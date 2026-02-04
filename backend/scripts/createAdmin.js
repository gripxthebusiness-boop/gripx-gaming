import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

await mongoose.connect(process.env.MONGO_URI);

const existing = await User.findOne({ username: 'admin' });

if (existing) {
  console.log('Admin already exists');
  process.exit(0);
}

const hashedPassword = await bcrypt.hash('neosellAdmin123', 10);

await User.create({
  username: 'admin',
  email: 'admin@neosell.local',
  password: hashedPassword,
  role: 'admin',
});

console.log('Admin account created');
process.exit(0);
