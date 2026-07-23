import express from 'express';
import {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Multer upload settings
const projectUploadFields = upload.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'gallery', maxCount: 20 },
  { name: 'beforeImages', maxCount: 10 },
  { name: 'afterImages', maxCount: 10 },
]);

// Public endpoints
router.get('/', getProjects);
router.get('/:slug', getProjectBySlug);

// Admin-only endpoints
router.post('/', protect, authorize('admin', 'superadmin'), projectUploadFields, createProject);
router.put('/:id', protect, authorize('admin', 'superadmin'), projectUploadFields, updateProject);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteProject);

export default router;
