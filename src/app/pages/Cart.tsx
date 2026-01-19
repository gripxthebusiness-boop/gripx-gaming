import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, Delete, ArrowLeft, Star, 
  CheckCircle, Heart, RefreshCcw, Trash2,
  Minus, Plus, ShoppingBag
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Mock cart data (in production, this would come from context/API)
const mockCartItems = [
  {
    id: '1',
    name: 'GripX Pro Gaming Mouse - RGB Wireless High Precision Sensor',
    price: 2499,
    originalPrice: 3499,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&q=80',
    inStock: true,
    rating: 4.5,
    reviews: 2341,
    color: 'Black',
    size: 'Medium'
  },
  {
    id: '2',
    name: 'GripX Mechanical Gaming Keyboard - Cherry MX Blue Switches RGB Backlit',
    price: 4599,
    originalPrice: 5999,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=300&q=80',
    inStock: true,
    rating: 4.3,
    reviews: 1876,
    color: 'White',
    size: 'Full Size'
  },
  {
    id: '3',
    name: 'GripX 7.1 Surround Sound Gaming Headset - Noise Cancelling Microphone',
    price: 3299,
    originalPrice: 4299,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80',
    inStock: true,
    rating: 4.6,
    reviews: 3421,
    color: 'Black/Red',
    size: 'One Size'
  }
];

export function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [subtotal, setSubtotal] = useState(0);
  const [savings, setSavings] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Calculate totals
  useEffect(() => {
    const newSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newSavings = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
    setSubtotal(newSubtotal);
    setSavings(newSavings);
  }, [cartItems]);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleDeleteClick = (itemId: string) => {
    setItemToDelete(itemId);
    setShowDeleteModal(true);
  };

  const freeDeliveryThreshold = 5000;
  const amountForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const deliveryDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-900/80 to-blue-900/80 backdrop-blur-sm border-b border-cyan-500/30 py-4 px-4">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between">
          <Link to="/" className="text-3xl font-bold">
            <span className="text-white">Grip</span>
            <span className="text-cyan-400">X</span>
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/products" className="text-gray-300 hover:text-cyan-400 transition-colors">
              Shop All
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-cyan-400 transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">
            Shopping Cart
            <span className="text-lg font-normal text-cyan-400 ml-3">
              ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})
            </span>
          </h1>
          <Link 
            to="/products" 
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </Link>
        </div>

        <div className="flex gap-8">
          {/* Left Column - Cart Items */}
          <div className="flex-1">
            {/* Cart Items Card */}
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-cyan-500/20 rounded-xl overflow-hidden">
              {cartItems.length > 0 ? (
                <>
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex gap-8 p-8 ${index !== cartItems.length - 1 ? 'border-b border-cyan-500/20' : ''}`}
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-[200px] h-[200px] object-contain rounded-lg bg-gradient-to-br from-gray-800 to-gray-900"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <Link 
                          to={`/products/${item.id}`}
                          className="text-white text-xl hover:text-cyan-400 transition-colors block mb-3"
                        >
                          {item.name}
                        </Link>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={16}
                                className={star <= Math.floor(item.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}
                              />
                            ))}
                          </div>
                          <span className="text-cyan-400 text-sm hover:underline cursor-pointer">
                            {item.reviews.toLocaleString()} reviews
                          </span>
                        </div>

                        {/* Color/Size */}
                        <p className="text-gray-400 text-sm mb-3">
                          Color: <span className="text-white">{item.color}</span> | Size: <span className="text-white">{item.size}</span>
                        </p>

                        {/* Stock Status */}
                        <div className="flex items-center gap-2 mb-4">
                          {item.inStock ? (
                            <>
                              <CheckCircle size={16} className="text-green-400" />
                              <span className="text-green-400 text-sm font-medium">In Stock</span>
                            </>
                          ) : (
                            <>
                              <span className="text-gray-400 text-sm">Currently unavailable</span>
                            </>
                          )}
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3 mb-4">
                          <span className="text-2xl font-bold text-cyan-400">
                            ₹{item.price.toLocaleString()}
                          </span>
                          <span className="text-lg text-gray-500 line-through">
                            ₹{item.originalPrice.toLocaleString()}
                          </span>
                          <span className="text-sm text-green-400">
                            Save {Math.round((1 - item.price / item.originalPrice) * 100)}%
                          </span>
                        </div>

                        {/* Free Delivery */}
                        <div className="flex items-center gap-2 mb-5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                            <span className="text-xs font-bold">prime</span>
                          </div>
                          <span className="text-sm text-gray-300">
                            FREE Delivery by <span className="text-cyan-400">{deliveryDate}</span>
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                          {/* Quantity Selector */}
                          <div className="flex items-center gap-3 bg-gray-800/50 rounded-lg px-3 py-2">
                            <span className="text-sm text-gray-400">Qty:</span>
                            <select
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                              className="bg-transparent text-white text-sm focus:outline-none cursor-pointer"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                <option key={num} value={num} className="bg-gray-800">{num}</option>
                              ))}
                            </select>
                          </div>

                          <span className="text-gray-600">|</span>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteClick(item.id)}
                            className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 transition-colors"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>

                          <span className="text-gray-600">|</span>

                          {/* Save for Later */}
                          <button className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1 transition-colors">
                            <Heart size={14} />
                            Save for later
                          </button>

                          <span className="text-gray-600">|</span>

                          {/* Compare */}
                          <button className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1 transition-colors">
                            <RefreshCcw size={14} />
                            Compare
                          </button>
                        </div>
                      </div>

                      {/* Right side - Item Subtotal */}
                      <div className="hidden xl:block text-right">
                        <p className="text-gray-400 text-sm mb-1">Item subtotal</p>
                        <div className="text-2xl font-bold text-cyan-400">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </>
              ) : (
                /* Empty Cart State */
                <div className="p-16 text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingCart size={48} className="text-cyan-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-3">Your Cart is Empty</h2>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
                  </p>
                  <Link
                    to="/products"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all group"
                  >
                    <ShoppingBag className="mr-2" size={20} />
                    Browse Products
                  </Link>
                </div>
              )}
            </div>

            {/* Saved for Later Section */}
            <div className="mt-8 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Heart className="text-cyan-400" size={24} />
                Saved for Later (0)
              </h2>
              <p className="text-gray-400 text-sm">
                No items saved for later. Save items while you shop to buy them later.
              </p>
            </div>

            {/* Recently Viewed */}
            <div className="mt-8 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Recently Viewed
              </h2>
              <p className="text-gray-400 text-sm">
                Your recently viewed items will appear here.
              </p>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="w-[400px] flex-shrink-0">
            {/* Order Summary Card */}
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-cyan-500/20 rounded-xl sticky top-8">
              <div className="p-6 border-b border-cyan-500/20">
                <h2 className="text-2xl font-bold text-white">Order Summary</h2>
              </div>

              <div className="p-6 space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between text-base">
                  <span className="text-gray-400">
                    Subtotal ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''}):
                  </span>
                  <span className="text-white font-bold">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>

                {/* Savings */}
                {savings > 0 && (
                  <div className="flex justify-between text-base">
                    <span className="text-green-400">You Save:</span>
                    <span className="text-green-400 font-bold">
                      ₹{savings.toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Free Delivery Progress */}
                <div className="pt-2">
                  {amountForFreeDelivery > 0 ? (
                    <>
                      <p className="text-cyan-400 text-sm mb-3">
                        Add ₹{amountForFreeDelivery.toLocaleString()} more for FREE Delivery
                      </p>
                      <div className="w-full bg-gray-800 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all"
                          style={{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-green-400 flex items-center gap-2 text-sm">
                      <CheckCircle size={16} />
                      Your order is eligible for FREE Delivery
                    </p>
                  )}
                </div>

                {/* Promo Code */}
                <div className="border-t border-cyan-500/20 pt-4">
                  <label className="text-white text-sm block mb-2">
                    Have a promo code?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    <button className="px-4 py-2 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-cyan-500/20 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-white">Order Total:</span>
                    <span className="text-2xl font-bold text-cyan-400">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Proceed to Checkout Button */}
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25"
                >
                  Proceed to Checkout
                </button>

                {/* Secure Transaction */}
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckCircle size={16} className="text-green-400" />
                  <span>Secure transaction</span>
                </div>

                {/* Terms */}
                <p className="text-xs text-gray-500">
                  By placing this order, you agree to GripX's{' '}
                  <a href="#" className="text-cyan-400 hover:underline">Terms</a> and{' '}
                  <a href="#" className="text-cyan-400 hover:underline">Privacy Policy</a>.
                </p>
              </div>
            </div>

            {/* Delivery Address Card */}
            <div className="mt-6 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6">
              <h3 className="font-bold text-white mb-2">Delivery to:</h3>
              <p className="text-gray-400 text-sm mb-3">
                Add a delivery address to see delivery options
              </p>
              <button className="text-cyan-400 hover:text-cyan-300 text-sm hover:underline transition-colors">
                + Add delivery address
              </button>
            </div>

            {/* Payment Methods */}
            <div className="mt-6 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6">
              <h3 className="font-bold text-white mb-3">Payment Methods</h3>
              <div className="flex gap-3 flex-wrap">
                <div className="w-12 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-white">VISA</span>
                </div>
                <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-white">MC</span>
                </div>
                <div className="w-12 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-white">UPI</span>
                </div>
                <div className="w-12 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-white">NB</span>
                </div>
                <div className="flex items-center text-sm text-cyan-400">
                  +more
                </div>
              </div>
            </div>

            {/* Need Help */}
            <div className="mt-6 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6">
              <h3 className="font-bold text-white mb-3">Need Help?</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-cyan-400 hover:text-cyan-300 text-sm hover:underline transition-colors">
                    Track Your Order
                  </a>
                </li>
                <li>
                  <a href="#" className="text-cyan-400 hover:text-cyan-300 text-sm hover:underline transition-colors">
                    Delete Items
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-cyan-400 hover:text-cyan-300 text-sm hover:underline transition-colors">
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Recommendations */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-white mb-5">
                Recommended for You
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-cyan-500/20 rounded-xl p-4 hover:border-cyan-500/40 transition-all cursor-pointer group"
                  >
                    <img
                      src={`https://images.unsplash.com/photo-1595225476474-87563907a212?w=150&q=80`}
                      alt="Product"
                      className="w-full h-24 object-contain mb-3 rounded-lg bg-gray-800/50"
                    />
                    <p className="text-sm text-gray-300 group-hover:text-white line-clamp-2 transition-colors">
                      Gaming Mouse Pad XXL Large
                    </p>
                    <p className="text-lg font-bold text-cyan-400 mt-2">₹599</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-cyan-500/30 rounded-xl p-8 max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} className="text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white text-center mb-3">Delete Item?</h3>
              <p className="text-gray-400 text-center mb-8">
                Are you sure you want to remove this item from your cart?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 border border-cyan-500/30 rounded-lg text-white hover:bg-cyan-500/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => itemToDelete && removeItem(itemToDelete)}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

