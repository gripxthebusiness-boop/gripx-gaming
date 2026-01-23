import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: true,
      enum: ['Mice', 'Keyboards', 'Headsets', 'Monitors', 'Accessories', 'Controllers'],
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
    },
    specs: {
      type: String,
      required: true,
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
    },
    stockQuantity: {
      type: Number,
      default: null, // null means unlimited or not specified
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);

