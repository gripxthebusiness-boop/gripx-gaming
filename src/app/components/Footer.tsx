import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black border-t border-cyan-500/20 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="text-2xl font-bold mb-4">
              <span className="text-white">Grip</span>
              <span className="text-cyan-400">X</span>
            </div>
            <p className="text-sm">
              Curated gaming gear from trusted brands in India.
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-cyan-400 transition-colors">Mice</Link></li>
              <li><Link to="/products" className="hover:text-cyan-400 transition-colors">Keyboards</Link></li>
              <li><Link to="/products" className="hover:text-cyan-400 transition-colors">Headsets</Link></li>
              <li><Link to="/products" className="hover:text-cyan-400 transition-colors">Controllers</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-cyan-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-white font-semibold mb-4">Community</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="hover:text-cyan-400 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-cyan-400 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-cyan-400 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-cyan-400 transition-colors"><Youtube size={20} /></a>
            </div>
            <p className="text-sm">Join our community of gamers</p>
          </div>
        </div>

        <div className="border-t border-cyan-500/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; 2026 GripX. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
