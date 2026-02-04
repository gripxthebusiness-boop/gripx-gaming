import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import OrderSummary from '../components/OrderSummary';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-900 to-white pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-800 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-gray-900 rounded-lg hover:from-red-700 hover:to-red-800 transition-all group"
            >
              Browse Products
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-900 to-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-800">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <div className="bg-gradient-to-br from-white to-white border border-red-600/20 rounded-xl overflow-hidden">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center gap-4 p-4 border-b border-red-200 last:border-b-0 hover:bg-red-50/30 transition-colors"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-red-50 flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-gray-800" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h4>
                    <p className="text-red-500 font-bold">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-red-50 text-gray-900 hover:bg-gray-700 transition-colors flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-gray-900 font-medium w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-red-50 text-gray-900 hover:bg-gray-700 transition-colors flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <Link
              to="/products"
              className="inline-flex items-center mt-6 text-red-500 hover:text-red-400 transition-colors"
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Continue Shopping
            </Link>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-96"
          >
            <OrderSummary />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
