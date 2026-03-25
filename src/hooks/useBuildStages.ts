import { useLiveQuery } from "dexie-react-hooks";
import db from "@/lib/db";
import type { BuildStage, BuildStageStatus } from "@/types";

interface CreateBuildStageInput {
  description: string;
  name: string;
  platform: string;
  promptContent: string;
  stageNumber: number;
  status?: BuildStageStatus;
}

export const useBuildStages = (projectId: string | undefined) => {
  const stagesQuery = useLiveQuery(
    async (): Promise<BuildStage[]> => {
      if (!projectId) {
        return [];
      }

      return db.buildStages
        .where("projectId")
        .equals(projectId)
        .sortBy("stageNumber");
    },
    [projectId]
  );

  const stages = stagesQuery ?? [];
  const isLoading = stagesQuery === undefined;

  const createStages = async (
    inputs: CreateBuildStageInput[]
  ): Promise<BuildStage[]> => {
    if (!projectId) {
      return [];
    }

    try {
      const now = Date.now();
      const nextStages = inputs.map((input) => ({
        id: crypto.randomUUID(),
        projectId,
        stageNumber: input.stageNumber,
        name: input.name,
        description: input.description,
        status: input.status ?? "not-started",
        promptContent: input.promptContent,
        platform: input.platform,
        createdAt: now,
        updatedAt: now
      }));

      await db.transaction("rw", db.buildStages, async () => {
        await db.buildStages.where("projectId").equals(projectId).delete();
        await db.buildStages.bulkPut(nextStages);
      });
      return nextStages;
    } catch (error) {
      console.error("Failed to create build stages.", error);
      return [];
    }
  };

  const updateStageStatus = async (
    stageId: string,
    status: BuildStageStatus
  ): Promise<void> => {
    try {
      await db.buildStages.update(stageId, {
        status,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error("Failed to update build stage status.", error);
    }
  };

  const updateStagePrompt = async (
    stageId: string,
    promptContent: string
  ): Promise<void> => {
    try {
      await db.buildStages.update(stageId, {
        promptContent,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error("Failed to update build stage prompt.", error);
    }
  };

  return {
    stages,
    isLoading,
    createStages,
    updateStageStatus,
    updateStagePrompt
  };
};
