# 🚀 Quick Deployment Checklist (55 Minutes to Live)

Follow this checklist to deploy your website in under an hour.

## Phase 1: Preparation (10 min)

- [ ] Have GitHub account ready
- [ ] Project code committed and pushed to GitHub
- [ ] `npm run build` works locally
- [ ] No environment variables in code

## Phase 2: Backend Deployment (15 min)

### Create Railway Account
- [ ] Go to [railway.app](https://railway.app)
- [ ] Sign up with GitHub
- [ ] Authorize Railway to access GitHub

### Deploy Backend
- [ ] In Railway: "New Project" → "Deploy from GitHub"
- [ ] Select your repository
- [ ] Set root directory to `backend`
- [ ] Add environment variables:
  - [ ] `MONGO_URI=mongodb+srv://...`
  - [ ] `JWT_SECRET=<random-long-string>`
  - [ ] `NODE_ENV=production`

### Verify Backend
- [ ] Deployment succeeds (green checkmark)
- [ ] Copy Railway URL (looks like: `https://...railway.app`)
- [ ] Test: `curl https://your-url/api/health`
- [ ] Should return: `{"message":"Server is running"}`

## Phase 3: Database Setup (15 min)

### Create MongoDB Atlas Account
- [ ] Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
- [ ] Sign up for free
- [ ] Create organization and project

### Create Database
- [ ] Click "Create a Deployment"
- [ ] Select "Free" tier
- [ ] Choose AWS region closest to you
- [ ] Create cluster (wait 2-3 min)

### Get Connection String
- [ ] Click "Connect"
- [ ] Choose "Drivers" tab
- [ ] Copy connection string
- [ ] Note: Must replace `<username>` and `<password>`

### Database User
- [ ] In MongoDB: Database Access tab
- [ ] "Add New Database User"
- [ ] Create username (remember it!)
- [ ] Create password (SAVE THIS!)
- [ ] Update connection string with credentials

### Network Access
- [ ] Network Access tab
- [ ] "Add IP Address"
- [ ] Select "Allow from Anywhere" (0.0.0.0/0)

### Update Railway
- [ ] Go back to Railway dashboard
- [ ] Update `MONGO_URI` with MongoDB connection string
- [ ] Railway redeploys automatically
- [ ] Verify deployment succeeds

## Phase 4: Frontend Deployment (10 min)

### Create Vercel Account
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Sign up with GitHub
- [ ] Authorize Vercel

### Deploy Frontend
- [ ] Click "Add New" → "Project"
- [ ] Select your GitHub repository
- [ ] Configure:
  - [ ] Framework: Vite
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `dist`
- [ ] Add environment variable:
  - [ ] `VITE_API_URL=https://your-railway-url/api`
- [ ] Click "Deploy"

### Verify Frontend
- [ ] Deployment succeeds
- [ ] Get Vercel URL (looks like: `https://project-name.vercel.app`)
- [ ] Visit URL in browser
- [ ] Should see GripX homepage

## Phase 5: Testing (10 min)

### Test Frontend
- [ ] Homepage loads
- [ ] Navigation links work
- [ ] No console errors (DevTools)

### Test Backend Connection
- [ ] Go to `/register`
- [ ] Create test account
- [ ] Go to `/login`
- [ ] Login with test account
- [ ] Access dashboard at `/admin/dashboard`
- [ ] Try adding a product
- [ ] Product appears in list

### Full Flow Test
- [ ] Visit homepage → Products → "Buy Now"
- [ ] Should go to contact page
- [ ] Phone numbers visible and clickable
- [ ] Logout button works

## Phase 6: Domain Setup (Optional, 5 min)

### Register Domain
- [ ] Go to [namecheap.com](https://namecheap.com)
- [ ] Search domain (e.g., gripx.com)
- [ ] Purchase (~$10/year)
- [ ] Note domain registrar

### Connect to Vercel
- [ ] Go to Vercel project → Settings → Domains
- [ ] Add your domain
- [ ] Vercel shows DNS records
- [ ] In Namecheap: Change nameservers to Vercel's
- [ ] Wait 24-48 hours for propagation

### Verify Domain
- [ ] Visit https://gripx.com
- [ ] Should load your site
- [ ] Check HTTPS works (green lock)

## Phase 7: Monitoring (2 min)

### Setup Uptime Alerts
- [ ] Go to [uptimerobot.com](https://uptimerobot.com)
- [ ] Sign up free
- [ ] Create monitor for frontend URL
- [ ] Create monitor for backend health endpoint
- [ ] Set to alert you if down

### Save Important URLs
- [ ] Frontend URL: ___________________
- [ ] Backend URL: ___________________
- [ ] MongoDB Cluster: ___________________
- [ ] Domain: ___________________
- [ ] GitHub Repo: ___________________

## Phase 8: Security (2 min)

- [ ] Enable 2FA on GitHub
- [ ] Enable 2FA on Vercel
- [ ] Enable 2FA on Railway
- [ ] Enable 2FA on MongoDB Atlas
- [ ] Save recovery codes in safe place
- [ ] Create `.env.example` (without secrets)

## Phase 9: Backups (1 min)

### MongoDB Backups
- [ ] In MongoDB Atlas: Go to "Backup"
- [ ] Verify automatic daily backups enabled
- [ ] Test restore (at least once)

### Code Backup
- [ ] Push code to GitHub
- [ ] GitHub auto-backs up everything
- [ ] Can restore from any commit

## Done Checklist

- [ ] Frontend deployed and live
- [ ] Backend running and connected to DB
- [ ] Database storing data
- [ ] All features tested
- [ ] Domain setup (if purchased)
- [ ] SSL/HTTPS working
- [ ] Backups enabled
- [ ] Monitoring active
- [ ] 2FA enabled everywhere
- [ ] Can access dashboard and add products

---

## Troubleshooting During Setup

### Backend won't connect to database
- ✓ Check MONGO_URI is correct
- ✓ Verify username/password in connection string
- ✓ Check IP whitelist (should be 0.0.0.0/0)
- ✓ View Railway logs for errors

### Frontend can't reach backend
- ✓ Check VITE_API_URL in Vercel env vars
- ✓ Ensure Railway backend is deployed
- ✓ Test backend health endpoint manually
- ✓ Check browser DevTools Network tab

### Login fails after deployment
- ✓ Check both have same JWT_SECRET
- ✓ Verify MongoDB has users collection
- ✓ Check backend logs in Railway dashboard
- ✓ Try registering new account again

### Domain not working
- ✓ Wait 24-48 hours after DNS change
- ✓ Verify nameservers in registrar
- ✓ Use `nslookup gripx.com` to check DNS
- ✓ Check Vercel DNS configuration

---

## After Launch

### Weekly Tasks
- [ ] Check uptime monitoring
- [ ] Review error logs
- [ ] Test core features

### Monthly Tasks
- [ ] Check MongoDB backup status
- [ ] Review platform bills
- [ ] Update dependencies

### When Making Changes
```bash
# 1. Make changes locally
# 2. Test locally: npm run dev
# 3. Push to GitHub: git push origin main
# 4. Both platforms auto-deploy (2-5 min)
# 5. Visit site and verify changes
```

---

## Time Summary

| Phase | Time | Done? |
|-------|------|-------|
| Preparation | 10 min | [ ] |
| Backend | 15 min | [ ] |
| Database | 15 min | [ ] |
| Frontend | 10 min | [ ] |
| Testing | 10 min | [ ] |
| Domain | 5 min | [ ] |
| Monitoring | 2 min | [ ] |
| Security | 2 min | [ ] |
| **TOTAL** | **~55 min** | [ ] |

---

## Success! 🎉

Your website is now:
- ✅ Live on the internet
- ✅ Running 24/7
- ✅ Accessible worldwide
- ✅ Auto-deploying code changes
- ✅ Backed up automatically
- ✅ Monitored for uptime
- ✅ Secure with HTTPS

**Cost per month: ~$5-15**

Every time you push code to GitHub, it automatically deploys! No manual steps needed.

---

## Emergency Contacts

**If something breaks:**

1. Check platform status pages:
   - [vercel.com/status](https://vercel.com/status)
   - [railway.app/status](https://railway.app/status)
   - [status.mongodb.com](https://status.mongodb.com)

2. View logs:
   - Railway: Dashboard → Logs
   - Vercel: Dashboard → Deployments → Logs
   - MongoDB: Atlas → Activity Feed

3. Search error online:
   - "[error message] railway node"
   - "[error message] vercel react"
   - "[error message] mongodb atlas"

4. Community help:
   - Stack Overflow
   - GitHub Discussions
   - Platform Discord servers

---

**You did it! Your website is now LIVE! 🚀**
