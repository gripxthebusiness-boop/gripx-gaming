import { motion } from 'motion/react';
import { Phone, Mail, MapPin } from 'lucide-react';

export function Contact() {
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
              Contact Us
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Call us to order your GripX products
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Phone 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 rounded-xl hover:border-cyan-500/50 transition-all text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Sales Line 1</h3>
            <a
              href="tel:+919063032312"
              className="text-cyan-400 text-xl font-semibold hover:text-cyan-300 transition-colors"
            >
              +91 9063032312
            </a>
            <p className="text-gray-400 mt-4">Available Monday - Friday, 9 AM - 6 PM EST</p>
          </motion.div>

          {/* Phone 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 rounded-xl hover:border-cyan-500/50 transition-all text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Sales Line 2</h3>
            <a
              href="tel:+919923869222"
              className="text-cyan-400 text-xl font-semibold hover:text-cyan-300 transition-colors"
            >
              +91 9923869222
            </a>
            <p className="text-gray-400 mt-4">Available Monday - Friday, 9 AM - 6 PM EST</p>
          </motion.div>
        </div>

        {/* Additional Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          {/* Email */}
          <div className="p-8 bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 rounded-xl text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Email</h3>
            <a
              href="mailto:sales@gripx.com"
              className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors break-all"
            >
              sales@gripx.com
            </a>
          </div>

          {/* Office */}
          <div className="p-8 bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 rounded-xl text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Office</h3>
            <p className="text-gray-400">
              1234 Gaming Street<br />
              Tech City, TC 12345<br />
              United States
            </p>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-12 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/30 rounded-2xl text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Order?</h2>
          <p className="text-gray-400 mb-8 text-lg max-w-2xl mx-auto">
            Call one of our sales lines to place your order today. Our team is ready to help you get the GripX gear you need.
          </p>
          <a
            href="tel:+919063032312"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all"
          >
            <Phone className="mr-2 w-5 h-5" />
            Call Now
          </a>
        </motion.div>
      </div>
    </div>
  );
}
