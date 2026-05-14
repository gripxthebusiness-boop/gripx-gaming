import express from 'express';
import { Product } from '../models/Product.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Cache middleware helper
const setCacheHeaders = (res, maxAge = 300) => {
  res.set('Cache-Control', `public, max-age=${maxAge}`);
  res.set('ETag', `W/"${Date.now()}"`);
};

// Get all products with pagination (PUBLIC - no auth needed)
router.get('/', async (req, res) => {
  try {
    // Parse pagination parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;

    // Build query filter
    const filter = { isActive: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Execute query with pagination - select only needed fields for list view
    const [products, total] = await Promise.all([
      Product.find(filter)
        .select('name price images category rating brand inStock')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(), // Use lean for faster query
      Product.countDocuments(filter),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);

    // Set cache headers for 1 minute (reduced for fresher product data after updates)
    setCacheHeaders(res, 60);

    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: total,
        productsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single product (PUBLIC - no auth needed)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Set cache headers for 10 minutes for single product
    setCacheHeaders(res, 600);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single product with related products (PUBLIC - optimized)
router.get('/:id/details', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Fetch related products in same request - select only needed fields
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    })
      .select('name price images rating brand')
      .limit(4)
      .sort({ createdAt: -1 })
      .lean();

    // Set cache headers for 10 minutes
    setCacheHeaders(res, 600);

    res.json({
      product,
      relatedProducts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

  // Create product (ADMIN ONLY)
  router.post('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
      const { name, brand, category, price, images, description, specs, rating, inStock, stockQuantity } = req.body;

      // Validate required fields with better error messaging
      const missingFields = [];
      if (!name || name.trim() === '') missingFields.push('name');
      if (!category || category.trim() === '') missingFields.push('category');
      if (price === undefined || price === null || price === '') missingFields.push('price');
      if (!images || !Array.isArray(images) || images.length === 0 || !images[0] || images[0].trim() === '') missingFields.push('images (at least one image URL required)');
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          message: 'Required fields are missing',
          details: `Missing: ${missingFields.join(', ')}`
        });
      }

    const newProduct = new Product({
      name,
      brand,
      category,
      price,
      images,
      description,
      specs,
      rating,
      inStock,
      stockQuantity,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update product (ADMIN ONLY)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, brand, category, price, images, description, specs, rating, inStock, stockQuantity } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, brand, category, price, images, description, specs, rating, inStock, stockQuantity },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete product (ADMIN ONLY)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Product deleted successfully',
      product 
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
});

export default router;
