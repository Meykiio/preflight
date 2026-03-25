import { describe, expect, it, beforeEach } from "vitest";
import { useUIStore } from "@/stores/uiStore";

describe("uiStore", () => {
  beforeEach(() => {
    // Reset store to default state before each test
    useUIStore.setState({
      sidebarCollapsed: false,
      activeTab: "projects",
      isCommandPaletteOpen: false,
      isOnboardingComplete: false,
      toasts: []
    });
  });

  describe("initial state", () => {
    it("has correct default values", () => {
      const state = useUIStore.getState();
      expect(state.sidebarCollapsed).toBe(false);
      expect(state.activeTab).toBe("projects");
      expect(state.isCommandPaletteOpen).toBe(false);
      expect(state.isOnboardingComplete).toBe(false);
      expect(state.toasts).toEqual([]);
    });
  });

  describe("setSidebarCollapsed", () => {
    it("sets sidebar to collapsed", () => {
      useUIStore.getState().setSidebarCollapsed(true);
      expect(useUIStore.getState().sidebarCollapsed).toBe(true);
    });

    it("sets sidebar to expanded", () => {
      useUIStore.getState().setSidebarCollapsed(false);
      expect(useUIStore.getState().sidebarCollapsed).toBe(false);
    });
  });

  describe("setActiveTab", () => {
    it("sets active tab", () => {
      useUIStore.getState().setActiveTab("brief");
      expect(useUIStore.getState().activeTab).toBe("brief");
    });

    it("changes active tab", () => {
      useUIStore.getState().setActiveTab("research");
      useUIStore.getState().setActiveTab("design");
      expect(useUIStore.getState().activeTab).toBe("design");
    });
  });

  describe("setCommandPaletteOpen", () => {
    it("opens command palette", () => {
      useUIStore.getState().setCommandPaletteOpen(true);
      expect(useUIStore.getState().isCommandPaletteOpen).toBe(true);
    });

    it("closes command palette", () => {
      useUIStore.getState().setCommandPaletteOpen(true);
      useUIStore.getState().setCommandPaletteOpen(false);
      expect(useUIStore.getState().isCommandPaletteOpen).toBe(false);
    });
  });

  describe("setOnboardingComplete", () => {
    it("marks onboarding as complete", () => {
      useUIStore.getState().setOnboardingComplete(true);
      expect(useUIStore.getState().isOnboardingComplete).toBe(true);
    });
  });

  describe("addToast", () => {
    it("adds a toast to the list", () => {
      const toast = { id: "1", title: "Test toast" };
      useUIStore.getState().addToast(toast);
      expect(useUIStore.getState().toasts).toHaveLength(1);
      expect(useUIStore.getState().toasts[0]).toEqual(toast);
    });

    it("adds multiple toasts", () => {
      useUIStore.getState().addToast({ id: "1", title: "First" });
      useUIStore.getState().addToast({ id: "2", title: "Second" });
      expect(useUIStore.getState().toasts).toHaveLength(2);
    });
  });

  describe("removeToast", () => {
    it("removes a toast by id", () => {
      useUIStore.getState().addToast({ id: "1", title: "First" });
      useUIStore.getState().addToast({ id: "2", title: "Second" });
      useUIStore.getState().removeToast("1");
      expect(useUIStore.getState().toasts).toHaveLength(1);
      expect(useUIStore.getState().toasts[0].id).toBe("2");
    });

    it("does nothing if toast not found", () => {
      useUIStore.getState().addToast({ id: "1", title: "First" });
      useUIStore.getState().removeToast("999");
      expect(useUIStore.getState().toasts).toHaveLength(1);
    });
  });
});
