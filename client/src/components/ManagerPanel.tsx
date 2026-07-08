import { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, CheckCircle, Clock } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useParkingStore } from '../store/useParkingStore';
import { useAppStore } from '../store/useAppStore';
import { api } from '../services/api';

export function ManagerPanel() {
  const { user } = useAuthStore();
  const { slots, managerReleases, tomorrowDate, fetchManagerReleases, isWeekend } = useParkingStore();
  const { addToast } = useAppStore();
  const [isReleasing, setIsReleasing] = useState(false);

  // Find manager's reserved slot across all floors
  const mySlot = slots.find(s => s.reserved_for_manager_id === user?.id);
  const release = managerReleases.find(r => r.slot_id === mySlot?.id && r.release_date === tomorrowDate);

  if (!mySlot) return null;

  const handleRelease = async () => {
    if (!tomorrowDate || isWeekend) return;
    
    setIsReleasing(true);
    try {
      await api.slots.release(mySlot.id, { date: tomorrowDate });
      await fetchManagerReleases(tomorrowDate);
      addToast({ type: 'success', message: 'Slot released successfully.' });
    } catch (err: any) {
      addToast({ type: 'error', message: err.message || 'Failed to release slot.' });
    } finally {
      setIsReleasing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: '#FFFFFF',
        border: '1px solid #E4E7EC',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '32px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <KeyRound size={20} color="#F59E0B" />
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#101828' }}>
              Your Reserved Slot: {mySlot.label}
            </h2>
          </div>
          <p style={{ fontSize: '14px', color: '#667085', maxWidth: '600px' }}>
            This slot is permanently assigned to you. If you are coming to the office tomorrow, no action is required. If you are not coming, please release your slot so others can use it.
          </p>
        </div>

        <div>
          {release ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#F0FDF4', borderRadius: '8px', border: '1px solid #DCFCE7' }}>
              <CheckCircle size={18} color="#059669" />
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#065F46' }}>Released for tomorrow</span>
            </div>
          ) : (
            <button
              onClick={handleRelease}
              disabled={isReleasing || isWeekend}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: isWeekend ? '#F3F4F6' : '#FFFFFF',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: isWeekend ? '#9CA3AF' : '#374151',
                cursor: (isReleasing || isWeekend) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              }}
              onMouseEnter={(e) => {
                if (!isReleasing && !isWeekend) {
                  e.currentTarget.style.background = '#F9FAFB';
                  e.currentTarget.style.borderColor = '#9CA3AF';
                }
              }}
              onMouseLeave={(e) => {
                if (!isReleasing && !isWeekend) {
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#D1D5DB';
                }
              }}
            >
              <Clock size={16} />
              {isReleasing ? 'Releasing...' : 'Release Parking'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
