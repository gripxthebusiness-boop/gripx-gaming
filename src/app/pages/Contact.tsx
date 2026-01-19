import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Send, ShoppingCart, CheckCircle } from 'lucide-react';
import { useState } from 'react';

// Cart items would come from context in production
const mockCartItems = [
  {
    id: '1',
    name: 'GripX Pro Gaming Mouse - RGB Wireless High Precision Sensor',
    price: 2499,
    quantity: 1,
  },
  {
    id: '2',
    name: 'GripX Mechanical Gaming Keyboard - Cherry MX Blue Switches RGB Backlit',
    price: 4599,
    quantity: 2,
  },
  {
    id: '3',
    name: 'GripX 7.1 Surround Sound Gaming Headset - Noise Cancelling Microphone',
    price: 3299,
    quantity: 1,
  }
];

const OFFICIAL_EMAIL = 'gripxthebusiness@gmail.com';

export function Contact() {
  const [copied, setCopied] = useState(false);

  // Calculate total
  const total = mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Generate email body with product list
  const generateEmailBody = () => {
    const date = new Date().toLocaleDateString('en-IN');
    let body = `Subject: Order Request - ${date}\n\n`;
    body += `Hello GripX Team,\n\n`;
    body += `I would like to order the following products:\n\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    mockCartItems.forEach((item, index) => {
      body += `${index + 1}. ${item.name}\n`;
      body += `   Price: ₹${item.price.toLocaleString()} x ${item.quantity} = ₹${(item.price * item.quantity).toLocaleString()}\n\n`;
    });
    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `TOTAL: ₹${total.toLocaleString()}\n\n`;
    body += `Please confirm availability and provide payment details.\n\n`;
    body += `My Contact Information:\n`;
    body += `Name: ________________\n`;
    body += `Phone: _______________\n`;
    body += `Address: ____________\n\n`;
    body += `Thank you!\n`;
    return encodeURIComponent(body);
  };

  // Generate mailto link
  const mailtoLink = `mailto:${OFFICIAL_EMAIL}?${generateEmailBody()}`;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(OFFICIAL_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              Order Your Gear
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Call us or send your product list to place an order
          </p>
        </motion.div>

        {/* Order Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 p-8 bg-gradient-to-br from-gray-900/80 to-black/80 border border-cyan-500/30 rounded-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <ShoppingCart className="text-cyan-400" size={28} />
            <h2 className="text-2xl font-bold text-white">Your Products</h2>
          </div>
          
          <div className="space-y-4 mb-6">
            {mockCartItems.map((item, index) => (
              <div key={item.id} className="flex justify-between items-center py-3 border-b border-cyan-500/20">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-white">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400">x{item.quantity}</span>
                  <span className="text-cyan-400 font-bold ml-4">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center pt-4">
            <span className="text-xl font-bold text-white">Total Amount:</span>
            <span className="text-3xl font-bold text-cyan-400">₹{total.toLocaleString()}</span>
          </div>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Phone 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 bg-gradient-to-br from-gray-900/80 to-black/80 border border-cyan-500/20 rounded-xl hover:border-cyan-500/50 transition-all text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Call to Order</h3>
            <a
              href="tel:+919063032312"
              className="text-cyan-400 text-xl font-semibold hover:text-cyan-300 transition-colors block mb-2"
            >
              +91 9063032312
            </a>
            <a
              href="tel:+919923869222"
              className="text-cyan-400 text-lg font-semibold hover:text-cyan-300 transition-colors block mb-4"
            >
              +91 9923869222
            </a>
            <p className="text-gray-400 text-sm">Available Monday - Saturday, 10 AM - 8 PM</p>
          </motion.div>

          {/* Email Order */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-8 bg-gradient-to-br from-gray-900/80 to-black/80 border border-cyan-500/20 rounded-xl hover:border-cyan-500/50 transition-all text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Email Your Order</h3>
            <p className="text-gray-400 text-sm mb-4">
              Send your product list and we'll get back to you with payment details
            </p>
            <a
              href={mailtoLink}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all font-semibold"
            >
              <Mail size={18} />
              Send Product List
            </a>
            <div className="mt-4 pt-4 border-t border-cyan-500/20">
              <p className="text-gray-400 text-xs mb-2">Or copy our email:</p>
              <button
                onClick={handleCopyEmail}
                className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center justify-center gap-2 mx-auto transition-colors"
              >
                <Mail size={14} />
                {copied ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle size={14} /> Copied!
                  </span>
                ) : (
                  OFFICIAL_EMAIL
                )}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Additional Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          {/* Office */}
          <div className="p-8 bg-gradient-to-br from-gray-900/80 to-black/80 border border-cyan-500/20 rounded-xl text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Office Location</h3>
            <p className="text-gray-400">
              Mumbai, Maharashtra<br />
              India
            </p>
          </div>

          {/* Business Hours */}
          <div className="p-8 bg-gradient-to-br from-gray-900/80 to-black/80 border border-cyan-500/20 rounded-xl text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ClockIcon />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Business Hours</h3>
            <p className="text-gray-400">
              Monday - Saturday<br />
              10:00 AM - 8:00 PM<br />
              <span className="text-sm">Closed on Sundays</span>
            </p>
          </div>
        </motion.div>

        {/* How to Order */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-8 bg-gradient-to-br from-gray-900/80 to-black/80 border border-cyan-500/20 rounded-2xl"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">How to Order</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-cyan-400 font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Add to Cart</h3>
              <p className="text-gray-400 text-sm">Browse products and add items to your cart</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-cyan-400 font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Contact Us</h3>
              <p className="text-gray-400 text-sm">Call or email us with your order details</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-cyan-400 font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Pay & Receive</h3>
              <p className="text-gray-400 text-sm">Complete payment and get your gear delivered</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-10 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/30 rounded-2xl text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Order?</h2>
          <p className="text-gray-400 mb-8 text-lg max-w-2xl mx-auto">
            Choose your preferred way to order - call us directly or send your product list via email.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+919063032312"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all"
            >
              <Phone className="mr-2 w-5 h-5" />
              Call Now
            </a>
            <a
              href={mailtoLink}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
            >
              <Mail className="mr-2 w-5 h-5" />
              Email Order
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Clock icon component
function ClockIcon() {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="text-white"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

