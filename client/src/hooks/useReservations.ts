import { useAuthStore } from '../store/useAuthStore';
import { useParkingStore } from '../store/useParkingStore';
import type { SlotStatus, SlotState } from '../types';

export function useSlotStatus(): SlotStatus[] {
  const { user } = useAuthStore();
  const { slots, reservations, managerReleases, tomorrowDate } = useParkingStore();

  return slots.map((slot) => {
    const reservation = reservations.find((r) => r.slot_id === slot.id);
    const release = managerReleases.find((r) => r.slot_id === slot.id && r.release_date === tomorrowDate);
    
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
      manager_id: slot.reserved_for_manager_id || undefined
    };
  });
}

export function useMyReservation() {
  const { user } = useAuthStore();
  const { reservations } = useParkingStore();
  return reservations.find((r) => r.user_id === user?.id) ?? null;
}

export function useAvailabilityCount() {
  const { slots, reservations, managerReleases, tomorrowDate } = useParkingStore();
  
  const activeSlots = slots.filter(s => s.status === 'active');
  const employeeSlots = activeSlots.filter(s => {
    if (!s.reserved_for_manager_id) return true;
    const isReleased = managerReleases.some(r => r.slot_id === s.id && r.release_date === tomorrowDate);
    return isReleased;
  });

  const total = employeeSlots.length;
  const reserved = reservations.length;
  
  return { available: total - reserved, total, reserved };
}
