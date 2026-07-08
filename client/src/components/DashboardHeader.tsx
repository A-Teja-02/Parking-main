import { Calendar, CheckCircle } from 'lucide-react';
import { useParkingStore } from '../store/useParkingStore';
import { useAvailabilityCount } from '../hooks/useReservations';
import { formatDisplayDate } from '../utils/date';

export function DashboardHeader() {
  const { tomorrowDate } = useParkingStore();
  const { available, total } = useAvailabilityCount();
  const displayDate = formatDisplayDate(tomorrowDate);
  const isFullyBooked = available === 0;

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Tomorrow label */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '20px',
          background: '#EEF2FF',
          border: '1px solid #C7D2FE',
          marginBottom: '12px',
        }}
      >
        <Calendar size={12} color="#4A6FA5" />
        <span style={{ fontSize: '12px', fontWeight: '500', color: '#4A6FA5', letterSpacing: '0.02em' }}>
          TOMORROW
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#101828',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
              marginBottom: '4px',
            }}
          >
            {displayDate}
          </h1>
          <p style={{ fontSize: '15px', color: '#667085', fontWeight: '400' }}>
            Reserve your parking slot for tomorrow's workday.
          </p>
        </div>

        {/* Availability pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '12px',
            background: isFullyBooked ? '#FFF1F2' : '#F0FDF4',
            border: `1px solid ${isFullyBooked ? '#FFE4E6' : '#DCFCE7'}`,
          }}
        >
          <CheckCircle
            size={16}
            color={isFullyBooked ? '#9B2335' : '#2D6A4F'}
          />
          <span
            style={{
              fontSize: '15px',
              fontWeight: '600',
              color: isFullyBooked ? '#9B2335' : '#2D6A4F',
            }}
          >
            {isFullyBooked ? 'Fully Booked' : `${available} / ${total} Available`}
          </span>
        </div>
      </div>
    </div>
  );
}
