import { useLiveQuery } from "dexie-react-hooks";
import { DEFAULT_AGENT_PROMPTS } from "@/lib/db";
import db from "@/lib/db";
import type { AgentSystemPrompt } from "@/types";

export const useAgentPrompts = () => {
  const promptsQuery = useLiveQuery(
    async () => db.agentSystemPrompts.toArray(),
    []
  );

  const prompts = promptsQuery ?? [];
  const isLoading = promptsQuery === undefined;

  const updatePrompt = async (
    promptId: string,
    updates: Partial<AgentSystemPrompt>
  ): Promise<AgentSystemPrompt | null> => {
    try {
      const current = await db.agentSystemPrompts.get(promptId);
      if (!current) {
        return null;
      }

      const nextPrompt: AgentSystemPrompt = {
        ...current,
        ...updates,
        updatedAt: Date.now()
      };

      await db.agentSystemPrompts.put(nextPrompt);
      return nextPrompt;
    } catch (error) {
      console.error("Failed to update agent prompt.", error);
      return null;
    }
  };

  const resetToDefault = async (
    promptId: string
  ): Promise<AgentSystemPrompt | null> => {
    try {
      const current = await db.agentSystemPrompts.get(promptId);
      if (!current) {
        return null;
      }

      const defaultPrompt = DEFAULT_AGENT_PROMPTS.find(
        (prompt) => prompt.agentType === current.agentType
      );

      if (!defaultPrompt) {
        return null;
      }

      const nextPrompt: AgentSystemPrompt = {
        ...current,
        label: defaultPrompt.label,
        content: defaultPrompt.content,
        isDefault: true,
        updatedAt: Date.now()
      };

      await db.agentSystemPrompts.put(nextPrompt);
      return nextPrompt;
    } catch (error) {
      console.error("Failed to reset agent prompt.", error);
      return null;
    }
  };

  return {
    prompts,
    isLoading,
    updatePrompt,
    resetToDefault
  };
};
