import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, X, Check } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';

function getPasswordStrength(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  return score;
}

const strengthLabels = ['Too short', 'Weak', 'Fair', 'Strong', 'Very strong'];
const strengthColors = [
  ['#E5E7EB', '#E5E7EB', '#E5E7EB', '#E5E7EB'],
  ['#EF4444', '#E5E7EB', '#E5E7EB', '#E5E7EB'],
  ['#F59E0B', '#F59E0B', '#E5E7EB', '#E5E7EB'],
  ['#22C55E', '#22C55E', '#22C55E', '#E5E7EB'],
  ['#10B981', '#10B981', '#10B981', '#10B981'],
];

const inputBaseStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  paddingRight: '44px',
  borderRadius: '10px',
  border: '1px solid #D1D5DB',
  fontSize: '14px',
  color: '#101828',
  background: '#FFFFFF',
  outline: 'none',
  transition: 'border-color 150ms ease, box-shadow 150ms ease',
  boxSizing: 'border-box',
};

const toggleButtonStyle: React.CSSProperties = {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#9CA3AF',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export function ChangePasswordModal() {
  const { changePassword, user } = useAuthStore();
  const { showChangePasswordModal, setShowChangePasswordModal, addToast } = useAppStore();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    setError('');
    setLoading(false);
    setFocusedField(null);
  };

  const handleClose = () => {
    setShowChangePasswordModal(false);
    resetForm();
  };

  const validate = (): string | null => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return 'All fields are required.';
    }
    if (newPassword.length < 8) {
      return 'New password must be at least 8 characters.';
    }
    if (!/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword)) {
      return 'New password must contain both lowercase (a-z) and uppercase (A-Z) letters.';
    }
    if (!/\d/.test(newPassword) && !/[^a-zA-Z0-9]/.test(newPassword)) {
      return 'New password must contain at least one number (0-9) or symbol.';
    }
    if (user && newPassword.toLowerCase().includes(user.email.toLowerCase())) {
      return 'New password must not contain your email address.';
    }
    if (['123456', '12345678', 'password', 'qwerty', 'admin123', 'quadrant'].includes(newPassword.toLowerCase())) {
      return 'New password is too common or easily guessed.';
    }
    if (newPassword !== confirmPassword) {
      return 'New password and confirmation do not match.';
    }
    if (newPassword === currentPassword) {
      return 'New password must be different from the current password.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const message = await changePassword(currentPassword, newPassword, confirmPassword);
      addToast({ type: 'success', message });
      handleClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to change password.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(newPassword);
  const colors = strengthColors[strength];
  const label = strengthLabels[strength];

  const constraints = [
    {
      label: 'contains at least 8 characters',
      isMet: newPassword.length >= 8,
    },
    {
      label: 'contains both lower (a-z) and upper case letters (A-Z)',
      isMet: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword),
    },
    {
      label: 'contains at least one number (0-9) or a symbol',
      isMet: /\d/.test(newPassword) || /[^a-zA-Z0-9]/.test(newPassword),
    },
    {
      label: 'does not contain your email address',
      isMet: !user || !newPassword.toLowerCase().includes(user.email.toLowerCase()),
    },
    {
      label: 'is not commonly used',
      isMet: !['123456', '12345678', 'password', 'qwerty', 'admin123', 'quadrant'].includes(newPassword.toLowerCase()),
    },
  ];

  const getFocusStyle = (field: string): React.CSSProperties =>
    focusedField === field
      ? { borderColor: '#1E3A5F', boxShadow: '0 0 0 3px rgba(30,58,95,0.1)' }
      : {};

  return (
    <AnimatePresence>
      {showChangePasswordModal && (
        <div
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '440px',
              width: 'calc(100% - 48px)',
              background: 'white',
              borderRadius: '20px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '24px',
                borderBottom: '1px solid #E4E7EC',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#1E3A5F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Lock size={20} color="#FFFFFF" />
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: '#101828' }}>
                    Change Password
                  </div>
                  <div style={{ fontSize: '13px', color: '#667085', marginTop: '2px' }}>
                    Update your password to keep your account secure.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#344054')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {error && (
                  <div
                    style={{
                      background: '#FFF1F2',
                      border: '1px solid #FFE4E6',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      color: '#9B2335',
                      fontSize: '13px',
                      marginBottom: '0px',
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* Current Password */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#344054',
                      marginBottom: '6px',
                    }}
                  >
                    Current Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      disabled={loading}
                      onFocus={() => setFocusedField('current')}
                      onBlur={() => setFocusedField(null)}
                      style={{ ...inputBaseStyle, ...getFocusStyle('current') }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      style={toggleButtonStyle}
                      tabIndex={-1}
                    >
                      {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#344054',
                      marginBottom: '6px',
                    }}
                  >
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      disabled={loading}
                      onFocus={() => setFocusedField('new')}
                      onBlur={() => setFocusedField(null)}
                      style={{ ...inputBaseStyle, ...getFocusStyle('new') }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      style={toggleButtonStyle}
                      tabIndex={-1}
                    >
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {/* Strength Indicator */}
                  {newPassword.length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {colors.map((color, i) => (
                          <div
                            key={i}
                            style={{
                              flex: 1,
                              height: '4px',
                              borderRadius: '2px',
                              background: color,
                              transition: 'background 200ms ease',
                            }}
                          />
                        ))}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#667085',
                          marginTop: '4px',
                        }}
                      >
                        {label}
                      </div>
                    </div>
                  )}

                  {/* Password Constraints List */}
                  <div
                    style={{
                      marginTop: '12px',
                      background: '#FFFDFD',
                      border: '1px solid #FEE2E2',
                      borderRadius: '12px',
                      padding: '12px 16px',
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                      Create a password that:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {constraints.map((c, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '12px',
                            color: c.isMet ? '#059669' : '#DC2626',
                            transition: 'color 150ms ease',
                          }}
                        >
                          {c.isMet ? (
                            <Check size={14} style={{ color: '#059669', flexShrink: 0 }} />
                          ) : (
                            <X size={14} style={{ color: '#DC2626', flexShrink: 0 }} />
                          )}
                          <span>{c.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#344054',
                      marginBottom: '6px',
                    }}
                  >
                    Confirm New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      disabled={loading}
                      onFocus={() => setFocusedField('confirm')}
                      onBlur={() => setFocusedField(null)}
                      style={{ ...inputBaseStyle, ...getFocusStyle('confirm') }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      style={toggleButtonStyle}
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: '16px 24px',
                  borderTop: '1px solid #E4E7EC',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                }}
              >
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: '1px solid #D1D5DB',
                    background: 'white',
                    color: '#344054',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: loading ? 'default' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#1E3A5F',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: loading ? 'default' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    transition: 'background 150ms ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.background = '#172D4B';
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) e.currentTarget.style.background = '#1E3A5F';
                  }}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
