import { create } from 'zustand';
import type { Toast, ParkingSlot } from '../types';

let toastId = 0;

interface UIState {
  toasts: Toast[];
  selectedSlot: ParkingSlot | null;
  showReservationModal: boolean;
  showCancellationModal: boolean;
  showChangePasswordModal: boolean;
  animatingSlot: string | null;

  setSelectedSlot: (slot: ParkingSlot | null) => void;
  setShowReservationModal: (show: boolean) => void;
  setShowCancellationModal: (show: boolean) => void;
  setShowChangePasswordModal: (show: boolean) => void;
  setAnimatingSlot: (slotId: string | null) => void;
  
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useAppStore = create<UIState>((set, get) => ({
  toasts: [],
  selectedSlot: null,
  showReservationModal: false,
  showCancellationModal: false,
  showChangePasswordModal: false,
  animatingSlot: null,

  setSelectedSlot: (slot) => set({ selectedSlot: slot }),
  setShowReservationModal: (show) => set({ showReservationModal: show }),
  setShowCancellationModal: (show) => set({ showCancellationModal: show }),
  setShowChangePasswordModal: (show) => set({ showChangePasswordModal: show }),
  setAnimatingSlot: (slotId) => set({ animatingSlot: slotId }),

  addToast: (toast) => {
    const id = String(++toastId);
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    setTimeout(() => get().removeToast(id), 4000);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

