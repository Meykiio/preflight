import { toAIServiceError } from "@/services/ai/errors";
import type { AICompleteParams, AIProvider } from "@/services/ai/types";

export const createQwenProvider = (
  apiKey: string,
  model: string
): AIProvider => {
  const baseUrl = "https://dashscope.aliyuncs.com/compatible-mode/v1";

  const validateKey = async (testApiKey: string): Promise<boolean> => {
    try {
      const response = await fetch(`${baseUrl}/models`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${testApiKey}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  const complete = async (params: AICompleteParams): Promise<string> => {
    try {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: params.model || model,
          messages: params.messages,
          temperature: params.temperature,
          max_tokens: params.maxTokens ?? 2048,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Qwen API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "";
    } catch (error) {
      throw toAIServiceError(error, "Qwen completion failed.");
    }
  };

  const streamComplete = async (
    params: AICompleteParams,
    onChunk: (chunk: string) => void
  ): Promise<void> => {
    try {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: params.model || model,
          messages: params.messages,
          temperature: params.temperature,
          max_tokens: params.maxTokens ?? 2048,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`Qwen API error: ${response.status}`);
      }

      // Handle SSE stream
      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") return;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || "";
              if (content) onChunk(content);
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      throw toAIServiceError(error, "Qwen streaming failed.");
    }
  };

  return {
    complete,
    streamComplete,
    validateKey
  };
};
