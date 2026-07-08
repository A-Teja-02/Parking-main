import { create } from 'zustand';
import { api } from '../services/api';
import type { User, Reservation } from '../types';

interface AdminState {
  users: User[];
  allReservations: Reservation[];
  reservedSlots: any[];
  isLoading: boolean;
  
  fetchUsers: () => Promise<void>;
  fetchAllReservations: (date?: string) => Promise<void>;
  fetchReservedSlots: () => Promise<void>;
  setIsLoading: (loading: boolean) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  users: [],
  allReservations: [],
  reservedSlots: [],
  isLoading: false,

  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const users = await api.users.list();
      set({ users });
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAllReservations: async (date?: string) => {
    set({ isLoading: true });
    try {
      const allReservations = await api.reservations.list(date);
      set({ allReservations });
    } catch (err) {
      console.error('Failed to fetch all reservations', err);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchReservedSlots: async () => {
    set({ isLoading: true });
    try {
      const reservedSlots = await api.slots.getReserved();
      set({ reservedSlots });
    } catch (err) {
      console.error('Failed to fetch reserved slots', err);
    } finally {
      set({ isLoading: false });
    }
  },

  setIsLoading: (loading) => set({ isLoading: loading }),
}));
