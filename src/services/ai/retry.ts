/**
 * Retry configuration for API calls
 * Uses exponential backoff: 1s, 2s, 4s, 8s, 16s (max 5 retries)
 */
export interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 5,
  initialDelay: 1000,
  maxDelay: 16000,
  backoffMultiplier: 2
};

/**
 * Calculate delay with exponential backoff and jitter
 * Jitter prevents thundering herd problem when multiple requests fail
 */
export const calculateDelay = (
  attempt: number,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): number => {
  const exponentialDelay =
    config.initialDelay * Math.pow(config.backoffMultiplier, attempt);
  const jitter = Math.random() * 0.3 * exponentialDelay; // ±15% jitter
  return Math.min(exponentialDelay + jitter, config.maxDelay);
};

/**
 * Check if error is retryable
 * Network errors and rate limits are retryable
 * Invalid API keys and bad requests are not
 */
export const isRetryableError = (error: unknown): boolean => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // Retryable errors
    if (message.includes('network') ||
        message.includes('fetch') ||
        message.includes('offline') ||
        message.includes('timeout') ||
        message.includes('rate limit')) {
      return true;
    }
  }
  
  return false;
};

/**
 * Execute async function with retry logic
 * @param fn - Async function to execute
 * @param config - Retry configuration
 * @param onRetry - Optional callback for retry attempts
 * @returns Promise resolving to function result
 */
export async function executeWithRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG,
  onRetry?: (attempt: number, error: unknown, delay: number) => void
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry if not a retryable error
      if (!isRetryableError(error)) {
        throw error;
      }
      
      // Don't wait after last attempt
      if (attempt < config.maxRetries) {
        const delay = calculateDelay(attempt, config);
        
        // Notify about retry
        onRetry?.(attempt + 1, error, delay);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // All retries exhausted, throw last error
  throw lastError;
}

/**
 * Sleep utility function
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));
