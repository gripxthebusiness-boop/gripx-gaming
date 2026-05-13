import {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  getOrderStats,
} from '../controllers/orderController.js';

import express from 'express';

const router = express.Router();

/**
 * Thin wrapper to match required filename:
 * routes/orderRoutes.js
 */
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/stats', getOrderStats);
router.get('/:id', getOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router;

