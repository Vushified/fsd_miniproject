import { Store } from '../models/Store.js';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';

// @desc    Get Admin summary metrics (Total sales, active stores, drivers, orders)
// @route   GET /api/admin/metrics
// @access  Private (Admin only)
export const getAdminMetrics = async (req, res, next) => {
  try {
    const orders = await Order.find();
    const stores = await Store.find();
    const activeDrivers = await User.countDocuments({ role: 'driver' });

    const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const activeStoresCount = stores.filter((s) => s.isOpen).length;

    res.status(200).json({
      success: true,
      data: {
        totalSales,
        totalOrders: orders.length,
        totalStores: stores.length,
        activeStores: activeStoresCount,
        activeDrivers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all vendor registration requests (Pending, Approved, Rejected)
// @route   GET /api/admin/vendors
// @access  Private (Admin only)
export const getVendorRequests = async (req, res, next) => {
  try {
    const vendors = await Store.find().populate('owner', 'name email phone');
    res.status(200).json({
      success: true,
      data: vendors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject vendor registration
// @route   PUT /api/admin/vendors/:id/verify
// @access  Private (Admin only)
export const verifyVendor = async (req, res, next) => {
  try {
    const { status } = req.body; // 'Approved' | 'Rejected'
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({ success: false, message: 'Vendor store not found' });
    }

    store.verificationStatus = status;
    await store.save();

    res.status(200).json({
      success: true,
      message: `Vendor application ${status.toLowerCase()} successfully`,
      data: store,
    });
  } catch (error) {
    next(error);
  }
};
