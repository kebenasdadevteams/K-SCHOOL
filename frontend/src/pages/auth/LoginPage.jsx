import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.png';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const user = await login({
        ...form,
        email: form.email.trim().toLowerCase(),
      });
      const roles = Array.isArray(user.roles)
        ? user.roles.map((role) => String(role).trim().toLowerCase()).filter(Boolean)
        : [];
      const preferredRoleOrder = ['admin', 'developer', 'editor', 'pastor', 'teacher', 'student'];

      if (roles.length === 0) {
        navigate('/student');
        return;
      }

      const highestRole = preferredRoleOrder.find((role) => roles.includes(role));
      const destinationRole = highestRole || roles[0] || 'student';
      navigate(`/${destinationRole}`);
    } catch (err) {
      const backendMessage = err.response?.data?.message;
      const message = backendMessage || err.message || 'Invalid email or password';
      setError(message);
      console.error('Login error:', err.response?.data || err.message, 'request URL:', err.config?.url);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#F6EBD8] text-[#4B2F18] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="Logo" className="h-16 w-16 object-contain mx-auto mb-4"
            onError={e => e.target.style.display = 'none'} />
          <h1 className="font-display text-3xl font-bold text-[#865014] mb-1">Sign In</h1>
          <p className="text-[#7F6243] text-sm">Access your K-School account</p>
        </div>

        <div className="bg-white/90 border border-[#E0AE3F]/30 rounded-[32px] p-8 shadow-[0_24px_90px_rgba(134,80,20,0.08)]">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#865014] mb-2">Email Address</label>
              <input
                type="email"
                className="w-full rounded-3xl border border-[#E0AE3F]/30 bg-[#FEF6E8] px-4 py-3 text-[#4B2F18] outline-none transition focus:border-[#865014] focus:ring-2 focus:ring-[#E0AE3F]/25"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#865014] mb-2">Password</label>
              <input
                type="password"
                className="w-full rounded-3xl border border-[#E0AE3F]/30 bg-[#FEF6E8] px-4 py-3 text-[#4B2F18] outline-none transition focus:border-[#865014] focus:ring-2 focus:ring-[#E0AE3F]/25"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-[#865014] text-sm font-medium hover:underline">Forgot password?</Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#865014] text-white py-3 text-base font-semibold transition hover:bg-[#6d410f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-[#7F6243] mt-6 text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-[#E0AE3F] hover:underline font-semibold">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
