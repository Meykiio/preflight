import { create } from "zustand";
import db from "@/lib/db";
import { generateId } from "@/lib/utils";
import type { Platform, Project, ProjectStatus } from "@/types";

interface CreateProjectInput {
  name: string;
  description?: string;
  status?: ProjectStatus;
  targetPlatforms?: Platform[];
  techStack?: string[];
}

interface ProjectStoreState {
  projects: Project[];
  selectedProjectId: string | null;
  loadProjects: () => Promise<void>;
  selectProject: (projectId: string | null) => void;
  createProject: (input: CreateProjectInput) => Promise<Project>;
  updateProject: (
    projectId: string,
    updates: Partial<Omit<Project, "id" | "createdAt">>
  ) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStoreState>((set) => ({
  projects: [],
  selectedProjectId: null,
  loadProjects: async () => {
    const projects = await db.projects.orderBy("updatedAt").reverse().toArray();
    set({ projects });
  },
  selectProject: (projectId) => {
    set({ selectedProjectId: projectId });
  },
  createProject: async (input) => {
    const now = Date.now();
    const project: Project = {
      id: generateId(),
      name: input.name,
      description: input.description ?? "",
      status: input.status ?? "ideation",
      targetPlatforms: input.targetPlatforms ?? [],
      techStack: input.techStack ?? [],
      createdAt: now,
      updatedAt: now
    };

    await db.projects.add(project);
    set((state) => ({
      projects: [project, ...state.projects],
      selectedProjectId: project.id
    }));

    return project;
  },
  updateProject: async (projectId, updates) => {
    const nextProject = {
      ...updates,
      updatedAt: Date.now()
    };

    await db.projects.update(projectId, nextProject);
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId ? { ...project, ...nextProject } : project
      )
    }));
  },
  deleteProject: async (projectId) => {
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

    set((state) => ({
      projects: state.projects.filter((project) => project.id !== projectId),
      selectedProjectId:
        state.selectedProjectId === projectId ? null : state.selectedProjectId
    }));
  }
}));
