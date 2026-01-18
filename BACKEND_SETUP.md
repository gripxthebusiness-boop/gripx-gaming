# GripX Gaming Website - Full Stack Setup Guide

## Project Structure

```
Premiumgamingwebsitedesign-main/
├── src/                          # Frontend React/TypeScript code
│   └── app/
│       ├── pages/               # Page components (Home, Products, Cart, Contact, Login, Register, Dashboard)
│       ├── components/          # Reusable components
│       ├── context/            # Authentication context
│       └── styles/             # CSS files
├── backend/                      # Node.js/Express backend
│   ├── models/                 # MongoDB schemas (User, Product)
│   ├── routes/                 # API routes (auth, products)
│   ├── middleware/             # Authentication middleware
│   ├── server.js               # Main server file
│   ├── package.json
│   └── .env.example
├── .env.example                 # Frontend environment variables example
└── package.json                # Frontend dependencies
```

## Prerequisites

- Node.js (v16+)
- MongoDB (local or MongoDB Atlas cloud)
- npm or yarn

## Installation & Setup

### 1. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# macOS (using Homebrew):
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB:
brew services start mongodb-community
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get your connection string

### 2. Frontend Setup

```bash
# Navigate to project root
cd Premiumgamingwebsitedesign-main

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Update .env.local with your API URL
VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your configuration
# For local MongoDB:
MONGO_URI=mongodb://localhost:27017/gripx
JWT_SECRET=your_secure_jwt_secret_key_here
PORT=5000
NODE_ENV=development

# For MongoDB Atlas, use:
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/gripx?retryWrites=true&w=majority

# Start the backend server
npm start
# Or for development with auto-reload:
npm run dev
```

## Features

### Public Features
- Browse gaming products
- View product details
- Contact page with phone numbers
- Responsive design

### Admin/Editor Features (Authenticated)
- **Login/Register**: Create editor accounts
- **Dashboard**: 
  - View all products
  - Add new products
  - Edit existing products
  - Delete products
- **User Management** (Admin only):
  - View all users
  - Manage user roles
  - Deactivate users

## User Roles

- **Admin**: Full access to all features and user management
- **Editor**: Can manage products but not users

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)
- `GET /api/auth/users` - Get all users (admin only)
- `PUT /api/auth/users/:userId/role` - Update user role (admin only)
- `PUT /api/auth/users/:userId/deactivate` - Deactivate user (admin only)

### Products
- `GET /api/products` - Get all active products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (requires editor/admin token)
- `PUT /api/products/:id` - Update product (requires editor/admin token)
- `DELETE /api/products/:id` - Delete product (requires editor/admin token)

## Creating Your First Admin User

1. Go to `http://localhost:3000/register` (or your frontend URL)
2. Create an account
3. Use MongoDB to manually update the role:

```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

Or use the backend API directly:

```bash
# After logging in, get your token and use it to update other users' roles
curl -X PUT http://localhost:5000/api/auth/users/USER_ID/role \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role":"admin"}'
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `brew services list` (macOS)
- Check connection string in `.env`
- Verify MongoDB is listening on port 27017

### CORS Issues
- Backend CORS is enabled for `localhost:3000` and `localhost:5173` (Vite default)
- Update `backend/server.js` CORS configuration if needed

### Token Issues
- Token stored in localStorage
- Check browser console for auth errors
- Verify JWT_SECRET is set in `.env`

### Port Already in Use
- Backend default: 5000
- Change PORT in `.env` if needed
- Frontend runs on Vite default (usually 5173)

## Environment Variables Reference

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/gripx
JWT_SECRET=your_secure_secret_here
PORT=5000
NODE_ENV=development
```

## Phone Numbers
- **Sales Line 1**: +91 9063032312
- **Sales Line 2**: +91 9923869222

## Security Notes

⚠️ **Important**: 
- Change `JWT_SECRET` in production
- Never commit `.env` files
- Use MongoDB Atlas with password protection
- Implement rate limiting in production
- Use HTTPS in production
- Add input validation
- Implement refresh tokens for better security

## Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
npm run build
# Deploy the dist folder
```

### Backend Deployment (Heroku/Railway)
```bash
# Set environment variables in hosting platform
# Deploy backend directory
```

## Support

For issues or questions, refer to the documentation or contact the development team.
