import { create } from "zustand";
import { DEFAULT_AGENT_PROMPTS } from "@/lib/db";
import db from "@/lib/db";
import type { AgentSystemPrompt, AppSettings } from "@/types";

interface SettingsStoreState {
  settings: AppSettings | null;
  agentPrompts: AgentSystemPrompt[];
  loadSettings: () => Promise<void>;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
  loadAgentPrompts: () => Promise<void>;
  updateAgentPrompt: (
    promptId: string,
    updates: Partial<AgentSystemPrompt>
  ) => Promise<void>;
  resetAgentPrompt: (promptId: string) => Promise<void>;
}

export const useSettingsStore = create<SettingsStoreState>((set) => ({
  settings: null,
  agentPrompts: [],
  loadSettings: async () => {
    const settings = await db.appSettings.get("app-settings");
    set({ settings: settings ?? null });
  },
  updateSettings: async (updates) => {
    const current = await db.appSettings.get("app-settings");
    if (!current) {
      return;
    }

    const nextSettings: AppSettings = {
      ...current,
      ...updates,
      updatedAt: Date.now()
    };

    await db.appSettings.put(nextSettings);
    set({ settings: nextSettings });
  },
  loadAgentPrompts: async () => {
    const agentPrompts = await db.agentSystemPrompts.toArray();
    set({ agentPrompts });
  },
  updateAgentPrompt: async (promptId, updates) => {
    const current = await db.agentSystemPrompts.get(promptId);
    if (!current) {
      return;
    }

    const nextPrompt: AgentSystemPrompt = {
      ...current,
      ...updates,
      updatedAt: Date.now()
    };

    await db.agentSystemPrompts.put(nextPrompt);
    set((state) => ({
      agentPrompts: state.agentPrompts.map((prompt) =>
        prompt.id === promptId ? nextPrompt : prompt
      )
    }));
  },
  resetAgentPrompt: async (promptId) => {
    const current = await db.agentSystemPrompts.get(promptId);
    if (!current) {
      return;
    }

    const defaultPrompt = DEFAULT_AGENT_PROMPTS.find(
      (prompt) => prompt.agentType === current.agentType
    );

    if (!defaultPrompt) {
      return;
    }

    const nextPrompt: AgentSystemPrompt = {
      ...current,
      label: defaultPrompt.label,
      content: defaultPrompt.content,
      isDefault: true,
      updatedAt: Date.now()
    };

    await db.agentSystemPrompts.put(nextPrompt);
    set((state) => ({
      agentPrompts: state.agentPrompts.map((prompt) =>
        prompt.id === promptId ? nextPrompt : prompt
      )
    }));
  }
}));
