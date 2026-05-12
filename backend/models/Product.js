import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true, // Index for faster searches
    },
    brand: {
      type: String,
      default: '',
      index: true, // Index for filtering by brand
    },
    category: {
      type: String,
      required: true,
      enum: ['Mice', 'Keyboards', 'Headsets', 'Monitors', 'Accessories', 'Controllers'],
      index: true, // Index for category filtering
    },
    price: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: function(v) {
          return v && v.length > 0 && v[0] !== '';
        },
        message: 'At least one image is required'
      }
    },
    description: {
      type: String,
      default: '',
      index: true, // Index for text search
    },
    specs: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    inStock: {
      type: Boolean,
      default: true,
      index: true, // Index for filtering by stock status
    },
    stockQuantity: {
      type: Number,
      default: null, // null means unlimited or not specified
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true, // Index for filtering active products
    },
  },
  { timestamps: true }
);

// Compound indexes for common query patterns
productSchema.index({ isActive: 1, category: 1, createdAt: -1 }); // For listing by category
productSchema.index({ isActive: 1, name: 'text', brand: 'text', description: 'text' }); // For text search
productSchema.index({ category: 1, inStock: 1 }); // For category + stock filter

export const Product = mongoose.model('Product', productSchema);

