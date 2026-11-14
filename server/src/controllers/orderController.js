import { Order } from '../models/Order.js';

// @desc    Create new grocery delivery order
// @route   POST /api/orders
// @access  Private (Customer)
export const createOrder = async (req, res, next) => {
  try {
    const { store, items, totalAmount, paymentMethod, deliveryAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot place an empty order. Cart is empty.',
      });
    }

    const order = await Order.create({
      customer: req.user.id,
      store,
      items,
      totalAmount,
      paymentMethod,
      deliveryAddress,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      status: 'Placed',
    });

    // Populate for clean response
    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email phone')
      .populate('store', 'name address');

    // Emit real-time Socket.IO event for vendor & driver (Section 8)
    const io = req.app.get('socketio');
    if (io) {
      io.emit('order:new', populatedOrder);
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: populatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get orders (Filtered by role: customer sees own, vendor sees store's, driver sees active)
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res, next) => {
  try {
    let query = {};

    // Customer only sees their orders
    if (req.user.role === 'customer') {
      query.customer = req.user.id;
    }
    // Driver sees orders that are Packing, Out for Delivery, or assigned
    else if (req.user.role === 'driver') {
      query.status = { $in: ['Packing', 'Out for Delivery', 'Delivered'] };
    }

    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .populate('store', 'name address')
      .populate('driver', 'name phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('store', 'name address')
      .populate('driver', 'name phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Placed -> Packing -> Out for Delivery -> Delivered)
// @route   PUT /api/orders/:id/status
// @access  Private (Vendor, Driver, Admin)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, driverId } = req.body;

    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    if (driverId) {
      order.driver = driverId;
    } else if (req.user.role === 'driver') {
      order.driver = req.user.id;
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email phone')
      .populate('store', 'name address')
      .populate('driver', 'name phone');

    // Emit WebSocket live event (Section 8: WebSockets / Socket.IO)
    const io = req.app.get('socketio');
    if (io) {
      io.emit('order:status_updated', {
        orderId: order._id,
        status: order.status,
        updatedOrder,
      });
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Vendor marks item out of stock & triggers refund (Assignment View 5 Requirement)
// @route   PUT /api/orders/:id/items/:itemId/outofstock
// @access  Private (Vendor, Admin)
export const markItemOutOfStock = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const itemIndex = order.items.findIndex(
      (it) => it._id.toString() === itemId || it.product?.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in order' });
    }

    // Mark unavailable and calculate refund
    order.items[itemIndex].available = false;
    const refundAmount = order.items[itemIndex].price * order.items[itemIndex].quantity;
    order.totalAmount = Math.max(0, order.totalAmount - refundAmount);

    order.missingItemRefund = {
      amount: refundAmount,
      message: `${order.items[itemIndex].name} was out of stock. Refund of ₹${refundAmount} processed.`,
      refundedAt: new Date(),
    };

    await order.save();

    // Broadcast refund event over WebSocket
    const io = req.app.get('socketio');
    if (io) {
      io.emit('order:refund_processed', {
        orderId: order._id,
        refund: order.missingItemRefund,
        newTotal: order.totalAmount,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item marked out of stock. Refund notification issued.',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
