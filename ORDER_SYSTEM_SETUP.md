# 🚀 Complete E-Commerce Order System Setup Guide

## Table of Contents

1. [Overview](#overview)
2. [Local Development Setup](#local-development-setup)
3. [Backend Deployment (Render)](#backend-deployment-render)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Telegram Bot Configuration](#telegram-bot-configuration)
6. [API Documentation](#api-documentation)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## Overview

This is a complete production-ready e-commerce order system with:

- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **Frontend**: React + TypeScript + Vite
- **Notifications**: Telegram Bot API
- **Hosting**: Render (Backend) + Vercel (Frontend)
- **Database**: MongoDB Atlas

### Tech Stack Summary

```
Frontend (Vercel)
    ↓ (HTTP/HTTPS)
Backend (Render - PORT 5000)
    ↓
MongoDB Atlas
    ↓
Telegram Bot (Notifications)
```

---

## Local Development Setup

### Prerequisites

- Node.js 16+ installed
- MongoDB local or Atlas URI
- Telegram Bot Token (optional for local testing)
- Git

### Backend Setup

#### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

This installs:
- `express` - Web framework
- `mongoose` - MongoDB ORM
- `cors` - Cross-origin support
- `dotenv` - Environment variables
- `axios` - HTTP client for Telegram
- `express-rate-limit` - Rate limiting
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT auth
- `compression` - Response compression

#### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```bash
# Database
MONGO_URI=mongodb://localhost:27017/gripx
# OR use MongoDB Atlas:
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/gripx

# Server
PORT=5000
NODE_ENV=development
JWT_SECRET=your_very_secret_key_change_in_production

# Telegram (optional)
BOT_TOKEN=your_bot_token_here
CHAT_ID=your_chat_id_here

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

#### 3. Start Backend

**Development mode** (with auto-reload):

```bash
npm run dev
```

**Production mode**:

```bash
npm start
```

Expected output:

```
🚀 Server running on port 5000
📍 Environment: development
✅ MongoDB connected
✅ Database indexes synchronized
```

### Frontend Setup

#### 1. Install Frontend Dependencies

```bash
npm install
```

#### 2. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```bash
# Local development (backend on port 5000)
VITE_API_URL=http://localhost:5000/api

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

#### 3. Start Frontend

```bash
npm run dev
```

Expected output:

```
  VITE v5.0.0  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Test Local Integration

1. Open frontend: http://localhost:5173
2. Navigate to any product
3. Click "Buy Now" or go to checkout
4. Fill in order form:
   - Name: "John Doe"
   - Phone: "1234567890"
   - Address: "123 Main St"
5. Submit order
6. See success message with order number

---

## Backend Deployment (Render)

### Step 1: Prepare Backend for Render

Ensure your backend folder structure:

```
backend/
├── server.js                    ✓ Main server file
├── package.json                 ✓ All deps included
├── .env.example                 ✓ Created
├── config/
│   └── db.js                    ✓ Optional
├── controllers/
│   └── orderController.js       ✓ Created
├── models/
│   ├── Order.js                 ✓ Created
│   ├── Product.js               ✓ Exists
│   └── User.js                  ✓ Exists
├── routes/
│   ├── orders.js                ✓ Created
│   ├── auth.js                  ✓ Exists
│   ├── products.js              ✓ Exists
│   └── upload.js                ✓ Exists
├── middleware/
│   └── auth.js                  ✓ Exists
├── scripts/
│   └── createAdmin.js           ✓ Exists
└── node_modules/                (will be installed)
```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Connect your GitHub repository

### Step 3: Deploy on Render

1. Click **New +** → **Web Service**
2. Select your repository
3. Configure:
   - **Name**: `gripx-gaming-api` (or your choice)
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
4. Click **Advanced** and add environment variables:

```
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_super_secret_key
BOT_TOKEN=your_telegram_bot_token
CHAT_ID=your_telegram_chat_id
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

5. Click **Create Web Service**

### Step 4: Get Your Backend URL

After deployment completes:

```
✅ Live at: https://gripx-gaming-api.onrender.com
```

Save this URL - you'll need it for the frontend.

### Step 5: Verify Backend Deployment

```bash
curl https://gripx-gaming-api.onrender.com/api/health

# Response:
{
  "status": "ok",
  "message": "Server is running",
  "uptime": 120.5
}
```

---

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Vercel

1. Ensure you have a `.env.production` file (or configure in Vercel):

```
VITE_API_URL=https://gripx-gaming-api.onrender.com/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Root Directory**: `.` (or leave empty)
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables:
   - `VITE_API_URL`: `https://gripx-gaming-api.onrender.com/api`
   - `VITE_CLOUDINARY_CLOUD_NAME`: Your Cloudinary name
   - `VITE_CLOUDINARY_UPLOAD_PRESET`: Your upload preset

6. Click **Deploy**

### Step 3: Update CORS on Backend

Once you have your Vercel URL, update `backend/server.js`:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://your-app.vercel.app',  // ← Add your Vercel URL
  'https://gripx.store',
];
```

Then redeploy backend on Render.

---

## Telegram Bot Configuration

### Step 1: Create Telegram Bot

1. Open Telegram
2. Search for **@BotFather**
3. Send `/start`
4. Send `/newbot`
5. Follow prompts:
   - Bot name: "GripX Gaming Orders" (or your name)
   - Bot username: "gripx_gaming_bot" (unique, must end with _bot)
6. Copy the **BOT_TOKEN** provided

Example token: `123456789:ABCdefGHIjklmNOpqrsTUvwxyz_ABC1234`

### Step 2: Get Chat ID

1. Create a Telegram group or use a private chat
2. Send a test message to the bot
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Replace `<YOUR_BOT_TOKEN>` with your actual token
4. Find the `"id"` in the `"chat"` object
   - Example: `"id": -1001234567890`
5. Copy the **CHAT_ID**

### Step 3: Configure Backend

Add to `.env` (Render environment variables):

```
BOT_TOKEN=123456789:ABCdefGHIjklmNOpqrsTUvwxyz_ABC1234
CHAT_ID=-1001234567890
```

### Step 4: Test Telegram Notification

```bash
curl -X POST https://gripx-gaming-api.onrender.com/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "product": "Gaming Mouse",
    "quantity": 2,
    "price": 49.99,
    "customer": "Test User",
    "phone": "1234567890",
    "address": "123 Test St"
  }'
```

You should receive a Telegram message!

---

## API Documentation

### Create Order

**Endpoint**: `POST /api/orders`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "product": "Gaming Mouse",
  "quantity": 2,
  "price": 49.99,
  "customer": "John Doe",
  "email": "john@example.com",
  "phone": "+1 (555) 000-0000",
  "address": "123 Main St, Apartment 4B",
  "city": "New York",
  "postalCode": "10001",
  "notes": "Please ring doorbell twice"
}
```

**Required Fields**: `product`, `quantity`, `price`, `customer`, `phone`, `address`

**Response (Success - 201)**:
```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "id": "507f1f77bcf86cd799439011",
    "orderNumber": "ORD-1234567890-5678",
    "product": "Gaming Mouse",
    "quantity": 2,
    "totalPrice": 99.98,
    "customer": "John Doe",
    "phone": "+1 (555) 000-0000",
    "address": "123 Main St, Apartment 4B",
    "status": "pending",
    "createdAt": "2024-05-13T10:30:00.000Z"
  },
  "notification": {
    "success": true,
    "messageId": 123
  }
}
```

**Response (Error - 400)**:
```json
{
  "success": false,
  "message": "Customer name is required",
  "field": "customer"
}
```

### Get All Orders (Admin)

**Endpoint**: `GET /api/orders`

**Query Parameters**:
- `status`: pending, confirmed, processing, shipped, delivered, cancelled
- `limit`: Number of results (default: 50)
- `skip`: Skip results (default: 0)
- `sort`: Sort field (default: -createdAt)

**Response**:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "limit": 50,
    "skip": 0,
    "pages": 2
  }
}
```

### Get Single Order

**Endpoint**: `GET /api/orders/:id`

**Response**:
```json
{
  "success": true,
  "data": { ... }
}
```

### Update Order Status (Admin)

**Endpoint**: `PUT /api/orders/:id`

**Request Body**:
```json
{
  "status": "confirmed",
  "notes": "Order is being prepared"
}
```

### Get Order Statistics (Admin)

**Endpoint**: `GET /api/orders/stats`

**Response**:
```json
{
  "success": true,
  "data": {
    "total": 150,
    "pending": 45,
    "confirmed": 30,
    "processed": 40,
    "shipped": 25,
    "delivered": 10
  }
}
```

---

## Testing

### Test Order Submission (Frontend)

1. Navigate to http://localhost:5173/products
2. Click any product
3. Click "Buy Now" button
4. Fill in form:
   - Name: John Doe
   - Phone: 1234567890
   - Address: 123 Main St
5. Click "Place Order"
6. Verify success message

### Test API Directly

**Create order via curl**:
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "product": "Gaming Keyboard",
    "quantity": 1,
    "price": 129.99,
    "customer": "Jane Smith",
    "phone": "9876543210",
    "address": "456 Oak Ave"
  }'
```

**Get all orders**:
```bash
curl http://localhost:5000/api/orders
```

**Get order stats**:
```bash
curl http://localhost:5000/api/orders/stats
```

---

## Troubleshooting

### Backend Issues

#### "Cannot find module 'axios'"

```bash
cd backend
npm install axios
```

#### "MongoDB connection failed"

Check your `MONGO_URI`:
- Local: `mongodb://localhost:27017/gripx`
- Atlas: `mongodb+srv://username:password@cluster.mongodb.net/gripx`
- Verify credentials and network access

#### "CORS error on frontend"

1. Frontend URL not in `allowedOrigins` in `server.js`
2. Add your Vercel URL to the list
3. Redeploy backend

#### "Order created but no Telegram notification"

1. Verify `BOT_TOKEN` and `CHAT_ID` are correct
2. Test bot with: `https://api.telegram.org/bot<TOKEN>/getMe`
3. Check bot permissions in Telegram group

### Frontend Issues

#### "API_URL is undefined"

Ensure `.env.local` has:
```
VITE_API_URL=http://localhost:5000/api
```

Restart dev server after changing `.env.local`.

#### "CORS error when posting order"

Frontend and backend CORS mismatch. Check:
```javascript
// backend/server.js
const allowedOrigins = [
  'http://localhost:5173',  // ← Your frontend URL
  ...
];
```

#### "Order form not submitting"

1. Check browser console for errors
2. Verify all required fields are filled
3. Check network tab to see API response

---

## Production Checklist

- [ ] Backend deployed on Render with PORT=5000
- [ ] Frontend deployed on Vercel
- [ ] `VITE_API_URL` points to Render backend
- [ ] Backend CORS includes Vercel domain
- [ ] MongoDB Atlas connection working
- [ ] Telegram bot configured and tested
- [ ] SSL/HTTPS enabled on both services
- [ ] Environment variables set on Render and Vercel
- [ ] Test order submission end-to-end
- [ ] Monitor Telegram for orders

---

## Next Steps

1. Add authentication to order routes (JWT)
2. Add payment integration (Stripe/PayPal)
3. Add email notifications
4. Create admin dashboard
5. Add order tracking system
6. Implement inventory management

---

**Need help?** Check the main README.md or API_DOCUMENTATION.md
