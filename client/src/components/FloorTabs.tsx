import { motion } from 'framer-motion';
import { useParkingStore } from '../store/useParkingStore';

export function FloorTabs() {
  const { floors, selectedFloorId, setSelectedFloorId } = useParkingStore();

  if (floors.length <= 1) return null;

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        background: '#FFFFFF',
        padding: '6px',
        borderRadius: '12px',
        border: '1px solid #E4E7EC',
        width: 'fit-content',
      }}
    >
      {floors.map((floor) => {
        const isSelected = selectedFloorId === floor.id;
        return (
          <button
            key={floor.id}
            onClick={() => setSelectedFloorId(floor.id)}
            style={{
              position: 'relative',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: 'transparent',
              fontSize: '14px',
              fontWeight: isSelected ? '600' : '500',
              color: isSelected ? '#1E3A5F' : '#667085',
              cursor: 'pointer',
              transition: 'color 0.2s',
              zIndex: 1,
            }}
          >
            {isSelected && (
              <motion.div
                layoutId="activeTab"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: '#EEF2FF',
                  borderRadius: '8px',
                  zIndex: -1,
                }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            {floor.label}
          </button>
        );
      })}
    </div>
  );
}
