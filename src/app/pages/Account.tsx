import { useAuth } from '@/app/context/AuthContext';

export default function Account() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 px-6">
      <div className="max-w-3xl mx-auto bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 rounded-xl p-8">
        <h1 className="text-3xl font-bold text-white mb-4">Your Account</h1>
        {user ? (
          <div className="space-y-3 text-gray-200">
            <div>
              <p className="text-sm text-gray-400">Username</p>
              <p className="text-lg font-semibold">{user.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-lg font-semibold">{user.email}</p>
            </div>
            {user.role && (
              <div>
                <p className="text-sm text-gray-400">Role</p>
                <p className="text-lg font-semibold capitalize">{user.role}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-300">Sign in to view your account details.</p>
        )}
      </div>
    </div>
  );
}
