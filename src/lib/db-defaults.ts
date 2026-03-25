import type { AgentType } from "@/types";
import { PreflightDatabase } from "@/lib/db-schema";
import { DEFAULT_AGENT_PROMPTS, DEFAULT_PLATFORM_LAUNCHERS } from "@/lib/db-seeds";

export async function initializeDatabaseDefaults(
  db: PreflightDatabase
): Promise<void> {
  const settingsCount = await db.appSettings.count();

  if (settingsCount === 0) {
    await db.appSettings.put({
      id: "app-settings",
      theme: "dark",
      defaultProvider: null,
      enabledPlatformLaunchers: DEFAULT_PLATFORM_LAUNCHERS,
      streamingEnabled: true,
      userName: "",
      isOnboardingComplete: false,
      updatedAt: Date.now()
    });
  }

  const promptCount = await db.agentSystemPrompts.count();

  if (promptCount === 0) {
    await db.agentSystemPrompts.bulkAdd(
      DEFAULT_AGENT_PROMPTS.map((prompt) => ({
        id: `${prompt.agentType}-default`,
        agentType: prompt.agentType as AgentType,
        label: prompt.label,
        content: prompt.content,
        isDefault: prompt.isDefault,
        updatedAt: Date.now()
      }))
    );
  } else {
    for (const promptSeed of DEFAULT_AGENT_PROMPTS) {
      const existing = await db.agentSystemPrompts.get(
        `${promptSeed.agentType}-default`
      );
      if (existing && existing.isDefault) {
        if (existing.content !== promptSeed.content) {
          await db.agentSystemPrompts.update(`${promptSeed.agentType}-default`, {
            content: promptSeed.content,
            label: promptSeed.label,
            updatedAt: Date.now()
          });
        }
      } else if (!existing) {
        await db.agentSystemPrompts.add({
          id: `${promptSeed.agentType}-default`,
          agentType: promptSeed.agentType as AgentType,
          label: promptSeed.label,
          content: promptSeed.content,
          isDefault: promptSeed.isDefault,
          updatedAt: Date.now()
        });
      }
    }
  }
}
