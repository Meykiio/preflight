import type { NavigateFunction } from "react-router-dom";
import { getGenerationErrorState } from "@/lib/generationErrors";
import { generateDesignPrompt } from "@/services/generation/designGeneration";
import { generateResearchPrompt } from "@/services/generation/researchGeneration";
import type { ArtifactType, Brief, GeneratedArtifact, Project } from "@/types";

interface ToastApi {
  error: (message: string) => void;
  success: (message: string) => void;
}

interface CreateArtifactInput {
  agentSystemPromptId: string;
  content: string;
  contextNodes?: string[];
  platform: string;
  type: ArtifactType;
  version?: number;
}

interface PaletteGenerationBase {
  artifacts: GeneratedArtifact[];
  brief?: Brief;
  closePalette: () => void;
  createArtifact: (artifact: CreateArtifactInput) => Promise<GeneratedArtifact | null>;
  navigate: NavigateFunction;
  project?: Project;
  selectedProjectId?: string;
  setActiveTab: (tab: string) => void;
  toast: ToastApi;
}

const handlePaletteAIError = (
  error: unknown,
  navigate: NavigateFunction,
  toast: ToastApi
): void => {
  const errorState = getGenerationErrorState(error);
  if (errorState.shouldRedirect) {
    navigate("/settings");
  }

  toast.error(errorState.toastMessage);
};

export const generateResearchFromPalette = async ({
  artifacts,
  brief,
  closePalette,
  createArtifact,
  navigate,
  project,
  selectedProjectId,
  setActiveTab,
  toast
}: PaletteGenerationBase): Promise<void> => {
  if (!project || !brief || !selectedProjectId) {
    toast.error("Add project context first.");
    return;
  }

  try {
    const content = await generateResearchPrompt({
      activeNodes: ["brief", "tech-stack", "user-personas"],
      brief,
      project
    });

    await createArtifact({
      agentSystemPromptId: "research-default",
      content,
      contextNodes: ["brief", "tech-stack", "user-personas"],
      platform: "universal",
      type: "research_prompt",
      version: artifacts.filter((artifact) => artifact.type === "research_prompt").length + 1
    });

    setActiveTab("research");
    navigate(`/project/${selectedProjectId}`);
    closePalette();
    toast.success("Research prompt generated.");
  } catch (error) {
    handlePaletteAIError(error, navigate, toast);
  }
};

export const generateDesignFromPalette = async ({
  artifacts,
  brief,
  closePalette,
  createArtifact,
  latestResearchArtifact,
  navigate,
  project,
  selectedProjectId,
  setActiveTab,
  toast
}: PaletteGenerationBase & {
  latestResearchArtifact?: GeneratedArtifact | null;
}): Promise<void> => {
  if (!project || !brief || !selectedProjectId || !latestResearchArtifact) {
    toast.error("Generate research first.");
    return;
  }

  try {
    const content = await generateDesignPrompt({
      brief,
      platform: "Universal",
      project,
      researchSummary: latestResearchArtifact.content
    });

    await createArtifact({
      agentSystemPromptId: "design-default",
      content,
      contextNodes: ["brief", "research-results"],
      platform: "Universal",
      type: "design_prompt",
      version: artifacts.filter((artifact) => artifact.type === "design_prompt").length + 1
    });

    setActiveTab("design");
    navigate(`/project/${selectedProjectId}`);
    closePalette();
    toast.success("Design prompt generated.");
  } catch (error) {
    handlePaletteAIError(error, navigate, toast);
  }
};
