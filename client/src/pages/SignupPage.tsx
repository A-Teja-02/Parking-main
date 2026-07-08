import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Eye, EyeOff, Mail, ShieldCheck, Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import { COMPANY_NAME, APP_NAME } from '../constants';

interface SignupPageProps {
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

const ALLOWED_DOMAIN = 'gmail.com';

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

export function SignupPage({ onNavigate }: SignupPageProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { activateRequest, activateVerify, activateComplete } = useAuthStore();
  const { addToast } = useAppStore();

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  // ── Step 1: Enter Name and Email ──
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || isSubmitting) return;

    // Client-side domain validation
    if (!email.endsWith(`@${ALLOWED_DOMAIN}`)) {
      setError(`Only @${ALLOWED_DOMAIN} emails are allowed.`);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = await activateRequest(email);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Step 2: Verify OTP ──
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6 || isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      await activateVerify(email, otp);
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Step 3: Set Password ──
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword || isSubmitting) return;

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
      setError('Password must contain uppercase, lowercase, and a number.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const message = await activateComplete(name, email, otp, password, confirmPassword);
      addToast({ type: 'success', message });
      onNavigate('login');
    } catch (err: any) {
      setError(err.message || 'Activation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Resend OTP ──
  const handleResendOtp = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const result = await activateRequest(email);
      setOtp('');
      addToast({ type: 'success', message: 'A new OTP has been sent.' });
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitles = ['Enter Email', 'Verify OTP', 'Set Password'];
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
            Activate your employee account to start reserving parking spots.
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
                {step === 1 ? 'Activate Account' : step === 2 ? 'Verify Email' : 'Create Password'}
              </h2>
              <p style={{ fontSize: '15px', color: '#667085', marginTop: '6px' }}>
                {step === 1
                  ? 'Enter your official company email to get started'
                  : step === 2
                    ? `Enter the 6-digit code sent to ${email}`
                    : 'Set a secure password for your account'}
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
                <form onSubmit={handleEmailSubmit}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => { setName(e.target.value); setError(''); }}
                      placeholder="John Doe"
                      style={inputBaseStyle}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      autoFocus
                    />
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={labelStyle}>Official Company Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      placeholder={`your.name@${ALLOWED_DOMAIN}`}
                      style={inputBaseStyle}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                    <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '6px' }}>
                      Only @{ALLOWED_DOMAIN} emails are accepted
                    </p>
                  </div>

                  {error && (
                    <div style={{ marginBottom: '20px', padding: '10px 12px', background: '#FFF1F2', borderRadius: '8px', border: '1px solid #FFE4E6' }}>
                      <p style={{ fontSize: '13px', color: '#9B2335', margin: 0 }}>{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || !email || !name}
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
                      opacity: (!email || !name) ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.background = '#172D4B'; }}
                    onMouseLeave={(e) => { if (!isSubmitting) e.currentTarget.style.background = '#1E3A5F'; }}
                  >
                    {isSubmitting ? 'Sending OTP...' : 'Send Verification Code'}
                  </button>
                </form>
              )}

              {/* ── Step 2: OTP ── */}
              {step === 2 && (
                <>
                  <form onSubmit={handleOtpSubmit}>
                    <div style={{ marginBottom: '24px' }}>
                      <label style={labelStyle}>6-Digit OTP Code</label>
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
                      disabled={isSubmitting || otp.length !== 6}
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
                        opacity: otp.length !== 6 ? 0.6 : 1,
                      }}
                      onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.background = '#172D4B'; }}
                      onMouseLeave={(e) => { if (!isSubmitting) e.currentTarget.style.background = '#1E3A5F'; }}
                    >
                      {isSubmitting ? 'Verifying...' : 'Verify Code'}
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

              {/* ── Step 3: Password ── */}
              {step === 3 && (
                <form onSubmit={handlePasswordSubmit}>
                  <div style={{ marginBottom: '8px' }}>
                    <label style={labelStyle}>New Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
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

                  {/* Strength indicator */}
                  {password.length > 0 && (
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

                  <div style={{ marginBottom: '24px', marginTop: password.length === 0 ? '12px' : undefined }}>
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
                    disabled={isSubmitting || !password || !confirmPassword}
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
                      opacity: (!password || !confirmPassword) ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.background = '#172D4B'; }}
                    onMouseLeave={(e) => { if (!isSubmitting) e.currentTarget.style.background = '#1E3A5F'; }}
                  >
                    {isSubmitting ? 'Activating...' : 'Activate Account'}
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
