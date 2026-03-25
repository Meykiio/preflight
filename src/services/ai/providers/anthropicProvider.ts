import Anthropic from "@anthropic-ai/sdk";
import { toAIServiceError } from "@/services/ai/errors";
import { emitTextChunks } from "@/services/ai/providers/chunkText";
import type { AICompleteParams, AIProvider } from "@/services/ai/types";

const getTextContent = (
  content: Array<{
    type: string;
    text?: string;
  }>
): string =>
  content
    .map((block) => (block.type === "text" ? block.text ?? "" : ""))
    .join("")
    .trim();

export const createAnthropicProvider = (
  apiKey: string,
  model: string
): AIProvider => {
  const client = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true
  });

  return {
    complete: async (params: AICompleteParams): Promise<string> => {
      try {
        const response = await client.messages.create({
          model: params.model || model,
          system: params.system,
          temperature: params.temperature,
          max_tokens: params.maxTokens ?? 2048,
          messages: params.messages
            .filter((message) => message.role !== "system")
            .map((message) => ({
              role: message.role === "assistant" ? "assistant" : "user",
              content: message.content
            }))
        });

        return getTextContent(response.content as Array<{ type: string; text?: string }>);
      } catch (error) {
        throw toAIServiceError(error, "Anthropic completion failed.");
      }
    },
    streamComplete: async (
      params: AICompleteParams,
      onChunk: (chunk: string) => void
    ): Promise<void> => {
      const text = await client.messages
        .create({
          model: params.model || model,
          system: params.system,
          temperature: params.temperature,
          max_tokens: params.maxTokens ?? 2048,
          messages: params.messages
            .filter((message) => message.role !== "system")
            .map((message) => ({
              role: message.role === "assistant" ? "assistant" : "user",
              content: message.content
            }))
        })
        .then((response) =>
          getTextContent(response.content as Array<{ type: string; text?: string }>)
        )
        .catch((error: unknown) => {
          throw toAIServiceError(error, "Anthropic streaming failed.");
        });

      await emitTextChunks(text, onChunk);
    },
    validateKey: async (): Promise<boolean> => {
      try {
        await client.messages.create({
          model,
          max_tokens: 8,
          messages: [{ role: "user", content: "Reply with OK." }]
        });
        return true;
      } catch (error) {
        throw toAIServiceError(error, "Anthropic key validation failed.");
      }
    }
  };
};
