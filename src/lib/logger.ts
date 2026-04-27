/**
 * Centralized logging service for Preflight
 * Uses console in development, sends to monitoring service in production
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;

  /**
   * Log debug information (development only)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.debug(`[DEBUG] ${message}`, context || "");
    }
  }

  /**
   * Log informational messages
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.info(`[INFO] ${message}`, context || "");
    }
    // In production, send to analytics/monitoring
    this.sendToMonitoring("info", message, context);
  }

  /**
   * Log warning messages
   */
  warn(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.warn(`[WARN] ${message}`, context || "");
    }
    this.sendToMonitoring("warn", message, context);
  }

  /**
   * Log error messages
   */
  error(message: string, error?: unknown, context?: LogContext): void {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error
    };

    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.error(`[ERROR] ${message}`, errorContext);
    }

    this.sendToMonitoring("error", message, errorContext);
  }

  /**
   * Send logs to monitoring service (Sentry, etc.)
   */
  private sendToMonitoring(level: LogLevel, message: string, context?: LogContext): void {
    // TODO: Integrate with Sentry or other monitoring service
    // For now, this is a placeholder
    if (!this.isDevelopment && level === "error") {
      // In production, errors should be sent to monitoring
      // Example: Sentry.captureMessage(message, { level, extra: context });
    }
  }
}

export const logger = new Logger();
