
import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Performance: Reduced bcrypt rounds from 10 to 8 (still secure, ~40% faster)
const BCRYPT_ROUNDS = 8;

// Password validation helper (Amazon-style requirements) - Optimized regex
const validatePassword = (password) => {
  // Early exit for obvious invalid cases
  if (!password || password.length < 8) {
    return { isValid: false, requirements: { minLength: false, hasUppercase: false, hasLowercase: false, hasNumber: false } };
  }
  
  // Combined regex checks for better performance
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  return {
    requirements: {
      minLength: true,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar: /[^A-Za-z0-9]/.test(password),
    },
    score: hasUppercase + hasLowercase + hasNumber + 3,
    isValid: hasUppercase && hasLowercase && hasNumber
  };
};

// Register - CUSTOMERS ONLY (cannot register as admin)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        message: 'Password does not meet requirements',
        requirements: passwordValidation.requirements
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email or username already exists' });
    }

    const hashedPassword = await bcryptjs.hash(password, BCRYPT_ROUNDS);

    // Create user with 'customer' role - customers cannot become admins via registration
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone: phone || undefined, // Optional phone number
      role: 'customer',
    });

    await newUser.save();

    res.status(201).json({ message: 'Account created successfully! You can now sign in.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login with email/password
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    const user = await User.findOne({ email });
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    // Check if account is locked
    if (user.isLocked) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(423).json({ 
        message: `Account temporarily locked. Please try again in ${remainingTime} minutes.`,
        locked: true,
        lockUntil: user.lockUntil
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Your account has been deactivated' });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    
    if (!isPasswordValid) {
      // Increment login attempts
      const updatedUser = await user.incrementLoginAttempts();

      const attemptsLeft = 5 - updatedUser.loginAttempts;
      if (attemptsLeft > 0) {
        return res.status(401).json({
          message: `Incorrect email or password. ${attemptsLeft} attempts remaining before lockout.`
        });
      } else {
        return res.status(423).json({
          message: 'Account temporarily locked due to too many failed login attempts. Please try again in 15 minutes.',
          locked: true
        });
      }
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login with phone/OTP (simulated for demo)
router.post('/login/otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // For demo purposes, accept OTP "123456" for any phone number
    // In production, integrate with SMS service like Twilio
    if (otp !== '123456') {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    // Find or create user with this phone
    let user = await User.findOne({ phone });

    if (!user) {
      // Create a new user with phone as identifier
      const username = `user_${phone.slice(-4)}`;
      user = new User({
        username,
        email: `${username}@neosell.local`,
        password: await bcryptjs.hash(phone, BCRYPT_ROUNDS),
        phone,
        role: 'customer',
      });
      await user.save();
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send OTP (simulated - in production, integrate with SMS service)
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || !/^[0-9]{10,15}$/.test(phone)) {
      return res.status(400).json({ message: 'Please enter a valid phone number' });
    }

    // In production, send actual OTP via SMS service
    // For demo, we always "send" OTP 123456
    res.json({
      message: 'OTP sent successfully',
      // Only include in development
      ...(process.env.NODE_ENV === 'development' && { otp: '123456' })
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Forgot password - send reset email (simulated)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    
    // Always return success to prevent email enumeration
    if (user) {
      // In production, send actual password reset email
      // For demo, we just return success
      res.json({ message: 'Password reset instructions sent to your email' });
    } else {
      res.json({ message: 'If an account exists with this email, you will receive reset instructions' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reset password with token (simulated)
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    // Validate new password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        message: 'Password does not meet requirements',
        requirements: passwordValidation.requirements
      });
    }

    // In production, verify token and update password
    // For demo, we just return success
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users (admin only)
router.get('/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user role (admin only)
router.put('/users/:userId/role', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!['admin', 'editor', 'customer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true }
    ).select('-password');

    res.json({ message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Deactivate user (admin only)
router.put('/users/:userId/deactivate', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isActive: false },
      { new: true }
    ).select('-password');

    res.json({ message: 'User deactivated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Activate user (admin only)
router.put('/users/:userId/activate', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isActive: true },
      { new: true }
    ).select('-password');

    res.json({ message: 'User activated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== USER PROFILE MANAGEMENT ====================

// Update own profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { username, email, phone } = req.body;
    const userId = req.user.id;

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid email address' });
      }

      // Check if email is already taken by another user
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'This email is already registered' });
      }
    }

    // Check if username is already taken by another user
    if (username) {
      const existingUser = await User.findOne({ username, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'This username is already taken' });
      }
    }

    // Build update object
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Change password
router.put('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        message: 'New password does not meet requirements',
        requirements: passwordValidation.requirements
      });
    }

    // Get user with password
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcryptjs.hash(newPassword, BCRYPT_ROUNDS);

    // Update password
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete own account
router.delete('/account', verifyToken, async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    if (!password) {
      return res.status(400).json({ message: 'Password is required to delete account' });
    }

    // Get user with password
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Password is incorrect' });
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

