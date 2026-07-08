import { useSlotStatus } from '../hooks/useReservations';
import { useAppStore } from '../store/useAppStore';
import { useParkingStore } from '../store/useParkingStore';
import { ParkingSpace } from './ParkingSpace';

export function ParkingLot() {
  const statuses = useSlotStatus();
  const { selectedFloorId } = useParkingStore();
  const { animatingSlot, setSelectedSlot, setShowReservationModal, setShowCancellationModal } = useAppStore();

  const handleAvailableClick = (slot: any) => {
    setSelectedSlot(slot);
    setShowReservationModal(true);
  };

  const handleMySpotClick = (slot: any) => {
    setSelectedSlot(slot);
    setShowCancellationModal(true);
  };
  
  if (!selectedFloorId) return null;

  const floorSlots = statuses.filter(s => s.slot.floor_id === selectedFloorId);

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E4E7EC',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 12px 24px -8px rgba(16, 24, 40, 0.05)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '24px',
        }}
      >
        {floorSlots.map((status) => (
          <ParkingSpace
            key={status.slot.id}
            slotStatus={status}
            isAnimating={animatingSlot === status.slot.id}
            onAvailableClick={() => handleAvailableClick(status.slot)}
            onMySpotClick={() => handleMySpotClick(status.slot)}
          />
        ))}
      </div>
    </div>
  );
}
