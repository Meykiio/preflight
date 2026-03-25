import { describe, expect, it, beforeEach, vi } from "vitest";
import { useProjectStore } from "@/stores/projectStore";
import db from "@/lib/db";
import type { Project } from "@/types";

// Mock Dexie database
vi.mock("@/lib/db", () => ({
  default: {
    projects: {
      orderBy: vi.fn().mockReturnThis(),
      reverse: vi.fn().mockReturnThis(),
      toArray: vi.fn().mockResolvedValue([]),
      add: vi.fn().mockResolvedValue("test-id"),
      update: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined)
    },
    transaction: vi.fn().mockImplementation(async (mode, tables, fn) => fn()),
    briefs: {
      where: vi.fn().mockReturnThis(),
      equals: vi.fn().mockReturnThis(),
      delete: vi.fn().mockResolvedValue(undefined)
    },
    artifacts: {
      where: vi.fn().mockReturnThis(),
      equals: vi.fn().mockReturnThis(),
      delete: vi.fn().mockResolvedValue(undefined)
    },
    vaultFiles: {
      where: vi.fn().mockReturnThis(),
      equals: vi.fn().mockReturnThis(),
      delete: vi.fn().mockResolvedValue(undefined)
    },
    buildStages: {
      where: vi.fn().mockReturnThis(),
      equals: vi.fn().mockReturnThis(),
      delete: vi.fn().mockResolvedValue(undefined)
    }
  }
}));

describe("projectStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store to default state
    useProjectStore.setState({
      projects: [],
      selectedProjectId: null
    });
  });

  describe("initial state", () => {
    it("has correct default values", () => {
      const state = useProjectStore.getState();
      expect(state.projects).toEqual([]);
      expect(state.selectedProjectId).toBe(null);
    });
  });

  describe("selectProject", () => {
    it("sets selected project id", () => {
      useProjectStore.getState().selectProject("project-1");
      expect(useProjectStore.getState().selectedProjectId).toBe("project-1");
    });

    it("clears selected project", () => {
      useProjectStore.getState().selectProject("project-1");
      useProjectStore.getState().selectProject(null);
      expect(useProjectStore.getState().selectedProjectId).toBe(null);
    });
  });

  describe("createProject", () => {
    it("creates a project with minimal data", async () => {
      const project = await useProjectStore.getState().createProject({
        name: "Test Project"
      });

      expect(project.name).toBe("Test Project");
      expect(project.status).toBe("ideation");
      expect(project.targetPlatforms).toEqual([]);
      expect(project.techStack).toEqual([]);
      expect(db.projects.add).toHaveBeenCalled();
    });

    it("creates a project with all data", async () => {
      const project = await useProjectStore.getState().createProject({
        name: "Full Project",
        description: "Test description",
        status: "building",
        targetPlatforms: ["lovable", "bolt"],
        techStack: ["React", "Tailwind"]
      });

      expect(project.name).toBe("Full Project");
      expect(project.description).toBe("Test description");
      expect(project.status).toBe("building");
      expect(project.targetPlatforms).toEqual(["lovable", "bolt"]);
      expect(project.techStack).toEqual(["React", "Tailwind"]);
    });

    it("adds project to state", async () => {
      await useProjectStore.getState().createProject({ name: "Test" });
      const state = useProjectStore.getState();
      expect(state.projects).toHaveLength(1);
      expect(state.selectedProjectId).toBeTruthy();
    });
  });

  describe("updateProject", () => {
    it("updates project fields", async () => {
      // First create a project
      const project = await useProjectStore.getState().createProject({
        name: "Original"
      });

      // Update it
      await useProjectStore.getState().updateProject(project.id, {
        name: "Updated",
        status: "shipped"
      });

      expect(db.projects.update).toHaveBeenCalledWith(
        project.id,
        expect.objectContaining({
          name: "Updated",
          status: "shipped"
        })
      );
    });

    it("updates updatedAt timestamp", async () => {
      const project = await useProjectStore.getState().createProject({
        name: "Test"
      });

      await useProjectStore.getState().updateProject(project.id, {
        name: "Updated"
      });

      const callArg = (db.projects.update as any).mock.calls[0][1];
      expect(callArg.updatedAt).toBeDefined();
    });
  });

  describe("loadProjects", () => {
    it("loads projects from database", async () => {
      const mockProjects: Project[] = [
        {
          id: "1",
          name: "Project 1",
          description: "",
          status: "ideation",
          targetPlatforms: [],
          techStack: [],
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      ];

      (db.projects.orderBy as any)
        .mockReturnValue({
          reverse: () => ({
            toArray: () => Promise.resolve(mockProjects)
          })
        });

      await useProjectStore.getState().loadProjects();

      expect(useProjectStore.getState().projects).toEqual(mockProjects);
    });
  });

  describe("deleteProject", () => {
    it("deletes project and related data", async () => {
      const project = await useProjectStore.getState().createProject({
        name: "To Delete"
      });

      await useProjectStore.getState().deleteProject(project.id);

      expect(db.projects.delete).toHaveBeenCalledWith(project.id);
      expect(db.briefs.where).toHaveBeenCalledWith("projectId");
      expect(db.artifacts.where).toHaveBeenCalledWith("projectId");
    });

    it("removes project from state", async () => {
      const project = await useProjectStore.getState().createProject({
        name: "To Delete"
      });

      await useProjectStore.getState().deleteProject(project.id);

      expect(useProjectStore.getState().projects).toHaveLength(0);
    });

    it("clears selectedProjectId if deleted project was selected", async () => {
      const project = await useProjectStore.getState().createProject({
        name: "To Delete"
      });

      useProjectStore.getState().selectProject(project.id);
      expect(useProjectStore.getState().selectedProjectId).toBe(project.id);

      await useProjectStore.getState().deleteProject(project.id);

      expect(useProjectStore.getState().selectedProjectId).toBe(null);
    });
  });
});
