import { motion } from 'framer-motion';
import { useParkingStore } from '../store/useParkingStore';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';

export function FloorTabs() {
  const { floors, selectedFloorId, setSelectedFloorId, toggleFloorStatus } = useParkingStore();
  const { user } = useAuthStore();
  const { addToast } = useAppStore();

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
        maxWidth: '100%',
        overflowX: 'auto',
        alignItems: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      {floors.map((floor) => {
        const isSelected = selectedFloorId === floor.id;
        return (
          <div key={floor.id} style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => setSelectedFloorId(floor.id)}
              style={{
                position: 'relative',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                fontSize: '14px',
                fontWeight: isSelected ? '600' : '500',
                color: isSelected ? '#1E3A5F' : (floor.is_active === false ? '#9CA3AF' : '#667085'),
                cursor: 'pointer',
                transition: 'color 0.2s',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
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
              {floor.is_active === false && (
                <span style={{ fontSize: '10px', background: '#FEF2F2', color: '#991B1B', padding: '2px 6px', borderRadius: '10px' }}>Closed</span>
              )}
            </button>
            {user?.role === 'hr' && (
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: '4px', marginRight: '8px' }}>
                <button
                  type="button"
                  onClick={async () => {
                    const nextActive = !(floor.is_active ?? true);
                    try {
                      await toggleFloorStatus(floor.id, nextActive);
                      addToast({ type: 'success', message: `Floor ${floor.label} ${nextActive ? 'enabled' : 'disabled'}` });
                    } catch (err) {
                      addToast({ type: 'error', message: 'Failed to update floor status' });
                    }
                  }}
                  style={{
                    position: 'relative',
                    width: '32px',
                    height: '18px',
                    borderRadius: '9px',
                    background: (floor.is_active ?? true) ? '#059669' : '#D1D5DB',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title={(floor.is_active ?? true) ? "Disable floor" : "Enable floor"}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: (floor.is_active ?? true) ? '15px' : '2px',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      transition: 'left 0.2s'
                    }}
                  />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
