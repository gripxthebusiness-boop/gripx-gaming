
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, User, LogOut, Settings, ChevronDown, ChevronUp, Clock, ShoppingCart } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

// Prefetch API helper
const prefetchProducts = () => {
  const API_BASE = import.meta.env.VITE_API_URL || '';
  fetch(`${API_BASE}/products?page=1&limit=9`).catch(() => {});
};

// Route prefetch hook
function useRoutePrefetch() {
  const prefetchTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (prefetchTimeoutRef.current) {
        clearTimeout(prefetchTimeoutRef.current);
      }
    };
  }, []);

  return {
    prefetchOnHover: (route: string) => {
      // Prefetch products page on hover
      if (route === '/products' && !prefetchTimeoutRef.current) {
        prefetchTimeoutRef.current = setTimeout(() => {
          prefetchProducts();
          prefetchTimeoutRef.current = null;
        }, 200); // 200ms delay to avoid unnecessary prefetches
      }
    },
    cancelPrefetch: () => {
      if (prefetchTimeoutRef.current) {
        clearTimeout(prefetchTimeoutRef.current);
        prefetchTimeoutRef.current = null;
      }
    },
  };
}

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, sessionTimeRemaining } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { prefetchOnHover, cancelPrefetch } = useRoutePrefetch();

  // Rick roll trick: click logo 5 times
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [showSecretToast, setShowSecretToast] = useState(false);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => location.pathname === href;

  // Handle logo click for rick roll
  const handleLogoClick = () => {
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);

    if (newCount === 5) {
      setShowSecretToast(true);
      setLogoClickCount(0);
      window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      setTimeout(() => setShowSecretToast(false), 3000);
    }
  };

  // Reset click count when navigating away
  useEffect(() => {
    setLogoClickCount(0);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format session time
  const formatSessionTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const { cartItems, getTotalItems } = useCart();

  if (navHidden) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setNavHidden(false)}
          className="bg-white/80 backdrop-blur-lg border border-red-600/20 rounded-lg p-2 text-gray-800 hover:text-gray-900 transition-colors"
          title="Show Navigation"
        >
          <ChevronDown size={20} />
        </button>
      </div>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-red-600/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo with secret click feature */}
          <button
            onClick={() => {
              handleLogoClick();
              navigate('/');
            }}
            className="flex items-center space-x-2 hover:scale-105 transition-transform"
            title={logoClickCount > 0 ? `${5 - logoClickCount} more clicks for rick roll` : 'Click 5 times for a surprise'}
          >
            <div className="text-3xl font-bold">
              <span className="text-gray-900">Neo</span>
              <span className="text-red-500">Sell</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onMouseEnter={() => prefetchOnHover(link.href)}
                onMouseLeave={cancelPrefetch}
                className={`relative text-sm font-medium transition-colors ${
                  isActive(link.href) ? 'text-red-500' : 'text-gray-900 hover:text-gray-900'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-500"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                {/* User Menu Trigger */}
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-red-50/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center">
                    <span className="text-gray-900 text-sm font-bold">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs text-gray-800">Hello,</p>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-gray-900">{user?.username || 'User'}</span>
                      {userMenuOpen ? (
                        <ChevronUp className="w-4 h-4 text-gray-800" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-800" />
                      )}
                    </div>
                  </div>
                </button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-64 bg-white border border-red-600/20 rounded-xl shadow-xl overflow-hidden"
                    >
                      {/* Session Timer */}
                      <div className="px-4 py-2 bg-red-50/50 border-b border-red-600/10 flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-gray-800">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs">Session expires in</span>
                        </div>
                        <span className="text-xs text-red-500 font-mono">
                          {formatSessionTime(sessionTimeRemaining)}
                        </span>
                      </div>

                      {/* Account Section */}
                      <div className="p-4 border-b border-red-600/10">
                        <p className="text-xs text-gray-800 mb-2">Your Account</p>
                        <ul className="space-y-1">
                          {user?.role === 'admin' && (
                            <li>
                              <Link
                                to="/admin/products"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                <Settings className="w-4 h-4 text-red-500" />
                                <span className="text-sm text-gray-900">Product Management</span>
                              </Link>
                            </li>
                          )}
                          <li>
                            <Link
                              to="/account"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <User className="w-4 h-4 text-gray-800" />
                              <span className="text-sm text-gray-900">Your Account</span>
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* Sign Out */}
                      <div className="p-2">
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">Sign out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-gray-900 rounded-lg hover:from-red-700 hover:to-red-800 transition-all"
              >
                <LogIn size={18} />
                <span>Sign in</span>
              </Link>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-2">
            {/* Cart Icon with Badge */}
            <Link
              to="/cart"
              className="relative text-gray-800 hover:text-gray-900 transition-colors p-1"
              title="Shopping Cart"
            >
              <ShoppingCart size={20} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-gray-900 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* Hide/Show Navigation Button */}
            <button
              onClick={() => setNavHidden(!navHidden)}
              className="text-gray-800 hover:text-gray-900 transition-colors p-1"
              title={navHidden ? 'Show Navigation' : 'Hide Navigation'}
            >
              {navHidden ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-900"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-red-600/20"
          >
            <div className="px-6 py-4 space-y-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-sm font-medium ${
                    isActive(link.href) ? 'text-red-500' : 'text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile User Section */}
              {isAuthenticated ? (
                <>
                  <div className="pt-4 border-t border-red-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center">
                        <span className="text-gray-900 font-bold">
                          {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user?.username || 'User'}</p>
                        <p className="text-xs text-gray-800">{user?.email}</p>
                      </div>
                    </div>
                    
                    <Link
                      to="/admin/products"
                      className="block text-sm font-medium px-4 py-2 bg-red-50 rounded-lg mb-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Product Management
                    </Link>
                    
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left text-sm font-medium px-4 py-2 text-red-400 rounded-lg hover:bg-red-500/10"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block text-sm font-medium px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-gray-900 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

