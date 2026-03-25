export const PROJECT_TABS = [
  { id: "brief", icon: "description", label: "Brief", shortcut: "⌘1" },
  { id: "research", icon: "analytics", label: "Research", shortcut: "⌘2" },
  { id: "design", icon: "architecture", label: "Design", shortcut: "⌘3" },
  { id: "prd", icon: "article", label: "PRD", shortcut: "⌘4" },
  { id: "build", icon: "terminal", label: "Build", shortcut: "⌘5" },
  { id: "vault", icon: "inventory_2", label: "Vault", shortcut: "⌘6" }
] as const;

export const NAVIGATION_ITEMS = [
  { id: "home", icon: "home", label: "Home / Projects", shortcut: "⌘H" },
  { id: "settings", icon: "settings", label: "Settings", shortcut: "⌘," }
] as const;

export const PLATFORM_LINKS = [
  { id: "lovable", icon: "favorite", label: "Lovable", url: "https://lovable.dev" },
  { id: "bolt", icon: "bolt", label: "Bolt", url: "https://bolt.new" },
  { id: "cursor", icon: "arrow_right_alt", label: "Cursor", url: "https://cursor.sh" },
  { id: "perplexity", icon: "help", label: "Perplexity", url: "https://www.perplexity.ai" },
  { id: "gemini", icon: "auto_awesome", label: "Gemini", url: "https://gemini.google.com" },
  { id: "chatgpt", icon: "chat", label: "ChatGPT", url: "https://chat.openai.com" },
  { id: "v0", icon: "deployed_code", label: "v0", url: "https://v0.dev" }
] as const;
