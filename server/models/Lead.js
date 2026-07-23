import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    leadId: {
      type: String,
      required: true,
      unique: true,
      default: () => 'ESP-' + Math.floor(100000 + Math.random() * 900000),
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    serviceType: {
      type: String,
      enum: ['turnkey', 'design_only', 'renovation', 'materials', 'something_else'],
      required: [true, 'Service type is required'],
    },
    propertyDetails: {
      propertyType: { type: String, trim: true },
      spaces: [{ type: String }],
      location: { type: String, trim: true },
      size: { type: String, trim: true },
    },
    projectDetails: {
      stage: { type: String, trim: true },
      timeline: { type: String, trim: true },
      budget: { type: String, trim: true },
      notes: { type: String, trim: true },
      attachments: [{ type: String }],
    },
    materialDetails: {
      categories: [{ type: String }],
      quantity: { type: String, trim: true },
      location: { type: String, trim: true },
      notes: { type: String, trim: true },
    },
    preferredContactTime: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'anytime'],
      default: 'anytime',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost', 'archived'],
      default: 'new',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    softDelete: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
