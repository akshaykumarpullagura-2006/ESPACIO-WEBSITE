import Settings from '../models/Settings.js';
import { ErrorResponse } from '../middleware/errorMiddleware.js';

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
    next(err);
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
      settings.updatedBy = req.user.id;
      await settings.save();
    } else {
      settings = await Settings.create({
        key: req.params.key,
        value,
        createdBy: req.user.id,
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
