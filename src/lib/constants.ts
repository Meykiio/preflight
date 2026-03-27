/**
 * Application-wide constants
 * Centralized configuration for consistent values across the codebase
 */

/**
 * File upload limits
 */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Token estimation (4 characters ≈ 1 token for most LLMs)
 */
export const CHARS_PER_TOKEN = 4;

/**
 * Time constants (milliseconds)
 */
export const ONE_MINUTE_MS = 60 * 1000;
export const ONE_HOUR_MS = 60 * ONE_MINUTE_MS;
export const ONE_DAY_MS = 24 * ONE_HOUR_MS;

/**
 * Cache durations
 */
export const CACHE_SHORT = ONE_MINUTE_MS * 5; // 5 minutes
export const CACHE_MEDIUM = ONE_HOUR_MS; // 1 hour
export const CACHE_LONG = ONE_DAY_MS; // 24 hours

/**
 * Animation durations (milliseconds)
 */
export const ANIMATION_FAST = 150;
export const ANIMATION_NORMAL = 300;
export const ANIMATION_SLOW = 500;

/**
 * Page transition duration (matches CSS)
 */
export const PAGE_TRANSITION_DURATION = 350;

/**
 * Debounce delays (milliseconds)
 */
export const DEBOUNCE_SHORT = 300;
export const DEBOUNCE_NORMAL = 500;
export const DEBOUNCE_LONG = 1000;

/**
 * Pagination defaults
 */
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
