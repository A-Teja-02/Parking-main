import { create } from 'zustand';
import { api } from '../services/api';
import { useAuthStore } from './useAuthStore';
import type { Floor, ParkingSlot, Reservation, ManagerRelease, User } from '../types';

interface ParkingState {
  floors: Floor[];
  slots: ParkingSlot[];
  reservations: Reservation[];
  managerReleases: ManagerRelease[];
  users: User[];
  selectedFloorId: string | null;
  isLoading: boolean;
  tomorrowDate: string;
  todayDate: string;
  selectedDate: string;
  isWeekend: boolean;
  todayAvailability: { available: number; total: number } | null;
  
  fetchFloors: () => Promise<void>;
  fetchSlots: (floorId?: string) => Promise<void>;
  fetchReservations: (date: string) => Promise<void>;
  fetchManagerReleases: (date: string) => Promise<void>;
  fetchStatus: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  setSelectedFloorId: (id: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  createReservation: (slotId: string, vehicleNumber: string) => Promise<void>;
  cancelReservation: (id: string) => Promise<void>;
  toggleFloorStatus: (id: string, is_active: boolean) => Promise<void>;
  setSelectedDate: (date: string) => void;
  fetchTodayAvailability: () => Promise<void>;
}

const getLocalDateString = (d: Date = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const useParkingStore = create<ParkingState>((set, get) => ({
  floors: [],
  slots: [],
  reservations: [],
  managerReleases: [],
  users: [],
  selectedFloorId: null,
  isLoading: false,
  tomorrowDate: '',
  todayDate: '',
  selectedDate: '',
  isWeekend: false,
  todayAvailability: null,

  fetchFloors: async () => {
    try {
      const floors = await api.floors.list();
      floors.sort((a, b) => a.order - b.order);
      set({ floors });
      if (floors.length > 0) {
        set((state) => ({ selectedFloorId: state.selectedFloorId || floors[0].id }));
      }
    } catch (err) {
      console.error('Failed to fetch floors', err);
    }
  },

  fetchSlots: async (floorId?: string) => {
    set({ isLoading: true });
    try {
      const slots = await api.slots.list(floorId);
      slots.sort((a, b) => a.position - b.position);
      set({ slots });
    } catch (err) {
      console.error('Failed to fetch slots', err);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchReservations: async (date: string) => {
    try {
      const reservations = await api.reservations.list(date);
      set({ reservations });
    } catch (err) {
      console.error('Failed to fetch reservations', err);
    }
  },

  fetchManagerReleases: async (date: string) => {
    try {
      const managerReleases = await api.slots.getReleases(date);
      set({ managerReleases });
    } catch (err) {
      console.error('Failed to fetch manager releases', err);
    }
  },

  fetchStatus: async () => {
    try {
      const status = await api.status.getSlotStatus();
      const todayStr = getLocalDateString();
      set({ 
        tomorrowDate: status.tomorrow, 
        todayDate: todayStr,
        selectedDate: get().selectedDate || status.tomorrow,
        isWeekend: status.is_weekend 
      });
    } catch (err) {
      console.error('Failed to fetch status', err);
    }
  },

  setSelectedFloorId: (id) => set({ selectedFloorId: id }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  fetchUsers: async () => {
    try {
      const users = await api.users.list();
      set({ users });
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  },

  createReservation: async (slotId, vehicleNumber) => {
    set({ isLoading: true });
    try {
      const { user } = useAuthStore.getState();
      const { selectedDate } = get();
      if (!user) throw new Error('Not authenticated');
      const newRes = await api.reservations.create({
        user_id: user.id,
        user_name: user.name,
        slot_id: slotId,
        vehicle_number: vehicleNumber,
        date: selectedDate,
      });
      set((state) => ({ reservations: [...state.reservations, newRes] }));
    } catch (err) {
      console.error('Failed to create reservation', err);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  cancelReservation: async (id) => {
    set({ isLoading: true });
    try {
      await api.reservations.cancel(id);
      set((state) => ({
        reservations: state.reservations.filter((r) => r.id !== id),
      }));
    } catch (err) {
      console.error('Failed to cancel reservation', err);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  toggleFloorStatus: async (id, is_active) => {
    try {
      await api.floors.toggleStatus(id, is_active);
      const floors = await api.floors.list();
      floors.sort((a, b) => a.order - b.order);
      set({ floors });
    } catch (err) {
      console.error('Failed to toggle floor status', err);
      throw err;
    }
  },

  setSelectedDate: (date) => set({ selectedDate: date }),

  fetchTodayAvailability: async () => {
    try {
      const todayStr = getLocalDateString();
      const [todayReservations, todayReleases, floors, slots] = await Promise.all([
        api.reservations.list(todayStr),
        api.slots.getReleases(todayStr),
        api.floors.list(),
        api.slots.list()
      ]);
      
      const activeFloorIds = new Set(floors.filter(f => f.is_active !== false).map(f => f.id));
      const activeSlots = slots.filter(s => s.status === 'active' && activeFloorIds.has(s.floor_id));
      const total = activeSlots.length;
      
      const employeeReserved = todayReservations.filter(r => {
        const slot = slots.find(s => s.id === r.slot_id);
        return slot && slot.status === 'active' && activeFloorIds.has(slot.floor_id);
      }).length;
      
      const unreleasedManagers = activeSlots.filter(s => {
        if (!s.reserved_for_manager_id) return false;
        const isReleased = todayReleases.some(r => r.slot_id === s.id && r.release_date === todayStr);
        return !isReleased;
      }).length;
      
      const reserved = employeeReserved + unreleasedManagers;
      const available = Math.max(0, total - reserved);
      
      set({ todayAvailability: { available, total } });
    } catch (err) {
      console.error('Failed to fetch today availability', err);
    }
  },
}));
