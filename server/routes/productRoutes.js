import express from 'express';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Multer settings for material library inputs
const productUploadFields = upload.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'gallery', maxCount: 20 },
  { name: 'catalogPDF', maxCount: 1 },
  { name: 'previewPages', maxCount: 7 },
]);

// Public getters
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

// Protected Admin Setters
router.post('/', protect, authorize('admin', 'superadmin'), productUploadFields, createProduct);
router.put('/:id', protect, authorize('admin', 'superadmin'), productUploadFields, updateProduct);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteProduct);

export default router;
