# 🚀 Deployment Checklist for neosell.store

After making the code changes, follow these steps to deploy and verify everything is working.

---

## 📦 Step 1: Push Changes to GitHub

```bash
cd /Users/SJ/Desktop/gripx-gaming
git add .
git commit -m "feat: Production optimization - performance, security, caching, monitoring"
git push origin main
```

**Wait 2-3 minutes for Vercel and Render to auto-deploy.**

---

## 🔧 Step 2: Update Backend Dependencies

Since we added `express-rate-limit`, you need to install it on Render:

**Option A: Via Render Dashboard (Recommended)**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your backend service: `neosell-backend`
3. Click **"Shell"** tab
4. Run:
   ```bash
   npm install express-rate-limit
   ```
5. Click **"Deploy"** → **"Deploy latest commit"**

**Option B: Via Git Push (Automatic)**
1. The changes to `backend/package.json` will auto-deploy
2. Render will run `npm install` automatically
3. Wait for deployment to complete

---

## 🔐 Step 3: Update Environment Variables

### Vercel (Frontend)
Go to [Vercel Dashboard](https://vercel.com) → gripx-gaming → Settings → Environment Variables

**Verify these variables exist:**
| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://neosell-backend.onrender.com/api` |
| `VITE_APP_TITLE` | `NeoSell` |

### Render (Backend)
Go to [Render Dashboard](https://dashboard.render.com) → neosell-backend → Environment

**Verify these variables exist:**
| Variable | Value |
|----------|-------|
| `MONGO_URI` | `mongodb+srv://admin:...@cluster0.xxx.mongodb.net/gripx?...` |
| `JWT_SECRET` | `your_long_random_string_at_least_32_characters` |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |

---

## 🌐 Step 4: Verify Custom Domain

### Check Vercel Domain Settings
1. Go to Vercel Dashboard → gripx-gaming → Settings → Domains
2. Verify `neosell.store` is listed and has:
   - ✅ SSL Certificate (green checkmark)
   - ✅ A/CNAME records configured

### Test Domain Resolution
```bash
# Check if domain points to Vercel
dig neosell.store

# Expected result:
# neosell.store.    3600    IN    CNAME    cname.vercel-dns.com.
```

### Verify HTTPS
1. Open browser to: `https://neosell.store`
2. Check for 🔒 lock icon in address bar
3. Click lock → Connection is secure

---

## 🧪 Step 5: Test All Endpoints

### Backend Health Check
```bash
curl https://neosell-backend.onrender.com/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "uptime": 123.45,
  "timestamp": "2024-...",
  "memory": {...},
  "cache": { "size": 0 }
}
```

### Products Endpoint
```bash
curl https://neosell-backend.onrender.com/api/products
```

### Frontend
1. Open: `https://neosell.store`
2. Check page loads without errors (F12 → Console)
3. Navigate to different pages
4. Test login/register flow

---

## ⚡ Step 6: Verify Performance Improvements

### Check Response Headers
```bash
curl -I https://neosell.store
```

**Expected Headers:**
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Cache-Control: public, max-age=31536000, immutable
```

### Check Caching Headers
```bash
curl -I https://neosell.store/assets/app-xxx.js
```

**Expected:**
```
Cache-Control: public, max-age=31536000, immutable
```

### Check Backend Caching
```bash
curl https://neosell-backend.onrender.com/api/products
```

**Response Headers should include:**
```
X-Cache: MISS (first request)
X-Cache: HIT (subsequent requests)
```

---

## 🔒 Step 7: Verify Security

### Test Rate Limiting
```bash
# Make 15 rapid requests
for i in {1..15}; do
  curl -s -o /dev/null -w "%{http_code}\n" https://neosell-backend.onrender.com/api/products
done
```

**Expected:** All should return 200 (if under limit) or 429 (if over limit)

### Test CORS
```bash
# Request from different origin
curl -H "Origin: https://evil.com" \
     -H "Access-Control-Request-Method: GET" \
     -I https://neosell-backend.onrender.com/api/products
```

**Expected Response:**
- Should NOT include `Access-Control-Allow-Origin: https://evil.com`

---

## 📊 Step 8: Set Up Monitoring

### UptimeRobot (Free - Recommended)
1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Create free account
3. Add monitors:

| Monitor Name | URL | Interval |
|--------------|-----|----------|
| NeoSell Frontend | `https://neosell.store` | 5 minutes |
| NeoSell Backend | `https://neosell-backend.onrender.com/api/health` | 5 minutes |

4. Set up email/SMS alerts

### Vercel Analytics
1. Go to Vercel Dashboard → Analytics
2. Enable if not already enabled
3. Monitor:
   - Page views
   - Unique visitors
   - Bandwidth usage
   - Performance score

### Render Logs
1. Go to Render Dashboard → neosell-backend → Logs
2. Enable log alerts (optional)
3. Check for errors

---

## 🐛 Step 9: Troubleshooting

### Frontend Shows Blank Page
1. Open DevTools (F12) → Console
2. Look for errors:
   - **"Failed to fetch"** → Backend URL wrong in Vercel env vars
   - **"CORS policy"** → Check backend CORS config
   - **"Module not found"** → Deployment in progress

### Can't Login
1. Check browser Network tab (F12)
2. Verify backend URL is correct
3. Check console for errors
4. Try incognito mode
5. Clear localStorage

### Products Don't Load
1. Check backend health: `https://neosell-backend.onrender.com/api/health`
2. Verify MongoDB connection in Render logs
3. Check Network tab for failed requests

### Backend Returns 503
1. Backend may be sleeping (Render free tier)
2. Wait 30-60 seconds
3. Refresh page
4. Consider upgrading to paid tier

### SSL Certificate Issues
1. Wait 10-15 minutes after DNS setup
2. Check DNS propagation: `dig neosell.store`
3. Verify SSL in Vercel: Settings → Domains → SSL

---

## 📈 Step 10: Monitor Performance

### Web Vitals
Open DevTools → Lighthouse tab
- **LCP** (Largest Contentful Paint): < 2.5s ✅
- **CLS** (Cumulative Layout Shift): < 0.1 ✅
- **FID** (First Input Delay): < 100ms ✅

### Response Times
```bash
# Time the response
time curl -s https://neosell.store/api/products

# Expected: < 2 seconds (warm), < 30 seconds (cold start)
```

### Cache Hit Rate
```bash
curl https://neosell-backend.onrender.com/api/cache/stats
```

**Expected after some usage:**
```json
{
  "size": 10,
  "hitRate": "85%"
}
```

---

## ✅ Deployment Complete!

**Your URLs:**
- 🌐 Frontend: `https://neosell.store`
- 🔧 Backend: `https://neosell-backend.onrender.com`
- 📊 Health: `https://neosell-backend.onrender.com/api/health`

**What was improved:**
- ✅ Performance optimization (caching, compression)
- ✅ Security enhancements (rate limiting, CORS, headers)
- ✅ Backend always-on (GitHub Actions keep-alive)
- ✅ Monitoring setup (UptimeRobot)
- ✅ SEO improvements (meta tags)

**Next Steps:**
1. ✅ Review this checklist
2. ✅ Push code to GitHub
3. ✅ Deploy and test
4. 📧 Set up monitoring alerts
5. 🎉 Enjoy your optimized site!

---

**Need Help?**
- Check Render logs for backend errors
- Check Vercel deployment logs
- Review PRODUCTION_OPTIMIZATION.md
- Check browser DevTools console
