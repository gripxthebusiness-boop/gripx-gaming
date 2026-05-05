import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Multer config for memory storage (we'll upload to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

    if (allowedMimes.includes(file.mimetype) && allowedExts.includes(file.originalname.toLowerCase().match(/\.[^.]*$/)?.[0] || '')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: JPEG, PNG, GIF, WebP'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Helper function to upload to Cloudinary
const uploadToCloudinary = (fileBuffer, filename) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        folder: 'gripx/products',
        resource_type: 'auto',
        public_id: `${Date.now()}-${filename.replace(/\.[^.]*$/, '')}`,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

// Upload single image
router.post('/upload', verifyToken, verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);

    res.status(201).json({
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
      publicId: result.public_id,
      filename: req.file.originalname,
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload error', error: error.message });
  }
});

// Upload multiple images
router.post('/upload-multiple', verifyToken, verifyAdmin, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    // Upload all files to Cloudinary in parallel
    const uploadPromises = req.files.map(file =>
      uploadToCloudinary(file.buffer, file.originalname)
    );

    const results = await Promise.all(uploadPromises);

    const imageUrls = results.map(result => ({
      url: result.secure_url,
      publicId: result.public_id,
      filename: result.original_filename,
    }));

    res.status(201).json({
      message: 'Images uploaded successfully',
      images: imageUrls,
      count: results.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload error', error: error.message });
  }
});

// Delete image from Cloudinary (optional)
router.delete('/delete/:publicId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({ message: 'Public ID is required' });
    }

    await cloudinary.v2.uploader.destroy(publicId);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete error', error: error.message });
  }
});

export default router;
