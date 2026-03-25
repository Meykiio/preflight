import { useLiveQuery } from "dexie-react-hooks";
import db from "@/lib/db";
import type { Project } from "@/types";

export const useProject = (projectId: string | undefined) => {
  const projectQuery = useLiveQuery(
    async (): Promise<Project | null> => {
      if (!projectId) {
        return null;
      }

      return (await db.projects.get(projectId)) ?? null;
    },
    [projectId]
  );

  return {
    project: projectQuery ?? null,
    isLoading: projectQuery === undefined
  };
};
