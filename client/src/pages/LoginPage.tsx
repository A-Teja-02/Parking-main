import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Eye, EyeOff, Car, Shield, Clock, Building2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { LOGIN_TITLE, COMPANY_NAME, APP_NAME } from '../constants';
import { useAppStore } from '../store/useAppStore';

interface LoginPageProps {
  onNavigate: (view: 'login' | 'signup' | 'forgot-password') => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuthStore();
  const { addToast } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || isSubmitting) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await login(email, password);
      addToast({ type: 'success', message: 'Successfully logged in.' });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ─── Left Branding Panel ─── */}
      <div className="auth-brand-panel">
        {/* Decorative shapes */}
        <div className="auth-shape auth-shape-1" />
        <div className="auth-shape auth-shape-2" />
        <div className="auth-shape auth-shape-3" />
        <div className="auth-shape auth-shape-4" />

        <div className="auth-brand-content">
          <div className="auth-brand-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5" fill="white" opacity="0.6"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5" fill="white" opacity="0.6"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5" fill="white" opacity="0.3"/>
            </svg>
          </div>

          <h1 className="auth-brand-title">
            {COMPANY_NAME}<br />
            <span style={{ fontSize: '0.6em', fontWeight: 400, opacity: 0.7 }}>
              {APP_NAME}
            </span>
          </h1>

          <p className="auth-brand-subtitle">
            Reserve your parking spot for tomorrow. Quick, easy, and paperless.
          </p>

          <div className="auth-brand-features">
            <div className="auth-brand-feature">
              <Car size={18} style={{ opacity: 0.6, flexShrink: 0 }} color="white" />
              <span>Real-time parking availability</span>
            </div>
            <div className="auth-brand-feature">
              <Clock size={18} style={{ opacity: 0.6, flexShrink: 0 }} color="white" />
              <span>Book for the next business day</span>
            </div>
            <div className="auth-brand-feature">
              <Shield size={18} style={{ opacity: 0.6, flexShrink: 0 }} color="white" />
              <span>Secure role-based access</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Right Form Panel ─── */}
      <div className="auth-form-panel">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%', maxWidth: '400px' }}
        >
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                background: '#1E3A5F',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(30, 58, 95, 0.2)',
              }}
            >
              <Building2 size={24} color="white" />
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#101828', letterSpacing: '-0.02em' }}>
              {LOGIN_TITLE}
            </h2>
            <p style={{ fontSize: '15px', color: '#667085', marginTop: '6px' }}>
              Sign in with your official email to continue
            </p>
          </div>

          {/* Form Card */}
          <motion.div
            animate={error ? { x: [-4, 4, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid #E4E7EC',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: '0 4px 24px -4px rgba(16, 24, 40, 0.08)',
            }}
          >
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#344054', marginBottom: '6px' }}>
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.name@quadrant.com"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #D1D5DB',
                    fontSize: '14px',
                    color: '#101828',
                    background: '#FFFFFF',
                    outline: 'none',
                    transition: 'border-color 150ms ease, box-shadow 150ms ease',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#1E3A5F';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30,58,95,0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#D1D5DB';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              {/* Password */}
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#344054', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={{
                      width: '100%',
                      padding: '10px 44px 10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #D1D5DB',
                      fontSize: '14px',
                      color: '#101828',
                      background: '#FFFFFF',
                      outline: 'none',
                      transition: 'border-color 150ms ease, box-shadow 150ms ease',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#1E3A5F';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30,58,95,0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#D1D5DB';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#9CA3AF',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '2px',
                    }}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Forgot password link */}
              <div style={{ textAlign: 'right', marginBottom: '24px' }}>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: '#1E3A5F',
                    fontWeight: '500',
                    padding: 0,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Error message */}
              {error && (
                <div style={{ marginBottom: '20px', padding: '10px 12px', background: '#FFF1F2', borderRadius: '8px', border: '1px solid #FFE4E6' }}>
                  <p style={{ fontSize: '13px', color: '#9B2335' }}>{error}</p>
                </div>
              )}

              {/* Submit button */}
              <button
                id="login-submit"
                type="submit"
                disabled={isSubmitting || !email || !password}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isSubmitting ? '#4A6FA5' : '#1E3A5F',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: 'white',
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  transition: 'background 150ms ease, opacity 150ms ease',
                  opacity: (!email || !password) ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) e.currentTarget.style.background = '#172D4B';
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) e.currentTarget.style.background = '#1E3A5F';
                }}
              >
                {isSubmitting ? (
                  <>
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: 'white',
                        animation: 'spin 0.6s linear infinite',
                      }}
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <LogIn size={16} />
                  </>
                )}
              </button>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </form>
          </motion.div>

          {/* Footer links */}
          <div style={{ textAlign: 'center', marginTop: '28px' }}>
            <p style={{ fontSize: '14px', color: '#667085' }}>
              First time here?{' '}
              <button
                type="button"
                onClick={() => onNavigate('signup')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#1E3A5F',
                  fontWeight: '600',
                  padding: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
              >
                Activate Account
              </button>
            </p>
          </div>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#9CA3AF', marginTop: '20px' }}>
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
