import React from 'react';
import { useCart } from '../context/CartContext';

const OrderSummary: React.FC = () => {
  const { cartItems } = useCart();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div
      style={{
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fafafa',
      }}
    >
      <h3>Order Summary</h3>

      <p>Subtotal: ₹{subtotal}</p>
      <p>Shipping: ₹0</p>

      <hr />

      <h4>Total: ₹{subtotal}</h4>

      <button
        style={{
          marginTop: '20px',
          width: '100%',
          padding: '10px',
          cursor: 'pointer',
        }}
      >
        Checkout
      </button>
    </div>
  );
};

export default OrderSummary;
