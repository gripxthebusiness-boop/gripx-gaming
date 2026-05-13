/**
 * Order System - Test Examples
 * Run with: node test-orders.js
 * Make sure backend is running on http://localhost:5000
 */

const API_URL = 'http://localhost:5000/api';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

/**
 * Test 1: Create a new order
 */
async function testCreateOrder() {
  console.log(`\n${colors.blue}📝 Test 1: Create Order${colors.reset}`);

  const orderData = {
    product: 'Gaming Mouse - RGB Edition',
    quantity: 2,
    price: 49.99,
    customer: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, Apartment 4B',
    city: 'New York',
    postalCode: '10001',
    notes: 'Please ring doorbell twice',
  };

  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log(`${colors.green}✅ Order created successfully!${colors.reset}`);
      console.log(`   Order ID: ${data.order.id}`);
      console.log(`   Order #: ${data.order.orderNumber}`);
      console.log(`   Total: $${data.order.totalPrice}`);
      console.log(`   Telegram: ${data.notification.success ? '✅ Sent' : '⚠️  Not sent'}`);
      return data.order.id; // Return order ID for next tests
    } else {
      console.log(`${colors.red}❌ Failed to create order${colors.reset}`);
      console.log(`   Error: ${data.message}`);
      return null;
    }
  } catch (error) {
    console.log(`${colors.red}❌ Request failed${colors.reset}`);
    console.log(`   Error: ${error.message}`);
    return null;
  }
}

/**
 * Test 2: Get all orders
 */
async function testGetOrders() {
  console.log(`\n${colors.blue}📦 Test 2: Get All Orders${colors.reset}`);

  try {
    const response = await fetch(`${API_URL}/orders`);
    const data = await response.json();

    if (response.ok && data.success) {
      console.log(`${colors.green}✅ Orders retrieved!${colors.reset}`);
      console.log(`   Total orders: ${data.pagination.total}`);
      console.log(`   Showing: ${data.data.length} of ${data.pagination.total}`);
      console.log(`   Pages: ${data.pagination.pages}`);

      if (data.data.length > 0) {
        console.log(`\n   Recent order:`);
        const order = data.data[0];
        console.log(`   - #${order.orderNumber}: ${order.product} (${order.quantity}x)`);
        console.log(`   - Customer: ${order.customer}`);
        console.log(`   - Status: ${order.status}`);
      }
    } else {
      console.log(`${colors.red}❌ Failed to fetch orders${colors.reset}`);
      console.log(`   Error: ${data.message}`);
    }
  } catch (error) {
    console.log(`${colors.red}❌ Request failed${colors.reset}`);
    console.log(`   Error: ${error.message}`);
  }
}

/**
 * Test 3: Get single order
 */
async function testGetOrder(orderId) {
  console.log(`\n${colors.blue}🔍 Test 3: Get Single Order${colors.reset}`);

  if (!orderId) {
    console.log(`${colors.yellow}⚠️  Skipped (no order ID from Test 1)${colors.reset}`);
    return;
  }

  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`);
    const data = await response.json();

    if (response.ok && data.success) {
      console.log(`${colors.green}✅ Order retrieved!${colors.reset}`);
      console.log(`   Order #: ${data.data.orderNumber}`);
      console.log(`   Product: ${data.data.product}`);
      console.log(`   Customer: ${data.data.customer}`);
      console.log(`   Phone: ${data.data.phone}`);
      console.log(`   Address: ${data.data.address}`);
      console.log(`   Total: $${data.data.quantity * data.data.price}`);
      console.log(`   Status: ${data.data.status}`);
    } else {
      console.log(`${colors.red}❌ Failed to fetch order${colors.reset}`);
      console.log(`   Error: ${data.message}`);
    }
  } catch (error) {
    console.log(`${colors.red}❌ Request failed${colors.reset}`);
    console.log(`   Error: ${error.message}`);
  }
}

/**
 * Test 4: Get order statistics
 */
async function testGetStats() {
  console.log(`\n${colors.blue}📊 Test 4: Get Order Statistics${colors.reset}`);

  try {
    const response = await fetch(`${API_URL}/orders/stats`);
    const data = await response.json();

    if (response.ok && data.success) {
      console.log(`${colors.green}✅ Statistics retrieved!${colors.reset}`);
      console.log(`   Total orders: ${data.data.total}`);
      console.log(`   - Pending: ${data.data.pending}`);
      console.log(`   - Confirmed: ${data.data.confirmed}`);
      console.log(`   - Processing: ${data.data.processed}`);
      console.log(`   - Shipped: ${data.data.shipped}`);
      console.log(`   - Delivered: ${data.data.delivered}`);
    } else {
      console.log(`${colors.red}❌ Failed to fetch statistics${colors.reset}`);
      console.log(`   Error: ${data.message}`);
    }
  } catch (error) {
    console.log(`${colors.red}❌ Request failed${colors.reset}`);
    console.log(`   Error: ${error.message}`);
  }
}

/**
 * Test 5: Update order status
 */
async function testUpdateOrder(orderId) {
  console.log(`\n${colors.blue}🔄 Test 5: Update Order Status${colors.reset}`);

  if (!orderId) {
    console.log(`${colors.yellow}⚠️  Skipped (no order ID from Test 1)${colors.reset}`);
    return;
  }

  const updateData = {
    status: 'confirmed',
    notes: 'Order has been confirmed and is being prepared',
  };

  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log(`${colors.green}✅ Order updated!${colors.reset}`);
      console.log(`   Order #: ${data.data.orderNumber}`);
      console.log(`   New status: ${data.data.status}`);
      console.log(`   Notes: ${data.data.notes}`);
    } else {
      console.log(`${colors.red}❌ Failed to update order${colors.reset}`);
      console.log(`   Error: ${data.message}`);
    }
  } catch (error) {
    console.log(`${colors.red}❌ Request failed${colors.reset}`);
    console.log(`   Error: ${error.message}`);
  }
}

/**
 * Test 6: Test validation errors
 */
async function testValidationErrors() {
  console.log(`\n${colors.blue}⚠️  Test 6: Test Validation Errors${colors.reset}`);

  const invalidOrders = [
    {
      name: 'Missing customer name',
      data: {
        product: 'Mouse',
        quantity: 1,
        price: 29.99,
        phone: '1234567890',
        address: '123 St',
      },
    },
    {
      name: 'Invalid phone number',
      data: {
        product: 'Mouse',
        quantity: 1,
        price: 29.99,
        customer: 'John',
        phone: '123', // Too short
        address: '123 St',
      },
    },
    {
      name: 'Missing address',
      data: {
        product: 'Mouse',
        quantity: 1,
        price: 29.99,
        customer: 'John',
        phone: '1234567890',
      },
    },
  ];

  for (const test of invalidOrders) {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(test.data),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(`   ${colors.green}✅ ${test.name}${colors.reset}`);
        console.log(`      Error: ${data.message}`);
      } else {
        console.log(`   ${colors.red}❌ ${test.name} - Should have failed!${colors.reset}`);
      }
    } catch (error) {
      console.log(`   ${colors.red}❌ ${test.name} - Request error${colors.reset}`);
    }
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log(`
${colors.blue}
╔════════════════════════════════════════════════════════════════╗
║  🧪 Order System API Tests                                     ║
║  Make sure backend is running: npm run dev                     ║
╚════════════════════════════════════════════════════════════════╝
${colors.reset}`);

  const orderId = await testCreateOrder();
  await testGetOrders();
  await testGetOrder(orderId);
  await testGetStats();
  await testUpdateOrder(orderId);
  await testValidationErrors();

  console.log(`
${colors.blue}
╔════════════════════════════════════════════════════════════════╗
║  ✅ All tests completed!                                       ║
╚════════════════════════════════════════════════════════════════╝
${colors.reset}`);
}

// Run tests
runAllTests().catch(console.error);
