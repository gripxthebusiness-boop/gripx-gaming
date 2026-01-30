# 🏆 GripX Production Optimization Plan

**Domain**: gripx.store  
**Backend**: gripx-backend.onrender.com  
**Frontend**: Vercel (configured for gripx.store)

---

## 📋 Executive Summary

This plan covers 5 major improvements:
1. ✅ Custom Domain Setup (gripx.store)
2. ⚡ Performance Optimization
3. 🔒 Security Enhancements
4. 🚀 Backend Sleep Solution
5. 🐛 Troubleshooting & Monitoring

---

## Phase 1: Custom Domain Setup (gripx.store)

### 1.1 Vercel Domain Configuration

**Step 1: Add Domain to Vercel**
1. Go to [Vercel Dashboard](https://vercel.com)
2. Navigate to your project: `gripx-gaming`
3. Click **Settings** → **Domains**
4. Click **Add** and enter: `gripx.store`
5. Click **Add**

**Step 2: Configure DNS Settings**

**If using Cloudflare:**
1. Go to Cloudflare Dashboard
2. Select your domain: `gripx.store`
3. Navigate to **DNS** → **Records**
4. Add/Update CNAME record:
   ```
   Type: CNAME
   Name: @
   Target: cname.vercel-dns.com
   TTL: Auto
   ```
5. Add A record (optional, for faster DNS):
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   TTL: Auto
   ```

**If using Namecheap/Other Registrar:**
1. Login to your domain registrar
2. Navigate to DNS Management
3. Add CNAME record:
   ```
   Host: @
   Value: cname.vercel-dns.com
   Type: CNAME
   TTL: 3600
   ```

**Step 3: Wait for DNS Propagation**
- DNS takes 5-60 minutes to propagate
- Verify with: `dig gripx.store` or [dnschecker.org](https://dnschecker.org)

**Step 4: Enable HTTPS**
1. Vercel will automatically provision SSL
2. Go to Vercel → Settings → HTTPS
3. Verify certificate is active
4. Force HTTPS redirect (automatic in Vercel)

### 1.2 Backend CORS Configuration

Update `backend/server.js` to allow gripx.store:

```javascript
// Add this after CORS middleware
const allowedOrigins = [
  'http://localhost:5173',
  'https://gripx.store',  // Your frontend domain
  'https://gripx-gaming.vercel.app',  // Vercel preview
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy violation'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
```

---

## Phase 2: Performance Optimization

### 2.1 Vercel Configuration (vercel.json)

Update `vercel.json` with full optimization:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).woff2",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).png",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://gripx-backend.onrender.com/api/:path*"
    }
  ]
}
```

### 2.2 Vite Build Optimization (vite.config.ts)

Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    conditions: ['import', 'module', 'browser', 'default'],
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
    dedupe: ['framer-motion'],
  },
  optimizeDeps: {
    include: ['framer-motion', 'framer-motion/value'],
    esbuildOptions: {
      conditions: ['import', 'module', 'browser', 'default'],
    },
  },
  build: {
    commonjsOptions: {
      include: [/framer-motion/, /node_modules/],
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    minify: 'esbuild',
    cssMinify: true,
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,
    host: true,
  }
})
```

### 2.3 Backend Compression & Optimization

Update `backend/server.js`:

```javascript
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';

const app = express();

// Middleware - Order matters for performance
app.use(compression()); // Compress responses (performance optimization)
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://gripx.store',
      'https://gripx-gaming.vercel.app',
    ];
    if(!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'), false);
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

// Create indexes for better query performance
import Product from './models/Product.js';
import User from './models/User.js';

// Sync indexes on startup
const syncIndexes = async () => {
  try {
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
    message: 'Server is running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 2.4 HTML Head Optimization (index.html)

Update `index.html` with SEO and performance meta tags:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="GripX - Premium Gaming Peripherals. Shop high-quality gaming mice, keyboards, headsets, and controllers for professional gamers.">
    <meta name="keywords" content="gaming mouse, gaming keyboard, gaming headset, gaming controller, gaming peripherals, GripX">
    <meta name="author" content="GripX">
    <meta name="robots" content="index, follow">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://gripx.store">
    <meta property="og:title" content="GripX - Premium Gaming Peripherals">
    <meta property="og:description" content="Shop high-quality gaming peripherals for professional gamers">
    <meta property="og:image" content="https://gripx.store/og-image.jpg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="GripX - Premium Gaming Peripherals">
    <meta name="twitter:description" content="Shop high-quality gaming peripherals for professional gamers">
    <link rel="canonical" href="https://gripx.store">
    <title>GripX - Premium Gaming Peripherals</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 2.5 React Query Optimization (src/main.tsx)

Already optimized! Your current configuration has:
- 5 minute staleTime
- 30 minute cacheTime
- RefetchOnWindowFocus: false
- Retry: 1

### 2.6 Lazy Loading for Better Performance

Ensure components are lazy loaded in App.tsx:

```typescript
// Example of lazy loading
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Loading from './components/Loading';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Account = lazy(() => import('./pages/Account'));
const AdminProducts = lazy(() => import('./pages/AdminProducts'));

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account />} />
          <Route path="/admin/products" element={<AdminProducts />} />
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
```

---

## Phase 3: Security Enhancements

### 3.1 Environment Variables Security

**Vercel Environment Variables:**
```
VITE_API_URL=https://gripx-backend.onrender.com/api
VITE_APP_TITLE=GripX
```

**Render Environment Variables:**
```
MONGO_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxx.mongodb.net/gripx?retryWrites=true&w=majority
JWT_SECRET=your_super_long_random_string_at_least_32_characters
NODE_ENV=production
PORT=5000
```

### 3.2 JWT Security Improvements

Update `backend/middleware/auth.js`:

```javascript
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ message: 'Token is not valid' });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(401).json({ message: 'Token is not valid' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
```

### 3.3 Rate Limiting (Add to Backend)

Install rate limiting:
```bash
cd backend && npm install express-rate-limit
```

Update `backend/server.js`:

```javascript
import rateLimit from 'express-rate-limit';

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
```

### 3.4 Security Headers

Update `vercel.json` with comprehensive security headers (already in Phase 2.1).

---

## Phase 4: Backend Sleep Solution

### 4.1 Understanding the Problem

**Render Free Tier Behavior:**
- Backend goes to sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Site becomes slow on first load

### 4.2 Solution 1: Keep-Alive Pings (Recommended)

Create a simple keep-alive service:

**Option A: Use Cron-job.org (Free)**
1. Go to [cron-job.org](https://cron-job.org)
2. Create free account
3. Create new job:
   - URL: `https://gripx-backend.onrender.com/api/health`
   - Schedule: `*/14 * * * *` (every 14 minutes)
   - Enable: Yes
4. Save

**Option B: Use GitHub Actions**
Create `.github/workflows/ping.yml`:

```yaml
name: Ping Backend

on:
  schedule:
    - cron: '*/14 * * * *'  # Every 14 minutes
  workflow_dispatch:

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Backend
        run: |
          curl -s -o /dev/null -w "%{http_code}" https://gripx-backend.onrender.com/api/health
```

**Option C: Use UptimeRobot (Free Monitoring)**
1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Create free account
3. Add new monitor:
   - Type: HTTP(s)
   - URL: `https://gripx-backend.onrender.com/api/health`
   - Interval: 5 minutes
4. Save

### 4.3 Solution 2: Upgrade to Render Paid Tier

**Upgrade to Render Basic ($25/month)**
- Always-on service
- No cold starts
- Better performance

**Upgrade to Render Pro ($85/month)**
- Priority support
- More resources
- Better reliability

### 4.4 Solution 3: Caching Strategy

Add Redis-like caching to backend:

```javascript
// Simple in-memory cache
const cache = new Map();

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl;
    const cached = cache.get(key);

    if (cached && Date.now() - cached.timestamp < duration) {
      return res.json(cached.data);
    }

    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method
    res.json = (data) => {
      cache.set(key, {
        data,
        timestamp: Date.now()
      });
      // Clean old cache entries
      if (cache.size > 100) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      originalJson(data);
    };

    next();
  };
};

// Apply cache to product routes (5 minute cache)
app.use('/api/products', cacheMiddleware(5 * 60 * 1000));
```

---

## Phase 5: Monitoring & Troubleshooting

### 5.1 Set Up Monitoring

**UptimeRobot (Free)**
1. Monitor frontend: `https://gripx.store`
2. Monitor backend: `https://gripx-backend.onrender.com/api/health`
3. Set alerts for email/SMS

**Vercel Analytics**
1. Go to Vercel Dashboard → Analytics
2. Enable analytics
3. Monitor:
   - Page views
   - Unique visitors
   - Bandwidth usage
   - Performance metrics

**Render Logs**
1. Go to Render Dashboard → Your Service → Logs
2. Monitor for errors
3. Set up log alerts

### 5.2 Performance Monitoring

**Web Vitals Monitoring**
Add to your main.tsx:

```typescript
// Report Web Vitals
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';

function reportWebVitals(metric: any) {
  console.log(`Web Vital: ${metric.name} = ${metric.value}`);
  // Send to analytics endpoint
  fetch('/api/analytics/vitals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metric)
  }).catch(() => {}); // Ignore errors
}

onCLS(reportWebVitals);
onFID(reportWebVitals);
onLCP(reportWebVitals);
onFCP(reportWebVitals);
onTTFB(reportWebVitals);
```

### 5.3 Error Tracking

**Sentry Integration (Free Tier)**
1. Go to [sentry.io](https://sentry.io)
2. Create account and project
3. Install SDK:
```bash
npm install @sentry/react @sentry/node
```

Update main.tsx:
```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
  release: "gripx@1.0.0",
});

createRoot(document.getElementById("root")!).render(
  <Sentry.ErrorBoundary fallback={({error}) => <ErrorFallback error={error} />}>
    <App />
  </Sentry.ErrorBoundary>
);
```

---

## 📊 Implementation Checklist

### Phase 1: Domain Setup
- [ ] Add gripx.store to Vercel
- [ ] Configure DNS CNAME records
- [ ] Wait for DNS propagation
- [ ] Verify HTTPS certificate
- [ ] Update CORS on backend

### Phase 2: Performance
- [ ] Update vercel.json with caching
- [ ] Update vite.config.ts with optimizations
- [ ] Update index.html with meta tags
- [ ] Optimize backend compression
- [ ] Add database indexes
- [ ] Verify lazy loading

### Phase 3: Security
- [ ] Add rate limiting
- [ ] Update JWT verification
- [ ] Verify environment variables
- [ ] Test CORS configuration
- [ ] Enable security headers

### Phase 4: Backend Sleep
- [ ] Set up keep-alive pings (Cron-job.org OR UptimeRobot)
- [ ] OR upgrade to Render paid tier
- [ ] Add caching to backend
- [ ] Test wake-up time

### Phase 5: Monitoring
- [ ] Set up UptimeRobot monitors
- [ ] Enable Vercel Analytics
- [ ] Configure Render log alerts
- [ ] Add Web Vitals tracking
- [ ] Create error tracking

---

## 🎯 Expected Results

| Metric | Before | After |
|--------|--------|-------|
| **First Load Time** | 2-5s (cold) | 1-2s (warm) |
| **Time to Interactive** | 3-6s | 1-3s |
| **Cumulative Layout Shift** | Unknown | < 0.1 |
| **Backend Wake Time** | 30-60s | 0s (with keep-alive) |
| **Security Score** | Basic | A+ |
| **HTTPS Grade** | A | A+ |

---

## 📝 Next Steps

1. **Review this plan** - Make sure all changes are acceptable
2. **Backup your code** - Commit current changes to Git
3. **Start with Phase 1** - Domain setup (most impactful)
4. **Continue with Phase 2-5** - Follow the checklist
5. **Test after each change** - Ensure everything works

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Status**: Ready for Implementation

