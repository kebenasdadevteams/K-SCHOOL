import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/auth-service';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/">
            <img src="/images/logo.png" alt="Logo" className="h-14 w-14 object-contain mx-auto mb-6"
              onError={(e) => e.target.style.display = 'none'} />
          </Link>
          <h2 className="font-display text-3xl font-bold text-primary mb-2">Forgot Password?</h2>
          <p className="text-muted-foreground">Enter your email and we'll send you a reset link</p>
        </div>

        {sent ? (
          <div className="card text-center bg-card border border-border rounded-3xl p-8 shadow-xl">
            <div className="text-5xl mb-4">✉️</div>
            <h3 className="font-display text-secondary text-xl mb-3">Check Your Email</h3>
            <p className="text-muted-foreground mb-2">We sent a password reset link to:</p>
            <p className="text-foreground font-medium mb-6">{email}</p>
            <p className="text-muted-foreground text-sm mb-6">The link expires in 1 hour. Check your spam folder if you don't see it.</p>
            <Link to="/login" className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90 transition">Back to Login</Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 mb-6 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="input-field" placeholder="you@example.com" required />
              </div>
              <button type="submit" disabled={loading} className="w-full rounded-full bg-primary text-primary-foreground py-3 text-base transition hover:bg-primary/90">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            <p className="text-center text-muted-foreground mt-6 text-sm">
              <Link to="/login" className="text-secondary hover:underline">← Back to Login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
