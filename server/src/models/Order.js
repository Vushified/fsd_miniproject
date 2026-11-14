import mongoose from 'mongoose';

// Order Schema tracking quick delivery state machine
const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to customer User
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store', // Reference to Store
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to assigned driver User
      default: null,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        available: { type: Boolean, default: true }, // Out-of-stock toggle (View 5)
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['UPI', 'Card', 'COD'],
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded'],
      default: 'Paid',
    },
    status: {
      type: String,
      enum: ['Placed', 'Packing', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Placed',
      index: true, // Indexed for fast query by driver and vendor
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    // Missing item refund details if vendor marked an item out of stock
    missingItemRefund: {
      amount: { type: Number, default: 0 },
      message: { type: String, default: null },
      refundedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save to generate order number if not present
orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  next();
});

export const Order = mongoose.model('Order', orderSchema);

