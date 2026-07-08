import { Clock } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown';

export function CountdownCard() {
  const { formatted, isExpired } = useCountdown();

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E4E7EC',
        borderRadius: '14px',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 2px 0 rgba(16,24,40,0.05)',
        marginBottom: '32px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: isExpired ? '#FFF1F2' : '#F0FDF4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Clock size={18} color={isExpired ? '#9B2335' : '#2D6A4F'} />
        </div>
        <div>
          <p style={{ fontSize: '12px', fontWeight: '500', color: '#667085', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
            Reservation Window
          </p>
          <p style={{ fontSize: '14px', color: '#344054', marginTop: '1px' }}>
            {isExpired ? 'Reservations are now closed' : 'Closes at midnight tonight'}
          </p>
        </div>
      </div>

      {/* Countdown */}
      <div
        style={{
          fontFamily: '"SF Mono", "Fira Code", monospace',
          fontSize: '28px',
          fontWeight: '600',
          letterSpacing: '0.05em',
          color: isExpired ? '#9B2335' : '#1E3A5F',
          background: isExpired ? '#FFF1F2' : '#F8F9FA',
          padding: '8px 16px',
          borderRadius: '10px',
          border: `1px solid ${isExpired ? '#FFE4E6' : '#E4E7EC'}`,
        }}
      >
        {formatted}
      </div>
    </div>
  );
}
