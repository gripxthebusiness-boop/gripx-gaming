import express from 'express';
import { Product } from '../models/Product.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all products (PUBLIC - no auth needed)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single product (PUBLIC - no auth needed)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create product (ADMIN ONLY)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, brand, category, price, images, description, specs, rating, inStock } = req.body;

    if (!name || !category || !price || !images || !images[0] || !specs) {
      return res.status(400).json({ message: 'Required fields are missing' });
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
    const { name, brand, category, price, images, description, specs, rating, inStock } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, brand, category, price, images, description, specs, rating, inStock },
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
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
