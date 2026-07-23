import express from 'express';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

const testimonialUploads = upload.fields([
  { name: 'clientPhoto', maxCount: 1 },
  { name: 'projectPhoto', maxCount: 1 },
]);

router.get('/', getTestimonials);

router.post('/', protect, authorize('admin', 'superadmin'), testimonialUploads, createTestimonial);
router.put('/:id', protect, authorize('admin', 'superadmin'), testimonialUploads, updateTestimonial);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteTestimonial);

export default router;
