import FAQ from '../models/FAQ.js';
import { ErrorResponse } from '../middleware/errorMiddleware.js';

/**
 * @desc    Get all FAQs (ordered by displayOrder)
 * @route   GET /api/faqs
 * @access  Public
 */
export const getFAQs = async (req, res, next) => {
  try {
    const queryObj = { softDelete: false, status: 'active' };

    // Filter by FAQ category if provided (e.g. general, services, materials)
    if (req.query.category) {
      queryObj.category = req.query.category;
    }

    const faqs = await FAQ.find(queryObj).sort('displayOrder -createdAt');

    res.status(200).json({
      success: true,
      data: faqs,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new FAQ
 * @route   POST /api/faqs
 * @access  Private (Admin)
 */
export const createFAQ = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;
    const faq = await FAQ.create(req.body);

    res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      data: faq,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update an FAQ
 * @route   PUT /api/faqs/:id
 * @access  Private (Admin)
 */
export const updateFAQ = async (req, res, next) => {
  try {
    let faq = await FAQ.findById(req.params.id);

    if (!faq || faq.softDelete) {
      return next(new ErrorResponse(`FAQ not found with ID of ${req.params.id}`, 404));
    }

    req.body.updatedBy = req.user.id;
    faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'FAQ updated successfully',
      data: faq,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Soft delete an FAQ
 * @route   DELETE /api/faqs/:id
 * @access  Private (Admin)
 */
export const deleteFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq || faq.softDelete) {
      return next(new ErrorResponse(`FAQ not found with ID of ${req.params.id}`, 404));
    }

    faq.softDelete = true;
    faq.updatedBy = req.user.id;
    await faq.save();

    res.status(200).json({
      success: true,
      message: 'FAQ deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
