# ⚡ Installation & First Run Guide

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js 16+** - Download from [nodejs.org](https://nodejs.org)
- **MongoDB** - Local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- **Git** - For version control
- **Telegram** - For bot notifications (optional but recommended)

Verify installation:
```bash
node --version
npm --version
git --version
```

---

## 🎯 Step-by-Step Installation

### Step 1: Backend Setup (5 minutes)

```bash
# Navigate to backend directory
cd backend

# Install all dependencies
npm install

# This installs:
# - express (web framework)
# - mongoose (database)
# - cors (cross-origin)
# - dotenv (environment)
# - axios (HTTP client)
# - bcryptjs (hashing)
# - jsonwebtoken (JWT)
# - compression (performance)
# - express-rate-limit (security)
# - cloudinary (image upload)
# - multer (file upload)
```

### Step 2: Backend Environment Configuration

```bash
# Create .env file from template
cp .env.example .env

# Edit .env with your values
# Use your favorite editor:
nano .env
# or
code .env
# or open in any text editor
```

**Minimal .env content:**
```bash
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/gripx
JWT_SECRET=your_secret_key_change_in_production
```

**To use MongoDB Atlas instead of local:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Get connection string
5. Replace MONGO_URI:
```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/gripx?retryWrites=true&w=majority
```

### Step 3: Start Backend

```bash
# Development mode (auto-reload on file changes)
npm run dev

# Expected output:
# 🚀 Server running on port 5000
# 📍 Environment: development
# ✅ MongoDB connected
# ✅ Database indexes synchronized
```

**Leave this running in Terminal 1**

---

### Step 4: Frontend Setup (5 minutes)

**In a NEW terminal window:**

```bash
# Go to project root (if in backend directory)
cd ..

# Install frontend dependencies
npm install

# This installs:
# - react (UI library)
# - typescript (type safety)
# - vite (build tool)
# - axios (HTTP client)
# - tailwind (styling)
# - react-router (navigation)
# - zustand (state management)
# - cloudinary-react (image upload)
```

### Step 5: Frontend Environment Configuration

```bash
# Create .env.local
cp .env.example .env.local

# Edit .env.local
code .env.local
# or nano .env.local
```

**Minimal .env.local content:**
```bash
VITE_API_URL=http://localhost:5000/api
```

### Step 6: Start Frontend

```bash
# In Terminal 2 (different from backend terminal)
npm run dev

# Expected output:
#   VITE v5.0.0  ready in 123 ms
#
#   ➜  Local:   http://localhost:5173/
#   ➜  press h to show help
```

---

## ✅ Verify Installation

### Test Backend API

```bash
# In Terminal 3 (or another terminal)

# Test 1: Health check
curl http://localhost:5000/api/health

# Expected response:
# {
#   "status": "ok",
#   "message": "Server is running"
# }

# Test 2: Create test order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "product": "Test Product",
    "quantity": 1,
    "price": 29.99,
    "customer": "Test User",
    "phone": "1234567890",
    "address": "123 Test Street"
  }'

# Expected response: Success JSON with order details

# Test 3: Get all orders
curl http://localhost:5000/api/orders

# Should return array of orders
```

### Test Frontend

1. Open browser: http://localhost:5173
2. Navigate to any product page
3. Click "Buy Now" button
4. Fill in form with test data
5. Click "Place Order"
6. Should see success message

---

## 🤖 Optional: Telegram Bot Setup

Skip this if you don't want order notifications.

### Setup Telegram Bot

1. **Open Telegram** and search for **@BotFather**
2. **Send** `/start`
3. **Send** `/newbot`
4. **Answer prompts:**
   - Name your bot: "GripX Gaming Orders"
   - Username: "gripx_gaming_bot" (must end with _bot)
5. **Copy** the token provided (looks like: `123456789:ABCdefGHI...`)

### Get Chat ID

1. **Create a Telegram group** or use a private chat with your bot
2. **Add the bot** to the group
3. **Send a message** to the bot
4. **Visit** this URL in browser:
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
   Replace `<YOUR_BOT_TOKEN>` with your actual token

5. **Find the Chat ID**:
   ```json
   {
     "result": [
       {
         "message": {
           "chat": {
             "id": -1001234567890,  // ← This is your CHAT_ID
             "type": "group"
           }
         }
       }
     ]
   }
   ```

6. **Add to backend .env:**
   ```bash
   BOT_TOKEN=123456789:ABCdefGHIjklmNOpqrsTUvwxyz_ABC1234
   CHAT_ID=-1001234567890
   ```

7. **Restart backend:**
   - Stop it (Ctrl+C)
   - Run `npm run dev` again

### Test Telegram

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "product": "Gaming Mouse",
    "quantity": 1,
    "price": 49.99,
    "customer": "Test User",
    "phone": "1234567890",
    "address": "123 Test St"
  }'
```

Check your Telegram group - you should see the notification!

---

## 📦 Run Tests

After setup, test everything:

```bash
# Run comprehensive test suite
cd backend
node test-orders.js

# Expected output:
# ✅ Test 1: Create Order
# ✅ Test 2: Get All Orders
# ✅ Test 3: Get Single Order
# ✅ Test 4: Get Order Statistics
# ✅ Test 5: Update Order Status
# ✅ Test 6: Test Validation Errors
```

---

## 🚨 Troubleshooting

### "Cannot find module 'express'"

```bash
cd backend
npm install
```

### "MongoDB connection failed"

**If using local MongoDB:**
- Ensure MongoDB is running
- Check MONGO_URI in .env is correct

**If using MongoDB Atlas:**
- Verify connection string format
- Check IP whitelist allows your IP
- Verify password has no special chars (or URL encode them)

### "CORS error in frontend"

Make sure backend is running:
```bash
cd backend
npm run dev
```

### "Port 5000 already in use"

Find and stop process:
```bash
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

Or use different port:
```bash
PORT=3000 npm run dev
```

### Telegram notifications not working

1. Check BOT_TOKEN is correct
2. Check CHAT_ID is correct (must be negative for groups)
3. Ensure bot is in the group/chat
4. Check .env file is loaded (restart backend)

---

## 📱 Common Commands

### Development Mode

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev

# Terminal 3 - Optional tests
cd backend
node test-orders.js
```

### Build for Production

```bash
# Backend (Render will do this)
cd backend
npm install
npm start

# Frontend (Vercel will do this)
npm run build
npm run preview
```

### Database Management

```bash
# View all orders (MongoDB)
mongo
use gripx
db.orders.find()

# Or via API
curl http://localhost:5000/api/orders
```

---

## 📚 Next Steps

1. ✅ Installation complete
2. ⬜ Read [ORDER_SYSTEM_SETUP.md](./ORDER_SYSTEM_SETUP.md) for complete guide
3. ⬜ Deploy backend to Render
4. ⬜ Deploy frontend to Vercel
5. ⬜ Configure Telegram in production
6. ⬜ Test end-to-end order flow

---

## 🎉 You're Ready!

Your local development environment is now set up and running!

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

**Next**: Go to http://localhost:5173 and test placing an order!

---

## 💡 Tips

- Keep both terminals open (backend & frontend)
- Changes to frontend code hot-reload automatically
- Backend changes require restart
- Check browser console (F12) for errors
- Check terminal for API logs
- Use `curl` or Postman for API testing

---

**Questions?** See ORDER_SYSTEM_SETUP.md or check error messages in terminals.
