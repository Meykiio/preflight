import { useLiveQuery } from "dexie-react-hooks";
import db from "@/lib/db";
import type { Platform, Project, ProjectStatus } from "@/types";

interface CreateProjectInput {
  name: string;
  description?: string;
  status?: ProjectStatus;
  targetPlatforms?: Platform[];
  techStack?: string[];
}

interface UpdateProjectInput {
  description?: string;
  name?: string;
  status?: ProjectStatus;
  targetPlatforms?: Platform[];
  techStack?: string[];
}

export const useProjects = () => {
  const projectsQuery = useLiveQuery(
    async () => db.projects.orderBy("updatedAt").reverse().toArray(),
    []
  );

  const projects = projectsQuery ?? [];
  const isLoading = projectsQuery === undefined;

  const createProject = async (
    input: CreateProjectInput
  ): Promise<Project | null> => {
    try {
      const now = Date.now();
      const project: Project = {
        id: crypto.randomUUID(),
        name: input.name,
        description: input.description ?? "",
        status: input.status ?? "ideation",
        targetPlatforms: input.targetPlatforms ?? [],
        techStack: input.techStack ?? [],
        createdAt: now,
        updatedAt: now
      };

      await db.projects.add(project);
      return project;
    } catch (error) {
      console.error("Failed to create project.", error);
      return null;
    }
  };

  const updateProject = async (
    projectId: string,
    updates: UpdateProjectInput
  ): Promise<void> => {
    try {
      await db.projects.update(projectId, {
        ...updates,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error("Failed to update project.", error);
    }
  };

  const deleteProject = async (projectId: string): Promise<void> => {
    try {
      await db.transaction(
        "rw",
        [db.projects, db.briefs, db.artifacts, db.vaultFiles, db.buildStages],
        async () => {
          await db.projects.delete(projectId);
          await db.briefs.where("projectId").equals(projectId).delete();
          await db.artifacts.where("projectId").equals(projectId).delete();
          await db.vaultFiles.where("projectId").equals(projectId).delete();
          await db.buildStages.where("projectId").equals(projectId).delete();
        }
      );
    } catch (error) {
      console.error("Failed to delete project.", error);
    }
  };

  return {
    projects,
    isLoading,
    createProject,
    updateProject,
    deleteProject
  };
};
