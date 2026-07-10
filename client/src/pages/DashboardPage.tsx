import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useParkingStore } from '../store/useParkingStore';
import { useAuthStore } from '../store/useAuthStore';
import { DashboardHeader } from '../components/DashboardHeader';
import { CountdownCard } from '../components/CountdownCard';
import { ParkingLot } from '../components/ParkingLot';
import { ReservationModal } from '../components/ReservationModal';
import { CancellationModal } from '../components/CancellationModal';
import { useMyReservation } from '../hooks/useReservations';
import { FloorTabs } from '../components/FloorTabs';
import { ManagerReleaseModal } from '../components/ManagerReleaseModal';
import { ReservationHistory } from '../components/ReservationHistory';

export function DashboardPage() {
  const { user } = useAuthStore();
  const { 
    tomorrowDate,
    todayDate,
    selectedDate,
    setSelectedDate,
    todayAvailability,
    fetchTodayAvailability,
    fetchFloors, 
    fetchSlots, 
    fetchReservations, 
    fetchManagerReleases,
    selectedFloorId,
    isLoading 
  } = useParkingStore();
  
  const myReservation = useMyReservation();

  useEffect(() => {
    fetchFloors();
    fetchTodayAvailability();
  }, [fetchFloors, fetchTodayAvailability]);

  useEffect(() => {
    fetchSlots(); // Always fetch all slots so that global statistics are correct
  }, [fetchSlots]);

  useEffect(() => {
    if (selectedDate) {
      fetchReservations(selectedDate);
      fetchManagerReleases(selectedDate);
      
      const interval = setInterval(() => {
        fetchSlots();
        fetchFloors();
        fetchReservations(selectedDate);
        fetchManagerReleases(selectedDate);
        fetchTodayAvailability();
      }, 30_000);
      return () => clearInterval(interval);
    }
  }, [selectedDate, fetchReservations, fetchManagerReleases, fetchSlots, fetchFloors, fetchTodayAvailability]);

  return (
    <>
      <main
        className="app-container"
        style={{
          flex: 1,
          margin: '0 auto',
          padding: '40px 24px 60px',
        }}
      >
        {isLoading && (
          <div
            style={{
              position: 'fixed',
              top: '64px',
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #1E3A5F, transparent)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              zIndex: 40,
            }}
          />
        )}
        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <DashboardHeader />

          {/* Today's Availability Alert Banner */}
          {selectedDate === tomorrowDate && todayAvailability && todayAvailability.available > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                border: '1px solid #10B981',
                borderRadius: '16px',
                padding: '16px 24px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#10B981', color: 'white', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={16} />
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#065F46', margin: 0 }}>Today's slots are available!</h4>
                  <p style={{ fontSize: '13px', color: '#047857', margin: '2px 0 0 0' }}>
                    There are <strong>{todayAvailability.available} / {todayAvailability.total}</strong> slots available for today.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDate(todayDate)}
                style={{
                  background: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(16, 185, 129, 0.15)',
                  transition: 'background-color 150ms',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#10B981'}
              >
                View & Book Today
              </button>
            </motion.div>
          )}

          {/* Viewing Today Banner */}
          {selectedDate === todayDate && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                border: '1px solid #BFDBFE',
                borderRadius: '16px',
                padding: '16px 24px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                boxShadow: '0 4px 15px rgba(30, 58, 95, 0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#1E3A5F', color: 'white', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={16} />
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1E3A5F', margin: 0 }}>Viewing Today's Parking Slots</h4>
                  <p style={{ fontSize: '13px', color: '#4A6FA5', margin: '2px 0 0 0' }}>
                    You are currently booking slots for <strong>today</strong>.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDate(tomorrowDate)}
                style={{
                  background: '#1E3A5F',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(30, 58, 95, 0.15)',
                  transition: 'background-color 150ms',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#172D4B'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#1E3A5F'}
              >
                Switch to Tomorrow
              </button>
            </motion.div>
          )}

          {myReservation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{
                background: 'linear-gradient(135deg, #EEF4FF 0%, #E0E7FF 100%)',
                border: '1px solid #C7D2FE',
                borderRadius: '12px',
                padding: '14px 20px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#1E3A5F',
                  flexShrink: 0,
                }}
              />
              <p style={{ fontSize: '14px', color: '#1E3A5F', fontWeight: '500' }}>
                You have a reservation for{' '}
                <strong>{myReservation.slot_id}</strong> on <strong>{myReservation.date}</strong>.{' '}
                <span style={{ color: '#4A6FA5' }}>Click your spot to release / cancel it.</span>
              </p>
            </motion.div>
          )}

          <CountdownCard />

          <div style={{ marginTop: '32px' }}>
            <FloorTabs />
            <ParkingLot />
          </div>
          
          <ReservationHistory />
        </motion.div>
      </main>

      <ReservationModal />
      <CancellationModal />
      <ManagerReleaseModal />
    </>
  );
}
