import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import cloudinaryConfig from '../config/cloudinary.js';

const router = express.Router();

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinaryConfig,
  params: {
    folder: 'neosell/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }]
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
    files: 5 // max 5 files per request
  }
});

// Configure multer for CSV files
const csvStorage = new CloudinaryStorage({
  cloudinary: cloudinaryConfig,
  params: {
    folder: 'neosell/specs',
    resource_type: 'raw',
    allowed_formats: ['csv'],
  }
});

const uploadCsv = multer({ 
  storage: csvStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max for CSV
    files: 1
  }
});

// Upload product images
router.post('/images', verifyToken, verifyAdmin, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images provided' });
    }

    const imageUrls = req.files.map(file => ({
      url: file.secure_url,
      public_id: file.filename,
      width: file.width,
      height: file.height,
      format: file.format
    }));

    res.json({
      message: 'Images uploaded successfully',
      images: imageUrls
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: 'Failed to upload images', 
      error: error.message 
    });
  }
});

// Upload single image
router.post('/image', verifyToken, verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    res.json({
      message: 'Image uploaded successfully',
      image: {
        url: req.file.secure_url,
        public_id: req.file.filename,
        width: req.file.width,
        height: req.file.height,
        format: req.file.format
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: 'Failed to upload image', 
      error: error.message 
    });
  }
});

// Upload CSV file for specifications
router.post('/csv', verifyToken, verifyAdmin, uploadCsv.single('csv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No CSV file provided' });
    }

    res.json({
      message: 'CSV file uploaded successfully',
      file: {
        url: req.file.secure_url,
        public_id: req.file.filename,
        format: req.file.format,
        resource_type: req.file.resource_type
      }
    });
  } catch (error) {
    console.error('CSV upload error:', error);
    res.status(500).json({ 
      message: 'Failed to upload CSV file', 
      error: error.message 
    });
  }
});

// Delete image by public_id
router.delete('/:publicId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { publicId } = req.params;
    
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      res.json({ message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ message: 'Image not found on Cloudinary' });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      message: 'Failed to delete image', 
      error: error.message 
    });
  }
});

export default router;