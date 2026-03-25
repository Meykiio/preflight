import { AIServiceError } from "@/services/ai/errors";

export interface GenerationErrorState {
  inlineMessage?: string;
  shouldRedirect: boolean;
  toastMessage: string;
}

export const getGenerationErrorState = (
  error: unknown
): GenerationErrorState => {
  if (error instanceof AIServiceError) {
    if (error.code === "NO_PROVIDER") {
      return {
        inlineMessage: "No AI provider is connected yet. Add one in Settings to continue.",
        shouldRedirect: true,
        toastMessage: "No AI provider configured. Opening Settings."
      };
    }

    if (error.code === "INVALID_KEY") {
      return {
        inlineMessage:
          "The connected API key was rejected. Update it in Settings and try again.",
        shouldRedirect: false,
        toastMessage: "The configured API key is invalid."
      };
    }

    if (error.code === "RATE_LIMIT") {
      return {
        shouldRedirect: false,
        toastMessage: "Rate limit reached. Please retry in a moment."
      };
    }

    if (error.code === "NETWORK") {
      return {
        shouldRedirect: false,
        toastMessage: "Network error. Check your connection and retry."
      };
    }

    return {
      shouldRedirect: false,
      toastMessage: error.message
    };
  }

  return {
    shouldRedirect: false,
    toastMessage: "Generation failed. Please try again."
  };
};
