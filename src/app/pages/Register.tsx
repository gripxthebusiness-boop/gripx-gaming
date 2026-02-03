
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/app/context/AuthContext';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';

export function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [showPasswordHelp, setShowPasswordHelp] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ level: 0, color: 'bg-gray-600', text: '' });
  
  const navigate = useNavigate();
  const { register } = useAuth();

  // Password requirements
  const passwordRequirements = [
    { regex: /.{8,}/, label: 'At least 8 characters' },
    { regex: /[A-Z]/, label: 'At least one uppercase letter' },
    { regex: /[a-z]/, label: 'At least one lowercase letter' },
    { regex: /[0-9]/, label: 'At least one number' },
    { regex: /[^A-Za-z0-9]/, label: 'At least one special character' },
  ];

  // Debounced password strength calculation (performance optimization)
  useEffect(() => {
    const timer = setTimeout(() => {
      const passed = passwordRequirements.filter(req => req.regex.test(formData.password)).length;
      let level = 0;
      let color = 'bg-gray-600';
      let text = '';
      
      if (passed > 0) {
        if (passed <= 2) { level = 1; color = 'bg-red-500'; text = 'Weak'; }
        else if (passed <= 3) { level = 2; color = 'bg-yellow-500'; text = 'Fair'; }
        else if (passed <= 4) { level = 3; color = 'bg-blue-500'; text = 'Good'; }
        else { level = 4; color = 'bg-green-500'; text = 'Strong'; }
      }
      
      setPasswordStrength({ level, color, text });
    }, 150); // 150ms debounce

    return () => clearTimeout(timer);
  }, [formData.password]);

  // Clear error when user types
  useEffect(() => {
    if (error) setError('');
  }, [formData]);

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (formData.fullName.trim().length < 3) {
      setError('Name must be at least 3 characters');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.phone && !/^[0-9]{10,15}$/.test(formData.phone)) {
      setError('Please enter a valid phone number (10-15 digits)');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!agreedToTerms) {
      setError('Please agree to the Conditions of Use and Privacy Notice');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create username from email or full name
      const username = formData.email.split('@')[0];
      
      await register(username, formData.email, formData.password);
      
      setSuccess('Registration successful! Redirecting to login...');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center pt-24 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/">
            <h1 className="text-4xl font-bold inline-block">
              <span className="text-white">Grip</span>
              <span className="text-cyan-400">X</span>
            </h1>
          </Link>
        </div>

        {/* Register Card */}
        <div className="p-6 bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-2">Create account</h2>
          <p className="text-gray-400 mb-6">Join NeoSell for exclusive deals on electronics</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Your name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="First and last name"
                  className={`w-full pl-10 pr-4 py-2 bg-gray-900 border ${
                    error && !formData.fullName ? 'border-red-500' : 'border-cyan-500/30'
                  } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors`}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  className={`w-full pl-10 pr-4 py-2 bg-gray-900 border ${
                    error && !formData.email ? 'border-red-500' : 'border-cyan-500/30'
                  } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors`}
                />
              </div>
            </div>

            {/* Phone (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Mobile number <span className="text-gray-500">(optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPasswordHelp(!showPasswordHelp)}
                  className="text-xs text-cyan-400 hover:text-cyan-300"
                >
                  Password tips
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full pl-10 pr-10 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded transition-colors ${
                          level <= passwordStrength.level ? passwordStrength.color : 'bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                  {passwordStrength.text && (
                    <p className={`text-xs ${
                      passwordStrength.level === 1 ? 'text-red-400' :
                      passwordStrength.level === 2 ? 'text-yellow-400' :
                      passwordStrength.level === 3 ? 'text-blue-400' : 'text-green-400'
                    }`}>
                      Password strength: {passwordStrength.text}
                    </p>
                  )}
                </div>
              )}

              {/* Password Requirements */}
              <AnimatePresence>
                {showPasswordHelp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 p-3 bg-gray-800/50 rounded-lg overflow-hidden"
                  >
                    <p className="text-xs text-gray-400 mb-2">Password must contain:</p>
                    <ul className="space-y-1">
                      {passwordRequirements.map((req, index) => (
                        <li 
                          key={index}
                          className={`text-xs flex items-center gap-2 ${
                            req.regex.test(formData.password) ? 'text-green-400' : 'text-gray-500'
                          }`}
                        >
                          {req.regex.test(formData.password) ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <div className="w-3 h-3 rounded-full border border-gray-500" />
                          )}
                          {req.label}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Re-enter Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Re-enter password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Re-enter password"
                  className={`w-full pl-10 pr-4 py-2 bg-gray-900 border ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-red-500' 
                      : 'border-cyan-500/30'
                  } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors`}
                />
                {formData.confirmPassword && (
                  <span className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                    formData.password === formData.confirmPassword ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formData.password === formData.confirmPassword ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                  </span>
                )}
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg"
                >
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Message */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg"
                >
                  <p className="text-green-400 text-sm">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Continue Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create your NeoSell account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Marketing Emails */}
          <div className="mt-4 p-3 bg-gray-800/30 rounded-lg">
            <label className="flex items-start gap-3 cursor-pointer group">
              <Checkbox.Root
                checked={marketingEmails}
                onCheckedChange={(checked) => setMarketingEmails(checked as boolean)}
                className="w-5 h-5 mt-0.5 rounded border-2 border-gray-500 bg-gray-800 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 flex items-center justify-center flex-shrink-0"
              >
                <Checkbox.Indicator>
                  <CheckIcon className="text-white w-4 h-4" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <div>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  Explore our latest deals and new arrivals
                </span>
                <p className="text-xs text-gray-500 mt-0.5">
                  By creating an account, you agree to receive promotional emails. You can unsubscribe at any time.
                </p>
              </div>
            </label>
          </div>

            {/* Terms Agreement */}
          <div className="mt-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <Checkbox.Root
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                className="w-5 h-5 mt-0.5 rounded border-2 border-gray-500 bg-gray-800 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 flex items-center justify-center flex-shrink-0"
              >
                <Checkbox.Indicator>
                  <CheckIcon className="text-white w-4 h-4" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <div>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  I agree to the{' '}
                  <a href="#" className="text-cyan-400 hover:text-cyan-300 hover:underline">
                    Conditions of Use
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-cyan-400 hover:text-cyan-300 hover:underline">
                    Privacy Notice
                  </a>
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Already have an account? */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black text-gray-500">
                Already have an account?
              </span>
            </div>
          </div>

          <Link
            to="/login"
            className="mt-4 block w-full py-2 px-4 bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-lg text-white hover:from-gray-700 hover:to-gray-600 transition-all text-center font-medium"
          >
            Sign in
          </Link>
        </div>

        {/* Footer Links */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-cyan-400 hover:underline">Conditions of Use</a>
            <a href="#" className="hover:text-cyan-400 hover:underline">Privacy Notice</a>
            <a href="#" className="hover:text-cyan-400 hover:underline">Help</a>
          </div>
          <p className="text-center text-xs text-gray-600 mt-2">
            © 2026 NeoSell. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;