import Product from '../models/Product.js';
import { ErrorResponse } from '../middleware/errorMiddleware.js';
import { uploadFile, deleteFile } from '../services/storageService.js';

/**
 * @desc    Get all materials / products (public library, filters, searches)
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res, next) => {
  try {
    let query;
    const reqQuery = { ...req.query };

    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
    removeFields.forEach((param) => delete reqQuery[param]);

    reqQuery.softDelete = false;
    reqQuery.status = 'published';

    // Search keywords
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      reqQuery.$or = [
        { title: searchRegex },
        { category: searchRegex },
        { description: searchRegex },
        { features: searchRegex },
      ];
    }

    query = Product.find(reqQuery);

    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('title'); // default: alphabetical
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    const total = await Product.countDocuments(reqQuery);

    query = query.skip(startIndex).limit(limit);

    const products = await query.populate('relatedProjects', 'title slug heroImage location');

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
    };

    res.status(200).json({
      success: true,
      data: products,
      pagination,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get a single product details by slug
 * @route   GET /api/products/:slug
 * @access  Public
 */
export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      softDelete: false,
      status: 'published',
    })
      .populate('relatedProducts', 'title slug heroImage category')
      .populate('relatedProjects', 'title slug heroImage category location');

    if (!product) {
      return next(new ErrorResponse(`Product not found with slug: ${req.params.slug}`, 404));
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new product/material entry
 * @route   POST /api/products
 * @access  Private (Admin)
 */
export const createProduct = async (req, res, next) => {
  try {
    let productData;
    if (typeof req.body.data === 'string') {
      productData = JSON.parse(req.body.data);
    } else if (req.body.data && typeof req.body.data === 'object') {
      productData = req.body.data;
    } else {
      productData = req.body;
    }

    // Handle files uploads
    if (req.files) {
      // 1. Cover Image
      if (req.files.heroImage && req.files.heroImage[0]) {
        productData.heroImage = await uploadFile(req.files.heroImage[0]);
      }

      // 2. Texture/Gallery Images
      if (req.files.gallery && req.files.gallery.length > 0) {
        productData.gallery = [];
        for (const file of req.files.gallery) {
          const url = await uploadFile(file);
          productData.gallery.push(url);
        }
      }

      // 3. Catalog PDF
      if (req.files.catalogPDF && req.files.catalogPDF[0]) {
        productData.catalogPDF = await uploadFile(req.files.catalogPDF[0]);
      }

      // 4. Catalog Preview Images (first 7 pages)
      if (req.files.previewPages && req.files.previewPages.length > 0) {
        productData.previewPages = [];
        for (const file of req.files.previewPages) {
          const url = await uploadFile(file);
          productData.previewPages.push(url);
        }
      }
    }

    productData.createdBy = req.user.id;

    // Save product
    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update a product entry
 * @route   PUT /api/products/:id
 * @access  Private (Admin)
 */
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product || product.softDelete) {
      return next(new ErrorResponse(`Product not found with ID of ${req.params.id}`, 404));
    }

    let productData;
    if (typeof req.body.data === 'string') {
      productData = JSON.parse(req.body.data);
    } else if (req.body.data && typeof req.body.data === 'object') {
      productData = req.body.data;
    } else {
      productData = req.body;
    }

    if (req.files) {
      // 1. Cover Image
      if (req.files.heroImage && req.files.heroImage[0]) {
        if (product.heroImage) await deleteFile(product.heroImage);
        productData.heroImage = await uploadFile(req.files.heroImage[0]);
      }

      // 2. Texture/Gallery Images
      if (req.files.gallery && req.files.gallery.length > 0) {
        const newGallery = [...(product.gallery || [])];
        for (const file of req.files.gallery) {
          const url = await uploadFile(file);
          newGallery.push(url);
        }
        productData.gallery = newGallery;
      }

      // 3. Catalog PDF
      if (req.files.catalogPDF && req.files.catalogPDF[0]) {
        if (product.catalogPDF) await deleteFile(product.catalogPDF);
        productData.catalogPDF = await uploadFile(req.files.catalogPDF[0]);
      }

      // 4. Preview Pages (up to 7)
      if (req.files.previewPages && req.files.previewPages.length > 0) {
        const newPreviews = [...(product.previewPages || [])];
        for (const file of req.files.previewPages) {
          const url = await uploadFile(file);
          newPreviews.push(url);
        }
        productData.previewPages = newPreviews;
      }
    }

    productData.updatedBy = req.user.id;

    product = await Product.findByIdAndUpdate(req.params.id, productData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Soft delete a product/material
 * @route   DELETE /api/products/:id
 * @access  Private (Admin)
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.softDelete) {
      return next(new ErrorResponse(`Product not found with ID of ${req.params.id}`, 404));
    }

    product.softDelete = true;
    product.updatedBy = req.user.id;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
