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
    if (Array.isArray(settingsList)) {
      settingsList.forEach((item) => {
        if (item.key) {
          settingsMap[item.key] = item.value;
        }
      });
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

    if (settings) {
      settings.value = value;
      settings.updatedBy = req.user?.id || 'admin';
      await settings.save();
    } else {
      settings = await Settings.create({
        key: req.params.key,
        value,
        createdBy: req.user?.id || 'admin',
      });
    }

    res.status(200).json({
      success: true,
      message: `Settings key '${req.params.key}' updated successfully`,
      data: settings.value,
    });
  } catch (err) {
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
    const keys = Object.keys(settingsObj);
    for (const key of keys) {
      const val = settingsObj[key];
      let settings = await Settings.findOne({ key });
      if (settings) {
        settings.value = val;
        settings.updatedBy = req.user?.id || 'admin';
        await settings.save();
      } else {
        await Settings.create({
          key,
          value: val,
          createdBy: req.user?.id || 'admin',
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'All settings updated successfully',
    });
  } catch (err) {
    next(err);
  }
};
