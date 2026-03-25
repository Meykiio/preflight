import { createOpenAICompatibleProvider } from "@/services/ai/providers/openAICompatibleProvider";
import type { AIProvider } from "@/services/ai/types";

export const createDeepSeekProvider = (
  apiKey: string,
  model: string
): AIProvider =>
  createOpenAICompatibleProvider({
    apiKey,
    baseURL: "https://api.deepseek.com/v1",
    model,
    providerName: "DeepSeek"
  });
