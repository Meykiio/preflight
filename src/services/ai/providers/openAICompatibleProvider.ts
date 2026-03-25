import OpenAI from "openai";
import { toAIServiceError } from "@/services/ai/errors";
import type {
  AICompleteParams,
  AIMessage,
  AIProvider
} from "@/services/ai/types";

interface OpenAICompatibleProviderOptions {
  apiKey: string;
  baseURL?: string;
  model: string;
  providerName: string;
}

const mapMessages = (
  system: string,
  messages: AIMessage[]
): Array<{
  role: "system" | "user" | "assistant";
  content: string;
}> => [
  { role: "system", content: system },
  ...messages
    .filter((message) => message.role !== "system")
    .map((message) => ({
      role: message.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: message.content
    }))
];

export const createOpenAICompatibleProvider = ({
  apiKey,
  baseURL,
  model,
  providerName
}: OpenAICompatibleProviderOptions): AIProvider => {
  const client = new OpenAI({
    apiKey,
    baseURL,
    dangerouslyAllowBrowser: true
  });

  return {
    complete: async (params: AICompleteParams): Promise<string> => {
      try {
        const response = await client.chat.completions.create({
          model: params.model || model,
          messages: mapMessages(params.system, params.messages),
          temperature: params.temperature,
          max_tokens: params.maxTokens
        });

        return response.choices
          .map((choice) => choice.message.content ?? "")
          .join("")
          .trim();
      } catch (error) {
        throw toAIServiceError(error, `${providerName} completion failed.`);
      }
    },
    streamComplete: async (
      params: AICompleteParams,
      onChunk: (chunk: string) => void
    ): Promise<void> => {
      try {
        const stream = await client.chat.completions.create({
          model: params.model || model,
          messages: mapMessages(params.system, params.messages),
          temperature: params.temperature,
          max_tokens: params.maxTokens,
          stream: true
        });

        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) {
            onChunk(text);
          }
        }
      } catch (error) {
        throw toAIServiceError(error, `${providerName} streaming failed.`);
      }
    },
    validateKey: async (): Promise<boolean> => {
      try {
        await client.chat.completions.create({
          model,
          messages: [{ role: "user", content: "Reply with OK." }],
          max_tokens: 4
        });
        return true;
      } catch (error) {
        throw toAIServiceError(error, `${providerName} key validation failed.`);
      }
    }
  };
};
