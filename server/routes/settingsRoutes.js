import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:key', getSettings);
router.put('/:key', protect, authorize('admin', 'superadmin'), updateSettings);

export default router;
