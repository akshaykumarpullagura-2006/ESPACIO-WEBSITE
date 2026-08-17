import express from 'express';
import { getAllSettings, getSettings, updateSettings, updateAllSettings } from '../controllers/settingsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllSettings);
router.put('/', protect, authorize('admin', 'superadmin'), updateAllSettings);
router.get('/:key', getSettings);
router.put('/:key', protect, authorize('admin', 'superadmin'), updateSettings);

export default router;
