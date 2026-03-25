import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ContextNodeSelector } from "@/components/workspace/ContextNodeSelector";
import { useProject } from "@/hooks/useProject";
import { cn } from "@/lib/utils";
import { BriefPage } from "@/pages/workspace/BriefPage";
import { BuildPage } from "@/pages/workspace/BuildPage";
import { PRDPage } from "@/pages/workspace/PRDPage";
import { DesignPage } from "@/pages/workspace/DesignPage";
import { ResearchPage } from "@/pages/workspace/ResearchPage";
import { ShipPage } from "@/pages/workspace/ShipPage";
import { VaultPage } from "@/pages/workspace/VaultPage";
import { useUIStore } from "@/stores/uiStore";

const WORKSPACE_STAGES = [
  { id: "brief", label: "Brief" },
  { id: "research", label: "Research" },
  { id: "design", label: "Design" },
  { id: "prd", label: "PRD" },
  { id: "build", label: "Build" },
  { id: "ship", label: "Ship" },
  { id: "vault", label: "Vault" }
] as const;

const PLACEHOLDER_STAGE_LABELS: Record<string, number> = {
  brief: 6,
  research: 7,
  design: 8,
  prd: 9,
  build: 10,
  vault: 11
};

const STATUS_STAGE_INDEX = {
  ideation: 0,
  researching: 1,
  designing: 2,
  building: 4,
  shipped: 5
} as const;

export const ProjectWorkspace = (): JSX.Element => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { project, isLoading } = useProject(projectId);
  const activeTab = useUIStore((state) => state.activeTab);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

  const currentStageIndex = useMemo(() => {
    if (project?.status === "shipped") {
      return 5;
    }

    const activeIndex = WORKSPACE_STAGES.findIndex((stage) => stage.id === activeTab);
    if (activeIndex >= 0) {
      return activeIndex;
    }

    return project ? STATUS_STAGE_INDEX[project.status] : 0;
  }, [activeTab, project]);

  if (!isLoading && !project) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-2xl bg-surface-container p-8 text-center">
          <h1 className="font-headline text-3xl font-bold text-on-surface">
            Project not found
          </h1>
          <p className="mt-3 text-on-surface-variant">
            The requested workspace could not be loaded.
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="gradient-cta glow-primary mt-6 rounded-xl px-4 py-3 text-sm font-semibold text-on-primary"
          >
            Back to Projects
          </button>
        </div>
      </section>
    );
  }

  const stageNumber = PLACEHOLDER_STAGE_LABELS[activeTab] ?? 6;
  const activeLabel =
    WORKSPACE_STAGES.find((stage) => stage.id === activeTab)?.label ?? "Brief";

  const renderActiveContent = (): JSX.Element => {
    if (activeTab === "brief") {
      return <BriefPage />;
    }

    if (activeTab === "research") {
      return <ResearchPage />;
    }

    if (activeTab === "design") {
      return <DesignPage onOpenContextSelector={() => setIsSelectorOpen(true)} />;
    }

    if (activeTab === "prd" && projectId) {
      return <PRDPage projectId={projectId} />;
    }

    if (activeTab === "build" && projectId) {
      return <BuildPage projectId={projectId} />;
    }

    if (activeTab === "vault") {
      return <VaultPage />;
    }

    if (activeTab === "ship" && projectId) {
      return <ShipPage projectId={projectId} />;
    }

    return (
      <div className="flex h-full items-center justify-center px-8">
        <div className="rounded-2xl border border-outline-variant/10 bg-surface-container p-10 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
            Workspace Placeholder
          </p>
          <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight text-on-surface">
            {activeLabel}
          </h1>
          <p className="mt-3 text-on-surface-variant">
            Coming in Stage {stageNumber}.
          </p>
        </div>
      </div>
    );
  };

  return (
    <section className="-mx-6 -my-8 flex min-h-[calc(100vh-3.5rem)] flex-col">
      <div className="sticky top-0 z-30 border-b border-outline-variant/10 bg-surface/80 px-8 py-4 backdrop-blur-md">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="transition hover:text-on-surface"
              >
                Projects
              </button>
              <span>/</span>
              <span className="text-on-surface">{project?.name ?? "Loading..."}</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {WORKSPACE_STAGES.map((stage, index) => {
                const isCompleted = index < currentStageIndex;
                const isCurrent = index === currentStageIndex;

                return (
                  <span
                    key={stage.id}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs",
                      isCompleted
                        ? "bg-secondary/20 text-secondary"
                        : isCurrent
                          ? "bg-primary/20 text-primary animate-pulse"
                          : "bg-surface-container text-outline"
                    )}
                  >
                    {stage.label}
                  </span>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSelectorOpen((current) => !current)}
            className="rounded-xl border border-outline-variant/15 bg-surface-container px-4 py-3 text-sm text-on-surface transition hover:bg-surface-container-high"
          >
            Context Nodes
          </button>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        {renderActiveContent()}

        {projectId ? (
          <ContextNodeSelector
            isOpen={isSelectorOpen}
            projectId={projectId}
            selectedNodes={selectedNodes}
            onChangeNodes={setSelectedNodes}
          />
        ) : null}
      </div>
    </section>
  );
};
