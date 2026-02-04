import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Trash2, 
  Save, 
  X, 
  Check, 
  Eye, 
  EyeOff,
  Shield,
  Clock,
  AlertTriangle
} from 'lucide-react';

export default function Account() {
  const { user, loading, error, updateProfile, changePassword, deleteAccount, clearError, validatePasswordStrength } = useAuth();

  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phone: '',
  });
  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(null);

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(null);

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState(null);

  // Initialize profile data from user
  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Clear messages when user changes
  useEffect(() => {
    clearError();
    setProfileError(null);
    setProfileSuccess(null);
    setPasswordError(null);
    setPasswordSuccess(null);
    setDeleteError(null);
  }, [user, clearError]);

  // Validate password strength
  useEffect(() => {
    if (passwordData.newPassword) {
      setPasswordStrength(validatePasswordStrength(passwordData.newPassword));
    } else {
      setPasswordStrength(null);
    }
  }, [passwordData.newPassword, validatePasswordStrength]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    try {
      await updateProfile(profileData);
      setProfileSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setProfileError(err.message);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError('New password must be different from current password');
      return;
    }

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordSuccess('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (err) {
      setPasswordError(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError(null);
    
    if (!deletePassword) {
      setDeleteError('Please enter your password to confirm account deletion');
      return;
    }

    try {
      await deleteAccount(deletePassword);
      // User will be logged out and redirected by the logout function
    } catch (err) {
      setDeleteError(err.message);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 px-6">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-gray-900 to-black border border-red-600/20 rounded-xl p-8 text-center">
          <User className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-gray-400">Please sign in to view and manage your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 px-6 pb-12">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Account Settings</h1>
            <p className="text-gray-400">Manage your profile and account preferences</p>
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-red-600/20 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-red-600/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold text-white">Profile Information</h2>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm font-medium text-red-500 hover:text-red-400 transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setProfileData({
                      username: user.username || '',
                      email: user.email || '',
                      phone: user.phone || '',
                    });
                  }}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            )}
          </div>

          <div className="p-6">
            {/* Success/Error Messages */}
            {profileSuccess && (
              <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-green-400">{profileSuccess}</span>
              </div>
            )}
            {profileError && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-red-400">{profileError}</span>
              </div>
            )}

            {/* Profile Fields */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm text-gray-400">
                  <User className="w-4 h-4" />
                  <span>Username</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={profileData.username}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-red-600/20 rounded-lg text-white focus:outline-none focus:border-red-600 transition-colors"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-800/30 rounded-lg text-white font-medium">{user.username}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-red-600/20 rounded-lg text-white focus:outline-none focus:border-red-600 transition-colors"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-800/30 rounded-lg text-white font-medium">{user.email}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center space-x-2 text-sm text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>Phone Number</span>
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-red-600/20 rounded-lg text-white focus:outline-none focus:border-red-600 transition-colors"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-800/30 rounded-lg text-white font-medium">
                    {user.phone || 'Not set'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-red-600/20 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-red-600/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Lock className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold text-white">Password</h2>
            </div>
            {!showPasswordForm && (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="px-4 py-2 text-sm font-medium text-red-500 hover:text-red-400 transition-colors"
              >
                Change Password
              </button>
            )}
          </div>

          <div className="p-6">
            {!showPasswordForm ? (
              <p className="text-gray-400">Password last changed: Never</p>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4">
                {/* Success/Error Messages */}
                {passwordSuccess && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-green-400">{passwordSuccess}</span>
                  </div>
                )}
                {passwordError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <span className="text-red-400">{passwordError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-red-600/20 rounded-lg text-white focus:outline-none focus:border-red-600 transition-colors pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-red-600/20 rounded-lg text-white focus:outline-none focus:border-red-600 transition-colors pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {passwordStrength && (
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all ${
                              passwordStrength.strength === 'strong' ? 'bg-green-500 w-full' :
                              passwordStrength.strength === 'good' ? 'bg-red-600 w-3/4' :
                              passwordStrength.strength === 'fair' ? 'bg-yellow-500 w-1/2' :
                              'bg-red-500 w-1/4'
                            }`}
                          />
                        </div>
                        <span className={`text-sm font-medium capitalize ${
                          passwordStrength.strength === 'strong' ? 'text-green-400' :
                          passwordStrength.strength === 'good' ? 'text-red-500' :
                          passwordStrength.strength === 'fair' ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {passwordStrength.strength}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                        <span className={passwordStrength.requirements.minLength ? 'text-green-400' : ''}>
                          {passwordStrength.requirements.minLength ? '✓' : '○'} At least 8 characters
                        </span>
                        <span className={passwordStrength.requirements.hasUppercase ? 'text-green-400' : ''}>
                          {passwordStrength.requirements.hasUppercase ? '✓' : '○'} One uppercase letter
                        </span>
                        <span className={passwordStrength.requirements.hasLowercase ? 'text-green-400' : ''}>
                          {passwordStrength.requirements.hasLowercase ? '✓' : '○'} One lowercase letter
                        </span>
                        <span className={passwordStrength.requirements.hasNumber ? 'text-green-400' : ''}>
                          {passwordStrength.requirements.hasNumber ? '✓' : '○'} One number
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-red-600/20 rounded-lg text-white focus:outline-none focus:border-red-600 transition-colors pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors disabled:opacity-50"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{loading ? 'Changing...' : 'Change Password'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      setPasswordError(null);
                      setPasswordSuccess(null);
                    }}
                    className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Session Information */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-red-600/20 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-red-600/10 flex items-center space-x-3">
            <Clock className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-white">Session Information</h2>
          </div>
          <div className="p-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-gray-800/30 rounded-lg">
                <p className="text-sm text-gray-400">Account Type</p>
                <p className="text-white font-medium capitalize">{user.role || 'Customer'}</p>
              </div>
              <div className="p-4 bg-gray-800/30 rounded-lg">
                <p className="text-sm text-gray-400">Member Since</p>
                <p className="text-white font-medium">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="p-4 bg-gray-800/30 rounded-lg">
                <p className="text-sm text-gray-400">Last Updated</p>
                <p className="text-white font-medium">
                  {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Account Section */}
        <div className="bg-gradient-to-br from-red-900/20 to-black border border-red-500/20 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-red-500/10 flex items-center space-x-3">
            <Trash2 className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-semibold text-white">Delete Account</h2>
          </div>
          <div className="p-6">
            {!showDeleteConfirm ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300">Permanently delete your account and all associated data.</p>
                  <p className="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Account</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 font-medium">Are you sure you want to delete your account?</p>
                  <p className="text-sm text-gray-400 mt-1">This will permanently delete your account, and you will be logged out.</p>
                </div>
                
                {deleteError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <span className="text-red-400">{deleteError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Enter your password to confirm</label>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-red-500/20 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={loading || !deletePassword}
                    className="flex items-center space-x-2 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{loading ? 'Deleting...' : 'Confirm Delete'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeletePassword('');
                      setDeleteError(null);
                    }}
                    className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
