import { ResearchContextCard } from "@/components/workspace/ResearchContextCard";

interface NodeAvailability {
  brief: boolean;
  techStack: boolean;
  userPersonas: boolean;
}

interface ResearchContextPanelProps {
  activeNodes: string[];
  errorMessage: string;
  isGenerating: boolean;
  onGenerate: () => void;
  onToggleNode: (nodeId: string) => void;
  projectTechStackCount: number;
  projectUserContext?: string;
  statusMeta?: string;
  nodeAvailability: NodeAvailability;
}

export const ResearchContextPanel = ({
  activeNodes,
  errorMessage,
  isGenerating,
  onGenerate,
  onToggleNode,
  projectTechStackCount,
  projectUserContext,
  statusMeta,
  nodeAvailability
}: ResearchContextPanelProps): JSX.Element => {
  return (
    <section className="rounded-2xl border border-outline-variant/10 bg-surface-container p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-[28px] font-bold tracking-tight text-on-surface">
            Research Intelligence
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Synthesize project context into high-fidelity research prompts for LLM
            analysis.
          </p>
        </div>
        <span className="rounded-full bg-secondary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-secondary">
          System Ready
        </span>
      </div>

      <div className="mt-6">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-outline">
          Context Nodes
        </p>
        <div className="mt-3 space-y-3">
          <ResearchContextCard
            checked={activeNodes.includes("brief")}
            description="Use the structured brief to define the core product problem and features."
            disabled={!nodeAvailability.brief}
            icon="description"
            label="Project Brief"
            metadata={statusMeta}
            onToggle={() => onToggleNode("brief")}
            statusLabel={nodeAvailability.brief ? "Available" : "Missing data"}
          />
          <ResearchContextCard
            checked={activeNodes.includes("tech-stack")}
            description="Include the stack hints already captured for implementation feasibility."
            disabled={!nodeAvailability.techStack}
            icon="stacked_line_chart"
            label="Tech Stack"
            metadata={
              projectTechStackCount > 0 ? `${projectTechStackCount} tags selected` : undefined
            }
            onToggle={() => onToggleNode("tech-stack")}
            statusLabel={nodeAvailability.techStack ? "Available" : "Missing data"}
          />
          <ResearchContextCard
            checked={activeNodes.includes("user-personas")}
            description="Bring target-user framing into the research output."
            disabled={!nodeAvailability.userPersonas}
            icon="groups"
            label="User Personas"
            metadata={projectUserContext}
            onToggle={() => onToggleNode("user-personas")}
            statusLabel={nodeAvailability.userPersonas ? "Available" : "Missing data"}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={isGenerating}
        className="gradient-cta glow-primary mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-on-primary disabled:opacity-60"
      >
        {isGenerating ? (
          <>
            <span className="material-symbols-outlined animate-spin text-base">
              progress_activity
            </span>
            <span>Generating...</span>
          </>
        ) : (
          <span>Generate Research Prompt</span>
        )}
      </button>

      {errorMessage ? (
        <div className="mt-4 rounded-xl border border-tertiary/20 bg-tertiary/10 px-4 py-3 text-sm text-tertiary">
          {errorMessage}
        </div>
      ) : null}
    </section>
  );
};
