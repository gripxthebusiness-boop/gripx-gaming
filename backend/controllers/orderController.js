import Order from '../models/Order.js';
import axios from 'axios';

/**
 * Order Controller
 * Handles all order-related operations
 */

/**
 * Send Telegram notification
 * @param {Object} orderData - Order information to send
 * @returns {Promise} - Result of Telegram API call
 */
const sendTelegramNotification = async (orderData) => {
  try {
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      console.warn('⚠️  Telegram bot configuration missing. Skipping notification.');
      return { success: false, message: 'Telegram config not set' };
    }

    // Format Telegram message
    const message = `
🚨 <b>NEW ORDER</b>

🛒 <b>Product:</b> ${orderData.product}
📦 <b>Quantity:</b> ${orderData.quantity}

👤 <b>Customer:</b> ${orderData.customer}
📞 <b>Phone:</b> ${orderData.phone}
✉️  <b>Email:</b> ${orderData.email || 'Not provided'}

📍 <b>Address:</b>
${orderData.address}
${orderData.city ? `<b>City:</b> ${orderData.city}` : ''}
${orderData.postalCode ? `<b>Postal Code:</b> ${orderData.postalCode}` : ''}

💰 <b>Total Price:</b> $${(orderData.quantity * orderData.price).toFixed(2)}
⏰ <b>Time:</b> ${new Date().toLocaleString()}
`;

    // Send to Telegram
    const response = await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      },
      {
        timeout: 10000, // 10 second timeout
      }
    );

    console.log('✅ Telegram notification sent successfully');
    return { success: true, messageId: response.data.result.message_id };
  } catch (error) {
    console.error('❌ Error sending Telegram notification:', error.message);
    // Don't throw - we still want order to be created even if Telegram fails
    return { success: false, error: error.message };
  }
};

/**
 * Create a new order
 * POST /api/orders
 */
export const createOrder = async (req, res) => {
  try {
    const { product, quantity, price, customer, email, phone, address, city, postalCode, notes } =
      req.body;

    // ===== VALIDATION =====
    if (!customer || customer.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Customer name is required',
        field: 'customer',
      });
    }

    if (!phone || phone.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required',
        field: 'phone',
      });
    }

    if (!address || address.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Address is required',
        field: 'address',
      });
    }

    if (!product || product.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Product name is required',
        field: 'product',
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required',
        field: 'quantity',
      });
    }

    if (!price || price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid price is required',
        field: 'price',
      });
    }

    // Validate phone format (basic check)
    const phoneRegex = /^[\d\s\-\+\(\)]{10,15}$/;
    if (!phoneRegex.test(phone.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format',
        field: 'phone',
      });
    }

    // Validate email if provided
    if (email) {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format',
          field: 'email',
        });
      }
    }

    // ===== CREATE ORDER =====
    const newOrder = new Order({
      product: product.trim(),
      quantity: parseInt(quantity),
      price: parseFloat(price),
      customer: customer.trim(),
      email: email ? email.trim() : '',
      phone: phone.trim(),
      address: address.trim(),
      city: city ? city.trim() : '',
      postalCode: postalCode ? postalCode.trim() : '',
      notes: notes ? notes.trim() : '',
      ipAddress: req.ip || req.connection.remoteAddress || '',
      userAgent: req.get('user-agent') || '',
      status: 'pending',
    });

    // Ensure totalPrice is set so Mongoose schema validation passes.
    // (Schema currently has totalPrice as required; we'll compute it here.)
    newOrder.totalPrice = parseInt(quantity) * parseFloat(price);

    // Save order to database
    const savedOrder = await newOrder.save();


    // ===== SEND TELEGRAM NOTIFICATION =====
    const telegramResult = await sendTelegramNotification({
      product: savedOrder.product,
      quantity: savedOrder.quantity,
      price: savedOrder.price,
      customer: savedOrder.customer,
      email: savedOrder.email,
      phone: savedOrder.phone,
      address: savedOrder.address,
      city: savedOrder.city,
      postalCode: savedOrder.postalCode,
    });

    // ===== RESPONSE =====
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        id: savedOrder._id,
        orderNumber: savedOrder.orderNumber,
        product: savedOrder.product,
        quantity: savedOrder.quantity,
        totalPrice: savedOrder.quantity * savedOrder.price,
        customer: savedOrder.customer,
        phone: savedOrder.phone,
        address: savedOrder.address,
        status: savedOrder.status,
        createdAt: savedOrder.createdAt,
      },
      notification: telegramResult,
    });
  } catch (error) {
    console.error('Error creating order:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate order data',
        field: Object.keys(error.keyPattern)[0],
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Get all orders (admin only)
 * GET /api/orders
 */
export const getOrders = async (req, res) => {
  try {
    const { status, limit = 50, skip = 0, sort = '-createdAt' } = req.query;

    // Build filter
    const filter = {};
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .lean();

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
    });
  }
};

/**
 * Get single order
 * GET /api/orders/:id
 */
export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
    });
  }
};

/**
 * Update order status (admin only)
 * PUT /api/orders/:id
 */
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const order = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: order,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order',
    });
  }
};

/**
 * Delete order (admin only)
 * DELETE /api/orders/:id
 */
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
    });
  }
};

/**
 * Get order statistics
 * GET /api/orders/stats
 */
export const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.getOrderStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order statistics',
    });
  }
};
