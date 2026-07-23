import Project from '../models/Project.js';
import { ErrorResponse } from '../middleware/errorMiddleware.js';
import { uploadFile, deleteFile } from '../services/storageService.js';

/**
 * @desc    Get all projects (public listing, filtering, pagination, search)
 * @route   GET /api/projects
 * @access  Public
 */
export const getProjects = async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
    removeFields.forEach((param) => delete reqQuery[param]);

    // Force active/softDelete rules
    reqQuery.softDelete = false;
    reqQuery.status = 'published';

    // Text search
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      reqQuery.$or = [
        { title: searchRegex },
        { location: searchRegex },
        { style: searchRegex },
        { description: searchRegex },
      ];
    }

    // Build query
    query = Project.find(reqQuery);

    // Select fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-year -createdAt'); // default: newest projects first
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    const total = await Project.countDocuments(reqQuery);

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const projects = await query.populate('materialsUsed', 'title slug heroImage');

    // Pagination detail object
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
    };

    res.status(200).json({
      success: true,
      data: projects,
      pagination,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get a single project details by slug
 * @route   GET /api/projects/:slug
 * @access  Public
 */
export const getProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      slug: req.params.slug,
      softDelete: false,
      status: 'published',
    })
      .populate('materialsUsed', 'title slug heroImage category')
      .populate('relatedProjects', 'title slug heroImage category location');

    if (!project) {
      return next(new ErrorResponse(`Project not found with slug: ${req.params.slug}`, 404));
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new project entry
 * @route   POST /api/projects
 * @access  Private (Admin)
 */
export const createProject = async (req, res, next) => {
  try {
    let projectData;
    if (typeof req.body.data === 'string') {
      projectData = JSON.parse(req.body.data);
    } else if (req.body.data && typeof req.body.data === 'object') {
      projectData = req.body.data;
    } else {
      projectData = req.body;
    }

    // Handle files if uploaded via multer
    if (req.files) {
      // 1. Single Hero Image
      if (req.files.heroImage && req.files.heroImage[0]) {
        projectData.heroImage = await uploadFile(req.files.heroImage[0]);
      }

      // 2. Multiple Gallery Images
      if (req.files.gallery && req.files.gallery.length > 0) {
        projectData.gallery = [];
        for (const file of req.files.gallery) {
          const url = await uploadFile(file);
          projectData.gallery.push(url);
        }
      }

      // 3. Renovation Before/After Images
      if (req.files.beforeImages && req.files.beforeImages.length > 0) {
        projectData.beforeImages = [];
        for (const file of req.files.beforeImages) {
          const url = await uploadFile(file);
          projectData.beforeImages.push(url);
        }
      }
      if (req.files.afterImages && req.files.afterImages.length > 0) {
        projectData.afterImages = [];
        for (const file of req.files.afterImages) {
          const url = await uploadFile(file);
          projectData.afterImages.push(url);
        }
      }
    }

    // Set auditing
    projectData.createdBy = req.user.id;

    // Save project
    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update a project entry
 * @route   PUT /api/projects/:id
 * @access  Private (Admin)
 */
export const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project || project.softDelete) {
      return next(new ErrorResponse(`Project not found with ID of ${req.params.id}`, 404));
    }

    let projectData;
    if (typeof req.body.data === 'string') {
      projectData = JSON.parse(req.body.data);
    } else if (req.body.data && typeof req.body.data === 'object') {
      projectData = req.body.data;
    } else {
      projectData = req.body;
    }

    // Handle file edits
    if (req.files) {
      // 1. Hero Image Update
      if (req.files.heroImage && req.files.heroImage[0]) {
        // Delete old cover
        if (project.heroImage) await deleteFile(project.heroImage);
        projectData.heroImage = await uploadFile(req.files.heroImage[0]);
      }

      // 2. Add new Gallery items
      if (req.files.gallery && req.files.gallery.length > 0) {
        const newGallery = [...(project.gallery || [])];
        for (const file of req.files.gallery) {
          const url = await uploadFile(file);
          newGallery.push(url);
        }
        projectData.gallery = newGallery;
      }

      // 3. Before/After updates
      if (req.files.beforeImages && req.files.beforeImages.length > 0) {
        const newBefore = [...(project.beforeImages || [])];
        for (const file of req.files.beforeImages) {
          const url = await uploadFile(file);
          newBefore.push(url);
        }
        projectData.beforeImages = newBefore;
      }
      if (req.files.afterImages && req.files.afterImages.length > 0) {
        const newAfter = [...(project.afterImages || [])];
        for (const file of req.files.afterImages) {
          const url = await uploadFile(file);
          newAfter.push(url);
        }
        projectData.afterImages = newAfter;
      }
    }

    projectData.updatedBy = req.user.id;

    // Update DB record
    project = await Project.findByIdAndUpdate(req.params.id, projectData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Soft delete a project entry
 * @route   DELETE /api/projects/:id
 * @access  Private (Admin)
 */
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project || project.softDelete) {
      return next(new ErrorResponse(`Project not found with ID of ${req.params.id}`, 404));
    }

    // Set soft delete flag
    project.softDelete = true;
    project.updatedBy = req.user.id;
    await project.save();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
