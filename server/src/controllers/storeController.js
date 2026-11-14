import { Store } from '../models/Store.js';

// @desc    Get all stores with optional filtering (Category & Search)
// @route   GET /api/stores
// @access  Public
export const getStores = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = { verificationStatus: 'Approved' };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Populate owner details from User model (demonstrates Mongoose relationships)
    const stores = await Store.find(query).populate('owner', 'name email phone');

    res.status(200).json({
      success: true,
      count: stores.length,
      data: stores,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single store by ID
// @route   GET /api/stores/:id
// @access  Public
export const getStoreById = async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.id).populate('owner', 'name email phone');

    if (!store) {
      return res.status(404).json({
        success: false,
        message: `Store not found with id: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: store,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new store (Vendor / Admin)
// @route   POST /api/stores
// @access  Private (Vendor, Admin)
export const createStore = async (req, res, next) => {
  try {
    // Assign currently authenticated user as owner
    req.body.owner = req.user.id;

    const store = await Store.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      data: store,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update store details / toggle Online/Offline duty status
// @route   PUT /api/stores/:id
// @access  Private (Vendor, Admin)
export const updateStore = async (req, res, next) => {
  try {
    let store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found',
      });
    }

    // Make sure user is store owner or admin
    if (store.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not own this store',
      });
    }

    store = await Store.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Store updated successfully',
      data: store,
    });
  } catch (error) {
    next(error);
  }
};
