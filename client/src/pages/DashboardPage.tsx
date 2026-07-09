import { useEffect } from 'react';
import { motion } from 'framer-motion';
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
  }, [fetchFloors]);

  useEffect(() => {
    fetchSlots(); // Always fetch all slots so that global statistics are correct
  }, [fetchSlots]);

  useEffect(() => {
    if (tomorrowDate) {
      fetchReservations(tomorrowDate);
      fetchManagerReleases(tomorrowDate);
      
      const interval = setInterval(() => {
        fetchSlots();
        fetchFloors();
        fetchReservations(tomorrowDate);
        fetchManagerReleases(tomorrowDate);
      }, 30_000);
      return () => clearInterval(interval);
    }
  }, [tomorrowDate, fetchReservations, fetchManagerReleases, fetchSlots, fetchFloors]);

  return (
    <>
      <main
        style={{
          flex: 1,
          maxWidth: '1280px',
          width: '100%',
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
                <strong>{myReservation.slot_id}</strong> tomorrow.{' '}
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
