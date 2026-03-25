import { create } from "zustand";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "error" | "success";
}

interface UIStoreState {
  sidebarCollapsed: boolean;
  activeTab: string;
  isCommandPaletteOpen: boolean;
  isOnboardingComplete: boolean;
  toasts: ToastItem[];
  setSidebarCollapsed: (isCollapsed: boolean) => void;
  setActiveTab: (tab: string) => void;
  setCommandPaletteOpen: (isOpen: boolean) => void;
  setOnboardingComplete: (isComplete: boolean) => void;
  addToast: (toast: ToastItem) => void;
  removeToast: (toastId: string) => void;
}

export const useUIStore = create<UIStoreState>((set) => ({
  sidebarCollapsed: false,
  activeTab: "projects",
  isCommandPaletteOpen: false,
  isOnboardingComplete: false,
  toasts: [],
  setSidebarCollapsed: (isCollapsed) => set({ sidebarCollapsed: isCollapsed }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setCommandPaletteOpen: (isOpen) => set({ isCommandPaletteOpen: isOpen }),
  setOnboardingComplete: (isComplete) =>
    set({ isOnboardingComplete: isComplete }),
  addToast: (toast) => set((state) => ({ toasts: [...state.toasts, toast] })),
  removeToast: (toastId) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== toastId)
    }))
}));
