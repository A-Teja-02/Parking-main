import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Eye, EyeOff, ArrowLeft, Mail, ShieldCheck, Lock, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import { COMPANY_NAME, APP_NAME } from '../constants';

interface ForgotPasswordPageProps {
  onNavigate: (view: 'login' | 'signup' | 'forgot-password') => void;
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
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1px solid #D1D5DB',
  fontSize: '14px',
  color: '#101828',
  background: '#FFFFFF',
  outline: 'none',
  transition: 'border-color 150ms ease, box-shadow 150ms ease',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '500',
  color: '#344054',
  marginBottom: '6px',
};

function handleInputFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = '#1E3A5F';
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30,58,95,0.1)';
}

function handleInputBlur(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = '#D1D5DB';
  e.currentTarget.style.boxShadow = 'none';
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
      {/* ─── Left Branding Panel ─── */}
      <div className="auth-brand-panel">
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
            Reset your password securely with a one-time verification code.
          </p>

          {/* Step indicator */}
          <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stepTitles.map((title, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: step > idx + 1
                      ? 'rgba(74, 222, 128, 0.3)'
                      : step === idx + 1
                        ? 'rgba(255,255,255,0.25)'
                        : 'rgba(255,255,255,0.08)',
                    color: 'white',
                    border: step === idx + 1 ? '2px solid rgba(255,255,255,0.5)' : '2px solid transparent',
                    transition: 'all 300ms ease',
                  }}
                >
                  {step > idx + 1 ? <CheckCircle size={14} /> : idx + 1}
                </div>
                <span
                  style={{
                    fontSize: '14px',
                    color: step >= idx + 1 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
                    fontWeight: step === idx + 1 ? '600' : '400',
                    transition: 'all 300ms ease',
                  }}
                >
                  {title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Right Form Panel ─── */}
      <div className="auth-form-panel">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
                <StepIcon size={24} color="white" />
              </div>
              <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#101828', letterSpacing: '-0.02em' }}>
                {step === 1 ? 'Reset Password' : step === 2 ? 'Verify Code' : 'New Password'}
              </h2>
              <p style={{ fontSize: '15px', color: '#667085', marginTop: '6px' }}>
                {step === 1
                  ? 'Enter your email to receive a reset code'
                  : step === 2
                    ? `Enter the 6-digit code sent to ${email}`
                    : 'Create a new secure password'}
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
                    <div style={{ marginBottom: '20px', padding: '10px 12px', background: '#FFF1F2', borderRadius: '8px', border: '1px solid #FFE4E6' }}>
                      <p style={{ fontSize: '13px', color: '#9B2335', margin: 0 }}>{error}</p>
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
                      background: isSubmitting ? '#4A6FA5' : '#1E3A5F',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: 'white',
                      cursor: isSubmitting ? 'wait' : 'pointer',
                      transition: 'background 150ms ease, opacity 150ms ease',
                      opacity: !email ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.background = '#172D4B'; }}
                    onMouseLeave={(e) => { if (!isSubmitting) e.currentTarget.style.background = '#1E3A5F'; }}
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
                      <div style={{ marginBottom: '20px', padding: '10px 12px', background: '#FFF1F2', borderRadius: '8px', border: '1px solid #FFE4E6' }}>
                        <p style={{ fontSize: '13px', color: '#9B2335', margin: 0 }}>{error}</p>
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
                        background: '#1E3A5F',
                        fontSize: '15px',
                        fontWeight: '600',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'background 150ms ease, opacity 150ms ease',
                        opacity: otp.length !== 6 ? 0.6 : 1,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#172D4B'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#1E3A5F'; }}
                    >
                      Continue
                    </button>
                  </form>


                  <p style={{ textAlign: 'center', fontSize: '13px', color: '#667085', marginTop: '16px', marginBottom: 0 }}>
                    Didn't receive a code?{' '}
                    <span
                      onClick={handleResendOtp}
                      style={{ color: '#1E3A5F', fontWeight: '600', cursor: 'pointer' }}
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
                          background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#667085',
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
                              background: i < strength.score ? strengthColors[strength.score] : '#E5E7EB',
                              transition: 'background 200ms ease',
                            }}
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: '12px', color: strengthColors[strength.score], fontWeight: '500', whiteSpace: 'nowrap' }}>
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
                          background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#667085',
                        }}
                      >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div style={{ marginBottom: '20px', padding: '10px 12px', background: '#FFF1F2', borderRadius: '8px', border: '1px solid #FFE4E6' }}>
                      <p style={{ fontSize: '13px', color: '#9B2335', margin: 0 }}>{error}</p>
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
                      background: isSubmitting ? '#4A6FA5' : '#1E3A5F',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: 'white',
                      cursor: isSubmitting ? 'wait' : 'pointer',
                      transition: 'background 150ms ease, opacity 150ms ease',
                      opacity: (!newPassword || !confirmPassword) ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.background = '#172D4B'; }}
                    onMouseLeave={(e) => { if (!isSubmitting) e.currentTarget.style.background = '#1E3A5F'; }}
                  >
                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Footer link */}
            <div
              onClick={() => onNavigate('login')}
              style={{
                textAlign: 'center',
                fontSize: '13px',
                color: '#667085',
                marginTop: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to <span style={{ color: '#1E3A5F', fontWeight: '600' }}>Sign In</span></span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
