import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  markItemOutOfStock,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, getOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/status')
  .put(protect, authorize('vendor', 'driver', 'admin'), updateOrderStatus);

router.route('/:id/items/:itemId/outofstock')
  .put(protect, authorize('vendor', 'admin'), markItemOutOfStock);

export default router;
