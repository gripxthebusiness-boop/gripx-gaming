
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, User, LogOut, Settings, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/app/context/AuthContext';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, sessionTimeRemaining } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Rick roll trick: click logo 5 times
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [showSecretToast, setShowSecretToast] = useState(false);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/cart', label: 'Cart' },
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-cyan-500/20">
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
              <span className="text-white">Grip</span>
              <span className="text-cyan-400">X</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative text-sm font-medium transition-colors ${
                  isActive(link.href) ? 'text-cyan-400' : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-400"
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
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs text-gray-400">Hello,</p>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-white">{user?.username || 'User'}</span>
                      {userMenuOpen ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
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
                      className="absolute right-0 mt-2 w-64 bg-gray-900 border border-cyan-500/20 rounded-xl shadow-xl overflow-hidden"
                    >
                      {/* Session Timer */}
                      <div className="px-4 py-2 bg-gray-800/50 border-b border-cyan-500/10 flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs">Session expires in</span>
                        </div>
                        <span className="text-xs text-cyan-400 font-mono">
                          {formatSessionTime(sessionTimeRemaining)}
                        </span>
                      </div>

                      {/* Account Section */}
                      <div className="p-4 border-b border-cyan-500/10">
                        <p className="text-xs text-gray-500 mb-2">Your Account</p>
                        <ul className="space-y-1">
                          {user?.role === 'admin' && (
                            <>
                              <li>
                                <Link
                                  to="/builder"
                                  onClick={() => setUserMenuOpen(false)}
                                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                  <span className="text-purple-400 text-lg">🎨</span>
                                  <span className="text-sm text-gray-300">Website Editor</span>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to="/admin/dashboard"
                                  onClick={() => setUserMenuOpen(false)}
                                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                  <Settings className="w-4 h-4 text-cyan-400" />
                                  <span className="text-sm text-gray-300">Dashboard</span>
                                </Link>
                              </li>
                            </>
                          )}
                          <li>
                            <Link
                              to="/account"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-300">Your Account</span>
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
                className="inline-flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all"
              >
                <LogIn size={18} />
                <span>Sign in</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black border-t border-cyan-500/20"
          >
            <div className="px-6 py-4 space-y-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-sm font-medium ${
                    isActive(link.href) ? 'text-cyan-400' : 'text-gray-300'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile User Section */}
              {isAuthenticated ? (
                <>
                  <div className="pt-4 border-t border-gray-800">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                        <span className="text-white font-bold">
                          {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{user?.username || 'User'}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                      </div>
                    </div>
                    
                    <Link
                      to="/admin/dashboard"
                      className="block text-sm font-medium px-4 py-2 bg-gray-800 rounded-lg mb-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
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
                  className="block text-sm font-medium px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg"
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

