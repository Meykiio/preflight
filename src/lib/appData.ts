import db from "@/lib/db";
import { estimateTokens } from "@/lib/utils";
import type {
  AgentSystemPrompt,
  AIProviderConfig,
  AppSettings,
  Brief,
  BuildStage,
  GeneratedArtifact,
  Project,
  VaultFile
} from "@/types";

export interface ExportedAppData {
  exportedAt: number;
  version: string;
  projects: Project[];
  briefs: Brief[];
  artifacts: GeneratedArtifact[];
  buildStages: BuildStage[];
  vaultFiles: Array<
    Omit<VaultFile, "data"> & {
      hasData: boolean;
      dataSize?: number;
    }
  >;
  aiProviders: Array<Omit<AIProviderConfig, "apiKey"> & { apiKeyMasked: string }>;
  agentSystemPrompts: AgentSystemPrompt[];
  appSettings: AppSettings | null;
}

export interface UsageLogEntry {
  id: string;
  createdAt: number;
  label: string;
  meta: string;
}

const maskStoredKey = (apiKey: string): string => {
  if (!apiKey.trim()) {
    return "";
  }

  if (apiKey.length <= 10) {
    return `${apiKey.slice(0, 2)}...${apiKey.slice(-2)}`;
  }

  return `${apiKey.slice(0, 7)}...${apiKey.slice(-3)}`;
};

export const exportAppData = async (): Promise<ExportedAppData> => {
  const [
    projects,
    briefs,
    artifacts,
    buildStages,
    vaultFiles,
    aiProviders,
    agentSystemPrompts,
    appSettings
  ] = await Promise.all([
    db.projects.toArray(),
    db.briefs.toArray(),
    db.artifacts.toArray(),
    db.buildStages.toArray(),
    db.vaultFiles.toArray(),
    db.aiProviders.toArray(),
    db.agentSystemPrompts.toArray(),
    db.appSettings.get("app-settings")
  ]);

  return {
    exportedAt: Date.now(),
    version: "0.1.0-alpha",
    projects,
    briefs,
    artifacts,
    buildStages,
    vaultFiles: vaultFiles.map((file) => {
      const { data, ...metadata } = file;
      return {
        ...metadata,
        hasData: true,
        dataSize: file.size
      };
    }),
    aiProviders: aiProviders.map(({ apiKey, ...provider }) => ({
      ...provider,
      apiKeyMasked: maskStoredKey(apiKey)
    })),
    agentSystemPrompts,
    appSettings: appSettings ?? null
  };
};

export const getUsageLogs = async (): Promise<UsageLogEntry[]> => {
  const artifacts = await db.artifacts.orderBy("createdAt").reverse().toArray();

  return artifacts.map((artifact) => ({
    id: artifact.id,
    createdAt: artifact.createdAt,
    label: artifact.type.replace(/_/g, " "),
    meta: `${artifact.platform} • ${estimateTokens(artifact.content)} tokens`
  }));
};

export const clearAllAppData = async (): Promise<void> => {
  await db.delete();
};
