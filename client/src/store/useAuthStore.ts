import { create } from 'zustand';
import { api } from '../services/api';
import type { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  isLoading: boolean;
  
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setUser: (user: User) => void;

  // Activation (first-time signup) — 3-step flow
  activateRequest: (email: string) => Promise<{ message: string }>;
  activateVerify: (email: string, otp: string) => Promise<string>;
  activateComplete: (name: string, email: string, otp: string, password: string, confirmPassword: string) => Promise<string>;

  // Password management
  forgotPassword: (email: string) => Promise<{ message: string }>;
  resetPassword: (email: string, otp: string, newPassword: string, confirmPassword: string) => Promise<string>;
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<string>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('auth_token'),
  isAuthenticated: !!localStorage.getItem('auth_token'),
  role: null,
  isLoading: true,

  login: async (email, password) => {
    const data = await api.auth.login({ email, password });
    localStorage.setItem('auth_token', data.token);
    set({ 
      user: data.user, 
      token: data.token, 
      isAuthenticated: true, 
      role: data.user.role 
    });
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    set({ user: null, token: null, isAuthenticated: false, role: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }

    try {
      const user = await api.auth.me();
      set({ user, isAuthenticated: true, role: user.role, isLoading: false });
    } catch {
      localStorage.removeItem('auth_token');
      set({ user: null, token: null, isAuthenticated: false, role: null, isLoading: false });
    }
  },

  setUser: (user) => set({ user, role: user.role }),

  // ─── Activation (First-Time Signup) ────────────────────────────

  activateRequest: async (email) => {
    const result = await api.auth.activateRequest({ email });
    return result;
  },

  activateVerify: async (email, otp) => {
    const result = await api.auth.activateVerify({ email, otp });
    return result.message;
  },

  activateComplete: async (name, email, otp, password, confirmPassword) => {
    const result = await api.auth.activateComplete({
      name,
      email,
      otp,
      password,
      confirm_password: confirmPassword,
    });
    return result.message;
  },

  // ─── Password Management ──────────────────────────────────────

  forgotPassword: async (email) => {
    const result = await api.auth.forgotPassword({ email });
    return result;
  },

  resetPassword: async (email, otp, newPassword, confirmPassword) => {
    const result = await api.auth.resetPassword({
      email,
      otp,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
    return result.message;
  },

  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    const result = await api.auth.changePassword({
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
    return result.message;
  },
}));
