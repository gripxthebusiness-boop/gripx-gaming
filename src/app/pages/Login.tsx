
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Phone } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/app/context/AuthContext';
import * as Dialog from '@radix-ui/react-dialog';

export function Login() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [showPasswordHelp, setShowPasswordHelp] = useState(false);
  const [showIssuesHelp, setShowIssuesHelp] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpStep, setOtpStep] = useState('phone'); // 'phone' or 'otp'
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Clear error when user types
  useEffect(() => {
    if (error) setError('');
  }, [emailOrPhone, password]);

  const validateEmailOrPhone = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;
    return emailRegex.test(value) || phoneRegex.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmailOrPhone(emailOrPhone)) {
      setError('Please enter a valid email address or phone number');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // For phone numbers, we need to handle differently (simulated)
      if (/^[0-9]{10,15}$/.test(emailOrPhone)) {
        throw new Error('Phone login requires OTP verification. Click "Need help?" → "Other issues with Sign-In"');
      }
      
      await login(emailOrPhone, password);
      
      // Save "Keep me signed in" preference
      if (keepSignedIn) {
        localStorage.setItem('keepSignedIn', 'true');
      }
      
      // Redirect to home page for customers
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSend = async () => {
    const phoneNumber = otp.join('');
    if (phoneNumber.length < 10) {
      setOtpError('Please enter a valid phone number');
      return;
    }
    
    setOtpLoading(true);
    setOtpError('');
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setOtpStep('otp');
    } catch (err: any) {
      setOtpError(err.message || 'Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    const phoneNumber = otp.slice(0, 10).join('');
    const otpValue = otp.join('');
    
    if (phoneNumber.length < 10 || otpValue.length !== 6) {
      setOtpError('Please enter valid phone number and 6-digit OTP');
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/auth/login/otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, otp: otpValue }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      localStorage.setItem('token', data.token);
      // Redirect to home page for customers
      window.location.href = '/';
    } catch (err: any) {
      setOtpError(err.message || 'Invalid OTP. Demo OTP: 123456');
      setOtp(['', '', '', '', '', '']);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center pt-24 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
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

        {/* Login Card */}
        <div className="p-6 bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Sign in</h2>
          <p className="text-gray-400 text-sm mb-4">to access your GripX account</p>

          {/* OTP Modal */}
          <Dialog.Root open={showOTPModal} onOpenChange={setShowOTPModal}>
            <Dialog.Trigger asChild>
              <button 
                type="button"
                className="w-full py-2 px-4 mb-4 bg-transparent border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition-colors text-sm"
              >
                Continue with OTP
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 border border-cyan-500/30 rounded-xl p-6 w-full max-w-md z-50">
                <Dialog.Title className="text-xl font-bold text-white mb-2">
                  {otpStep === 'phone' ? 'Sign in with OTP' : 'Enter OTP'}
                </Dialog.Title>
                <Dialog.Description className="text-gray-400 mb-4 text-sm">
                  {otpStep === 'phone' 
                    ? 'Enter your phone number to receive a one-time password.' 
                    : 'Enter the 6-digit code sent to your phone.'}
                </Dialog.Description>

                {otpStep === 'phone' ? (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <select className="bg-gray-800 border border-cyan-500/30 rounded-lg px-3 py-2 text-white">
                        <option>+91</option>
                        <option>+1</option>
                        <option>+44</option>
                      </select>
                      <input
                        type="tel"
                        value={otp.join('')}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          const newOtp = ['', '', '', '', '', ''];
                          val.split('').forEach((d, i) => newOtp[i] = d);
                          setOtp(newOtp);
                        }}
                        placeholder="Phone number"
                        className="flex-1 bg-gray-800 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    {otpError && (
                      <p className="text-red-400 text-sm">{otpError}</p>
                    )}
                    <div className="flex gap-3">
                      <Dialog.Close asChild>
                        <button className="flex-1 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                          Cancel
                        </button>
                      </Dialog.Close>
                      <button 
                        onClick={handleOtpSend}
                        disabled={otpLoading || otp[0].length < 10}
                        className="flex-1 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 flex items-center justify-center"
                      >
                        {otpLoading ? 'Sending...' : 'Send OTP'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-center gap-2">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => { otpRefs.current[index] = el }}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-12 h-12 text-center text-xl font-bold bg-gray-800 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 text-center">Demo OTP: 123456</p>
                    {otpError && (
                      <p className="text-red-400 text-sm text-center">{otpError}</p>
                    )}
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setOtpStep('phone')}
                        className="flex-1 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Change Phone
                      </button>
                      <button 
                        onClick={handleOtpVerify}
                        disabled={otpLoading}
                        className="flex-1 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50"
                      >
                        {otpLoading ? 'Verifying...' : 'Verify & Sign In'}
                      </button>
                    </div>
                  </div>
                )}
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-500">or</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email/Phone Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email or mobile phone number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="Enter email or phone"
                  className={`w-full pl-10 pr-4 py-2 bg-gray-900 border ${
                    error && !validateEmailOrPhone(emailOrPhone) 
                      ? 'border-red-500' 
                      : 'border-cyan-500/30'
                  } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors`}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !emailOrPhone || !password}
              className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Keep me signed in */}
          <div className="mt-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-900"
              />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                Keep me signed in
              </span>
            </label>
          </div>

          {/* Need help? Accordion */}
          <div className="mt-4">
            <button
              onClick={() => setShowPasswordHelp(!showPasswordHelp)}
              className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Need help?
              <span className={`transition-transform ${showPasswordHelp ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            <AnimatePresence>
              {showPasswordHelp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 space-y-1 overflow-hidden"
                >
                  <Link to="/forgot-password" className="block text-sm text-cyan-400 hover:text-cyan-300 hover:underline">
                    Forgot password
                  </Link>
                  <button
                    onClick={() => setShowIssuesHelp(!showIssuesHelp)}
                    className="block text-sm text-cyan-400 hover:text-cyan-300 hover:underline text-left"
                  >
                    Other issues with Sign-In
                  </button>
                  
                  <AnimatePresence>
                    {showIssuesHelp && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-4 mt-2 p-3 bg-gray-800/50 rounded-lg"
                      >
                        <ul className="text-sm text-gray-400 space-y-2">
                          <li>• If you no longer have access to your email or phone</li>
                          <li>• If you're having trouble verifying your identity</li>
                          <li>• Contact support: +91 9063032312</li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* New to GripX? */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black text-gray-500">
                New to GripX?
              </span>
            </div>
          </div>

          <Link
            to="/register"
            className="mt-4 block w-full py-2 px-4 bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-lg text-white hover:from-gray-700 hover:to-gray-600 transition-all text-center font-medium"
          >
            Start here
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
            © 2026 GripX. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

