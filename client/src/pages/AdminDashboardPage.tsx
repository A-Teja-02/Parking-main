import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, LayoutGrid, CalendarRange } from 'lucide-react';
import { useAdminStore } from '../store/useAdminStore';
import { useParkingStore } from '../store/useParkingStore';
import { EmployeeManagement } from '../components/EmployeeManagement';
import { ParkingManagement } from '../components/ParkingManagement';
import { ReservationManagement } from '../components/ReservationManagement';

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'employees' | 'parking' | 'reservations'>('employees');
  
  const { fetchUsers, fetchAllReservations, fetchReservedSlots } = useAdminStore();
  const { fetchFloors, fetchSlots, fetchStatus } = useParkingStore();

  useEffect(() => {
    fetchUsers();
    fetchAllReservations();
    fetchReservedSlots();
    fetchFloors();
    fetchSlots();
    fetchStatus();
  }, [fetchUsers, fetchAllReservations, fetchReservedSlots, fetchFloors, fetchSlots, fetchStatus]);

  const tabs = [
    { id: 'employees', label: 'Employees', icon: <Users size={18} /> },
    { id: 'parking', label: 'Parking Lots', icon: <LayoutGrid size={18} /> },
    { id: 'reservations', label: 'Reservations', icon: <CalendarRange size={18} /> },
  ];

  return (
    <main
      style={{
        flex: 1,
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto',
        padding: '40px 24px 60px',
      }}
    >
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#101828', letterSpacing: '-0.02em' }}>
          HR Admin Dashboard
        </h1>
        <p style={{ fontSize: '15px', color: '#667085', marginTop: '4px' }}>
          Manage employees, parking configurations, and monitor system usage.
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          borderBottom: '1px solid #E4E7EC',
          paddingBottom: '16px',
          overflowX: 'auto',
          maxWidth: '100%',
          whiteSpace: 'nowrap',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '8px',
              background: activeTab === tab.id ? '#EEF2FF' : 'transparent',
              color: activeTab === tab.id ? '#1E3A5F' : '#667085',
              fontWeight: activeTab === tab.id ? '600' : '500',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'employees' && <EmployeeManagement />}
        {activeTab === 'parking' && <ParkingManagement />}
        {activeTab === 'reservations' && <ReservationManagement />}
      </motion.div>
    </main>
  );
}
