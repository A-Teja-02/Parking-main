import { create } from 'zustand';
import type { Toast, ParkingSlot } from '../types';

let toastId = 0;

interface UIState {
  currentView: 'dashboard' | 'profile';
  specialView: 'hr' | 'map';
  toasts: Toast[];
  selectedSlot: ParkingSlot | null;
  showReservationModal: boolean;
  showCancellationModal: boolean;
  showChangePasswordModal: boolean;
  showManagerReleaseModal: boolean;
  animatingSlot: string | null;

  setCurrentView: (view: 'dashboard' | 'profile') => void;
  setSpecialView: (view: 'hr' | 'map') => void;
  setSelectedSlot: (slot: ParkingSlot | null) => void;
  setShowReservationModal: (show: boolean) => void;
  setShowCancellationModal: (show: boolean) => void;
  setShowChangePasswordModal: (show: boolean) => void;
  setShowManagerReleaseModal: (show: boolean) => void;
  setAnimatingSlot: (slotId: string | null) => void;
  
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useAppStore = create<UIState>((set, get) => ({
  currentView: 'dashboard',
  specialView: 'hr',
  toasts: [],
  selectedSlot: null,
  showReservationModal: false,
  showCancellationModal: false,
  showChangePasswordModal: false,
  showManagerReleaseModal: false,
  animatingSlot: null,

  setCurrentView: (view) => set({ currentView: view }),
  setSpecialView: (view) => set({ specialView: view }),
  setSelectedSlot: (slot) => set({ selectedSlot: slot }),
  setShowReservationModal: (show) => set({ showReservationModal: show }),
  setShowCancellationModal: (show) => set({ showCancellationModal: show }),
  setShowChangePasswordModal: (show) => set({ showChangePasswordModal: show }),
  setShowManagerReleaseModal: (show) => set({ showManagerReleaseModal: show }),
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

