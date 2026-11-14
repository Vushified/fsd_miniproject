import express from 'express';
import {
  getStores,
  getStoreById,
  createStore,
  updateStore,
} from '../controllers/storeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getStores)
  .post(protect, authorize('vendor', 'admin'), createStore);

router.route('/:id')
  .get(getStoreById)
  .put(protect, authorize('vendor', 'admin'), updateStore);

export default router;

