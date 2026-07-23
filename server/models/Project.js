import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
    },
    story: {
      vision: { type: String, trim: true },
      challenges: { type: String, trim: true },
      solutions: { type: String, trim: true },
      engineering: { type: String, trim: true },
      outcome: { type: String, trim: true },
    },
    category: {
      type: String,
      required: [true, 'Project category is required'],
      enum: ['residential', 'commercial', 'villa', 'apartment', 'office', 'renovation', 'luxury_home'],
    },
    location: {
      type: String,
      required: [true, 'Project location is required'],
      trim: true,
    },
    area: {
      type: String, // e.g. "4,200 sq.ft."
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Completion year is required'],
    },
    style: {
      type: String, // e.g. "Minimalist Japandi", "Contemporary Classic"
      trim: true,
    },
    heroImage: {
      type: String,
      required: [true, 'Hero image is required'],
    },
    gallery: [{ type: String }],
    beforeImages: [{ type: String }],
    afterImages: [{ type: String }],
    videos: [{ type: String }],
    testimonial: {
      name: { type: String, trim: true },
      text: { type: String, trim: true },
      rating: { type: Number, min: 1, max: 5, default: 5 },
      avatar: { type: String },
    },
    materialsUsed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    relatedProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
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
    seo: {
      title: { type: String, trim: true },
      description: { type: String, trim: true },
      keywords: [{ type: String }],
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate SEO metadata if not provided
projectSchema.pre('save', function (next) {
  if (!this.seo) {
    this.seo = {};
  }
  if (!this.seo.title) {
    this.seo.title = `${this.title} | ESPACIO Interiors`;
  }
  if (!this.seo.description) {
    this.seo.description = this.description.substring(0, 160);
  }
  next();
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
