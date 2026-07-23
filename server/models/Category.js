import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Category description is required'],
      trim: true,
    },
    heroImage: {
      type: String,
      required: [true, 'Hero image is required'],
    },
    galleryImages: [{ type: String }],
    filters: [{ type: String }], // filter chips e.g. ["Japandi", "Minimal", "Luxury"]
    videos: [{ type: String }],
    displayOrder: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
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

categorySchema.pre('save', function (next) {
  if (!this.seo) {
    this.seo = {};
  }
  if (!this.seo.title) {
    this.seo.title = `${this.name} Interiors | ESPACIO Room Explorer`;
  }
  if (!this.seo.description) {
    this.seo.description = this.description.substring(0, 160);
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
