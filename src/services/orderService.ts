/**
 * Order Service
 * Handles all order-related API calls to the backend
 * Uses environment variable NEXT_PUBLIC_API_URL or VITE_API_URL
 */

const API_URL: string =
  (import.meta as any).env?.NEXT_PUBLIC_API_URL ||
  (import.meta as any).env?.VITE_API_URL ||
  'https://api.gripx.store';



/**
 * Create a new order
 * @param {Object} orderData - Order information
 * @returns {Promise} - Response from server
 */
export const createOrder = async (orderData: any) => {
  try {
    // Validate data before sending
    if (!orderData.customer || !orderData.phone || !orderData.address) {
      throw new Error('Customer name, phone, and address are required');
    }

    const response = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Return error response with details
      throw new Error(data.message || 'Failed to create order');
    }

    return {
      success: true,
      data: data.order,
      notification: data.notification,
    };
  } catch (error: any) {
    console.error('Order API Error:', error);

    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get all orders (admin only)
 * @param {Object} params - Query parameters (status, limit, skip, sort)
 * @returns {Promise} - List of orders
 */
export const getOrders = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_URL}/api/orders${queryString ? '?' + queryString : ''}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch orders');
    }

    return {
      success: true,
      data: data.data,
      pagination: data.pagination,
    };
  } catch (error: any) {
    console.error('Fetch Orders Error:', error);

    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get a single order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise} - Order details
 */
export const getOrderById = async (orderId: string) => {
  try {
    const response = await fetch(`${API_URL}/api/orders/${orderId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch order');
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    console.error('Fetch Order Error:', error);

    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get order statistics (admin only)
 * @returns {Promise} - Order statistics
 */
export const getOrderStats = async () => {
  try {
    const response = await fetch(`${API_URL}/api/orders/stats`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch statistics');
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    console.error('Fetch Stats Error:', error);

    return {
      success: false,
      error: error.message,
    };
  }
};
