import mongoose from 'mongoose';

// Store Schema representing grocery marts
const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a store name'],
      trim: true,
      maxlength: [100, 'Store name cannot exceed 100 characters'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User model (demonstrates relationships & populate)
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Groceries', 'Dairy', 'Snacks'],
      index: true,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    distance: {
      type: String,
      default: '1.2 km',
    },
    deliveryTime: {
      type: String,
      default: '10-15 mins',
    },
    address: {
      type: String,
      required: [true, 'Please provide store address'],
    },
    isOpen: {
      type: Boolean,
      default: true, // Duty toggle Online / Offline (Assignment View 6)
      index: true,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80',
    },
    verificationStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Approved', // Default stores approved, new ones pending for admin
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Store = mongoose.model('Store', storeSchema);
