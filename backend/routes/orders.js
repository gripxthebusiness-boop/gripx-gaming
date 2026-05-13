import express from 'express';
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  getOrderStats,
} from '../controllers/orderController.js';

const router = express.Router();

/**
 * Order Routes
 * All routes are production-ready and follow RESTful conventions
 */

// Public routes
/**
 * POST /api/orders
 * Create a new order
 * Body: {
 *   product: string (required),
 *   quantity: number (required),
 *   price: number (required),
 *   customer: string (required),
 *   email: string (optional),
 *   phone: string (required),
 *   address: string (required),
 *   city: string (optional),
 *   postalCode: string (optional),
 *   notes: string (optional)
 * }
 */
router.post('/', createOrder);

// Admin routes (in production, add authentication middleware here)
/**
 * GET /api/orders
 * Get all orders with filtering and pagination
 * Query params:
 *   - status: pending, confirmed, processing, shipped, delivered, cancelled
 *   - limit: number of results (default: 50)
 *   - skip: number of results to skip (default: 0)
 *   - sort: sort field (default: -createdAt)
 */
router.get('/', getOrders);

/**
 * GET /api/orders/stats
 * Get order statistics
 */
router.get('/stats', getOrderStats);

/**
 * GET /api/orders/:id
 * Get a specific order by ID
 */
router.get('/:id', getOrder);

/**
 * PUT /api/orders/:id
 * Update order status or notes
 * Body: {
 *   status: string (optional),
 *   notes: string (optional)
 * }
 */
router.put('/:id', updateOrder);

/**
 * DELETE /api/orders/:id
 * Delete an order (admin only)
 */
router.delete('/:id', deleteOrder);

export default router;
