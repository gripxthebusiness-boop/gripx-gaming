# Quick Start Guide

## TL;DR - Get Running in 5 Minutes

### Prerequisites
- Have Node.js installed
- Have MongoDB running locally OR MongoDB Atlas account

### Step 1: Frontend Setup (2 minutes)
```bash
cd Premiumgamingwebsitedesign-main
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

### Step 2: Backend Setup (3 minutes)
```bash
cd backend
npm install

# Create .env file with:
MONGO_URI=mongodb://localhost:27017/neosell
JWT_SECRET=test_secret_key
PORT=5000
NODE_ENV=development

npm start
```
Backend runs on: `http://localhost:5000`

### Step 3: First Time Setup
1. Open `http://localhost:5173/register`
2. Create an account (e.g., admin@neosell.com / password123)
3. Go to `http://localhost:5173/login` and login
4. Access dashboard at `http://localhost:5173/admin/dashboard`

### Done! 🎉

## What You Can Do Now

### As a Visitor
- Browse products
- View contact page with phone numbers
- Check out cart page

### As a Logged-In Editor
- Add/Edit/Delete products
- Manage product inventory
- Update product details

### As Admin (Manual Setup)
In MongoDB or terminal:
```javascript
// Update your user to admin in MongoDB
db.users.updateOne(
  { email: "admin@neosell.com" },
  { $set: { role: "admin" } }
)
```

Then manage other users from dashboard.

## Common Issues

**"Cannot connect to MongoDB"**
- Make sure MongoDB is running: `brew services start mongodb-community`
- Or use MongoDB Atlas connection string in `.env`

**"Port 5000 already in use"**
- Change PORT in `backend/.env` to 5001 or another free port

**"CORS error when logging in"**
- Make sure backend is running on port 5000
- Check `VITE_API_URL` in `.env.local` matches backend URL

## File Locations

- **Frontend code**: `src/app/pages/`, `src/app/components/`
- **Backend code**: `backend/routes/`, `backend/models/`
- **Database models**: `backend/models/User.js`, `backend/models/Product.js`
- **Auth endpoints**: `backend/routes/auth.js`
- **Product endpoints**: `backend/routes/products.js`

## Next Steps

1. Customize branding and colors
2. Add more product fields as needed
3. Implement email notifications
4. Set up production deployment
5. Add payment processing

See `BACKEND_SETUP.md` for detailed documentation.
