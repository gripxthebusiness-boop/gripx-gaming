import { motion } from 'motion/react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Cart() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              Shopping Cart
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Your cart is empty
          </p>
        </motion.div>

        {/* Empty Cart Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingCart className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Browse our premium gaming gear and add items to your cart. When you're ready to purchase, call one of our sales lines to complete your order.
          </p>
          
          <Link
            to="/products"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all group"
          >
            Continue Shopping
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-16 p-8 bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 rounded-xl"
        >
          <h3 className="text-2xl font-bold text-white mb-4">How to Order</h3>
          <ol className="space-y-4 text-gray-400">
            <li className="flex items-start">
              <span className="flex items-center justify-center w-8 h-8 bg-cyan-500 text-white rounded-full mr-4 flex-shrink-0">1</span>
              <span>Browse our <Link to="/products" className="text-cyan-400 hover:text-cyan-300">premium gaming gear</Link></span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-8 h-8 bg-cyan-500 text-white rounded-full mr-4 flex-shrink-0">2</span>
              <span>Click "Buy Now" on the product you want</span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-8 h-8 bg-cyan-500 text-white rounded-full mr-4 flex-shrink-0">3</span>
              <span>Call our sales team to place your order</span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-8 h-8 bg-cyan-500 text-white rounded-full mr-4 flex-shrink-0">4</span>
              <span>We'll process your order and arrange delivery</span>
            </li>
          </ol>
          
          <div className="mt-8 pt-8 border-t border-cyan-500/20">
            <p className="text-gray-300 mb-4">Ready to order? Call us now:</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="tel:+919063032312"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all text-center font-semibold"
              >
                +91 9063032312
              </a>
              <a
                href="tel:+919923869222"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all text-center font-semibold"
              >
                +91 9923869222
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
