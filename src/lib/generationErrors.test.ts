import { describe, expect, it } from "vitest";
import { getGenerationErrorState } from "@/lib/generationErrors";
import { AIServiceError } from "@/services/ai/errors";

describe("generationErrors", () => {
  describe("getGenerationErrorState", () => {
    it("handles NO_PROVIDER error", () => {
      const error = new AIServiceError(
        "NO_PROVIDER",
        "No provider configured"
      );
      const result = getGenerationErrorState(error);
      expect(result.shouldRedirect).toBe(true);
      expect(result.toastMessage).toContain("No AI provider configured");
      expect(result.inlineMessage).toContain("No AI provider is connected");
    });

    it("handles INVALID_KEY error", () => {
      const error = new AIServiceError(
        "INVALID_KEY",
        "Invalid API key"
      );
      const result = getGenerationErrorState(error);
      expect(result.shouldRedirect).toBe(false);
      expect(result.toastMessage).toContain("API key is invalid");
      expect(result.inlineMessage).toContain("API key was rejected");
    });

    it("handles RATE_LIMIT error", () => {
      const error = new AIServiceError(
        "RATE_LIMIT",
        "Rate limit exceeded"
      );
      const result = getGenerationErrorState(error);
      expect(result.shouldRedirect).toBe(false);
      expect(result.toastMessage).toContain("Rate limit reached");
      expect(result.inlineMessage).toBeUndefined();
    });

    it("handles NETWORK error", () => {
      const error = new AIServiceError(
        "NETWORK",
        "Network error"
      );
      const result = getGenerationErrorState(error);
      expect(result.shouldRedirect).toBe(false);
      expect(result.toastMessage).toContain("Network error");
      expect(result.inlineMessage).toBeUndefined();
    });

    it("handles generic AIServiceError with custom message", () => {
      const error = new AIServiceError(
        "UNKNOWN",
        "Custom provider error"
      );
      const result = getGenerationErrorState(error);
      expect(result.shouldRedirect).toBe(false);
      expect(result.toastMessage).toBe("Custom provider error");
      expect(result.inlineMessage).toBeUndefined();
    });
  });
});
