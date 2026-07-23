import express from 'express';
import { getStats, createLog } from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are admin protected
router.use(protect);
router.use(authorize('admin', 'superadmin'));

router.get('/stats', getStats);
router.post('/logs', createLog);

export default router;
