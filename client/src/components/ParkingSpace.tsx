import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import type { SlotStatus } from '../types';

interface CarIconProps {
  color?: string;
  size?: number;
}

function CarIcon({ color = '#1E3A5F', size = 52 }: CarIconProps) {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 80 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="20" width="72" height="22" rx="4" fill={color} opacity="0.95" />
      <path d="M18 20 L26 6 Q28 4 32 4 L48 4 Q52 4 54 6 L62 20Z" fill={color} />
      <path d="M22 20 L28 9 Q29.5 7 32 7 L48 7 Q50.5 7 52 9 L58 20Z" fill="white" opacity="0.25" />
      <path d="M22 20 L28 10 L36 10 L36 20Z" fill="white" opacity="0.15" />
      <path d="M58 20 L52 10 L44 10 L44 20Z" fill="white" opacity="0.15" />
      <circle cx="60" cy="42" r="6" fill="#1a1a2e" />
      <circle cx="60" cy="42" r="3" fill="#6b7280" />
      <circle cx="20" cy="42" r="6" fill="#1a1a2e" />
      <circle cx="20" cy="42" r="3" fill="#6b7280" />
      <rect x="68" y="24" width="6" height="5" rx="1.5" fill="#FCD34D" opacity="0.9" />
      <rect x="6" y="24" width="6" height="5" rx="1.5" fill="#EF4444" opacity="0.9" />
      <rect x="68" y="31" width="6" height="3" rx="1" fill="white" opacity="0.3" />
    </svg>
  );
}

interface ParkingSpaceProps {
  slotStatus: SlotStatus;
  isAnimating: boolean;
  onAvailableClick: () => void;
  onMySpotClick: () => void;
}

export function ParkingSpace({
  slotStatus,
  isAnimating,
  onAvailableClick,
  onMySpotClick,
}: ParkingSpaceProps) {
  const { slot, state, reservation, manager_name } = slotStatus;
  const { user } = useAuthStore();
  const isMySlot = slot.reserved_for_manager_id === user?.id;
  const isClickable = user?.role === 'manager'
    ? isMySlot
    : (state === 'available' || state === 'mine' || state === 'released_manager');

  const styles = {
    available: {
      background: '#FAFFFE',
      border: '2px solid #2D6A4F',
      labelColor: '#2D6A4F',
      labelBg: '#F0FDF4',
      cursor: 'pointer',
    },
    reserved_employee: {
      background: '#FFF5F5',
      border: '2px solid #FCA5A5',
      labelColor: '#9B2335',
      labelBg: '#FFF1F2',
      cursor: 'not-allowed',
    },
    reserved_manager: {
      background: '#FFFBEB',
      border: '2px solid #FCD34D',
      labelColor: '#92400E',
      labelBg: '#FEF3C7',
      cursor: 'not-allowed',
    },
    released_manager: {
      background: '#FAFFFE',
      border: '2px solid #2D6A4F',
      labelColor: '#2D6A4F',
      labelBg: '#F0FDF4',
      cursor: 'pointer',
    },
    mine: {
      background: '#EEF4FF',
      border: '2px solid #1E3A5F',
      labelColor: '#1E3A5F',
      labelBg: '#E0E7FF',
      cursor: 'pointer',
    },
    maintenance: {
      background: '#F9FAFB',
      border: '2px solid #D1D5DB',
      labelColor: '#9CA3AF',
      labelBg: '#F3F4F6',
      cursor: 'not-allowed',
    },
    unavailable: {
      background: '#F3F4F6',
      border: '2px solid #E5E7EB',
      labelColor: '#6B7280',
      labelBg: '#E5E7EB',
      cursor: 'not-allowed',
    },
    occupied: {
      background: '#F3F4F6',
      border: '2px solid #9CA3AF',
      labelColor: '#374151',
      labelBg: '#E5E7EB',
      cursor: 'not-allowed',
    }
  };

  const baseStyle = styles[state] || styles.unavailable;
  const s = {
    ...baseStyle,
    cursor: (user?.role === 'manager' && !isMySlot) ? 'not-allowed' : baseStyle.cursor
  };
  const isReserved = state === 'reserved_employee' || state === 'reserved_manager';

  return (
    <motion.div
      id={`parking-space-${slot.id}`}
      onClick={isClickable ? (state === 'mine' ? onMySpotClick : onAvailableClick) : undefined}
      style={{
        position: 'relative',
        background: s.background,
        border: s.border,
        borderRadius: '12px',
        padding: '24px 16px',
        cursor: s.cursor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        minHeight: '190px',
        justifyContent: 'space-between',
        transition: 'box-shadow 200ms ease, transform 200ms ease',
        boxShadow: state === 'mine'
          ? '0 0 0 3px rgba(30, 58, 95, 0.12), 0 4px 8px rgba(30, 58, 95, 0.08)'
          : '0 1px 3px rgba(16,24,40,0.06)',
        userSelect: 'none',
      }}
      whileHover={
        isClickable
          ? { y: -3, boxShadow: state === 'mine'
              ? '0 0 0 3px rgba(30, 58, 95, 0.15), 0 8px 16px rgba(30, 58, 95, 0.12)'
              : '0 6px 16px rgba(16,24,40,0.12)'
            }
          : {}
      }
      whileTap={isClickable ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
    >
      {state === 'mine' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            position: 'absolute',
            top: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1E3A5F',
            color: 'white',
            fontSize: '10px',
            fontWeight: '600',
            letterSpacing: '0.05em',
            padding: '3px 10px',
            borderRadius: '20px',
            whiteSpace: 'nowrap',
          }}
        >
          YOUR SPOT
        </motion.div>
      )}
      
      {state === 'reserved_manager' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            position: 'absolute',
            top: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#F59E0B',
            color: 'white',
            fontSize: '10px',
            fontWeight: '600',
            letterSpacing: '0.05em',
            padding: '3px 10px',
            borderRadius: '20px',
            whiteSpace: 'nowrap',
          }}
        >
          MANAGER
        </motion.div>
      )}

      <div
        style={{
          fontSize: '13px',
          fontWeight: '700',
          color: s.labelColor,
          background: s.labelBg,
          padding: '4px 12px',
          borderRadius: '20px',
          letterSpacing: '0.05em',
        }}
      >
        {slot.label}
      </div>

      <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          {isReserved && !isAnimating && (
            <motion.div
              key="reserved-car"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <CarIcon color={state === 'reserved_manager' ? '#F59E0B' : '#9B2335'} size={48} />
            </motion.div>
          )}

          {state === 'mine' && !isAnimating && (
            <motion.div
              key="mine-car"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <CarIcon color="#1E3A5F" size={52} />
            </motion.div>
          )}

          {isAnimating && state !== 'available' && state !== 'released_manager' && (
            <motion.div
              key="parking-car"
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <CarIcon color="#1E3A5F" size={52} />
            </motion.div>
          )}

          {isAnimating && (state === 'available' || state === 'released_manager') && (
            <motion.div
              key="leaving-car"
              initial={{ x: 0, opacity: 1 }}
              animate={{ x: -80, opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <CarIcon color="#2D6A4F" size={48} />
            </motion.div>
          )}

          {(state === 'available' || state === 'released_manager') && !isAnimating && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
            >
              <svg width="40" height="28" viewBox="0 0 40 28" fill="none">
                <rect
                  x="2" y="2" width="36" height="24" rx="4"
                  stroke="#2D6A4F" strokeWidth="1.5" strokeDasharray="4 3"
                  fill="none" opacity="0.4"
                />
                <text x="20" y="17" textAnchor="middle" fontSize="9" fill="#2D6A4F" opacity="0.5" fontWeight="500">
                  OPEN
                </text>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        style={{
          fontSize: '12px',
          fontWeight: '500',
          color: s.labelColor,
          letterSpacing: '0.02em',
          textAlign: 'center'
        }}
      >
        {(state === 'available' || state === 'released_manager') && 'Available'}
        {state === 'reserved_employee' && (
          <>
            <div style={{ fontWeight: '600', color: '#9B2335', fontSize: '11px', lineHeight: 1.3, textAlign: 'center' }}>
              {reservation?.user_name || 'Reserved'}
            </div>
            {reservation && (
              <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '2px', fontFamily: 'monospace', letterSpacing: '0.03em' }}>
                {reservation.vehicle_number}
              </div>
            )}
          </>
        )}
        {state === 'reserved_manager' && (
          <div style={{ fontWeight: '600', color: '#92400E', fontSize: '11px', lineHeight: 1.3, textAlign: 'center' }}>
            {manager_name || 'Manager'}
          </div>
        )}
        {state === 'mine' && (
          <>
            <div style={{ color: '#1E3A5F' }}>My Reservation</div>
            {reservation && (
              <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '2px', fontFamily: 'monospace', letterSpacing: '0.03em' }}>
                {reservation.vehicle_number}
              </div>
            )}
          </>
        )}
        {state === 'maintenance' && 'Maintenance'}
        {state === 'unavailable' && 'Unavailable'}
      </div>

      {(state === 'available' || state === 'released_manager') && isClickable && (
        <div style={{ position: 'absolute', bottom: '8px', right: '8px', fontSize: '10px', color: '#9CA3AF' }}>
          Click to reserve
        </div>
      )}
    </motion.div>
  );
}
