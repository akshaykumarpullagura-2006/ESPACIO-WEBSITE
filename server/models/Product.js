import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product/Material title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: [
        'wpc_wall_panels',
        'pvc_ceiling_panels',
        'fluted_panels',
        'polygranite_sheets',
        'acrylic_sheets',
        'charcoal_panels',
        'mosaic_tiles',
        'decorative_panels',
        'surface_sheets',
        'korean_collection',
        'louvers',
        'ceiling_systems',
      ],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    heroImage: {
      type: String,
      required: [true, 'Hero image is required'],
    },
    gallery: [{ type: String }],
    specifications: [
      {
        label: { type: String, trim: true },
        value: { type: String, trim: true },
      },
    ],
    features: [{ type: String }], // e.g. ["Waterproof", "Termite Resistant", "Fire Retardant"]
    colors: [
      {
        name: { type: String, trim: true },
        hex: { type: String, trim: true }, // hex value, e.g. "#8B5A2B"
        image: { type: String }, // option image
      },
    ],
    catalogPDF: {
      type: String,
      trim: true,
    },
    previewPages: [{ type: String }], // Up to 7 preview page urls
    applications: [{ type: String }], // e.g. ["Modular Kitchens", "Living Rooms", "Offices"]
    relatedProducts: [
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

// Auto-generate SEO metadata
productSchema.pre('save', function (next) {
  if (!this.seo) {
    this.seo = {};
  }
  if (!this.seo.title) {
    this.seo.title = `${this.title} | Premium Material Library | ESPACIO`;
  }
  if (!this.seo.description) {
    this.seo.description = this.description.substring(0, 160);
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
