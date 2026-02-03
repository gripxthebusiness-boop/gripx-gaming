# NeoSell Premium Gaming Website - Complete Project

A full-stack e-commerce website for NeoSell gaming peripherals with a complete admin dashboard for managing products and users.

## 🎮 Project Overview

NeoSell is a professional gaming peripherals e-commerce platform featuring:
- Modern responsive design with dark gaming theme
- Product catalog with multiple categories
- Contact page with dedicated phone numbers
- Full admin/editor dashboard for content management
- User authentication and role-based access control
- MongoDB database for persistent storage

## ✨ Features

### For Customers
- ✅ Browse gaming products by category
- ✅ View detailed product specifications
- ✅ Call-to-action buttons with direct phone numbers
- ✅ Responsive mobile-friendly design
- ✅ Modern animated UI with motion effects

### For Admins/Editors
- ✅ User authentication system
- ✅ Admin dashboard for product management
- ✅ Add/Edit/Delete products
- ✅ Role-based access control (Admin/Editor)
- ✅ User management (Admin only)
- ✅ Real-time product updates

## 🏗️ Architecture

```
┌─────────────────────────┐
│   Frontend (React)      │
│  - Home Page            │
│  - Products Gallery     │
│  - Contact Page         │
│  - Login/Register       │
│  - Admin Dashboard      │
└──────────────┬──────────┘
               │ REST API
               │ Bearer Token Auth
               ↓
┌─────────────────────────┐
│  Backend (Node.js)      │
│  - Express Server       │
│  - JWT Authentication   │
│  - CRUD Operations      │
│  - Role Management      │
└──────────────┬──────────┘
               │ MongoDB Query
               ↓
┌─────────────────────────┐
│   Database (MongoDB)    │
│  - Users Collection     │
│  - Products Collection  │
└─────────────────────────┘
```

## 📦 Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **Vite** - Fast build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)

### Setup (5 minutes)

1. **Frontend**
```bash
cd Premiumgamingwebsitedesign-main
npm install
npm run dev
# Open http://localhost:5173
```

2. **Backend**
```bash
cd backend
npm install
cp .env.example .env
npm start
# Server runs on http://localhost:5000
```

3. **First Admin User**
- Register at `/register`
- Update in MongoDB to admin role
- Login to access dashboard

## 📋 Project Structure

```
Premiumgamingwebsitedesign-main/
├── src/
│   ├── app/
│   │   ├── pages/           # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Products.tsx
│   │   │   ├── Cart.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── components/      # Reusable components
│   │   ├── context/         # Auth context
│   │   └── styles/
│   └── main.tsx
├── backend/
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API endpoints
│   ├── middleware/          # Auth middleware
│   ├── server.js
│   └── package.json
├── QUICK_START.md           # Quick reference
├── BACKEND_SETUP.md         # Detailed setup
├── API_DOCUMENTATION.md     # API reference
└── TROUBLESHOOTING.md       # Common issues
```

## 🔑 Contact Information

**NeoSell Sales**
- **Phone 1**: +91 9063032312
- **Phone 2**: +91 9923869222
- **Email**: sales@gripx.com

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get started in 5 minutes
- **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** - Detailed setup and configuration
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and solutions
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - What was built

## 🔐 Authentication

### User Registration
Create a new editor account at `/register`
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password"
}
```

### User Login
Login with your credentials at `/login`

### Make Admin
After registration, update in MongoDB:
```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

## 📊 Database

### Users Collection
- `username` - Unique username
- `email` - Unique email
- `password` - Hashed password
- `role` - "admin" or "editor"
- `isActive` - Account status

### Products Collection
- `name` - Product name
- `category` - Mice, Keyboards, Headsets, Controllers
- `price` - Price string
- `rating` - Rating (0-5)
- `image` - Image URL
- `specs` - Product specifications
- `description` - Product description
- `isActive` - Product visibility

## 🛣️ API Routes

### Auth Endpoints
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
GET    /api/auth/users (admin)
PUT    /api/auth/users/:id/role (admin)
PUT    /api/auth/users/:id/deactivate (admin)
```

### Product Endpoints
```
GET    /api/products
GET    /api/products/:id
POST   /api/products (editor/admin)
PUT    /api/products/:id (editor/admin)
DELETE /api/products/:id (editor/admin)
```

## 🎨 UI/UX Features

- Dark gaming theme with cyan/blue gradients
- Smooth animations and transitions
- Responsive design (mobile, tablet, desktop)
- Loading states and error handling
- Intuitive dashboard interface
- Product management interface

## 🔧 Configuration

### Environment Variables

**Frontend (.env.local)**
```
VITE_API_URL=http://localhost:5000/api
```

**Backend (.env)**
```
MONGO_URI=mongodb://localhost:27017/neosell
JWT_SECRET=your_secure_key_here
PORT=5000
NODE_ENV=development
```

## 📈 Next Steps

1. **Setup the project** - Follow QUICK_START.md
2. **Understand the architecture** - Read IMPLEMENTATION_SUMMARY.md
3. **Learn the API** - Check API_DOCUMENTATION.md
4. **Deploy** - Set up production environment
5. **Enhance** - Add features like:
   - Email notifications
   - Image uploads
   - Search & filtering
   - Payment processing
   - User reviews

## 🐛 Troubleshooting

Encounter issues? Check these resources:
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common problems and solutions
- Backend logs in terminal
- Browser DevTools Console
- MongoDB logs

## 📦 Installation Checklist

- [ ] Node.js installed
- [ ] MongoDB running or Atlas account ready
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend dependencies installed (`npm install`)
- [ ] `.env.local` created for frontend
- [ ] `.env` created for backend
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] First user registered
- [ ] Admin role assigned
- [ ] Dashboard accessible

## 💡 Tips for Success

1. **Always have MongoDB running** before starting backend
2. **Check both terminal windows** for errors
3. **Clear browser cache** if experiencing issues
4. **Use DevTools** to debug frontend issues
5. **Check logs** - errors are usually printed there
6. **Read error messages carefully** - they tell you what's wrong
7. **Use the documentation** - answers are usually there

## 🤝 Support

If you need help:
1. Check the relevant documentation file
2. Review the error message carefully
3. Check browser console (DevTools)
4. Check backend terminal output
5. Verify all prerequisites are installed

## 📄 License

NeoSell Premium Gaming Website © 2026

## 📝 Files Changed/Created

### Created
- Backend: `server.js`, models, routes, middleware
- Frontend: `Login.tsx`, `Register.tsx`, `Dashboard.tsx`
- Context: `AuthContext.jsx` (updated)
- Documentation: 4 guide files

### Modified
- `App.tsx` - Added routes and auth provider
- `Navigation.tsx` - Added login/dashboard links
- `Products.tsx` - "Buy Now" buttons
- Phone numbers in Contact & Cart pages

### Updated Phone Numbers
- **Line 1**: +91 9063032312
- **Line 2**: +91 9923869222

---

**Ready to get started?** Follow the [QUICK_START.md](./QUICK_START.md) guide!
