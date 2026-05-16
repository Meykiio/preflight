import db from "@/lib/db";
import { logger } from "@/lib/logger";
import { AIServiceError } from "@/services/ai/errors";
import { executeWithRetry, sleep } from "@/services/ai/retry";
import {
  saveCheckpoint,
  clearCheckpoint,
  estimateTokenCount,
  shouldSaveCheckpoint
} from "@/services/ai/checkpoint";
import { decryptString } from "@/lib/security";
import type { AICompleteParams, AIProvider } from "@/services/ai/types";
import type { AgentType, AIProviderConfig } from "@/types";

export const createProviderFromConfig = async (
  config: AIProviderConfig
): Promise<AIProvider> => {
  // Decrypt the API key before use
  const decryptedKey = await decryptString(config.apiKey);

  switch (config.provider) {
    case "anthropic":
      return import("@/services/ai/providers/anthropicProvider").then((module) =>
        module.createAnthropicProvider(decryptedKey, config.model)
      );
    case "openai":
      return import("@/services/ai/providers/openaiProvider").then((module) =>
        module.createOpenAIProvider(decryptedKey, config.model)
      );
    case "google":
      return import("@/services/ai/providers/googleProvider").then((module) =>
        module.createGoogleProvider(decryptedKey, config.model)
      );
    case "openrouter":
      return import("@/services/ai/providers/openrouterProvider").then((module) =>
        module.createOpenRouterProvider(decryptedKey, config.model, config.baseUrl)
      );
    case "ollama":
      return import("@/services/ai/providers/ollamaProvider").then((module) =>
        module.createOllamaProvider(decryptedKey, config.model, config.baseUrl)
      );
    case "groq":
      return import("@/services/ai/providers/groqProvider").then((module) =>
        module.createGroqProvider(decryptedKey, config.model)
      );
    default:
      throw new AIServiceError(
        "PROVIDER",
        "The selected AI provider is not supported."
      );
  }
};

const getDefaultProviderConfig = async (): Promise<AIProviderConfig> => {
  const provider =
    (await db.aiProviders.filter((item) => item.isDefault).first()) ??
    (await db.aiProviders.toCollection().first());

  if (!provider?.apiKey.trim()) {
    throw new AIServiceError(
      "NO_PROVIDER",
      "No AI provider configured. Please add an API key in Settings."
    );
  }

  return provider;
};

const getSystemPrompt = async (agentType: AgentType): Promise<string> => {
  const prompt = await db.agentSystemPrompts
    .where("agentType")
    .equals(agentType)
    .first();

  if (!prompt?.content.trim()) {
    throw new AIServiceError(
      "NO_SYSTEM_PROMPT",
      `No system prompt is configured for ${agentType}.`
    );
  }

  return prompt.content;
};

export const getProvider = async (): Promise<AIProvider> =>
  createProviderFromConfig(await getDefaultProviderConfig());

export const generateWithAgent = async (
  agentType: AgentType,
  userContent: string,
  onChunk?: (chunk: string) => void,
  projectId?: string
): Promise<string> => {
  const [providerConfig, systemPrompt, settings] = await Promise.all([
    getDefaultProviderConfig(),
    getSystemPrompt(agentType),
    db.appSettings.get("app-settings")
  ]);

  const provider = await createProviderFromConfig(providerConfig);

  const params: AICompleteParams = {
    model: providerConfig.model,
    system: systemPrompt,
    messages: [{ role: "user", content: userContent }],
    temperature: 0.4,
    maxTokens: 4096
  };

  // Track generation progress for checkpointing
  let accumulatedContent = "";
  let lastCheckpointTokens = 0;
  const checkpointEnabled = projectId !== undefined;

  const saveProgress = (content: string) => {
    if (!checkpointEnabled) return;
    
    const currentTokens = estimateTokenCount(content);
    if (shouldSaveCheckpoint(currentTokens, lastCheckpointTokens)) {
      saveCheckpoint({
        projectId,
        agentType,
        content,
        tokenCount: currentTokens,
        timestamp: Date.now(),
        status: "in-progress"
      });
      lastCheckpointTokens = currentTokens;
    }
  };

  // Retry wrapper for generation
  const generateWithRetry = async (): Promise<string> => {
    if (onChunk && settings?.streamingEnabled !== false) {
      let result = "";
      await provider.streamComplete(params, (chunk) => {
        result += chunk;
        onChunk(chunk);
        saveProgress(result);
      });
      return result.trim();
    }

    return provider.complete(params);
  };

  try {
    const result = await executeWithRetry(
      generateWithRetry,
      undefined,
      (attempt, error, delay) => {
        logger.warn(`Generation retry ${attempt}/5 after ${Math.round(delay)}ms`, error instanceof Error ? { error: error.message } : { error: String(error) });
      }
    );

    // Clear checkpoint on success
    if (checkpointEnabled) {
      clearCheckpoint();
    }

    return result;
  } catch (error) {
    // Save failed state for recovery
    if (checkpointEnabled && accumulatedContent) {
      saveCheckpoint({
        projectId,
        agentType,
        content: accumulatedContent,
        tokenCount: estimateTokenCount(accumulatedContent),
        timestamp: Date.now(),
        status: "failed"
      });
    }
    throw error;
  }
};
