# Environment Variables for Vercel & Render

## 🔧 Backend (Render)

### Setting Environment Variables in Render

1. Go to your service dashboard on [render.com](https://render.com)
2. Click **Environment** tab
3. Add each variable below:

### Required Variables

| Variable | Value | Example | Notes |
|----------|-------|---------|-------|
| **MONGO_URI** | MongoDB Atlas connection string | `mongodb+srv://user:password@cluster.mongodb.net/gripx` | Get from MongoDB Atlas |
| **JWT_SECRET** | Random secret key | `your_very_secure_random_string_here` | Use strong random string |
| **PORT** | Server port | `5000` | Render will override, but set for local |
| **NODE_ENV** | Environment | `production` | Use `production` on Render |

### Optional Variables (for Telegram)

| Variable | Value | Example | Notes |
|----------|-------|---------|-------|
| **BOT_TOKEN** | Telegram bot token | `123456789:ABCDefghijklmNOpqrsTUVwxyzABCDefgh` | Get from @BotFather |
| **CHAT_ID** | Telegram chat ID | `987654321` | Your Telegram chat ID |

### Complete Backend .env Example for Render

```bash
# Database
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/gripx

# JWT
JWT_SECRET=use_a_very_strong_random_string_at_least_32_characters_long

# Server
PORT=5000
NODE_ENV=production

# Telegram (Optional)
BOT_TOKEN=your_telegram_bot_token_here
CHAT_ID=your_telegram_chat_id_here
```

---

## 🎯 Frontend (Vercel)

### Setting Environment Variables in Vercel

1. Go to your project on [vercel.com](https://vercel.com)
2. Click **Settings** → **Environment Variables**
3. Add each variable with the scope: **Production**, **Preview**, **Development**
4. Deploy to apply changes

### Required Variables

| Variable | Value | Scope | Notes |
|----------|-------|-------|-------|
| **VITE_API_URL** | Backend API URL | Production, Preview, Development | Points to your backend |
| **NEXT_PUBLIC_API_URL** | Backend API URL (alternative) | Production, Preview, Development | For Next.js compatibility |

### Recommended Values by Environment

#### Production (after backend deployed to Render)
```
VITE_API_URL=https://your-backend-name.onrender.com
NEXT_PUBLIC_API_URL=https://your-backend-name.onrender.com
```

#### Preview/Development (local backend)
```
VITE_API_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🔗 Step-by-Step Setup Guide

### Part 1: Backend Setup on Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Connect Repository**
   - New → Web Service
   - Select your GitHub repo (gripx-gaming)
   - Name: `gripx-backend`

3. **Configure Service**
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`

4. **Add Environment Variables**
   - Click **Environment** tab
   - Add all variables from Backend section above
   - Click **Save**

5. **Deploy**
   - Render auto-deploys
   - Wait for build to complete
   - Copy your service URL (e.g., `https://gripx-backend.onrender.com`)

### Part 2: Frontend Setup on Vercel

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - New Project → Import Git Repository
   - Select gripx-gaming repo
   - Framework: **Vite**

3. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables**
   - Go to **Settings** → **Environment Variables**
   - Add both variables:
     - `VITE_API_URL` = `https://gripx-backend.onrender.com`
     - `NEXT_PUBLIC_API_URL` = `https://gripx-backend.onrender.com`
   - Apply to all scopes (Production, Preview, Development)

5. **Deploy**
   - Click **Deploy**
   - Wait for build
   - Your site URL will be provided

---

## 🔐 Getting Sensitive Values

### MongoDB Atlas URI

1. Go to [mongodb.com/cloud](https://mongodb.com/cloud)
2. Log in to your cluster
3. Click **Connect** → **Drivers**
4. Copy connection string
5. Replace `<password>` with your database password
6. Use full URI as `MONGO_URI`

Example format:
```
mongodb+srv://username:password@cluster0.abc123.mongodb.net/gripx?retryWrites=true&w=majority
```

### JWT Secret

Generate a strong random string:

**Option A: Terminal**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option B: Online**
- Use [randomstring.com](https://randomstring.com) (32+ characters)

**Option C: Manual**
- Create any 32+ character random string

### Telegram Bot Token & Chat ID

1. **Create Bot:**
   - Message @BotFather on Telegram
   - `/newbot` → follow prompts
   - Copy the token

2. **Get Chat ID:**
   - Send a message to your new bot
   - Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find `"chat":{"id":123456789}`
   - Copy the ID number

---

## 📝 Environment Variable Reference

### Vite/Frontend Variables

Variables starting with `VITE_` are exposed to browser code.

```typescript
// These are accessible in frontend code:
import.meta.env.VITE_API_URL
import.meta.env.VITE_APP_TITLE

// NEXT_PUBLIC_ is Next.js convention but works with envPrefix
import.meta.env.NEXT_PUBLIC_API_URL
```

### Node.js Backend Variables

Variables are loaded via `dotenv` and accessed as:

```javascript
process.env.MONGO_URI
process.env.JWT_SECRET
process.env.BOT_TOKEN
```

---

## ✅ Verification Checklist

### Before Deploying to Render

- [ ] Create MongoDB Atlas cluster
- [ ] Test MongoDB connection locally
- [ ] Generate strong JWT_SECRET
- [ ] (Optional) Create Telegram bot
- [ ] Push code to GitHub
- [ ] Create Render service
- [ ] Add all environment variables
- [ ] Check build logs for errors

### Before Deploying to Vercel

- [ ] Backend deployed to Render (have URL ready)
- [ ] Push frontend code to GitHub
- [ ] Create Vercel project
- [ ] Set VITE_API_URL to backend Render URL
- [ ] Set NEXT_PUBLIC_API_URL to backend Render URL
- [ ] Run build test locally: `npm run build`
- [ ] Deploy to Vercel

### After Deployment

- [ ] Backend health check: `https://your-backend.onrender.com/api/health`
- [ ] Frontend loads: `https://your-site.vercel.app`
- [ ] Order API works: Test from frontend
- [ ] Telegram notifications work (if configured)

---

## 🚨 Common Issues & Fixes

### Backend can't connect to MongoDB

**Error:** `MONGO_URI is missing`

**Fix:**
- Verify MONGO_URI is set in Render environment
- Check MongoDB Atlas IP whitelist (set to 0.0.0.0 or your IP)
- Test connection string locally first
- Check password doesn't have special characters (URL encode if needed)

### Frontend can't reach backend

**Error:** `Failed to create order` / CORS error

**Fix:**
- Verify VITE_API_URL in Vercel matches deployed backend URL
- Check backend is running: `https://your-backend.onrender.com/api/health`
- Verify backend has CORS enabled (it does by default)
- Clear browser cache and rebuild

### Telegram notifications not working

**Error:** Orders create but no notification

**Fix:**
- BOT_TOKEN and CHAT_ID must be set
- Verify bot token is correct (no spaces)
- Verify chat ID is correct (should be a number)
- Bot must have permission to send messages
- Order will still be created even if notification fails

### Build fails on Vercel

**Error:** `vite: command not found` / dependency issues

**Fix:**
- Ensure package.json has vite as dependency
- Clear build cache: Settings → Advanced → Clear All
- Rerun deploy
- Check npm install succeeds

---

## 🔄 Updating Environment Variables

### After Deployment

If you need to change variables after deployment:

**Render:**
1. Go to service settings
2. Click **Environment** tab
3. Edit variables
4. Click **Save**
5. Service auto-redeploys

**Vercel:**
1. Go to **Settings** → **Environment Variables**
2. Edit variables
3. Redeploy: **Deployments** → **Redeploy**

---

## 📊 Complete Deployment Summary

### Render Backend (Backend URL)
```
https://your-backend-name.onrender.com
```

### Vercel Frontend (Frontend URL)
```
https://your-site-name.vercel.app
```

### Environment Variables

**Render (Backend):**
- MONGO_URI
- JWT_SECRET
- PORT
- NODE_ENV
- BOT_TOKEN (optional)
- CHAT_ID (optional)

**Vercel (Frontend):**
- VITE_API_URL = https://your-backend-name.onrender.com
- NEXT_PUBLIC_API_URL = https://your-backend-name.onrender.com

---

## 🎯 Quick Copy-Paste Template

### For Render

```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/gripx
JWT_SECRET=YOUR_STRONG_SECRET_HERE
PORT=5000
NODE_ENV=production
BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN_HERE
CHAT_ID=YOUR_TELEGRAM_CHAT_ID_HERE
```

### For Vercel

```
VITE_API_URL=https://your-backend-name.onrender.com
NEXT_PUBLIC_API_URL=https://your-backend-name.onrender.com
```

---

**Last Updated:** May 13, 2026
**Status:** Ready for Deployment ✅
