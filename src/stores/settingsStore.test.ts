import { describe, expect, it, beforeEach, vi } from "vitest";
import { useSettingsStore } from "@/stores/settingsStore";
import db from "@/lib/db";
import { DEFAULT_AGENT_PROMPTS } from "@/lib/db";
import type { AppSettings, AgentSystemPrompt } from "@/types";

// Mock Dexie database and DEFAULT_AGENT_PROMPTS
vi.mock("@/lib/db", () => ({
  default: {
    appSettings: {
      get: vi.fn().mockResolvedValue(null),
      put: vi.fn().mockResolvedValue(undefined)
    },
    agentSystemPrompts: {
      toArray: vi.fn().mockResolvedValue([]),
      get: vi.fn().mockResolvedValue(null),
      put: vi.fn().mockResolvedValue(undefined)
    }
  },
  DEFAULT_AGENT_PROMPTS: [
    {
      agentType: "research",
      label: "Research Agent",
      content: "Default research content",
      isDefault: true
    }
  ]
}));

describe("settingsStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store to default state
    useSettingsStore.setState({
      settings: null,
      agentPrompts: []
    });
  });

  describe("initial state", () => {
    it("has correct default values", () => {
      const state = useSettingsStore.getState();
      expect(state.settings).toBe(null);
      expect(state.agentPrompts).toEqual([]);
    });
  });

  describe("loadSettings", () => {
    it("loads settings from database", async () => {
      const mockSettings: AppSettings = {
        id: "app-settings",
        theme: "dark",
        defaultProvider: "anthropic",
        enabledPlatformLaunchers: ["lovable"],
        streamingEnabled: true,
        userName: "Test User",
        isOnboardingComplete: true,
        updatedAt: Date.now()
      };

      (db.appSettings.get as any).mockResolvedValue(mockSettings);

      await useSettingsStore.getState().loadSettings();

      expect(useSettingsStore.getState().settings).toEqual(mockSettings);
      expect(db.appSettings.get).toHaveBeenCalledWith("app-settings");
    });

    it("sets settings to null if not found", async () => {
      (db.appSettings.get as any).mockResolvedValue(undefined);

      await useSettingsStore.getState().loadSettings();

      expect(useSettingsStore.getState().settings).toBe(null);
    });
  });

  describe("updateSettings", () => {
    it("does nothing if no current settings", async () => {
      (db.appSettings.get as any).mockResolvedValue(null);

      await useSettingsStore.getState().updateSettings({ theme: "light" });

      expect(db.appSettings.put).not.toHaveBeenCalled();
    });

    it("updates settings with new values", async () => {
      const currentSettings: AppSettings = {
        id: "app-settings",
        theme: "dark",
        defaultProvider: null,
        enabledPlatformLaunchers: [],
        streamingEnabled: true,
        userName: "",
        isOnboardingComplete: false,
        updatedAt: Date.now()
      };

      (db.appSettings.get as any).mockResolvedValue(currentSettings);

      await useSettingsStore.getState().updateSettings({
        theme: "light",
        userName: "New User"
      });

      expect(db.appSettings.put).toHaveBeenCalledWith(
        expect.objectContaining({
          theme: "light",
          userName: "New User"
        })
      );
    });

    it("updates updatedAt timestamp", async () => {
      const currentSettings: AppSettings = {
        id: "app-settings",
        theme: "dark",
        defaultProvider: null,
        enabledPlatformLaunchers: [],
        streamingEnabled: true,
        userName: "",
        isOnboardingComplete: false,
        updatedAt: Date.now()
      };

      (db.appSettings.get as any).mockResolvedValue(currentSettings);

      await useSettingsStore.getState().updateSettings({ theme: "light" });

      const callArg = (db.appSettings.put as any).mock.calls[0][0];
      expect(callArg.updatedAt).toBeDefined();
    });

    it("updates state with new settings", async () => {
      const currentSettings: AppSettings = {
        id: "app-settings",
        theme: "dark",
        defaultProvider: null,
        enabledPlatformLaunchers: [],
        streamingEnabled: true,
        userName: "",
        isOnboardingComplete: false,
        updatedAt: Date.now()
      };

      (db.appSettings.get as any).mockResolvedValue(currentSettings);

      await useSettingsStore.getState().updateSettings({ userName: "Test" });

      expect(useSettingsStore.getState().settings?.userName).toBe("Test");
    });
  });

  describe("loadAgentPrompts", () => {
    it("loads agent prompts from database", async () => {
      const mockPrompts: AgentSystemPrompt[] = [
        {
          id: "1",
          agentType: "research",
          label: "Research",
          content: "Content",
          isDefault: true,
          updatedAt: Date.now()
        }
      ];

      (db.agentSystemPrompts.toArray as any).mockResolvedValue(mockPrompts);

      await useSettingsStore.getState().loadAgentPrompts();

      expect(useSettingsStore.getState().agentPrompts).toEqual(mockPrompts);
    });
  });

  describe("updateAgentPrompt", () => {
    it("does nothing if prompt not found", async () => {
      (db.agentSystemPrompts.get as any).mockResolvedValue(undefined);

      await useSettingsStore.getState().updateAgentPrompt("1", {
        content: "New content"
      });

      expect(db.agentSystemPrompts.put).not.toHaveBeenCalled();
    });

    it("updates prompt with new values", async () => {
      const currentPrompt: AgentSystemPrompt = {
        id: "1",
        agentType: "research",
        label: "Research",
        content: "Original content",
        isDefault: true,
        updatedAt: Date.now()
      };

      (db.agentSystemPrompts.get as any).mockResolvedValue(currentPrompt);

      await useSettingsStore.getState().updateAgentPrompt("1", {
        content: "Updated content"
      });

      expect(db.agentSystemPrompts.put).toHaveBeenCalledWith(
        expect.objectContaining({
          content: "Updated content"
        })
      );
    });

    it("updates state with updated prompt", async () => {
      const currentPrompt: AgentSystemPrompt = {
        id: "1",
        agentType: "research",
        label: "Research",
        content: "Original",
        isDefault: true,
        updatedAt: Date.now()
      };

      useSettingsStore.setState({ agentPrompts: [currentPrompt] });
      (db.agentSystemPrompts.get as any).mockResolvedValue(currentPrompt);

      await useSettingsStore.getState().updateAgentPrompt("1", {
        content: "Updated"
      });

      expect(
        useSettingsStore.getState().agentPrompts[0].content
      ).toBe("Updated");
    });
  });

  describe("resetAgentPrompt", () => {
    it("does nothing if prompt not found", async () => {
      (db.agentSystemPrompts.get as any).mockResolvedValue(undefined);

      await useSettingsStore.getState().resetAgentPrompt("1");

      expect(db.agentSystemPrompts.put).not.toHaveBeenCalled();
    });

    it("resets prompt to default values", async () => {
      const currentPrompt: AgentSystemPrompt = {
        id: "1",
        agentType: "research",
        label: "Custom Label",
        content: "Custom content",
        isDefault: false,
        updatedAt: Date.now()
      };

      const defaultPrompt = {
        agentType: "research" as const,
        label: "Research Agent",
        content: "Default research content",
        isDefault: true
      };

      (db.agentSystemPrompts.get as any).mockResolvedValue(currentPrompt);
      
      // Mock the find method to return our default prompt
      vi.spyOn(DEFAULT_AGENT_PROMPTS, "find").mockReturnValue(defaultPrompt);

      await useSettingsStore.getState().resetAgentPrompt("1");

      expect(db.agentSystemPrompts.put).toHaveBeenCalledWith(
        expect.objectContaining({
          label: "Research Agent",
          content: "Default research content",
          isDefault: true
        })
      );
    });
  });
});
