import Media from '../models/Media.js';
import Settings from '../models/Settings.js';
import { ErrorResponse } from '../middleware/errorMiddleware.js';

/**
 * @desc    Get all media records from database
 * @route   GET /api/media
 * @access  Public
 */
export const getMedia = async (req, res, next) => {
  try {
    let items = await Media.find();

    // Fallback to media_gallery_items inside site_settings document if Media collection is empty
    if (!Array.isArray(items) || items.length === 0) {
      const siteSettings = await Settings.findOne({ key: 'site_settings' });
      if (siteSettings && siteSettings.value && Array.isArray(siteSettings.value.media_gallery_items)) {
        items = siteSettings.value.media_gallery_items;
      }
    }

    res.status(200).json({
      success: true,
      count: items ? items.length : 0,
      data: items || [],
    });
  } catch (err) {
    console.error('getMedia error:', err.message);
    res.status(200).json({
      success: true,
      count: 0,
      data: [],
    });
  }
};

const cleanMediaPayload = (item) => {
  if (!item || typeof item !== 'object') return item;
  const copy = { ...item };
  delete copy.dataUrl;
  delete copy.base64;
  return copy;
};

/**
 * @desc    Create/Register a new media record in database
 * @route   POST /api/media
 * @access  Private (Admin)
 */
export const createMedia = async (req, res, next) => {
  try {
    console.log('[STAGE 14: DATABASE_SAVE_STARTED]');
    const payload = req.body;
    let createdItem = null;

    if (Array.isArray(payload)) {
      const results = await Promise.all(
        payload.map(async (rawItem) => {
          const item = cleanMediaPayload(rawItem);
          const docId = item.id || `media-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
          return await Media.saveOrUpdate(docId, item);
        })
      );
      createdItem = results;
    } else if (payload && typeof payload === 'object') {
      const item = cleanMediaPayload(payload);
      const docId = item.id || `media-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      createdItem = await Media.saveOrUpdate(docId, item);
    }

    // Keep site_settings.media_gallery_items synchronized in Firestore DB
    try {
      const allMedia = await Media.find();
      let mainSettings = await Settings.findOne({ key: 'site_settings' });
      if (mainSettings && mainSettings._id) {
        const mergedVal = { ...(mainSettings.value || {}), media_gallery_items: allMedia };
        await Settings.findByIdAndUpdate(mainSettings._id, { key: 'site_settings', value: mergedVal });
      }
    } catch {}

    console.log('[STAGE 15: DATABASE_SAVE_SUCCESS]');

    res.status(200).json({
      success: true,
      message: 'Media record created in database',
      data: createdItem,
    });
  } catch (err) {
    console.error('createMedia error:', err);
    return next(new ErrorResponse('Failed to create media record in database', 500));
  }
};

import { deleteFromCloudinary } from '../utils/cloudinaryHelper.js';

/**
 * @desc    Delete media record by ID from database
 * @route   DELETE /api/media/:id
 * @access  Private (Admin)
 */
export const deleteMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    let existing = await Media.findOne({ id });
    if (existing && existing._id) {
      if (existing.cloudinaryPublicId) {
        await deleteFromCloudinary(existing.cloudinaryPublicId);
      }
      await Media.findByIdAndDelete(existing._id);
    }

    // Sync updated list to site_settings.media_gallery_items
    const remaining = await Media.find();
    let mainSettings = await Settings.findOne({ key: 'site_settings' });
    if (mainSettings && mainSettings._id) {
      const mergedVal = { ...(mainSettings.value || {}), media_gallery_items: remaining };
      await Settings.findByIdAndUpdate(mainSettings._id, { key: 'site_settings', value: remaining });
    }

    res.status(200).json({
      success: true,
      message: `Media record '${id}' deleted from database and Cloudinary`,
    });
  } catch (err) {
    console.error('deleteMedia error:', err);
    return next(new ErrorResponse('Failed to delete media record from database', 500));
  }
};
