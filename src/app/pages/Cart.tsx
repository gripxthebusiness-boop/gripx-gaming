import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import OrderSummary from '../components/OrderSummary';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '80px' }}>
        <h2>Your Cart is Empty</h2>
        <Link to="/products">
          <button style={{ marginTop: '20px' }}>
            Browse Products
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '40px', padding: '40px' }}>
      <div style={{ flex: 2 }}>
        <h2>Your Cart</h2>

        {cartItems.map(item => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '20px',
              borderBottom: '1px solid #ddd',
              paddingBottom: '10px',
            }}
          >
            <div>
              <h4>{item.name}</h4>
              <p>Qty: {item.quantity}</p>
              <p>₹{item.price}</p>
            </div>

            <button onClick={() => removeFromCart(item.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }}>
        <OrderSummary />
      </div>
    </div>
  );
};

export default Cart;
