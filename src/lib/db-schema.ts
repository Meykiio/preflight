import Dexie, { type Table } from "dexie";
import type {
  AgentSystemPrompt,
  AgentType,
  AIProviderConfig,
  AppSettings,
  Brief,
  BuildStage,
  GeneratedArtifact,
  Project,
  VaultFile,
  ProjectVersion,
  Credential
} from "@/types";

export class PreflightDatabase extends Dexie {
  projects!: Table<Project, string>;
  briefs!: Table<Brief, string>;
  artifacts!: Table<GeneratedArtifact, string>;
  vaultFiles!: Table<VaultFile, string>;
  buildStages!: Table<BuildStage, string>;
  aiProviders!: Table<AIProviderConfig, string>;
  agentSystemPrompts!: Table<AgentSystemPrompt, string>;
  appSettings!: Table<AppSettings, string>;
  projectVersions!: Table<ProjectVersion, string>;
  credentials!: Table<Credential, string>;

  constructor() {
    super("preflight");

    this.version(1).stores({
      projects: "id, status, updatedAt",
      briefs: "id, projectId",
      artifacts: "id, projectId, type, createdAt",
      vaultFiles: "id, projectId, category, isActiveContext",
      buildStages: "id, projectId, stageNumber",
      aiProviders: "id, provider, isDefault",
      agentSystemPrompts: "id, agentType, isDefault",
      appSettings: "id",
      projectVersions: "id, projectId, createdAt",
      credentials: "id, projectId, category"
    });
  }
}
