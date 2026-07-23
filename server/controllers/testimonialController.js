import Testimonial from '../models/Testimonial.js';
import { ErrorResponse } from '../middleware/errorMiddleware.js';
import { uploadFile, deleteFile } from '../services/storageService.js';

/**
 * @desc    Get all testimonials (Public reviews / ratings list)
 * @route   GET /api/testimonials
 * @access  Public
 */
export const getTestimonials = async (req, res, next) => {
  try {
    const queryObj = { softDelete: false, status: 'active' };

    // Support featured testimonials override filter
    if (req.query.featured) {
      queryObj.featured = req.query.featured === 'true';
    }

    const testimonials = await Testimonial.find(queryObj).sort('displayOrder -createdAt');

    res.status(200).json({
      success: true,
      data: testimonials,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new testimonial
 * @route   POST /api/testimonials
 * @access  Private (Admin)
 */
export const createTestimonial = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data || '{}');

    // Handle profile images
    if (req.files) {
      if (req.files.clientPhoto && req.files.clientPhoto[0]) {
        data.clientPhoto = await uploadFile(req.files.clientPhoto[0]);
      }
      if (req.files.projectPhoto && req.files.projectPhoto[0]) {
        data.projectPhoto = await uploadFile(req.files.projectPhoto[0]);
      }
    }

    data.createdBy = req.user.id;

    const testimonial = await Testimonial.create(data);

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: testimonial,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update a testimonial
 * @route   PUT /api/testimonials/:id
 * @access  Private (Admin)
 */
export const updateTestimonial = async (req, res, next) => {
  try {
    let testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial || testimonial.softDelete) {
      return next(new ErrorResponse(`Testimonial not found with ID of ${req.params.id}`, 404));
    }

    const data = JSON.parse(req.body.data || '{}');

    if (req.files) {
      if (req.files.clientPhoto && req.files.clientPhoto[0]) {
        if (testimonial.clientPhoto) await deleteFile(testimonial.clientPhoto);
        data.clientPhoto = await uploadFile(req.files.clientPhoto[0]);
      }
      if (req.files.projectPhoto && req.files.projectPhoto[0]) {
        if (testimonial.projectPhoto) await deleteFile(testimonial.projectPhoto);
        data.projectPhoto = await uploadFile(req.files.projectPhoto[0]);
      }
    }

    data.updatedBy = req.user.id;

    testimonial = await Testimonial.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Soft delete a testimonial
 * @route   DELETE /api/testimonials/:id
 * @access  Private (Admin)
 */
export const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial || testimonial.softDelete) {
      return next(new ErrorResponse(`Testimonial not found with ID of ${req.params.id}`, 404));
    }

    testimonial.softDelete = true;
    testimonial.updatedBy = req.user.id;
    await testimonial.save();

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
