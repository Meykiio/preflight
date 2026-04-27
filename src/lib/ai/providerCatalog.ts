import type { AIProvider } from "@/types";

export interface ProviderCatalogEntry {
  provider: AIProvider;
  label: string;
  icon: string;
  helpUrl: string;
  keyLabel: string;
  defaultModel: string;
  models: string[];
  requiresApiKey?: boolean;
  defaultBaseUrl?: string;
}

export const PROVIDER_ORDER: AIProvider[] = [
  "anthropic",
  "openai",
  "google",
  "deepseek",
  "groq",
  "qwen",
  "openrouter",
  "ollama",
  "lmstudio",
  "custom"
];

export const PROVIDER_CATALOG: Record<AIProvider, ProviderCatalogEntry> = {
  anthropic: {
    provider: "anthropic",
    label: "Anthropic",
    icon: "psychology",
    helpUrl: "https://console.anthropic.com/settings/keys",
    keyLabel: "Claude API key",
    defaultModel: "claude-3-5-sonnet-latest",
    models: ["claude-3-5-sonnet-latest", "claude-3-5-haiku-latest"]
  },
  openai: {
    provider: "openai",
    label: "OpenAI",
    icon: "chat",
    helpUrl: "https://platform.openai.com/api-keys",
    keyLabel: "OpenAI API key",
    defaultModel: "gpt-4o-mini",
    models: ["gpt-4o-mini", "gpt-4o"]
  },
  google: {
    provider: "google",
    label: "Google Gemini",
    icon: "auto_awesome",
    helpUrl: "https://aistudio.google.com/app/apikey",
    keyLabel: "Gemini API key",
    defaultModel: "gemini-1.5-pro",
    models: ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.0-pro"]
  },
  deepseek: {
    provider: "deepseek",
    label: "DeepSeek",
    icon: "bolt",
    helpUrl: "https://platform.deepseek.com/api_keys",
    keyLabel: "DeepSeek API key",
    defaultModel: "deepseek-chat",
    models: ["deepseek-chat", "deepseek-reasoner"]
  },
  groq: {
    provider: "groq",
    label: "Groq",
    icon: "speed",
    helpUrl: "https://console.groq.com/keys",
    keyLabel: "Groq API key",
    defaultModel: "llama-3.3-70b-versatile",
    models: ["llama-3.3-70b-versatile", "mixtral-8x7b-32768"]
  },
  qwen: {
    provider: "qwen",
    label: "Qwen Code",
    icon: "code",
    helpUrl: "https://github.com/QwenLM/Qwen",
    keyLabel: "Qwen API key",
    defaultModel: "qwen-plus",
    models: ["qwen-plus", "qwen-max"],
    requiresApiKey: true
  },
  openrouter: {
    provider: "openrouter",
    label: "OpenRouter",
    icon: "hub",
    helpUrl: "https://openrouter.ai/keys",
    keyLabel: "OpenRouter API key",
    defaultModel: "meta-llama/llama-3.1-8b-instruct:free",
    models: [
      "meta-llama/llama-3.1-8b-instruct:free",
      "meta-llama/llama-3.2-90b-vision-instruct:free",
      "google/gemma-2-9b-it:free",
      "mistralai/mistral-7b-instruct:free",
      "qwen/qwen-2-7b-instruct:free",
      "openai/gpt-4o-mini",
      "openai/gpt-4o",
      "anthropic/claude-3.5-sonnet",
      "anthropic/claude-3-opus"
    ],
    requiresApiKey: true,
    defaultBaseUrl: "https://openrouter.ai/api/v1"
  },
  ollama: {
    provider: "ollama",
    label: "Ollama (Local)",
    icon: "desktop_windows",
    helpUrl: "https://ollama.ai",
    keyLabel: "Not required (optional)",
    defaultModel: "llama3.2",
    models: ["llama3.2", "llama3.1", "mistral", "mixtral", "phi3"],
    requiresApiKey: false,
    defaultBaseUrl: "http://localhost:11434/v1"
  },
  lmstudio: {
    provider: "lmstudio",
    label: "LM Studio (Local)",
    icon: "studio",
    helpUrl: "https://lmstudio.ai",
    keyLabel: "Not required",
    defaultModel: "local-model",
    models: ["local-model"],
    requiresApiKey: false,
    defaultBaseUrl: "http://localhost:1234/v1"
  },
  custom: {
    provider: "custom",
    label: "Custom",
    icon: "api",
    helpUrl: "https://platform.openai.com/docs/api-reference",
    keyLabel: "Custom provider API key",
    defaultModel: "gpt-4o-mini",
    models: ["gpt-4o-mini"],
    requiresApiKey: true
  }
};

export const PLATFORM_TOGGLE_OPTIONS = [
  { id: "lovable", label: "Lovable", icon: "favorite" },
  { id: "bolt", label: "Bolt", icon: "bolt" },
  { id: "cursor", label: "Cursor", icon: "arrow_right_alt" },
  { id: "qwen-code", label: "Qwen Code", icon: "code" },
  { id: "v0", label: "v0", icon: "deployed_code" },
  { id: "replit", label: "Replit", icon: "terminal" },
  { id: "perplexity", label: "Perplexity", icon: "help" },
  { id: "gemini", label: "Gemini", icon: "auto_awesome" },
  { id: "chatgpt", label: "ChatGPT", icon: "chat" }
] as const;

export const getProviderLabel = (provider: AIProvider): string =>
  PROVIDER_CATALOG[provider].label;
