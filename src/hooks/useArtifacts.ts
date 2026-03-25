import { useLiveQuery } from "dexie-react-hooks";
import db from "@/lib/db";
import { estimateTokens } from "@/lib/utils";
import type { ArtifactType, GeneratedArtifact } from "@/types";

interface CreateArtifactInput {
  agentSystemPromptId: string;
  content: string;
  contextNodes?: string[];
  platform: string;
  type: ArtifactType;
  version?: number;
}

export const useArtifacts = (projectId: string | undefined) => {
  const artifactsQuery = useLiveQuery(
    async (): Promise<GeneratedArtifact[]> => {
      if (!projectId) {
        return [];
      }

      const artifacts = await db.artifacts
        .where("projectId")
        .equals(projectId)
        .sortBy("createdAt");

      return artifacts.reverse();
    },
    [projectId]
  );

  const artifacts = artifactsQuery ?? [];
  const isLoading = artifactsQuery === undefined;

  const createArtifact = async (
    input: CreateArtifactInput
  ): Promise<GeneratedArtifact | null> => {
    if (!projectId) {
      return null;
    }

    try {
      const artifact: GeneratedArtifact = {
        id: crypto.randomUUID(),
        projectId,
        type: input.type,
        platform: input.platform,
        content: input.content,
        contextNodes: input.contextNodes ?? [],
        agentSystemPromptId: input.agentSystemPromptId,
        version: input.version ?? 1,
        charCount: input.content.length,
        tokenEstimate: estimateTokens(input.content),
        createdAt: Date.now()
      };

      await db.artifacts.add(artifact);
      return artifact;
    } catch (error) {
      console.error("Failed to create artifact.", error);
      return null;
    }
  };

  const deleteArtifact = async (artifactId: string): Promise<void> => {
    try {
      await db.artifacts.delete(artifactId);
    } catch (error) {
      console.error("Failed to delete artifact.", error);
    }
  };

  const getLatestByType = (type: ArtifactType): GeneratedArtifact | null =>
    artifacts.find((artifact) => artifact.type === type) ?? null;

  return {
    artifacts,
    isLoading,
    createArtifact,
    deleteArtifact,
    getLatestByType
  };
};
