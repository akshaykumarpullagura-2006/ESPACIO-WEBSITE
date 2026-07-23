import express from 'express';
import {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
  exportLeads,
} from '../controllers/leadController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public submissions (attaches arrays of uploads up to 5 files)
router.post('/', upload.array('attachments', 5), createLead);

// Protected Admin Routes
router.get('/', protect, authorize('admin', 'superadmin'), getLeads);
router.get('/export', protect, authorize('admin', 'superadmin'), exportLeads);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateLead);
router.patch('/:id/status', protect, authorize('admin', 'superadmin'), updateLead);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteLead);

export default router;
