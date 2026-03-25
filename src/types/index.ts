export type ProjectStatus =
  | "ideation"
  | "researching"
  | "designing"
  | "building"
  | "shipped";

export type Platform =
  | "lovable"
  | "bolt"
  | "cursor"
  | "claude-code"
  | "replit"
  | "v0"
  | "other";

export type AIProvider =
  | "anthropic"
  | "openai"
  | "google"
  | "deepseek"
  | "groq"
  | "qwen"
  | "custom";

export type AgentType =
  | "research"
  | "design"
  | "prd"
  | "system-instructions"
  | "rules-file"
  | "build-foundation"
  | "build-database"
  | "build-feature"
  | "build-audit"
  | "build-deployment";

export type ArtifactType =
  | "research_prompt"
  | "design_prompt"
  | "prd"
  | "system_instructions"
  | "rules_file"
  | "build_prompt";

export type VaultCategory = "research" | "design" | "export" | "other";

export type BuildStageStatus =
  | "locked"
  | "not-started"
  | "in-progress"
  | "complete";

export type CredentialCategory = "api_key" | "database" | "oauth" | "other";

export type AppTheme = "dark" | "light" | "system";

export interface CoreFeature {
  id: string;
  text: string;
  order: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  targetPlatforms: Platform[];
  techStack: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Brief {
  id: string;
  projectId: string;
  problem: string;
  targetUser: string;
  coreFeatures: CoreFeature[];
  inspirations: string[];
  notes: string;
  updatedAt: number;
}

export interface GeneratedArtifact {
  id: string;
  projectId: string;
  type: ArtifactType;
  platform: string;
  content: string;
  contextNodes: string[];
  agentSystemPromptId: string;
  version: number;
  charCount: number;
  tokenEstimate: number;
  createdAt: number;
}

export interface VaultFile {
  id: string;
  projectId: string;
  name: string;
  size: number;
  mimeType: string;
  category: VaultCategory;
  isActiveContext: boolean;
  data: ArrayBuffer;
  uploadedAt: number;
}

export interface BuildStage {
  id: string;
  projectId: string;
  stageNumber: number;
  name: string;
  description: string;
  status: BuildStageStatus;
  promptContent: string;
  platform: string;
  createdAt: number;
  updatedAt: number;
}

export interface AIProviderConfig {
  id: string;
  provider: AIProvider;
  apiKey: string;
  model: string;
  baseUrl?: string;
  isDefault: boolean;
  createdAt: number;
}

export interface AgentSystemPrompt {
  id: string;
  agentType: AgentType;
  label: string;
  content: string;
  isDefault: boolean;
  updatedAt: number;
}

export interface AppSettings {
  id: string;
  theme: AppTheme;
  defaultProvider: AIProvider | null;
  enabledPlatformLaunchers: string[];
  streamingEnabled: boolean;
  userName: string;
  isOnboardingComplete: boolean;
  updatedAt: number;
}

export interface ProjectVersion {
  id: string;
  projectId: string;
  version: string;
  name: string;
  description: string;
  zipData?: ArrayBuffer;
  zipSize: number;
  liveUrl?: string;
  createdAt: number;
}

export interface Credential {
  id: string;
  projectId: string;
  name: string;
  value: string;
  category: CredentialCategory;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}
