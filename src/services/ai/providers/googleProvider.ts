import { GoogleGenerativeAI } from "@google/generative-ai";
import { toAIServiceError } from "@/services/ai/errors";
import type { AICompleteParams, AIProvider } from "@/services/ai/types";

const buildPrompt = (params: AICompleteParams): string =>
  [
    `SYSTEM:\n${params.system}`,
    ...params.messages.map(
      (message) => `${message.role.toUpperCase()}:\n${message.content}`
    ),
    "ASSISTANT:"
  ].join("\n\n");

export const createGoogleProvider = (
  apiKey: string,
  model: string
): AIProvider => {
  const client = new GoogleGenerativeAI(apiKey);

  return {
    complete: async (params: AICompleteParams): Promise<string> => {
      try {
        const generativeModel = client.getGenerativeModel({
          model: params.model || model
        });
        const result = await generativeModel.generateContent(buildPrompt(params));
        return result.response.text().trim();
      } catch (error) {
        throw toAIServiceError(error, "Google completion failed.");
      }
    },
    streamComplete: async (
      params: AICompleteParams,
      onChunk: (chunk: string) => void
    ): Promise<void> => {
      try {
        const generativeModel = client.getGenerativeModel({
          model: params.model || model
        });
        const result = await generativeModel.generateContentStream(buildPrompt(params));
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            onChunk(text);
          }
        }
      } catch (error) {
        throw toAIServiceError(error, "Google streaming failed.");
      }
    },
    validateKey: async (): Promise<boolean> => {
      try {
        const generativeModel = client.getGenerativeModel({ model });
        await generativeModel.generateContent("Reply with OK.");
        return true;
      } catch (error) {
        throw toAIServiceError(error, "Google key validation failed.");
      }
    }
  };
};
