import express from 'express';
import { getAllSettings, getSettings, updateSettings, updateAllSettings } from '../controllers/settingsController.js';

const router = express.Router();

router.get('/', getAllSettings);
router.put('/', updateAllSettings);
router.get('/:key', getSettings);
router.put('/:key', updateSettings);

export default router;
