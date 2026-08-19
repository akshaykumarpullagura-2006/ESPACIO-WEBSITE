import express from 'express';
import { getMedia, createMedia, deleteMedia } from '../controllers/mediaController.js';

const router = express.Router();

router.route('/')
  .get(getMedia)
  .post(createMedia);

router.route('/:id')
  .delete(deleteMedia);

export default router;
