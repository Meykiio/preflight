import type { AIProvider as AIProviderName } from "@/types";

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AICompleteParams {
  model: string;
  system: string;
  messages: AIMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface AIProvider {
  complete(params: AICompleteParams): Promise<string>;
  streamComplete(
    params: AICompleteParams,
    onChunk: (chunk: string) => void
  ): Promise<void>;
  validateKey(apiKey: string): Promise<boolean>;
}

export interface AIProviderAdapter {
  provider: AIProviderName;
  create(apiKey: string, model: string): AIProvider;
}
