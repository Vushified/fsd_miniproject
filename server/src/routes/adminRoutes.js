import express from 'express';
import {
  getAdminMetrics,
  getVendorRequests,
  verifyVendor,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin Only Routes (Role-based access control)
router.use(protect);
router.use(authorize('admin'));

router.get('/metrics', getAdminMetrics);
router.get('/vendors', getVendorRequests);
router.put('/vendors/:id/verify', verifyVendor);

export default router;

