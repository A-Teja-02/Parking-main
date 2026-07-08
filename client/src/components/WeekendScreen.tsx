import { motion } from 'framer-motion';
import { getTodayDayName } from '../utils/date';

export function WeekendScreen() {
  const today = getTodayDayName();

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          textAlign: 'center',
          maxWidth: '440px',
        }}
      >
        {/* Illustration */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '32px',
            background: 'linear-gradient(135deg, #F3F4F6 0%, #E9EBF0 100%)',
            border: '2px solid #E4E7EC',
            margin: '0 auto 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            {/* Closed sign */}
            <rect x="6" y="12" width="48" height="36" rx="6" fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="2" />
            {/* Lock */}
            <rect x="22" y="28" width="16" height="14" rx="3" fill="#9CA3AF" />
            <path d="M23 28V24a7 7 0 0114 0v4" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="30" cy="34" r="2" fill="white" opacity="0.7" />
            {/* Calendar dots */}
            <circle cx="14" cy="10" r="2.5" fill="#9CA3AF" />
            <circle cx="46" cy="10" r="2.5" fill="#9CA3AF" />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div
            style={{
              display: 'inline-block',
              background: '#F3F4F6',
              border: '1px solid #E5E7EB',
              borderRadius: '20px',
              padding: '4px 14px',
              fontSize: '12px',
              fontWeight: '500',
              color: '#6B7280',
              letterSpacing: '0.04em',
              marginBottom: '16px',
            }}
          >
            {today.toUpperCase()}
          </div>

          <h1
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#101828',
              letterSpacing: '-0.02em',
              marginBottom: '12px',
              lineHeight: '1.25',
            }}
          >
            Parking Reservations Closed
          </h1>

          <p
            style={{
              fontSize: '15px',
              color: '#6B7280',
              lineHeight: '1.65',
              marginBottom: '32px',
            }}
          >
            Parking reservations are only available Sunday through Thursday.
            <br />
            Come back on Sunday to reserve your spot.
          </p>

          {/* Day indicators */}
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
              const isWeekend = day === 'Fri' || day === 'Sat';
              const isToday =
                (day === 'Fri' && new Date().getDay() === 5) ||
                (day === 'Sat' && new Date().getDay() === 6);
              return (
                <div
                  key={day}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: isToday ? '700' : '500',
                    background: isToday ? '#1F2937' : isWeekend ? '#FFF1F2' : '#F0FDF4',
                    color: isToday ? 'white' : isWeekend ? '#9B2335' : '#2D6A4F',
                    border: `1px solid ${isToday ? '#1F2937' : isWeekend ? '#FFE4E6' : '#DCFCE7'}`,
                  }}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
