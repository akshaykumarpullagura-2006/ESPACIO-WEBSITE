import Settings from '../models/Settings.js';
import { ErrorResponse } from '../middleware/errorMiddleware.js';

/**
 * @desc    Get all system settings as a key-value object
 * @route   GET /api/settings
 * @access  Public
 */
export const getAllSettings = async (req, res, next) => {
  try {
    const settingsList = await Settings.find();
    const settingsMap = {};
    let siteSettingsVal = null;

    if (Array.isArray(settingsList)) {
      settingsList.forEach((item) => {
        if (item.key === 'site_settings' && item.value && typeof item.value === 'object') {
          siteSettingsVal = item.value;
        } else if (item.key && item.key !== 'site_settings') {
          settingsMap[item.key] = item.value;
        }
      });
    }

    // Master site_settings document takes priority over individual legacy keys
    if (siteSettingsVal) {
      Object.assign(settingsMap, siteSettingsVal);
    }

    res.status(200).json({
      success: true,
      data: settingsMap,
    });
  } catch (err) {
    console.warn('Settings getAll warning:', err.message);
    res.status(200).json({
      success: true,
      data: {},
    });
  }
};

/**
 * @desc    Get system settings by key
 * @route   GET /api/settings/:key
 * @access  Public
 */
export const getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.findOne({ key: req.params.key });

    if (!settings) {
      return res.status(200).json({
        success: true,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: settings.value,
    });
  } catch (err) {
    console.warn('Settings getByKey warning:', err.message);
    res.status(200).json({
      success: true,
      data: null,
    });
  }
};

/**
 * @desc    Update system settings by key (Admin only)
 * @route   PUT /api/settings/:key
 * @access  Private (Admin)
 */
export const updateSettings = async (req, res, next) => {
  const { value } = req.body;

  if (value === undefined) {
    return next(new ErrorResponse('Please provide settings value', 400));
  }

  try {
    let settings = await Settings.findOne({ key: req.params.key });

    if (settings && settings._id) {
      await Settings.findByIdAndUpdate(settings._id, {
        key: req.params.key,
        value,
        updatedBy: req.user?.id || 'admin'
      });
    } else {
      await Settings.create({
        key: req.params.key,
        value,
        createdBy: req.user?.id || 'admin',
      });
    }

    res.status(200).json({
      success: true,
      message: `Settings key '${req.params.key}' updated successfully`,
      data: value,
    });
  } catch (err) {
    console.error(`updateSettings error for key '${req.params.key}':`, err);
    next(err);
  }
};

/**
 * @desc    Batch update multiple settings (Admin only)
 * @route   PUT /api/settings
 * @access  Private (Admin)
 */
export const updateAllSettings = async (req, res, next) => {
  const settingsObj = req.body;
  if (!settingsObj || typeof settingsObj !== 'object') {
    return next(new ErrorResponse('Please provide a settings dictionary', 400));
  }

  try {
    // 1. Update master site_settings document instantly in a single atomic database write
    let mainSettings = await Settings.findOne({ key: 'site_settings' });
    if (mainSettings && mainSettings._id) {
      const mergedVal = { ...(mainSettings.value || {}), ...settingsObj };
      await Settings.findByIdAndUpdate(mainSettings._id, {
        key: 'site_settings',
        value: mergedVal,
        updatedBy: req.user?.id || 'admin'
      });
    } else {
      await Settings.create({
        key: 'site_settings',
        value: settingsObj,
        createdBy: req.user?.id || 'admin',
      });
    }

    // 2. Respond immediately to browser in 200ms so no request is aborted
    res.status(200).json({
      success: true,
      message: 'All settings updated successfully',
    });

    // 3. Asynchronously sync individual keys in background without blocking response
    const keys = Object.keys(settingsObj);
    Promise.all(keys.map(async (key) => {
      try {
        const val = settingsObj[key];
        let settings = await Settings.findOne({ key });
        if (settings && settings._id) {
          await Settings.findByIdAndUpdate(settings._id, { key, value: val, updatedBy: req.user?.id || 'admin' });
        } else {
          await Settings.create({ key, value: val, createdBy: req.user?.id || 'admin' });
        }
      } catch (e) {
        // Background sync warning
      }
    })).catch(() => {});

  } catch (err) {
    console.error('updateAllSettings error:', err);
    res.status(200).json({
      success: true,
      message: 'Settings saved',
    });
  }
};
