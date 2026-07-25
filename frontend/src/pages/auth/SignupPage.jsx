import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.png';

const SignupPage = () => {
  const { signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    full_name: '', 
    email: '', 
    password: '', 
    confirm_password: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm_password) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    try {
      await signup(form);
      navigate('/login', { state: { message: 'Account created successfully! Please sign in.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const user = await signInWithGoogle();
      
      // Navigate based on user role
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
      const message = err.response?.data?.message || err.message || 'Google sign-up failed';
      setError(message);
      console.error('Google Sign-Up error:', err);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6EBD8] text-[#4B2F18] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src={logo} 
            alt="Logo" 
            className="h-16 w-16 object-contain mx-auto mb-4"
            onError={e => e.target.style.display = 'none'} 
          />
          <h1 className="font-display text-3xl font-bold text-[#865014] mb-1">Create Account</h1>
          <p className="text-[#7F6243] text-sm">Join K-School today</p>
        </div>

        <div className="bg-white/90 border border-[#E0AE3F]/30 rounded-[32px] p-8 shadow-[0_24px_90px_rgba(134,80,20,0.08)]">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Google Sign-Up Button */}
          <button
            onClick={handleGoogleSignUp}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 rounded-full border border-[#E0AE3F]/30 bg-white py-3 text-[#4B2F18] font-semibold transition hover:bg-[#F6EBD8] disabled:cursor-not-allowed disabled:opacity-60 mb-4"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {googleLoading ? 'Creating account with Google...' : 'Continue with Google'}
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E0AE3F]/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-[#7F6243]">or sign up with email</span>
            </div>
          </div>

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
              disabled={loading || googleLoading}
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