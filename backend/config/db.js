import mongoose from 'mongoose';

/**
 * Connect to MongoDB (MongoDB Atlas)
 * Render-friendly: uses process.env.MONGO_URI
 */
export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is missing. Set it in Render environment variables.');
  }

  // Keep pool small-ish for typical Render free instances
  const mongooseOptions = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    autoIndex: true,
    maxIdleTimeMS: 60000,
  };

  await mongoose.connect(uri, mongooseOptions);
  console.log('✅ MongoDB connected');
};

