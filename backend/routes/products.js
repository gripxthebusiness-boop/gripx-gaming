import express from 'express';
import { Product } from '../models/Product.js';
import { verifyToken, verifyEditorOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single product
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

// Create product (editor/admin only)
router.post('/', verifyToken, verifyEditorOrAdmin, async (req, res) => {
  try {
    const { name, category, price, rating, image, specs, description } = req.body;

    if (!name || !category || !price || !image || !specs) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const newProduct = new Product({
      name,
      category,
      price,
      rating,
      image,
      specs,
      description,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update product (editor/admin only)
router.put('/:id', verifyToken, verifyEditorOrAdmin, async (req, res) => {
  try {
    const { name, category, price, rating, image, specs, description } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, price, rating, image, specs, description },
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

// Delete product (editor/admin only)
router.delete('/:id', verifyToken, verifyEditorOrAdmin, async (req, res) => {
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
