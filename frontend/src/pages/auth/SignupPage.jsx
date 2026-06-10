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
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="Logo" className="h-16 w-16 object-contain mx-auto mb-4"
            onError={e => e.target.style.display = 'none'} />
          <h1 className="font-display text-3xl font-bold text-white mb-1">Create Account</h1>
          <p className="text-gray-400 text-sm">Join K-School today</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="label">Full Name</label>
              <input className="input-field" placeholder="Your full name" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} required /></div>
            <div><label className="label">Email Address</label>
              <input type="email" className="input-field" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
            <div><label className="label">Password</label>
              <input type="password" className="input-field" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></div>
            <div><label className="label">Confirm Password</label>
              <input type="password" className="input-field" placeholder="••••••••" value={form.confirm_password} onChange={e => setForm({ ...form, confirm_password: e.target.value })} required /></div>
            <button type="submit" disabled={loading} className="w-full btn-gold py-3 text-base">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-gray-500 mt-6 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-400 hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default SignupPage;
