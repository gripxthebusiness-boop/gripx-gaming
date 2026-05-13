import mongoose from 'mongoose';

/**
 * Order Schema
 * Stores all customer orders with product details and customer information
 */
const orderSchema = new mongoose.Schema(
  {
    // Product Information
    product: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      max: [1000, 'Quantity cannot exceed 1000'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    totalPrice: {
      type: Number,
      required: true,
      // Calculated as quantity * price
      get: function() {
        return this.quantity * this.price;
      },
    },

    // Customer Information
    customer: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      maxlength: [50, 'Customer name cannot exceed 50 characters'],
      minlength: [2, 'Customer name must be at least 2 characters'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format'],
      default: '',
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      minlength: [10, 'Phone number must be at least 10 digits'],
      maxlength: [15, 'Phone number cannot exceed 15 characters'],
    },

    // Delivery Address
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
      maxlength: [200, 'Address cannot exceed 200 characters'],
      minlength: [5, 'Address must be at least 5 characters'],
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    postalCode: {
      type: String,
      trim: true,
      default: '',
    },

    // Order Status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },

    // Tracking & Metadata
    orderNumber: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'orders',
  }
);

/**
 * Pre-save middleware
 * - Generate order number
 * - Update timestamps
 */
orderSchema.pre('save', function(next) {
  // Generate order number if not exists
  if (!this.orderNumber) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }

  // Update updatedAt
  this.updatedAt = new Date();

  next();
});

/**
 * Instance methods
 */

// Format order for display
orderSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.totalPrice = this.quantity * this.price;
  return obj;
};

/**
 * Static methods
 */

// Get recent orders
orderSchema.statics.getRecentOrders = function(days = 7) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return this.find({ createdAt: { $gte: date } }).sort({ createdAt: -1 });
};

// Get order statistics
orderSchema.statics.getOrderStats = async function() {
  const total = await this.countDocuments();
  const pending = await this.countDocuments({ status: 'pending' });
  const confirmed = await this.countDocuments({ status: 'confirmed' });
  const processed = await this.countDocuments({ status: 'processing' });
  const shipped = await this.countDocuments({ status: 'shipped' });
  const delivered = await this.countDocuments({ status: 'delivered' });

  return {
    total,
    pending,
    confirmed,
    processed,
    shipped,
    delivered,
  };
};

// Create indexes for better query performance
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ customer: 'text' });
orderSchema.index({ phone: 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
