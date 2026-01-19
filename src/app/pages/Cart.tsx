import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, Delete, ArrowLeft, Star, 
  CheckCircle, Package, Truck, Shield, 
  Heart, RefreshCcw
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
  const [selectedItems, setSelectedItems] = useState(new Set(cartItems.map(item => item.id)));
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Calculate totals
  useEffect(() => {
    const newSubtotal = cartItems.reduce((sum, item) => {
      if (selectedItems.has(item.id)) {
        return sum + (item.price * item.quantity);
      }
      return sum;
    }, 0);
    
    const newSavings = cartItems.reduce((sum, item) => {
      if (selectedItems.has(item.id)) {
        return sum + ((item.originalPrice - item.price) * item.quantity);
      }
      return sum;
    }, 0);

    setSubtotal(newSubtotal);
    setSavings(newSavings);
  }, [cartItems, selectedItems]);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleDeleteClick = (itemId) => {
    setItemToDelete(itemId);
    setShowDeleteModal(true);
  };

  const freeDeliveryThreshold = 5000;
  const amountForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <div className="min-h-screen bg-[#EAEDED]">
      {/* Header Banner */}
      <div className="bg-[#232F3E] text-white py-3 px-4">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-2xl font-bold">
              <span className="text-white">Grip</span>
              <span className="text-[#FF9900]">X</span>
            </Link>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/products" className="hover:underline">Shop all deals</Link>
            <Link to="/contact" className="hover:underline">Help</Link>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-[#EAEDED] py-2 px-4 border-b border-[#DDD]">
        <div className="max-w-[1500px] mx-auto text-xs text-[#555]">
          <Link to="/" className="hover:underline text-[#007600]">Home</Link>
          <span className="mx-2">›</span>
          <Link to="/products" className="hover:underline text-[#007600]">Gaming Accessories</Link>
          <span className="mx-2">›</span>
          <span className="text-[#111]">Shopping Cart</span>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#111]">
            Shopping Cart
            <span className="text-lg font-normal text-[#555] ml-3">
              ({selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''})
            </span>
          </h1>
          <Link 
            to="/products" 
            className="flex items-center gap-2 text-[#007600] hover:underline text-sm"
          >
            <ArrowLeft size={16} />
            Continue shopping
          </Link>
        </div>

        <div className="flex gap-6">
          {/* Left Column - Cart Items */}
          <div className="flex-1">
            {/* Cart Items Card */}
            <div className="bg-white rounded-lg border border-[#DDD] shadow-sm overflow-hidden">
              {cartItems.length > 0 ? (
                <>
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex gap-6 p-6 ${index !== cartItems.length - 1 ? 'border-b border-[#EAEDED]' : ''}`}
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-[180px] h-[180px] object-contain"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <Link 
                          to={`/products/${item.id}`}
                          className="text-[#0F1111] hover:text-[#007600] hover:underline text-lg leading-tight mb-2 block"
                        >
                          {item.name}
                        </Link>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={star <= Math.floor(item.rating) ? 'text-[#FFA41C] fill-current' : 'text-[#999]'}
                            />
                          ))}
                          <span className="text-[#007600] text-sm ml-1 hover:underline cursor-pointer">
                            {item.reviews.toLocaleString()} ratings
                          </span>
                        </div>

                        {/* Color/Size */}
                        <p className="text-sm text-[#555] mb-2">
                          Color: {item.color} | Size: {item.size}
                        </p>

                        {/* Stock Status */}
                        <div className="flex items-center gap-1 mb-3">
                          {item.inStock ? (
                            <>
                              <CheckCircle size={14} className="text-[#007600]" />
                              <span className="text-[#007600] text-sm font-medium">In Stock</span>
                            </>
                          ) : (
                            <>
                              <span className="text-[#555] text-sm">Currently unavailable</span>
                            </>
                          )}
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-xl font-bold text-[#B12704]">
                            ₹{item.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-[#555] line-through">
                            ₹{item.originalPrice.toLocaleString()}
                          </span>
                          <span className="text-sm text-[#B12704]">
                            ({Math.round((1 - item.price / item.originalPrice) * 100)}% off)
                          </span>
                        </div>

                        {/* Prime Badge */}
                        <div className="flex items-center gap-1 mb-4">
                          <span className="text-xs font-bold text-[#00A8E1] bg-[#FFF] border border-[#00A8E1] px-1 rounded">
                            prime
                          </span>
                          <span className="text-xs text-[#555]">
                            FREE Delivery by {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                          {/* Quantity Selector */}
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-[#555]">Qty:</span>
                            <select
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                              className="border border-[#D5D9D9] rounded py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900]"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                <option key={num} value={num}>{num}</option>
                              ))}
                            </select>
                          </div>

                          <span className="text-[#555]">|</span>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteClick(item.id)}
                            className="text-[#007600] hover:underline text-sm"
                          >
                            Delete
                          </button>

                          <span className="text-[#555]">|</span>

                          {/* Save for Later */}
                          <button className="text-[#007600] hover:underline text-sm flex items-center gap-1">
                            <Heart size={14} />
                            Save for later
                          </button>

                          <span className="text-[#555]">|</span>

                          {/* Compare */}
                          <button className="text-[#007600] hover:underline text-sm flex items-center gap-1">
                            <RefreshCcw size={14} />
                            Compare similar items
                          </button>
                        </div>
                      </div>

                      {/* Right side - Item Subtotal */}
                      <div className="hidden xl:block text-right">
                        <div className="text-xl font-bold text-[#B12704]">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </>
              ) : (
                /* Empty Cart State */
                <div className="p-12 text-center">
                  <ShoppingCart size={64} className="mx-auto text-[#DDD] mb-4" />
                  <h2 className="text-2xl font-bold text-[#111] mb-2">Your GripX Cart is empty</h2>
                  <p className="text-[#555] mb-6">
                    Shop today's deals
                  </p>
                  <Link
                    to="/products"
                    className="inline-block px-8 py-3 bg-[#FFD814] hover:bg-[#F7CA00] text-[#111] rounded-full font-medium text-sm transition-colors"
                  >
                    Shop deals
                  </Link>
                </div>
              )}
            </div>

            {/* Saved for Later Section */}
            <div className="mt-6 bg-white rounded-lg border border-[#DDD] shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#111] mb-4">
                Items saved for later ({0})
              </h2>
              <p className="text-[#555] text-sm">
                No items saved for later. Save items while you shop to buy them later.
              </p>
            </div>

            {/* Buy It Again Section */}
            <div className="mt-6 bg-white rounded-lg border border-[#DDD] shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#111] mb-4">
                Buy it again
              </h2>
              <p className="text-[#555] text-sm">
                No recently purchased items. Your recently viewed items will appear here.
              </p>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="w-[380px] flex-shrink-0">
            {/* Order Summary Card */}
            <div className="bg-white rounded-lg border border-[#DDD] shadow-sm sticky top-6">
              <div className="p-5 border-b border-[#EAEDED]">
                <h2 className="text-xl font-bold text-[#111]">Order Summary</h2>
              </div>

              <div className="p-5">
                {/* Subtotal */}
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-[#555]">
                    Subtotal ({selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''}):
                  </span>
                  <span className="text-[#111] font-bold">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>

                {/* Savings */}
                {savings > 0 && (
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-[#007600]">You save:</span>
                    <span className="text-[#007600] font-bold">
                      ₹{savings.toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Free Delivery */}
                <div className="mb-4">
                  {amountForFreeDelivery > 0 ? (
                    <>
                      <p className="text-sm text-[#007600] mb-2">
                        Add ₹{amountForFreeDelivery.toLocaleString()} of eligible items to your order for FREE Delivery
                      </p>
                      <div className="w-full bg-[#EAEDED] rounded-full h-2 mb-1">
                        <div 
                          className="bg-[#FF9900] h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-[#007600] flex items-center gap-1">
                      <CheckCircle size={14} />
                      Your order is eligible for FREE Delivery
                    </p>
                  )}
                </div>

                {/* Promo Code */}
                <div className="border-t border-[#EAEDED] pt-4 mb-4">
                  <label className="text-sm text-[#111] block mb-2">
                    Add a promotional code or gift card
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 border border-[#D5D9D9] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                    />
                    <button className="px-4 py-2 border border-[#D5D9D9] rounded text-sm text-[#111] hover:bg-[#F7F8F8] transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-[#EAEDED] pt-4 mb-5">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-[#111]">Order Total:</span>
                    <span className="text-xl font-bold text-[#B12704]">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Proceed to Checkout Button */}
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-3 bg-[#FFD814] hover:bg-[#F7CA00] text-[#111] rounded-full font-medium text-sm transition-colors mb-4"
                >
                  Proceed to checkout
                </button>

                {/* Secure Transaction */}
                <div className="flex items-center gap-2 text-xs text-[#555] mb-4">
                  <Shield size={14} className="text-[#007600]" />
                  <span>Secure transaction</span>
                </div>

                {/* Terms */}
                <p className="text-xs text-[#555]">
                  By placing this order, you agree to GripX's{' '}
                  <a href="#" className="text-[#007600] hover:underline">Conditions of Use</a> and{' '}
                  <a href="#" className="text-[#007600] hover:underline">Privacy Notice</a>.
                </p>
              </div>
            </div>

            {/* Delivery Address Card */}
            <div className="mt-6 bg-white rounded-lg border border-[#DDD] shadow-sm p-5">
              <h3 className="font-bold text-[#111] mb-2">Delivery to:</h3>
              <p className="text-sm text-[#555]">
                Your default address
              </p>
              <button className="text-[#007600] text-sm hover:underline mt-2">
                Add a delivery address
              </button>
            </div>

            {/* Payment Methods */}
            <div className="mt-6 bg-white rounded-lg border border-[#DDD] shadow-sm p-5">
              <h3 className="font-bold text-[#111] mb-2">Payment methods</h3>
              <div className="flex gap-2">
                <div className="w-10 h-6 bg-[#FF9900] rounded text-[#111] text-xs font-bold flex items-center justify-center">
                  VISA
                </div>
                <div className="w-10 h-6 bg-[#1A1F71] rounded text-white text-xs font-bold flex items-center justify-center">
                  MC
                </div>
                <div className="w-10 h-6 bg-[#0066B2] rounded text-white text-xs font-bold flex items-center justify-center">
                  UPI
                </div>
                <div className="w-10 h-6 bg-[#00A3E0] rounded text-white text-xs font-bold flex items-center justify-center">
                  NB
                </div>
                <span className="text-xs text-[#007600] self-center">+2 more</span>
              </div>
            </div>

            {/* Need Help */}
            <div className="mt-6 bg-white rounded-lg border border-[#DDD] shadow-sm p-5">
              <h3 className="font-bold text-[#111] mb-2">Need help?</h3>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="text-[#007600] hover:underline">
                    Track Package
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#007600] hover:underline">
                    Delete items
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#007600] hover:underline">
                    Edit delivery address
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-[#007600] hover:underline">
                    Contact seller
                  </a>
                </li>
              </ul>
            </div>

            {/* Recommendations */}
            <div className="mt-6">
              <h3 className="text-lg font-bold text-[#111] mb-4">
                Recommendations based on your recent purchases
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-lg border border-[#DDD] shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <img
                      src={`https://images.unsplash.com/photo-1595225476474-87563907a212?w=150&q=80`}
                      alt="Product"
                      className="w-full h-24 object-contain mb-2"
                    />
                    <p className="text-sm text-[#111] line-clamp-2 hover:text-[#007600]">
                      Gaming Mouse Pad XXL Large
                    </p>
                    <p className="text-lg font-bold text-[#B12704] mt-1">₹599</p>
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
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-[#111] mb-2">Delete item?</h3>
              <p className="text-[#555] mb-6">
                Are you sure you want to delete this item from your cart?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-[#D5D9D9] rounded text-sm text-[#111] hover:bg-[#F7F8F8] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => itemToDelete && removeItem(itemToDelete)}
                  className="px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] rounded text-sm text-[#111] font-medium transition-colors"
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

