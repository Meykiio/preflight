import { createOpenAICompatibleProvider } from "@/services/ai/providers/openAICompatibleProvider";
import type { AIProvider } from "@/services/ai/types";

/**
 * LM Studio Provider
 * 
 * Run local LLM models with a user-friendly GUI.
 * 
 * Setup:
 * 1. Install: https://lmstudio.ai
 * 2. Download model from HuggingFace via the app
 * 3. Start local server: Click "Start Server" button
 * 
 * API: http://localhost:1234/v1
 * No API key required
 */
export const createLMStudioProvider = (
  apiKey?: string,
  model?: string,
  baseURL?: string
): AIProvider =>
  createOpenAICompatibleProvider({
    apiKey: apiKey || "not-needed",
    baseURL: baseURL || "http://localhost:1234/v1",
    model: model || "local-model",
    providerName: "LM Studio"
  });
