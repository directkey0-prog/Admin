import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiKey, FiMail, FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import { useAdminAuth } from '../../contexts/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back, Admin!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/DIRECTKEYLOGO.png" alt="DirectKey" className="h-12 w-auto" />
            <span className="text-2xl font-bold text-white">
              Direct<span className="text-primary-400">Key</span>
            </span>
          </div>
          <h1 className="text-xl font-bold text-white mb-1">Admin Panel</h1>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <FiShield className="text-primary-400 text-sm" />
            <p className="text-sm text-gray-400">Admin Control Panel</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-xl font-bold text-navy-900 mb-1">Admin Login</h2>
          <p className="text-gray-500 text-sm mb-6">Sign in to manage the platform</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 bg-transparent border-0 cursor-pointer">
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary-400 hover:bg-primary-500 text-white py-3.5 rounded-xl font-semibold transition-all border-0 cursor-pointer text-sm disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;
