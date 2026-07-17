import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.png';

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm_password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (form.password !== form.confirm_password) return setError('Passwords do not match');
    setLoading(true);
    try { await signup(form); navigate('/login'); }
    catch (err) { setError(err.response?.data?.message || 'Signup failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#F6EBD8] text-[#4B2F18] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="Logo" className="h-16 w-16 object-contain mx-auto mb-4"
            onError={e => e.target.style.display = 'none'} />
          <h1 className="font-display text-3xl font-bold text-[#865014] mb-1">Create Account</h1>
          <p className="text-[#7F6243] text-sm">Join K-School today</p>
        </div>
        <div className="bg-white/90 border border-[#E0AE3F]/30 rounded-[32px] p-8 shadow-[0_24px_90px_rgba(134,80,20,0.08)]">
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#865014] mb-2">Full Name</label>
              <input
                className="w-full rounded-3xl border border-[#E0AE3F]/30 bg-[#FEF6E8] px-4 py-3 text-[#4B2F18] outline-none transition focus:border-[#865014] focus:ring-2 focus:ring-[#E0AE3F]/25"
                placeholder="Your full name"
                value={form.full_name}
                onChange={e => setForm({ ...form, full_name: e.target.value })}
                required
              />
            </div>
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
            <div>
              <label className="block text-sm font-semibold text-[#865014] mb-2">Confirm Password</label>
              <input
                type="password"
                className="w-full rounded-3xl border border-[#E0AE3F]/30 bg-[#FEF6E8] px-4 py-3 text-[#4B2F18] outline-none transition focus:border-[#865014] focus:ring-2 focus:ring-[#E0AE3F]/25"
                placeholder="••••••••"
                value={form.confirm_password}
                onChange={e => setForm({ ...form, confirm_password: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#865014] text-white py-3 text-base font-semibold transition hover:bg-[#6d410f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-[#7F6243] mt-6 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-[#E0AE3F] hover:underline font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default SignupPage;
