import express from 'express';
import { getFAQs, createFAQ, updateFAQ, deleteFAQ } from '../controllers/faqController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getFAQs);

router.post('/', protect, authorize('admin', 'superadmin'), createFAQ);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateFAQ);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteFAQ);

export default router;
