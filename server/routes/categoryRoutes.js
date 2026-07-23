import express from 'express';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

const categoryUploadFields = upload.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 20 },
]);

// Public endpoints
router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

// Admin-only endpoints
router.post('/', protect, authorize('admin', 'superadmin'), categoryUploadFields, createCategory);
router.put('/:id', protect, authorize('admin', 'superadmin'), categoryUploadFields, updateCategory);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteCategory);

export default router;
