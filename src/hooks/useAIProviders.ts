import { useLiveQuery } from "dexie-react-hooks";
import db from "@/lib/db";
import type { AIProviderConfig } from "@/types";

export interface AIProviderSummary {
  id?: string;
  provider: AIProviderConfig["provider"];
  model: string;
  isDefault: boolean;
  hasKey: boolean;
  maskedKey: string;
  createdAt?: number;
}

interface SaveProviderInput {
  id?: string;
  provider: AIProviderConfig["provider"];
  apiKey: string;
  model: string;
  isDefault?: boolean;
}

const maskApiKey = (apiKey: string): string => {
  if (!apiKey.trim()) {
    return "";
  }

  if (apiKey.length <= 10) {
    return `${apiKey.slice(0, 2)}...${apiKey.slice(-2)}`;
  }

  return `${apiKey.slice(0, 7)}...${apiKey.slice(-3)}`;
};

export const useAIProviders = () => {
  const providersQuery = useLiveQuery(
    async (): Promise<AIProviderSummary[]> => {
      const configs = await db.aiProviders.toArray();

      return configs.map((config) => ({
        id: config.id,
        provider: config.provider,
        model: config.model,
        isDefault: config.isDefault,
        hasKey: Boolean(config.apiKey.trim()),
        maskedKey: maskApiKey(config.apiKey),
        createdAt: config.createdAt
      }));
    },
    []
  );

  const providers = providersQuery ?? [];
  const defaultProvider =
    providers.find((provider) => provider.isDefault) ?? null;
  const isLoading = providersQuery === undefined;

  const saveProvider = async (
    input: SaveProviderInput
  ): Promise<AIProviderConfig | null> => {
    try {
      const existing = input.id ? await db.aiProviders.get(input.id) : null;
      const provider: AIProviderConfig = {
        id: input.id ?? crypto.randomUUID(),
        provider: input.provider,
        apiKey: input.apiKey.trim() || existing?.apiKey || "",
        model: input.model,
        isDefault: input.isDefault ?? false,
        baseUrl: existing?.baseUrl,
        createdAt: existing?.createdAt ?? Date.now()
      };

      await db.transaction("rw", db.aiProviders, db.appSettings, async () => {
        if (provider.isDefault) {
          // Clear existing defaults safely
          const allProviders = await db.aiProviders.toArray();
          for (const p of allProviders) {
            if (p.isDefault) {
              await db.aiProviders.update(p.id, { isDefault: false });
            }
          }
        }

        await db.aiProviders.put(provider);

        // Update settings to track default provider
        const settings = await db.appSettings.get("app-settings");
        if (settings) {
          await db.appSettings.put({
            ...settings,
            defaultProvider: provider.isDefault
              ? provider.provider
              : settings.defaultProvider,
            updatedAt: Date.now()
          });
        } else {
          // Create settings if they don't exist
          await db.appSettings.put({
            id: "app-settings",
            theme: "dark",
            defaultProvider: provider.isDefault ? provider.provider : null,
            enabledPlatformLaunchers: [
              "lovable",
              "bolt",
              "cursor",
              "v0",
              "replit",
              "perplexity",
              "gemini",
              "chatgpt"
            ],
            streamingEnabled: true,
            userName: "",
            isOnboardingComplete: false,
            updatedAt: Date.now()
          });
        }
      });

      return provider;
    } catch (error) {
      console.error("Failed to save AI provider.", error);
      return null;
    }
  };

  const deleteProvider = async (providerId: string): Promise<void> => {
    try {
      const current = await db.aiProviders.get(providerId);
      await db.aiProviders.delete(providerId);

      if (current?.isDefault) {
        const nextDefault = await db.aiProviders.toCollection().first();
        if (nextDefault) {
          await db.aiProviders.update(nextDefault.id, { isDefault: true });
        }

        const settings = await db.appSettings.get("app-settings");
        if (settings) {
          await db.appSettings.put({
            ...settings,
            defaultProvider: nextDefault?.provider ?? null,
            updatedAt: Date.now()
          });
        }
      }
    } catch (error) {
      console.error("Failed to delete AI provider.", error);
    }
  };

  const setDefault = async (providerId: string): Promise<void> => {
    try {
      await db.transaction("rw", db.aiProviders, db.appSettings, async () => {
        // Clear all existing defaults
        const allProviders = await db.aiProviders.toArray();
        for (const p of allProviders) {
          if (p.isDefault) {
            await db.aiProviders.update(p.id, { isDefault: false });
          }
        }

        // Set new default
        await db.aiProviders.update(providerId, { isDefault: true });

        const provider = await db.aiProviders.get(providerId);
        const settings = await db.appSettings.get("app-settings");
        if (provider && settings) {
          await db.appSettings.put({
            ...settings,
            defaultProvider: provider.provider,
            updatedAt: Date.now()
          });
        }
      });
    } catch (error) {
      console.error("Failed to set default AI provider.", error);
    }
  };

  return {
    providers,
    defaultProvider,
    isLoading,
    saveProvider,
    deleteProvider,
    setDefault
  };
};
