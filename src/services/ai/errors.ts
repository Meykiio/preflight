export type AIServiceErrorCode =
  | "NO_PROVIDER"
  | "NO_SYSTEM_PROMPT"
  | "INVALID_KEY"
  | "RATE_LIMIT"
  | "NETWORK"
  | "PROVIDER"
  | "UNKNOWN";

export class AIServiceError extends Error {
  code: AIServiceErrorCode;
  cause?: unknown;
  status?: number;

  constructor(
    code: AIServiceErrorCode,
    message: string,
    options?: {
      cause?: unknown;
      status?: number;
    }
  ) {
    super(message);
    this.name = "AIServiceError";
    this.code = code;
    this.status = options?.status;
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

const isNetworkMessage = (message: string): boolean =>
  /network|fetch|offline|timed out|timeout|econn|failed to fetch/i.test(message);

const isInvalidKeyMessage = (message: string): boolean =>
  /invalid api key|authentication|unauthorized|forbidden|permission/i.test(message);

const getStatus = (error: unknown): number | undefined => {
  if (typeof error !== "object" || error === null) {
    return undefined;
  }

  const maybeStatus = Reflect.get(error, "status");
  return typeof maybeStatus === "number" ? maybeStatus : undefined;
};

const getMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Unknown AI provider failure.";
};

export const toAIServiceError = (
  error: unknown,
  fallbackMessage: string
): AIServiceError => {
  if (error instanceof AIServiceError) {
    return error;
  }

  const message = getMessage(error);
  const status = getStatus(error);

  if (status === 401 || status === 403 || isInvalidKeyMessage(message)) {
    return new AIServiceError("INVALID_KEY", "The configured API key was rejected.", {
      cause: error,
      status
    });
  }

  if (status === 429 || /rate limit/i.test(message)) {
    return new AIServiceError("RATE_LIMIT", "The AI provider rate limit was reached.", {
      cause: error,
      status
    });
  }

  if (isNetworkMessage(message)) {
    return new AIServiceError("NETWORK", "A network error interrupted the AI request.", {
      cause: error,
      status
    });
  }

  if (status) {
    return new AIServiceError("PROVIDER", fallbackMessage, {
      cause: error,
      status
    });
  }

  return new AIServiceError("UNKNOWN", fallbackMessage, {
    cause: error,
    status
  });
};
