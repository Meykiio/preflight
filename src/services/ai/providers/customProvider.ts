import { createOpenAICompatibleProvider } from "@/services/ai/providers/openAICompatibleProvider";
import type { AIProvider } from "@/services/ai/types";

export const createCustomProvider = (
  apiKey: string,
  model: string,
  baseURL?: string
): AIProvider =>
  createOpenAICompatibleProvider({
    apiKey,
    baseURL,
    model,
    providerName: "Custom"
  });
