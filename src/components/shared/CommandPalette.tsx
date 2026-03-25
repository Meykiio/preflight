import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NewProjectModal } from "@/components/hub/NewProjectModal";
import {
  CommandPaletteContent,
} from "@/components/shared/command-palette/CommandPaletteContent";
import { useCommandPaletteActions } from "@/components/shared/command-palette/useCommandPaletteActions";
import { useArtifacts } from "@/hooks/useArtifacts";
import { useBrief } from "@/hooks/useBrief";
import { useBuildStages } from "@/hooks/useBuildStages";
import { useDialogAccessibility } from "@/hooks/useDialogAccessibility";
import { useProject } from "@/hooks/useProject";
import { useProjects } from "@/hooks/useProjects";
import { useProjectStore } from "@/stores/projectStore";
import { useUIStore } from "@/stores/uiStore";

export const CommandPalette = (): JSX.Element | null => {
  const navigate = useNavigate();
  const { projects, isLoading } = useProjects();
  const selectedProjectId = useProjectStore((state) => state.selectedProjectId);
  const { project } = useProject(selectedProjectId ?? undefined);
  const { brief } = useBrief(selectedProjectId ?? undefined);
  const { artifacts, createArtifact } = useArtifacts(selectedProjectId ?? undefined);
  const { stages } = useBuildStages(selectedProjectId ?? undefined);
  const isOpen = useUIStore((state) => state.isCommandPaletteOpen);
  const setCommandPaletteOpen = useUIStore((state) => state.setCommandPaletteOpen);
  const setActiveTab = useUIStore((state) => state.setActiveTab);
  const [query, setQuery] = useState("");
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const dialogRef = useDialogAccessibility<HTMLDivElement>(isOpen, () => {
    setQuery("");
    setCommandPaletteOpen(false);
  });

  if (!isOpen) {
    return null;
  }

  const closePalette = (): void => {
    setQuery("");
    setCommandPaletteOpen(false);
  };

  const latestArtifact = artifacts[0] ?? null;
  const latestResearchArtifact =
    artifacts.find((artifact) => artifact.type === "research_prompt") ?? null;
  const { navigationItems, platformLinks, projectTabs, quickActions } =
    useCommandPaletteActions({
      artifacts,
      brief: brief ?? undefined,
      closePalette,
      createArtifact,
      latestArtifact,
      latestResearchArtifact: latestResearchArtifact ?? undefined,
      onOpenNewProject: () => setIsNewProjectOpen(true),
      project: project ?? undefined,
      selectedProjectId: selectedProjectId ?? undefined,
      stages
    });

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-surface-dim/80 backdrop-blur-sm"
        onClick={closePalette}
      >
        <div className="flex min-h-screen items-start justify-center px-4 pt-24">
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Global command palette"
            className="glass-panel w-full max-w-2xl rounded-xl border border-outline-variant/15 bg-surface-container shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <CommandPaletteContent
              actions={quickActions}
              isLoading={isLoading}
              navigationItems={navigationItems}
              onProjectSelect={(projectId) => {
                setActiveTab("brief");
                navigate(`/project/${projectId}`);
                closePalette();
              }}
              onQueryChange={setQuery}
              platformLinks={platformLinks}
              projectTabs={projectTabs}
              projects={projects}
              query={query}
            />
          </div>
        </div>
      </div>

      <NewProjectModal isOpen={isNewProjectOpen} onOpenChange={setIsNewProjectOpen} />
    </>
  );
};
