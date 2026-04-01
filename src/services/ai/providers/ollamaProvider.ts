import { createOpenAICompatibleProvider } from "@/services/ai/providers/openAICompatibleProvider";
import type { AIProvider } from "@/services/ai/types";

/**
 * Ollama Provider
 * 
 * Run local LLM models on your machine.
 * 
 * Setup:
 * 1. Install: https://ollama.ai
 * 2. Download model: ollama pull llama3.2
 * 3. Run server: ollama serve
 * 
 * API: http://localhost:11434/v1
 * No API key required (use "ollama" as dummy key if needed)
 */
export const createOllamaProvider = (
  apiKey?: string,
  model?: string,
  baseURL?: string
): AIProvider =>
  createOpenAICompatibleProvider({
    apiKey: apiKey || "ollama", // Dummy key, not actually used
    baseURL: baseURL || "http://localhost:11434/v1",
    model: model || "llama3.2",
    providerName: "Ollama"
  });
