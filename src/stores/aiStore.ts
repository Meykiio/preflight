import { create } from "zustand";
import db from "@/lib/db";
import { generateId } from "@/lib/utils";
import type { AIProviderConfig } from "@/types";

interface AIProviderSnapshot {
  id: string;
  provider: AIProviderConfig["provider"];
  model: string;
  isDefault: boolean;
  hasKey: boolean;
  createdAt: number;
}

interface SaveProviderInput {
  id?: string;
  provider: AIProviderConfig["provider"];
  apiKey: string;
  model: string;
  isDefault?: boolean;
}

interface AIStoreState {
  providers: AIProviderSnapshot[];
  defaultProvider: AIProviderSnapshot | null;
  isGenerating: boolean;
  generationError: string | null;
  loadProviders: () => Promise<void>;
  saveProvider: (input: SaveProviderInput) => Promise<AIProviderConfig>;
  deleteProvider: (providerId: string) => Promise<void>;
  setDefaultProvider: (providerId: string | null) => void;
  setGenerating: (isGenerating: boolean) => void;
  setGenerationError: (message: string | null) => void;
}

export const useAIStore = create<AIStoreState>((set, get) => ({
  providers: [],
  defaultProvider: null,
  isGenerating: false,
  generationError: null,
  loadProviders: async () => {
    const providers = (await db.aiProviders.toArray()).map((provider) => ({
      id: provider.id,
      provider: provider.provider,
      model: provider.model,
      isDefault: provider.isDefault,
      hasKey: Boolean(provider.apiKey.trim()),
      createdAt: provider.createdAt
    }));
    const defaultProvider =
      providers.find((provider) => provider.isDefault) ?? null;

    set({ providers, defaultProvider });
  },
  saveProvider: async (input) => {
    const existing = get().providers;
    const storedProvider = input.id ? await db.aiProviders.get(input.id) : null;
    const nextProvider: AIProviderConfig = {
      id: input.id ?? generateId(),
      provider: input.provider,
      apiKey: input.apiKey.trim() || storedProvider?.apiKey || "",
      model: input.model,
      isDefault: input.isDefault ?? false,
      baseUrl: storedProvider?.baseUrl,
      createdAt:
        existing.find((provider) => provider.id === input.id)?.createdAt ??
        Date.now()
    };

    await db.transaction("rw", db.aiProviders, async () => {
      if (nextProvider.isDefault) {
        // Clear existing defaults safely
        const allProviders = await db.aiProviders.toArray();
        for (const p of allProviders) {
          if (p.isDefault) {
            await db.aiProviders.update(p.id, { isDefault: false });
          }
        }
      }

      await db.aiProviders.put(nextProvider);
    });

    await get().loadProviders();
    return nextProvider;
  },
  deleteProvider: async (providerId) => {
    await db.aiProviders.delete(providerId);
    await get().loadProviders();
  },
  setDefaultProvider: (providerId) => {
    set((state) => ({
      providers: state.providers.map((provider) => ({
        ...provider,
        isDefault: provider.id === providerId
      })),
      defaultProvider:
        state.providers.find((provider) => provider.id === providerId) ?? null
    }));
  },
  setGenerating: (isGenerating) => set({ isGenerating }),
  setGenerationError: (message) => set({ generationError: message })
}));
