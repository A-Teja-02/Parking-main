import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Eye, EyeOff, ArrowLeft, Mail, ShieldCheck, Lock, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import { COMPANY_NAME, APP_NAME } from '../constants';

interface ForgotPasswordPageProps {
  onNavigate: (view: 'login' | 'forgot-password') => void;
}

function getPasswordStrength(password: string): { score: number; label: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const labels = ['Too weak', 'Weak', 'Fair', 'Strong', 'Very strong'];
  return { score, label: labels[score] };
}

const strengthColors = ['#D1D5DB', '#EF4444', '#F59E0B', '#22C55E', '#10B981'];

const inputBaseStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  fontSize: '14px',
  color: '#FFFFFF',
  background: 'rgba(255, 255, 255, 0.05)',
  outline: 'none',
  transition: 'all 150ms ease',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '600',
  color: '#CBD5E1',
  marginBottom: '6px',
};

function handleInputFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = '#38BDF8';
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(56, 189, 248, 0.15)';
  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
}

function handleInputBlur(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
  e.currentTarget.style.boxShadow = 'none';
  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
}

export function ForgotPasswordPage({ onNavigate }: ForgotPasswordPageProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { forgotPassword, resetPassword } = useAuthStore();
  const { addToast } = useAppStore();

  const strength = useMemo(() => getPasswordStrength(newPassword), [newPassword]);

  // ── Step 1: Request Reset Code ──
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      const result = await forgotPassword(email);
      setStep(2);
      addToast({ type: 'success', message: result.message });
    } catch (err: any) {
      setError(err.message || 'Failed to send reset code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Step 2: Enter OTP → Step 3: New Password ──
  // Combined into step 2 entering OTP, then step 3 for password
  const handleVerifyAndProceed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6 || isSubmitting) return;

    setStep(3);
  };

  // ── Step 3: Reset Password ──
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword || isSubmitting) return;

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const message = await resetPassword(email, otp, newPassword, confirmPassword);
      addToast({ type: 'success', message });
      onNavigate('login');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Resend OTP ──
  const handleResendOtp = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const result = await forgotPassword(email);
      setOtp('');
      addToast({ type: 'success', message: 'A new reset code has been sent.' });
    } catch (err: any) {
      setError(err.message || 'Failed to resend code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitles = ['Enter Email', 'Verify Code', 'New Password'];
  const stepIcons = [Mail, ShieldCheck, Lock];
  const StepIcon = stepIcons[step - 1];

  return (
    <div className="auth-page">
      {/* Background Shapes */}
      <div className="auth-bg-shape auth-bg-shape-1" />
      <div className="auth-bg-shape auth-bg-shape-2" />
      <div className="auth-bg-shape auth-bg-shape-3" />
      <div className="auth-bg-shape auth-bg-shape-4" />

      {/* Glassmorphic Form Card */}
      <div className="auth-glass-box">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%' }}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div
                style={{
                  background: '#FFFFFF',
                  padding: '12px 20px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 'fit-content',
                  margin: '0 auto 16px auto',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }}
              >
                <img src="/logo.png" alt="Logo" style={{ height: '56px', objectFit: 'contain' }} />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.02em', margin: 0 }}>
                {step === 1 ? 'Reset Password' : step === 2 ? 'Verify Code' : 'New Password'}
              </h2>
              <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '6px', fontWeight: '500', marginBottom: 0 }}>
                {step === 1
                  ? 'Enter your email to receive a reset code'
                  : step === 2
                    ? `Enter the 6-digit code sent to ${email}`
                    : 'Create a new secure password'}
              </p>
            </div>

            {/* Step Indicators */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
              {stepTitles.map((title, idx) => (
                <div
                  key={idx}
                  style={{
                    height: '4px',
                    width: '32px',
                    borderRadius: '2px',
                    background: step === idx + 1 
                      ? '#38BDF8' 
                      : step > idx + 1 
                        ? '#10B981' 
                        : 'rgba(255, 255, 255, 0.15)',
                    transition: 'all 300ms ease',
                  }}
                />
              ))}
            </div>

            {/* Form Fields Card */}
            <div>
              {/* ── Step 1: Email ── */}
              {step === 1 && (
                <form onSubmit={handleRequestCode}>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={labelStyle}>Official Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      placeholder="your.name@quadrantitservices.com"
                      style={inputBaseStyle}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      autoFocus
                    />
                  </div>

                  {error && (
                    <div style={{ marginBottom: '20px', padding: '10px 12px', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                      <p style={{ fontSize: '13px', color: '#FCA5A5', margin: 0 }}>{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || !email}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px 20px',
                      borderRadius: '10px',
                      border: 'none',
                      background: isSubmitting ? '#0284C7' : 'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: 'white',
                      cursor: isSubmitting ? 'wait' : 'pointer',
                      transition: 'all 150ms ease',
                      opacity: !email ? 0.6 : 1,
                      boxShadow: '0 4px 12px rgba(56, 189, 248, 0.25)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) e.currentTarget.style.background = 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubmitting) e.currentTarget.style.background = 'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)';
                    }}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Reset Code'}
                  </button>
                </form>
              )}

              {/* ── Step 2: OTP ── */}
              {step === 2 && (
                <>
                  <form onSubmit={handleVerifyAndProceed}>
                    <div style={{ marginBottom: '24px' }}>
                      <label style={labelStyle}>6-Digit Reset Code</label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => {
                          setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6));
                          setError('');
                        }}
                        placeholder="------"
                        maxLength={6}
                        style={{
                          ...inputBaseStyle,
                          fontFamily: 'monospace',
                          fontSize: '24px',
                          textAlign: 'center',
                          letterSpacing: '0.3em',
                          padding: '14px',
                        }}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        autoFocus
                      />
                    </div>

                    {error && (
                      <div style={{ marginBottom: '20px', padding: '10px 12px', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                        <p style={{ fontSize: '13px', color: '#FCA5A5', margin: 0 }}>{error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={otp.length !== 6}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '12px 20px',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)',
                        fontSize: '15px',
                        fontWeight: '600',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 150ms ease',
                        opacity: otp.length !== 6 ? 0.6 : 1,
                        boxShadow: '0 4px 12px rgba(56, 189, 248, 0.25)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)';
                      }}
                    >
                      Continue
                    </button>
                  </form>

                  <p style={{ textAlign: 'center', fontSize: '13px', color: '#94A3B8', marginTop: '16px', marginBottom: 0 }}>
                    Didn't receive a code?{' '}
                    <span
                      onClick={handleResendOtp}
                      style={{ color: '#38BDF8', fontWeight: '600', cursor: 'pointer' }}
                    >
                      Resend
                    </span>
                  </p>
                </>
              )}

              {/* ── Step 3: New Password ── */}
              {step === 3 && (
                <form onSubmit={handleResetPassword}>
                  <div style={{ marginBottom: '8px' }}>
                    <label style={labelStyle}>New Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                        placeholder="Create a strong password"
                        style={{ ...inputBaseStyle, paddingRight: '42px' }}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                          background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#94A3B8',
                        }}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {newPassword.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            style={{
                              flex: 1, height: '4px', borderRadius: '2px',
                              background: i < strength.score ? strengthColors[strength.score] : 'rgba(255,255,255,0.15)',
                              transition: 'background 200ms ease',
                            }}
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: '12px', color: strengthColors[strength.score], fontWeight: '600', whiteSpace: 'nowrap' }}>
                        {strength.label}
                      </span>
                    </div>
                  )}

                  <div style={{ marginBottom: '24px', marginTop: newPassword.length === 0 ? '12px' : undefined }}>
                    <label style={labelStyle}>Confirm Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                        placeholder="Re-enter your password"
                        style={{ ...inputBaseStyle, paddingRight: '42px' }}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        style={{
                          position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                          background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#94A3B8',
                        }}
                      >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div style={{ marginBottom: '20px', padding: '10px 12px', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                      <p style={{ fontSize: '13px', color: '#FCA5A5', margin: 0 }}>{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || !newPassword || !confirmPassword}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px 20px',
                      borderRadius: '10px',
                      border: 'none',
                      background: isSubmitting ? '#0284C7' : 'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: 'white',
                      cursor: isSubmitting ? 'wait' : 'pointer',
                      transition: 'all 150ms ease',
                      opacity: (!newPassword || !confirmPassword) ? 0.6 : 1,
                      boxShadow: '0 4px 12px rgba(56, 189, 248, 0.25)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) e.currentTarget.style.background = 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubmitting) e.currentTarget.style.background = 'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)';
                    }}
                  >
                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              )}
            </div>

            {/* Footer link */}
            <div
              onClick={() => onNavigate('login')}
              style={{
                textAlign: 'center',
                fontSize: '13px',
                color: '#94A3B8',
                marginTop: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to <span style={{ color: '#38BDF8', fontWeight: '600' }}>Sign In</span></span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
