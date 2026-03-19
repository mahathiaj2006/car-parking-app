import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authAPI.register(formData.username, formData.email, formData.password, formData.phone);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'username', label: 'Username', type: 'text', placeholder: 'john_doe' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
    { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
    { name: 'phone', label: 'Phone (optional)', type: 'tel', placeholder: '9876543210' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <Link to="/" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
            &larr; Back
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mt-6 mb-1">Create account</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Join ParkHub today</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="input"
                placeholder={placeholder}
                required={name !== 'phone'}
              />
            </div>
          ))}
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-zinc-900 dark:text-white hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
