import { createOpenAICompatibleProvider } from "@/services/ai/providers/openAICompatibleProvider";
import type { AIProvider } from "@/services/ai/types";

export const createOpenAIProvider = (
  apiKey: string,
  model: string
): AIProvider =>
  createOpenAICompatibleProvider({
    apiKey,
    model,
    providerName: "OpenAI"
  });
