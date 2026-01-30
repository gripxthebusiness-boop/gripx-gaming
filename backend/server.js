import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';

const app = express();

// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { 
    message: 'Too many requests from this IP, please try again later' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 login/register attempts per hour
  message: { 
    message: 'Too many authentication attempts, please try again later' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiters
app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);

// Middleware - Order matters for performance
app.use(compression()); // Compress responses (performance optimization)

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://gripx.store',
  'https://www.gripx.store',
  'https://gripx-gaming.vercel.app',
  'https://*.vercel.app',
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.some(allowed => origin.includes(allowed))) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy violation'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Simple in-memory cache for GET requests
const cache = new Map();
const CACHE_MAX_SIZE = 100;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const cacheMiddleware = (req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }

  const key = req.originalUrl;
  const cached = cache.get(key);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    // Add cache header
    res.set('X-Cache', 'HIT');
    return res.json(cached.data);
  }

  // Store original json method
  const originalJson = res.json.bind(res);

  // Override json method to cache response
  res.json = (data) => {
    res.set('X-Cache', 'MISS');
    cache.set(key, {
      data,
      timestamp: Date.now()
    });
    // Clean old cache entries
    if (cache.size > CACHE_MAX_SIZE) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    originalJson(data);
  };

  next();
};

// Apply cache to product routes (5 minute cache)
app.use('/api/products', cacheMiddleware);

// MongoDB connection with optimized settings
const mongooseOptions = {
  maxPoolSize: 10, // Connection pool size
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  autoIndex: true, // Create indexes automatically
  maxIdleTimeMS: 60000, // Close idle connections after 60s
};

mongoose
  .connect(process.env.MONGO_URI, mongooseOptions)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Sync indexes on startup for better query performance
const syncIndexes = async () => {
  try {
    const Product = (await import('./models/Product.js')).default;
    const User = (await import('./models/User.js')).default;
    
    await Product.syncIndexes();
    await User.syncIndexes();
    console.log('Database indexes synchronized');
  } catch (error) {
    console.error('Error syncing indexes:', error);
  }
};
syncIndexes();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Health check with performance metrics
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Server is running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    cache: {
      size: cache.size,
      hitRate: 'N/A'
    }
  });
});

// Cache stats endpoint
app.get('/api/cache/stats', (req, res) => {
  res.json({
    size: cache.size,
    maxSize: CACHE_MAX_SIZE,
    duration: CACHE_DURATION,
    entries: Array.from(cache.entries()).map(([key, value]) => ({
      key,
      age: Date.now() - value.timestamp,
      dataSize: JSON.stringify(value.data).length
    }))
  });
});

// Clear cache endpoint (admin only)
app.post('/api/cache/clear', (req, res) => {
  cache.clear();
  res.json({ message: 'Cache cleared successfully' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: https://gripx-backend.onrender.com/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  mongoose.connection.close(false, () => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

export default app;
