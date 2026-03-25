import type { AIProvider } from "@/types";

export interface ProviderCatalogEntry {
  provider: AIProvider;
  label: string;
  icon: string;
  helpUrl: string;
  keyLabel: string;
  defaultModel: string;
  models: string[];
}

export const PROVIDER_ORDER: AIProvider[] = [
  "anthropic",
  "openai",
  "google",
  "deepseek",
  "groq",
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
    models: ["gemini-1.5-pro", "gemini-1.5-flash"]
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
  custom: {
    provider: "custom",
    label: "Custom",
    icon: "api",
    helpUrl: "https://platform.openai.com/docs/api-reference",
    keyLabel: "Custom provider API key",
    defaultModel: "gpt-4o-mini",
    models: ["gpt-4o-mini"]
  }
};

export const PLATFORM_TOGGLE_OPTIONS = [
  { id: "lovable", label: "Lovable", icon: "favorite" },
  { id: "bolt", label: "Bolt", icon: "bolt" },
  { id: "cursor", label: "Cursor", icon: "arrow_right_alt" },
  { id: "v0", label: "v0", icon: "deployed_code" },
  { id: "replit", label: "Replit", icon: "terminal" },
  { id: "perplexity", label: "Perplexity", icon: "help" },
  { id: "gemini", label: "Gemini", icon: "auto_awesome" },
  { id: "chatgpt", label: "ChatGPT", icon: "chat" }
] as const;

export const getProviderLabel = (provider: AIProvider): string =>
  PROVIDER_CATALOG[provider].label;
