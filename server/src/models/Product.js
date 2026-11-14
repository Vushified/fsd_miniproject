import mongoose from 'mongoose';

// Product Schema for grocery inventory
const productSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store', // Reference to Store model
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      index: true, // Indexed for fast product catalog search
    },
    category: {
      type: String,
      required: [true, 'Please provide product category'],
      enum: ['Dairy', 'Snacks', 'Groceries'],
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      default: function () {
        return this.price;
      },
    },
    unit: {
      type: String,
      default: '1 unit',
    },
    stock: {
      type: Number,
      required: true,
      default: 50,
      min: [0, 'Stock count cannot be negative'],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model('Product', productSchema);

