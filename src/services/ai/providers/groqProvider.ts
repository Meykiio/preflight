import { createOpenAICompatibleProvider } from "@/services/ai/providers/openAICompatibleProvider";
import type { AIProvider } from "@/services/ai/types";

export const createGroqProvider = (
  apiKey: string,
  model: string
): AIProvider =>
  createOpenAICompatibleProvider({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
    model,
    providerName: "Groq"
  });
