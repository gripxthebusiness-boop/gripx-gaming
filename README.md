# Gripx Gaming - E-commerce Platform

A premium gaming e-commerce platform built with React, TypeScript, and Node.js.

## Features

- **Product Management** - Full CRUD operations for products with image uploads
- **Cloudinary Integration** - Secure image and CSV file uploads via backend API
- **User Authentication** - JWT-based auth with admin role management
- **Shopping Cart** - Full cart functionality with persistence
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Performance Optimized** - Caching, compression, and lazy loading

## Quick Start

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (backend/.env)
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Cloudinary Setup

For detailed Cloudinary configuration, see [backend/CLOUDINARY_SETUP.md](backend/CLOUDINARY_SETUP.md).

### Required Environment Variables for Cloudinary

Add these to your Render/Heroku deployment:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Deployment

### Frontend (Vercel)
1. Connect your repository to Vercel
2. Set `VITE_API_URL` to your backend URL
3. Deploy

### Backend (Render)
1. Create a new Web Service
2. Connect your repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables (MongoDB, JWT, Cloudinary)
6. Deploy

## API Documentation

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete API reference.

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React context (Auth, Cart)
│   │   └── pages/         # Application pages
│   └── styles/            # Global styles
├── backend/
│   ├── config/            # Configuration files (Cloudinary)
│   ├── middleware/        # Express middleware (auth)
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes (auth, products, upload)
│   └── server.js          # Express server entry point
└── public/                # Static assets
```

## Technologies Used

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Storage:** Cloudinary (images & files)
- **Authentication:** JWT (jsonwebtoken)
- **UI Components:** shadcn/ui

## License

MIT
