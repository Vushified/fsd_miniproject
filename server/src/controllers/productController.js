import { Product } from '../models/Product.js';
import { Store } from '../models/Store.js';

// @desc    Get all products (with category & search filters)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { storeId, category, search } = req.query;
    let query = {};

    if (storeId) query.store = storeId;
    if (category && category !== 'All') query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    const products = await Product.find(query).populate('store', 'name address isOpen');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get products by Store ID
// @route   GET /api/products/store/:storeId
// @access  Public
export const getProductsByStore = async (req, res, next) => {
  try {
    const products = await Product.find({ store: req.params.storeId });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to store inventory
// @route   POST /api/products
// @access  Private (Vendor, Admin)
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Product added to inventory',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product price, stock quantity, or in-stock status
// @route   PUT /api/products/:id
// @access  Private (Vendor, Admin)
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product from store
// @route   DELETE /api/products/:id
// @access  Private (Vendor, Admin)
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted from inventory',
    });
  } catch (error) {
    next(error);
  }
};

