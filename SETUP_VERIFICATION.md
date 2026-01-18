# Setup & Verification Checklist

Use this checklist to ensure everything is properly installed and configured.

## ✅ Prerequisites

- [ ] Node.js v16+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] MongoDB installed OR MongoDB Atlas account created
- [ ] Text editor/IDE ready (VS Code recommended)

## ✅ Frontend Setup

### Installation
- [ ] Navigate to project root: `cd Premiumgamingwebsitedesign-main`
- [ ] Install dependencies: `npm install`
- [ ] All packages installed successfully (no errors)

### Configuration
- [ ] Create `.env.local` file in project root
- [ ] Added `VITE_API_URL=http://localhost:5000/api` to `.env.local`
- [ ] Saved `.env.local` file

### Verification
- [ ] Start dev server: `npm run dev`
- [ ] Frontend runs on `http://localhost:5173`
- [ ] No errors in terminal
- [ ] Browser shows GripX homepage
- [ ] Navigation links work

## ✅ Backend Setup

### Installation
- [ ] Navigate to backend: `cd backend`
- [ ] Install dependencies: `npm install`
- [ ] All packages installed successfully (no errors)

### Configuration
- [ ] Create `.env` file in `backend/` directory
- [ ] Added `MONGO_URI=mongodb://localhost:27017/gripx`
- [ ] Added `JWT_SECRET=your_secret_key_here` (any string)
- [ ] Added `PORT=5000`
- [ ] Added `NODE_ENV=development`
- [ ] Saved `.env` file

### Database
- [ ] MongoDB is running locally OR
- [ ] MongoDB Atlas account configured with connection string
- [ ] Connection string updated in `.env`

### Verification
- [ ] Start backend: `npm start`
- [ ] Backend runs on `http://localhost:5000`
- [ ] No errors in terminal
- [ ] Test with curl: `curl http://localhost:5000/api/health`
- [ ] Response shows: `{"message":"Server is running"}`

## ✅ Database Verification

### Connection Check
- [ ] MongoDB is accessible
- [ ] Can connect via MongoDB Compass or shell
- [ ] Database `gripx` exists (will be auto-created)

### Collections (will be created automatically)
- [ ] `users` collection appears after first registration
- [ ] `products` collection appears after adding first product

## ✅ Frontend Features

### Navigation
- [ ] Home link works
- [ ] Products link works
- [ ] Cart link works
- [ ] Login link appears (not logged in)

### Pages Working
- [ ] Homepage loads with hero section
- [ ] Products page shows all products
- [ ] Cart page shows message
- [ ] Contact page displays phone numbers:
  - [ ] +91 9063032312
  - [ ] +91 9923869222
- [ ] Phone numbers are clickable

### Product Buttons
- [ ] "Buy Now" button visible on products
- [ ] Clicking "Buy Now" goes to Contact page

## ✅ Authentication System

### Registration
- [ ] Go to `http://localhost:5173/register`
- [ ] Page loads without errors
- [ ] Can enter: username, email, password
- [ ] Registration button works
- [ ] Success message appears
- [ ] Redirects to login page

### Login
- [ ] Go to `http://localhost:5173/login`
- [ ] Page loads without errors
- [ ] Enter registered credentials
- [ ] Login button works
- [ ] No errors in DevTools Console
- [ ] Redirected to dashboard on success

### Token Storage
- [ ] Open DevTools → Application → LocalStorage
- [ ] Token appears after login (key: `token`)
- [ ] Token is long string starting with `eyJ`

## ✅ Admin Dashboard

### Dashboard Access
- [ ] Logged in user can access `/admin/dashboard`
- [ ] Page loads with "Admin Dashboard" heading
- [ ] Username appears in dashboard
- [ ] Logout button visible

### Add Product Feature
- [ ] "Add New Product" button visible
- [ ] Clicking opens a form
- [ ] Form has fields: name, category, price, rating, image URL, specs, description
- [ ] Can fill in product details
- [ ] Submit button adds product
- [ ] New product appears in table below

### Product List
- [ ] Products table displays all products
- [ ] Shows: Name, Category, Price, Rating columns
- [ ] Edit button visible for each product
- [ ] Delete button visible for each product

### Edit Product
- [ ] Click "Edit" on a product
- [ ] Form prefills with current data
- [ ] Can modify fields
- [ ] Submit button updates product
- [ ] Changes appear in table

### Delete Product
- [ ] Click "Delete" on a product
- [ ] Confirmation dialog appears
- [ ] Confirm delete
- [ ] Product removed from list

### Logout
- [ ] Click "Logout" button
- [ ] Redirected to homepage
- [ ] Login link reappears
- [ ] Cannot access dashboard without logging in

## ✅ API Testing

### Health Check
```bash
curl http://localhost:5000/api/health
# Expected: {"message":"Server is running"}
```
- [ ] Returns success message

### Registration API
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"test123"}'
# Expected: {"message":"User registered successfully"}
```
- [ ] Returns success message

### Login API
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
# Expected: token in response
```
- [ ] Returns token in response
- [ ] Copy the token value

### Get Products
```bash
curl http://localhost:5000/api/products
# Expected: JSON array of products
```
- [ ] Returns product list (empty array if no products)

### Get Current User (requires token)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/auth/me
# Expected: Current user object
```
- [ ] Returns user data with token from login

## ✅ Browser DevTools

### Network Tab
- [ ] No failed requests (red ones)
- [ ] Login request returns 200 status
- [ ] Product requests return 200 status
- [ ] Token included in Authorization header

### Console Tab
- [ ] No red error messages
- [ ] No warnings related to auth
- [ ] No CORS errors

### Application Tab
- [ ] LocalStorage shows `token` after login
- [ ] Token value is long JWT string

## ✅ Documentation

- [ ] `QUICK_START.md` exists and readable
- [ ] `BACKEND_SETUP.md` exists and readable
- [ ] `API_DOCUMENTATION.md` exists and readable
- [ ] `TROUBLESHOOTING.md` exists and readable
- [ ] `IMPLEMENTATION_SUMMARY.md` exists and readable

## ✅ Common Verification Steps

### If MongoDB not connecting
- [ ] Check MongoDB service running: `brew services list` (macOS)
- [ ] Verify port 27017 is available
- [ ] Check MONGO_URI in `.env`

### If port 5000 in use
- [ ] Change PORT in `backend/.env` to 5001
- [ ] Or kill process: `lsof -i :5000` → `kill -9 PID`

### If login not working
- [ ] Check backend is running
- [ ] Check `VITE_API_URL` in `.env.local`
- [ ] Check DevTools Network tab for failed requests
- [ ] Look for CORS errors

### If dashboard won't load
- [ ] Make sure you're logged in (token in localStorage)
- [ ] Check browser console for errors
- [ ] Try logging in again
- [ ] Clear localStorage and restart

## ✅ Performance Check

### Frontend Performance
- [ ] Homepage loads in < 3 seconds
- [ ] Products page loads in < 2 seconds
- [ ] No memory leaks (DevTools Memory tab)
- [ ] Animations are smooth

### Backend Performance
- [ ] API responses within 100-500ms
- [ ] No lag when adding/editing products
- [ ] Database queries efficient

## ✅ Security Verification

- [ ] Password not visible in frontend code
- [ ] JWT token stored in localStorage only
- [ ] API requires token for protected routes
- [ ] Admin routes check for admin role
- [ ] Passwords are hashed in database

## ✅ Mobile Responsiveness

- [ ] Open DevTools → Toggle device toolbar
- [ ] Test on mobile size (375x667)
- [ ] Navigation works on mobile
- [ ] Forms are usable on mobile
- [ ] Products display well on mobile
- [ ] Dashboard usable on tablet size

## ✅ Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (if macOS)
- [ ] Edge (if Windows)

## ✅ Final Verification

### All Core Features Working
- [ ] Public can view products
- [ ] Editors can add/edit/delete products
- [ ] Admins can manage users
- [ ] Phone numbers are clickable
- [ ] Contact page displays correctly
- [ ] Cart page has instructions

### No Critical Errors
- [ ] Backend terminal shows no errors
- [ ] Frontend DevTools console clean
- [ ] No network failures
- [ ] Database connected

### Ready for Development
- [ ] Can modify product data
- [ ] Can add new features
- [ ] Can deploy when ready

## ✅ Setup Complete! 🎉

All items checked? Great! Your GripX website is fully functional!

### Next Steps
1. Customize the branding and colors
2. Add more products
3. Implement additional features
4. Deploy to production

### Need Help?
- Check `TROUBLESHOOTING.md` for common issues
- Review the error messages carefully
- Check DevTools Console and Network tabs
- Restart services if stuck

---

**Date Completed**: ___________
**Setup by**: ___________
