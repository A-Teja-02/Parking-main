import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { Toast } from '../types';

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useAppStore();

  const config = {
    success: {
      icon: <CheckCircle size={16} />,
      bg: '#F0FDF4',
      border: '#DCFCE7',
      iconColor: '#2D6A4F',
      textColor: '#1B4332',
    },
    error: {
      icon: <XCircle size={16} />,
      bg: '#FFF1F2',
      border: '#FFE4E6',
      iconColor: '#9B2335',
      textColor: '#7F1D1D',
    },
    info: {
      icon: <Info size={16} />,
      bg: '#EEF2FF',
      border: '#C7D2FE',
      iconColor: '#4A6FA5',
      textColor: '#1E3A5F',
    },
  };

  const c = config[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: '12px',
        padding: '12px 14px',
        boxShadow: '0 8px 16px -4px rgba(16,24,40,0.12)',
        maxWidth: '360px',
        width: '100%',
        pointerEvents: 'all',
      }}
    >
      <span style={{ color: c.iconColor, flexShrink: 0 }}>{c.icon}</span>
      <span
        style={{
          fontSize: '13px',
          fontWeight: '500',
          color: c.textColor,
          flex: 1,
          lineHeight: '1.4',
        }}
      >
        {toast.message}
      </span>
      <button
        onClick={() => removeToast(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: c.iconColor,
          display: 'flex',
          alignItems: 'center',
          opacity: 0.6,
          padding: '2px',
          borderRadius: '4px',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
        aria-label="Dismiss"
      >
        <X size={13} />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const { toasts } = useAppStore();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: 'flex-end',
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
