
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ArrowLeft, Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'code' | 'reset'>('email');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ level: 0, color: 'bg-gray-600', text: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  
  const navigate = useNavigate();
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend timer
  useEffect(() => {
    if (step === 'code' && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, resendTimer]);

  // Password strength calculation
  useEffect(() => {
    const requirements = {
      minLength: newPassword.length >= 8,
      hasUppercase: /[A-Z]/.test(newPassword),
      hasLowercase: /[a-z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
      hasSpecialChar: /[^A-Za-z0-9]/.test(newPassword),
    };
    setPasswordRequirements(requirements);

    const passed = Object.values(requirements).filter(Boolean).length;
    let level = 0;
    let color = 'bg-gray-600';
    let text = '';

    if (passed <= 2) { level = 1; color = 'bg-red-500'; text = 'Weak'; }
    else if (passed <= 3) { level = 2; color = 'bg-yellow-500'; text = 'Fair'; }
    else if (passed <= 4) { level = 3; color = 'bg-blue-500'; text = 'Good'; }
    else { level = 4; color = 'bg-green-500'; text = 'Strong'; }

    setPasswordStrength({ level, color, text });
  }, [newPassword]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.trim()) {
      setError('Please enter your email');
      setLoading(false);
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset code');
      }

      setStep('code');
      setResendTimer(60);
      setSuccess('');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    const codeValue = code.join('');
    if (codeValue.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setError('');
    setLoading(true);

    // For demo, accept "123456"
    if (codeValue === '123456') {
      setStep('reset');
      setLoading(false);
    } else {
      setError('Invalid code. Demo code: 123456');
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const isValid = passwordRequirements.minLength && passwordRequirements.hasUppercase &&
                    passwordRequirements.hasLowercase && passwordRequirements.hasNumber;
    if (!isValid) {
      setError('Password does not meet all requirements');
      setLoading(false);
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: 'demo_token', password: newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
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

        {/* Step 1: Enter Email */}
        <AnimatePresence mode="wait">
          {step === 'email' && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-6 bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 rounded-lg"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Password help</h2>
              <p className="text-gray-400 mb-6">
                Enter the email address associated with your GripX account.
              </p>

              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>

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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50"
                >
                  {loading ? 'Sending code...' : 'Continue'}
                </button>
              </form>

              <div className="mt-6">
                <Link to="/login" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign in
                </Link>
              </div>
            </motion.div>
          )}

          {/* Step 2: Enter Code */}
          {step === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-6 bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 rounded-lg"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
              <p className="text-gray-400 mb-2">
                We've sent a verification code to:
              </p>
              <p className="text-cyan-400 mb-6">{email}</p>

              <div className="space-y-4">
                <div className="flex justify-center gap-2">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { otpRefs.current[index] = el }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      className="w-12 h-12 text-center text-xl font-bold bg-gray-800 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 text-center">Demo code: 123456</p>

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

                <button
                  onClick={handleVerifyCode}
                  disabled={loading || code.join('').length !== 6}
                  className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify code'}
                </button>

                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-sm text-gray-500">
                      Resend code in {resendTimer}s
                    </p>
                  ) : (
                    <button
                      onClick={() => {
                        setCode(['', '', '', '', '', '']);
                        setResendTimer(60);
                      }}
                      className="text-sm text-cyan-400 hover:text-cyan-300"
                    >
                      Resend code
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setStep('email')}
                  className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Reset Password */}
          {step === 'reset' && (
            <motion.div
              key="reset"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 rounded-lg"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Create new password</h2>
              <p className="text-gray-400 mb-6">
                Your new password must be different from your previous password.
              </p>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    New password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError('');
                      }}
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
                  
                  {/* Password strength */}
                  {newPassword && (
                    <div className="mt-2">
                      <div className="flex gap-1">
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
                        <p className={`text-xs mt-1 ${
                          passwordStrength.level === 1 ? 'text-red-400' :
                          passwordStrength.level === 2 ? 'text-yellow-400' :
                          passwordStrength.level === 3 ? 'text-blue-400' : 'text-green-400'
                        }`}>
                          {passwordStrength.text} password
                        </p>
                      )}
                    </div>
                  )}

                  {/* Password requirements */}
                  <div className="mt-2 space-y-1">
                    {[
                      { key: 'minLength', label: 'At least 8 characters' },
                      { key: 'hasUppercase', label: 'At least one uppercase letter' },
                      { key: 'hasLowercase', label: 'At least one lowercase letter' },
                      { key: 'hasNumber', label: 'At least one number' },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-2">
                        {passwordRequirements[key as keyof typeof passwordRequirements] ? (
                          <CheckCircle className="w-3 h-3 text-green-400" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border border-gray-500" />
                        )}
                        <span className={`text-xs ${
                          passwordRequirements[key as keyof typeof passwordRequirements] 
                            ? 'text-green-400' : 'text-gray-500'
                        }`}>
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Re-enter new password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError('');
                      }}
                      placeholder="Re-enter password"
                      className={`w-full pl-10 pr-4 py-2 bg-gray-900 border ${
                        confirmPassword && newPassword !== confirmPassword
                          ? 'border-red-500' : 'border-cyan-500/30'
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors`}
                    />
                    {confirmPassword && (
                      <span className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        newPassword === confirmPassword ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {newPassword === confirmPassword ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <AlertCircle className="w-5 h-5" />
                        )}
                      </span>
                    )}
                  </div>
                </div>

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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50"
                >
                  {loading ? 'Resetting...' : 'Reset password'}
                </button>
              </form>

              <div className="mt-6">
                <Link to="/login" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign in
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-cyan-400 hover:underline">Conditions of Use</a>
            <a href="#" className="hover:text-cyan-400 hover:underline">Privacy Notice</a>
            <a href="#" className="hover:text-cyan-400 hover:underline">Help</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

