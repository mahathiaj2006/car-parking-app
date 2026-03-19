import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      login(response.token, response.user);
      navigate('/slots');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <Link to="/" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
            &larr; Back
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mt-6 mb-1">Welcome back</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center mt-6">
          No account?{' '}
          <Link to="/register" className="font-semibold text-zinc-900 dark:text-white hover:underline">Register</Link>
        </p>

        <div className="mt-8 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">Demo credentials</p>
          <p className="text-xs text-zinc-600 dark:text-zinc-300">admin@example.com / admin123</p>
        </div>
      </div>
    </div>
  );
}
