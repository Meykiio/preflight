import { createOpenAICompatibleProvider } from "@/services/ai/providers/openAICompatibleProvider";
import type { AIProvider } from "@/services/ai/types";

/**
 * OpenRouter Provider
 * 
 * OpenRouter is an API gateway with 200+ models including:
 * - Free tier: Meta Llama, Google Gemma, Mistral, etc.
 * - Paid: GPT-4, Claude 3.5, etc. (pay-per-use)
 * 
 * Get API key: https://openrouter.ai/keys
 * Free models: https://openrouter.ai/models?o=top-weekly&max_price=0
 */
export const createOpenRouterProvider = (
  apiKey: string,
  model?: string,
  baseURL?: string
): AIProvider =>
  createOpenAICompatibleProvider({
    apiKey,
    baseURL: baseURL || "https://openrouter.ai/api/v1",
    model: model || "meta-llama/llama-3.1-8b-instruct:free",
    providerName: "OpenRouter"
  });
