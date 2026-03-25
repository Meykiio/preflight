import { useCallback, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import db from "@/lib/db";
import type { Brief, CoreFeature } from "@/types";

interface UpdateBriefInput {
  coreFeatures?: CoreFeature[];
  inspirations?: string[];
  notes?: string;
  problem?: string;
  targetUser?: string;
}

export const useBrief = (projectId: string | undefined) => {
  // Read-only observation - no writes inside liveQuery
  const briefQuery = useLiveQuery(
    async (): Promise<Brief | null> => {
      if (!projectId) {
        return null;
      }

      return (await db.briefs.where("projectId").equals(projectId).first()) ?? null;
    },
    [projectId]
  );

  // Separate initialization logic - called explicitly, not in liveQuery
  const initializeBrief = useCallback(async (): Promise<Brief | null> => {
    if (!projectId) {
      return null;
    }

    const current = await db.briefs.where("projectId").equals(projectId).first();
    if (current) {
      return current;
    }

    const nextBrief: Brief = {
      id: crypto.randomUUID(),
      projectId,
      problem: "",
      targetUser: "",
      coreFeatures: [],
      inspirations: [],
      notes: "",
      updatedAt: Date.now()
    };

    await db.briefs.add(nextBrief);
    return nextBrief;
  }, [projectId]);

  // Auto-initialize brief on mount if it doesn't exist
  useEffect(() => {
    if (projectId && briefQuery === null) {
      initializeBrief();
    }
  }, [projectId, briefQuery, initializeBrief]);

  const updateBrief = async (updates: UpdateBriefInput): Promise<Brief | null> => {
    if (!projectId) {
      return null;
    }

    try {
      const current =
        (await db.briefs.where("projectId").equals(projectId).first()) ?? null;

      const nextBrief: Brief = {
        id: current?.id ?? crypto.randomUUID(),
        projectId,
        problem: updates.problem ?? current?.problem ?? "",
        targetUser: updates.targetUser ?? current?.targetUser ?? "",
        coreFeatures: updates.coreFeatures ?? current?.coreFeatures ?? [],
        inspirations: updates.inspirations ?? current?.inspirations ?? [],
        notes: updates.notes ?? current?.notes ?? "",
        updatedAt: Date.now()
      };

      await db.briefs.put(nextBrief);
      return nextBrief;
    } catch (error) {
      console.error("Failed to update brief.", error);
      return null;
    }
  };

  return {
    brief: briefQuery ?? null,
    isLoading: briefQuery === undefined,
    updateBrief,
    initializeBrief
  };
};
