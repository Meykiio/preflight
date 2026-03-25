import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { NAVIGATION_ITEMS, PLATFORM_LINKS, PROJECT_TABS } from "@/components/shared/command-palette/commandPaletteConfig";
import { generateDesignFromPalette, generateResearchFromPalette } from "@/components/shared/command-palette/commandPaletteGeneration";
import type { CommandPaletteAction } from "@/components/shared/command-palette/CommandPaletteContent";
import { useToast } from "@/hooks/useToast";
import { copyToClipboard } from "@/lib/utils";
import { exportAllPrompts } from "@/services/generation/buildGeneration";
import { useUIStore } from "@/stores/uiStore";
import type { ArtifactType, Brief, BuildStage, GeneratedArtifact, Project } from "@/types";

interface UseCommandPaletteActionsInput {
  artifacts: GeneratedArtifact[];
  brief?: Brief;
  closePalette: () => void;
  createArtifact: (artifact: { agentSystemPromptId: string; content: string; contextNodes?: string[]; platform: string; type: ArtifactType; version?: number }) => Promise<GeneratedArtifact | null>;
  latestArtifact: GeneratedArtifact | null;
  latestResearchArtifact?: GeneratedArtifact | null;
  onOpenNewProject: () => void;
  project?: Project;
  selectedProjectId?: string;
  stages: BuildStage[];
}

export const useCommandPaletteActions = ({
  artifacts,
  brief,
  closePalette,
  createArtifact,
  latestArtifact,
  latestResearchArtifact,
  onOpenNewProject,
  project,
  selectedProjectId,
  stages
}: UseCommandPaletteActionsInput): {
  navigationItems: CommandPaletteAction[];
  platformLinks: CommandPaletteAction[];
  projectTabs: CommandPaletteAction[];
  quickActions: CommandPaletteAction[];
} => {
  const navigate = useNavigate();
  const toast = useToast();
  const setActiveTab = useUIStore((state) => state.setActiveTab);
  const briefComplete = Boolean(brief?.problem.trim() || brief?.targetUser.trim() || brief?.coreFeatures.some((feature) => feature.text.trim()));
  const handleNavigate = (path: string, tab?: string): void => {
    if (tab) setActiveTab(tab);
    navigate(path);
    closePalette();
  };
  const quickActions = useMemo<CommandPaletteAction[]>(
    () => [
      { id: "new-project", icon: "add_circle", label: "New Project", shortcut: "⌘N", onSelect: () => { closePalette(); onOpenNewProject(); } },
      {
        id: "generate-research",
        icon: "analytics",
        label: "Generate Research Prompt",
        shortcut: "⌘R",
        hidden: !selectedProjectId || !briefComplete,
        onSelect: () => void generateResearchFromPalette({ artifacts, brief, closePalette, createArtifact, navigate, project, selectedProjectId, setActiveTab, toast })
      },
      {
        id: "generate-design",
        icon: "architecture",
        label: "Generate Design Prompt",
        shortcut: "⌘D",
        hidden: !selectedProjectId || !latestResearchArtifact,
        onSelect: () => void generateDesignFromPalette({ artifacts, brief, closePalette, createArtifact, latestResearchArtifact, navigate, project, selectedProjectId, setActiveTab, toast })
      },
      { id: "export-build", icon: "download", label: "Export Build Prompts", shortcut: "⌘E", hidden: stages.length === 0, onSelect: () => { exportAllPrompts(stages); closePalette(); toast.success("Build workflow exported."); } },
      {
        id: "copy-last-artifact",
        icon: "content_copy",
        label: "Copy Last Artifact",
        shortcut: "⌘C",
        hidden: !latestArtifact,
        onSelect: async () => {
          if (!latestArtifact) return;
          const copied = await copyToClipboard(latestArtifact.content);
          closePalette();
          copied ? toast.success("Latest artifact copied.") : toast.error("Copy failed.");
        }
      }
    ],
    [artifacts, brief, briefComplete, closePalette, createArtifact, latestArtifact, latestResearchArtifact, navigate, onOpenNewProject, project, selectedProjectId, setActiveTab, stages, toast]
  );
  return {
    navigationItems: NAVIGATION_ITEMS.map((item) => ({ ...item, onSelect: () => handleNavigate(item.id === "settings" ? "/settings" : "/") })),
    platformLinks: PLATFORM_LINKS.map((item) => ({ id: item.id, icon: item.icon, label: item.label, onSelect: () => { window.open(item.url, "_blank", "noopener,noreferrer"); closePalette(); } })),
    projectTabs: selectedProjectId ? PROJECT_TABS.map((tab) => ({ ...tab, onSelect: () => handleNavigate(`/project/${selectedProjectId}`, tab.id) })) : [],
    quickActions
  };
};
