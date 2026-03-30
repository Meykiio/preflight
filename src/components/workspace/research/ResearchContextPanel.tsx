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
  nodeAvailability,
}: ResearchContextPanelProps): JSX.Element => {
  return (
    <section className="rounded-2xl border border-outline-variant/10 bg-surface-container p-5">
      <div className="flex flex-wrap items-center gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="font-headline text-xl font-bold tracking-tight text-on-surface">
            Research Intelligence
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating}
            className="gradient-cta glow-primary shrink-0 whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-semibold text-on-primary disabled:opacity-50"
          >
            {isGenerating ? "Generating..." : "Generate Research"}
          </button>
        </div>
      </div>

      <div className="mt-6">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-outline">
          Context Nodes
        </p>
        <div className="mt-3 space-y-3">
          <ResearchContextCard
            checked={activeNodes.includes("brief")}
            description=""
            disabled={!nodeAvailability.brief}
            icon="description"
            label="Project Brief"
            metadata={statusMeta}
            onToggle={() => onToggleNode("brief")}
            statusLabel={nodeAvailability.brief ? "Available" : "Missing data"}
            compact={true}
          />
          <ResearchContextCard
            checked={activeNodes.includes("tech-stack")}
            description=""
            disabled={!nodeAvailability.techStack}
            icon="stacked_line_chart"
            label="Tech Stack"
            metadata={
              projectTechStackCount > 0
                ? `${projectTechStackCount} tags selected`
                : undefined
            }
            onToggle={() => onToggleNode("tech-stack")}
            statusLabel={
              nodeAvailability.techStack ? "Available" : "Missing data"
            }
            compact={true}
          />
          <ResearchContextCard
            checked={activeNodes.includes("user-personas")}
            description=""
            disabled={!nodeAvailability.userPersonas}
            icon="groups"
            label="User Personas"
            metadata={undefined}
            onToggle={() => onToggleNode("user-personas")}
            statusLabel={
              nodeAvailability.userPersonas ? "Available" : "Missing data"
            }
            compact={true}
          />
        </div>
      </div>

      {errorMessage ? (
        <div className="mt-4 rounded-xl border border-tertiary/20 bg-tertiary/10 px-4 py-3 text-sm text-tertiary">
          {errorMessage}
        </div>
      ) : null}
    </section>
  );
};
