/**
 * Updated Lead Controller — accepts both the rich multi-step format (legacy)
 * and the simple wizard format submitted by the Contact wizard.
 */
import Lead from '../models/Lead.js';
import { ErrorResponse } from '../middleware/errorMiddleware.js';
import { uploadFile } from '../services/storageService.js';
import sendEmail from '../services/mailService.js';
import { leadConfirmationHTML, adminNotificationHTML } from '../emails/templates.js';
import { appendToGoogleSheet } from '../services/googleSheetsService.js';

/**
 * @desc    Submit a new enquiry (multi-step wizard OR legacy format)
 * @route   POST /api/leads
 * @access  Public
 */
export const createLead = async (req, res, next) => {
  try {
    // Support both JSON body directly and multipart body.data string
    let leadData = req.body;
    if (typeof req.body.data === 'string') {
      leadData = JSON.parse(req.body.data || '{}');
    }

    const {
      name, email, phone,
      // Simple wizard fields
      projectType, budget, message, location, area, timeline,
      // Legacy nested fields
      serviceType, propertyDetails, projectDetails, materialDetails,
    } = leadData;

    if (!name || !email) {
      return next(new ErrorResponse('Name and email are required', 400));
    }

    // ── Normalise to database schema ──────────────────────────────────
    const normalised = {
      name,
      email,
      phone: phone || 'Not provided',
      serviceType: serviceType || projectType || 'interior_design',
      propertyDetails: propertyDetails || {
        location: location || '',
        size: area || '',
      },
      projectDetails: projectDetails || {
        timeline: timeline || '',
        budget: budget || '',
        notes: message || '',
      },
      materialDetails: materialDetails || undefined,
      status: 'new',
      softDelete: false,
    };

    // Handle file attachments if present
    const attachments = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileUrl = await uploadFile(file);
        attachments.push(fileUrl);
      }
    }
    if (attachments.length > 0) {
      normalised.projectDetails.attachments = attachments;
    }

    // ── Google Sheets Sync & ID Generation ────────────────────────────
    const isCatalogueRequest = projectType === 'Catalogue Request';
    const isMaterialsEnquiry = 
      projectType === 'Materials' || 
      serviceType === 'Materials' || 
      budget === 'Materials Path' || 
      projectType === 'Free Estimate Request' ||
      (req.body.googleSheetData && req.body.googleSheetData.requirement === 'Materials') ||
      !!materialDetails;
 
    let sheetId;
    try {
      const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || 'N/A';
      const ipAddress = typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : rawIp;
 
      if (isCatalogueRequest) {
        // Parse phone numbers
        let phone1 = phone || '';
        let phone2 = '';
        if (phone1.includes('/')) {
          const parts = phone1.split('/');
          phone1 = parts[0].trim();
          phone2 = parts[1].trim();
        }

        const cataloguePayload = {
          name: name || 'N/A',
          phone1,
          phone2,
          email: email || 'N/A',
          location: location || 'N/A',
          catalogueMaterial: req.body.catalogueMaterial || message || 'N/A',
          ipAddress
        };

        const sheetRes = await appendToGoogleSheet('catalogue', cataloguePayload);
        if (sheetRes) sheetId = sheetRes.id;
      } else if (isMaterialsEnquiry) {
        // Parse phone numbers
        let phone1 = phone || '';
        let phone2 = '';
        if (req.body.googleSheetData) {
          phone1 = req.body.googleSheetData.mobile || phone1;
        }
        if (phone1.includes('/')) {
          const parts = phone1.split('/');
          phone1 = parts[0].trim();
          phone2 = parts[1].trim();
        }

        const materialPayload = {
          name: name || (req.body.googleSheetData ? req.body.googleSheetData.name : 'N/A'),
          phone1,
          phone2,
          email: email || (req.body.googleSheetData ? req.body.googleSheetData.email : 'N/A'),
          location: location || (propertyDetails ? propertyDetails.location : '') || (req.body.googleSheetData ? req.body.googleSheetData.location : 'N/A'),
          ipAddress
        };

        const sheetRes = await appendToGoogleSheet('material', materialPayload);
        if (sheetRes) sheetId = sheetRes.id;
      } else {
        const contactPayload = {
          name: name || (req.body.googleSheetData ? req.body.googleSheetData.name : 'N/A'),
          phone: phone || (req.body.googleSheetData ? req.body.googleSheetData.mobile : 'N/A'),
          email: email || (req.body.googleSheetData ? req.body.googleSheetData.email : 'N/A'),
          lookingFor: serviceType || projectType || (req.body.googleSheetData ? req.body.googleSheetData.requirement : 'N/A'),
          propertyType: (req.body.googleSheetData ? req.body.googleSheetData.propertyType : '') || (propertyDetails ? propertyDetails.propertyType : '') || 'N/A',
          spaces: (req.body.googleSheetData ? req.body.googleSheetData.spaces : '') || (propertyDetails ? (Array.isArray(propertyDetails.spaces) ? propertyDetails.spaces.join(', ') : propertyDetails.spaces) : '') || 'N/A',
          location: (req.body.googleSheetData ? req.body.googleSheetData.location : '') || location || (propertyDetails ? propertyDetails.location : '') || 'N/A',
          projectStage: (req.body.googleSheetData ? req.body.googleSheetData.stage : '') || (projectDetails ? projectDetails.stage : '') || 'N/A',
          notes: (req.body.googleSheetData ? req.body.googleSheetData.notes : '') || message || (projectDetails ? projectDetails.notes : '') || 'None',
          ipAddress
        };

        const sheetRes = await appendToGoogleSheet('contact', contactPayload);
        if (sheetRes) sheetId = sheetRes.id;
      }
    } catch (sheetErr) {
      console.error('Google Sheets sync error:', sheetErr.message);
      return res.status(500).json({
        success: false,
        message: "We're unable to submit your request at the moment. Please try again in a few minutes."
      });
    }

    if (sheetId) {
      normalised.leadId = sheetId;
    }

    // Save lead (with DB fallback for local / offline mode)
    let lead;
    try {
      lead = await Lead.create(normalised);
    } catch (dbErr) {
      console.warn('MongoDB lead save fallback active:', dbErr.message);
      lead = {
        ...normalised,
        _id: 'local-' + Date.now(),
        leadId: normalised.leadId || 'ESP-' + Math.floor(1000 + Math.random() * 9000),
        createdAt: new Date(),
      };
    }

    // ── Send emails (non-blocking) ────────────────────────────────────
    (async () => {
      try {
        await sendEmail({
          email: lead.email,
          subject: `Your ESPACIO Consultation Request [Ref: ${lead.leadId}]`,
          html: leadConfirmationHTML(lead),
        });
        await sendEmail({
          email: process.env.SMTP_USER || 'admin@theespacio.in',
          subject: `New Lead — ${lead.name} [${lead.serviceType}]`,
          html: adminNotificationHTML(lead),
        });
      } catch (mailErr) {
        console.error('SMTP Error:', mailErr.message);
      }
    })();

    res.status(201).json({
      success: true,
      message: 'Consultation request submitted successfully',
      data: { leadId: lead.leadId, name: lead.name },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all leads (filter, pagination, search)
 * @route   GET /api/leads
 * @access  Private (Admin)
 */
export const getLeads = async (req, res, next) => {
  try {
    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
    removeFields.forEach((p) => delete reqQuery[p]);
    reqQuery.softDelete = false;

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      reqQuery.$or = [{ name: searchRegex }, { email: searchRegex }, { leadId: searchRegex }];
    }

    let query = Lead.find(reqQuery);
    if (req.query.select) query = query.select(req.query.select.split(',').join(' '));
    query = query.sort(req.query.sort ? req.query.sort.split(',').join(' ') : '-createdAt');

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const total = await Lead.countDocuments({ softDelete: false });
    query = query.skip((page - 1) * limit).limit(limit);

    const leads = await query.lean();

    res.status(200).json({
      success: true,
      data: leads,
      pagination: { currentPage: page, totalPages: Math.ceil(total / limit), totalResults: total },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update lead status or fields
 * @route   PUT /api/leads/:id   |  PATCH /api/leads/:id/status
 * @access  Private (Admin)
 */
export const updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lead) return next(new ErrorResponse('Lead not found', 404));
    res.status(200).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Soft-delete (archive) a lead
 * @route   DELETE /api/leads/:id
 * @access  Private (Admin)
 */
export const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return next(new ErrorResponse('Lead not found', 404));
    lead.softDelete = true;
    await lead.save();
    res.status(200).json({ success: true, message: 'Lead archived' });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Export leads as CSV
 * @route   GET /api/leads/export
 * @access  Private (Admin)
 */
export const exportLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find({ softDelete: false }).sort('-createdAt').lean();
    let csv = 'Lead ID,Date,Name,Email,Service,Status,Location,Budget,Notes\n';
    leads.forEach((l) => {
      const date = new Date(l.createdAt).toISOString().split('T')[0];
      const loc = l.propertyDetails?.location || '';
      const budget = l.projectDetails?.budget || '';
      const notes = (l.projectDetails?.notes || '').replace(/\n/g, ' ').replace(/"/g, '""');
      csv += `"${l.leadId}","${date}","${l.name}","${l.email}","${l.serviceType}","${l.status}","${loc}","${budget}","${notes}"\n`;
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=espacio_leads.csv');
    res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
};
