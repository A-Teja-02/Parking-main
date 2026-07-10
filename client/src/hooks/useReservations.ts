import { useAuthStore } from '../store/useAuthStore';
import { useParkingStore } from '../store/useParkingStore';
import type { SlotStatus, SlotState } from '../types';

export function useSlotStatus(): SlotStatus[] {
  const { user } = useAuthStore();
  const { slots, reservations, managerReleases, selectedDate, users } = useParkingStore();

  return slots.map((slot) => {
    const reservation = reservations.find((r) => r.slot_id === slot.id);
    const release = managerReleases.find((r) => r.slot_id === slot.id && r.release_date === selectedDate);
    
    let state: SlotState = 'available';

    if (slot.status !== 'active') {
      state = 'unavailable';
    } else if (slot.reserved_for_manager_id) {
      if (user?.role === 'manager' && slot.reserved_for_manager_id === user.id) {
        state = release ? 'released_manager' : 'mine';
      } else {
        state = release ? 'available' : 'reserved_manager';
      }
    }
    
    if (reservation && state !== 'unavailable' && state !== 'reserved_manager') {
      state = reservation.user_id === user?.id ? 'mine' : 'reserved_employee';
    }

    return { 
      slot, 
      state, 
      reservation,
      manager_id: slot.reserved_for_manager_id || undefined,
      manager_name: slot.reserved_for_manager_id
        ? users.find((u) => u.id === slot.reserved_for_manager_id)?.name
        : undefined,
    };
  });
}

export function useMyReservation() {
  const { user } = useAuthStore();
  const { reservations } = useParkingStore();
  return reservations.find((r) => r.user_id === user?.id) ?? null;
}

export function useAvailabilityCount() {
  const { slots, reservations, managerReleases, selectedDate, floors } = useParkingStore();
  
  // Get active floor IDs
  const activeFloorIds = new Set(floors.filter(f => f.is_active !== false).map(f => f.id));
  
  // Total is the count of all active slots on active floors
  const activeSlots = slots.filter(s => s.status === 'active' && activeFloorIds.has(s.floor_id));
  const total = activeSlots.length;

  // Reserved counts:
  // 1. All employee reservations on active floors
  const employeeReserved = reservations.filter(r => {
    const slot = slots.find(s => s.id === r.slot_id);
    return slot && slot.status === 'active' && activeFloorIds.has(slot.floor_id);
  }).length;

  // 2. All unreleased manager slots on active floors (since they cannot be booked by others)
  const unreleasedManagers = activeSlots.filter(s => {
    if (!s.reserved_for_manager_id) return false;
    const isReleased = managerReleases.some(r => r.slot_id === s.id && r.release_date === selectedDate);
    return !isReleased;
  }).length;

  const reserved = employeeReserved + unreleasedManagers;
  
  return { available: Math.max(0, total - reserved), total, reserved };
}
