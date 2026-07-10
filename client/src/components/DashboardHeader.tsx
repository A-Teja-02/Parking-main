import { Calendar, CheckCircle } from 'lucide-react';
import { useParkingStore } from '../store/useParkingStore';
import { useAvailabilityCount } from '../hooks/useReservations';
import { formatDisplayDate } from '../utils/date';

export function DashboardHeader() {
  const { selectedDate, todayDate } = useParkingStore();
  const { available, total } = useAvailabilityCount();
  const displayDate = formatDisplayDate(selectedDate);
  const isFullyBooked = available === 0;
  const isToday = selectedDate === todayDate;

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Date label */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '20px',
          background: isToday ? '#ECFDF5' : '#EEF2FF',
          border: `1px solid ${isToday ? '#A7F3D0' : '#C7D2FE'}`,
          marginBottom: '12px',
        }}
      >
        <Calendar size={12} color={isToday ? '#059669' : '#4A6FA5'} />
        <span style={{ fontSize: '12px', fontWeight: '500', color: isToday ? '#059669' : '#4A6FA5', letterSpacing: '0.02em' }}>
          {isToday ? 'TODAY' : 'TOMORROW'}
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
