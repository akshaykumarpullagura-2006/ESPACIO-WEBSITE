import Testimonial from '../models/Testimonial.js';
import { ErrorResponse } from '../middleware/errorMiddleware.js';
import { uploadFile, deleteFile } from '../services/storageService.js';
import axios from 'axios';

/**
 * @desc    Get all testimonials (Public reviews / ratings list)
 * @route   GET /api/testimonials
 * @access  Public
 */
export const getTestimonials = async (req, res, next) => {
  try {
    const queryObj = { softDelete: false };

    if (req.query.featured) {
      queryObj.featured = req.query.featured === 'true';
    }

    const testimonials = await Testimonial.find(queryObj);

    res.status(200).json({
      success: true,
      data: testimonials || [],
    });
  } catch (err) {
    console.warn('Testimonials GET warning:', err.message);
    res.status(200).json({
      success: true,
      data: [],
    });
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

/**
 * @desc    Synchronize Google Business / Places Reviews safely
 * @route   GET /api/testimonials/google-sync
 * @access  Private (Admin)
 */
export const syncGoogleReviews = async (req, res, next) => {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID || '2pUt25WptxBMZUxHq';

    if (!apiKey) {
      console.warn('Google Places API key is missing in environment variables');
      return res.status(200).json({
        success: false,
        configured: false,
        message: 'Google Places API configuration missing. Please add GOOGLE_PLACES_API_KEY (or GOOGLE_MAPS_API_KEY) and GOOGLE_PLACE_ID to your environment variables.',
        data: []
      });
    }

    // Call official Google Places Details API
    const googleUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,user_ratings_total&key=${apiKey}`;
    const response = await axios.get(googleUrl, { timeout: 10000 });

    if (!response.data || response.data.status !== 'OK') {
      const apiErr = response.data?.error_message || response.data?.status || 'Failed Google API response';
      console.error('Google Places API Error:', apiErr);
      return res.status(200).json({
        success: false,
        configured: true,
        message: `Google API Error: ${apiErr}`,
        data: []
      });
    }

    const result = response.data.result || {};
    const reviews = Array.isArray(result.reviews) ? result.reviews : [];

    // Map and upsert Google reviews to prevent duplication
    const syncedData = [];
    for (let i = 0; i < reviews.length; i++) {
      const rev = reviews[i];
      const googleId = rev.time ? `g_rev_${rev.time}_${encodeURIComponent(rev.author_name)}` : `g_rev_${i + 1}`;
      
      const payload = {
        googleReviewId: googleId,
        source: 'GOOGLE',
        name: rev.author_name || 'Google Reviewer',
        designation: `Google Reviewer • ${rev.relative_time_description || ''}`,
        title: rev.text ? (rev.text.length > 60 ? rev.text.slice(0, 60) + '...' : rev.text) : 'Google Review',
        body: rev.text || '',
        rating: rev.rating || 5,
        avatar: rev.profile_photo_url || '',
        date: rev.relative_time_description || 'Recently',
        visible: true,
        featured: (rev.rating || 5) === 5,
        order: i + 1
      };

      try {
        const existing = await Testimonial.findOne({ googleReviewId: googleId });
        if (existing && existing._id) {
          const updated = await Testimonial.findByIdAndUpdate(existing._id, payload);
          syncedData.push(updated);
        } else {
          const created = await Testimonial.create(payload);
          syncedData.push(created);
        }
      } catch (err) {
        syncedData.push(payload);
      }
    }

    res.status(200).json({
      success: true,
      configured: true,
      message: 'Google Reviews synchronized successfully',
      stats: {
        googleRating: result.rating || 5.0,
        totalReviews: result.user_ratings_total || reviews.length,
        lastSynced: new Date().toISOString()
      },
      data: syncedData
    });
  } catch (err) {
    console.error('Google Reviews sync error:', err.message);
    res.status(200).json({
      success: false,
      configured: true,
      message: `Sync failed: ${err.message}`,
      data: []
    });
  }
};

