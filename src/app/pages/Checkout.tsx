import React from 'react';
import { useCart } from '../context/CartContext';
import OrderForm from '../components/OrderForm';

const Checkout: React.FC = () => {
  const { cartItems } = useCart();

  // Current backend order model is 1 product per order.
  // For a working checkout, we create one order per cart item.
  // We pass the first item to OrderForm and show a simple guard.
  const first = cartItems[0];

  if (!first) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gradient-to-b from-white via-red-50 to-white">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-800">Your cart is empty.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-red-50 to-white pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <OrderForm
          productName={first.name}
          productPrice={first.price}
          productId={first.id}
          quantity={first.quantity}
        />
      </div>
    </div>
  );
};

export default Checkout;

