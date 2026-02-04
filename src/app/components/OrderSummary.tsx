import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

const OrderSummary: React.FC = () => {
  const { cartItems } = useCart();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = 0; // Free shipping
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + shipping + tax;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-100 to-white border border-red-600/20 rounded-xl p-6 sticky top-24"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>

      {/* Cart Items Preview */}
      <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                )}
              </div>
              <span className="text-gray-700 truncate max-w-[120px]">{item.name}</span>
            </div>
            <div className="text-right">
              <span className="text-gray-600">x{item.quantity}</span>
              <span className="text-gray-900 ml-2">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          </div>
        ))}
      </div>

      <hr className="border-gray-700 my-4" />

      {/* Price Details */}
      <div className="space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Shipping
          </span>
          <span className="text-green-400">FREE</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax (18% GST)</span>
          <span className="text-gray-900">₹{tax.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <hr className="border-gray-700 my-4" />

      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-bold text-gray-900">Total</span>
        <span className="text-2xl font-bold text-red-500">₹{total.toLocaleString('en-IN')}</span>
      </div>

      {/* Checkout Button */}
      <button
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-gray-900 rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-semibold"
      >
        <CreditCard className="w-5 h-5" />
        Proceed to Checkout
      </button>

      {/* Security Badge */}
      <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 text-sm">
        <ShieldCheck className="w-4 h-4 text-green-400" />
        <span>Secure Checkout</span>
      </div>

      {/* Payment Methods */}
      <div className="mt-4 flex items-center justify-center gap-2 opacity-50">
        <span className="text-xs text-gray-500">We accept:</span>
        <div className="flex gap-1">
          <div className="w-8 h-5 bg-gray-700 rounded flex items-center justify-center text-[8px] text-gray-900">VISA</div>
          <div className="w-8 h-5 bg-gray-700 rounded flex items-center justify-center text-[8px] text-gray-900">MC</div>
          <div className="w-8 h-5 bg-gray-700 rounded flex items-center justify-center text-[8px] text-gray-900">UPI</div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
