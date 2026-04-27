import { GoogleGenerativeAI } from "@google/generative-ai";
import { toAIServiceError } from "@/services/ai/errors";
import type { AICompleteParams, AIProvider } from "@/services/ai/types";

export const createGoogleProvider = (
  apiKey: string,
  model: string
): AIProvider => {
  const client = new GoogleGenerativeAI(apiKey);

  const getModel = (params: AICompleteParams) => {
    return client.getGenerativeModel(
      { model: params.model || model },
      { apiVersion: "v1beta" }
    );
  };

  const buildContents = (params: AICompleteParams) => {
    return [
      {
        role: "user",
        parts: [{ text: `SYSTEM INSTRUCTIONS:\n${params.system}` }]
      },
      ...params.messages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      }))
    ];
  };

  return {
    complete: async (params: AICompleteParams): Promise<string> => {
      try {
        const generativeModel = getModel(params);
        const result = await generativeModel.generateContent({
          contents: buildContents(params)
        });
        const text = result.response.text();
        return text.trim();
      } catch (error) {
        throw toAIServiceError(error, "Google completion failed.");
      }
    },
    streamComplete: async (
      params: AICompleteParams,
      onChunk: (chunk: string) => void
    ): Promise<void> => {
      try {
        const generativeModel = getModel(params);
        const result = await generativeModel.generateContentStream({
          contents: buildContents(params)
        });
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
        const generativeModel = getModel({ model } as any);
        await generativeModel.generateContent("Reply with OK.");
        return true;
      } catch (error) {
        throw toAIServiceError(error, "Google key validation failed.");
      }
    }
  };
};
