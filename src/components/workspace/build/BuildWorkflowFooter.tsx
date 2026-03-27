import type { BuildStage } from "@/types";

interface BuildWorkflowFooterProps {
  completedCount: number;
  currentStageId?: string;
  onExport: () => void;
  platform: string;
  stages: BuildStage[];
}

export const BuildWorkflowFooter = ({
  completedCount,
  currentStageId,
  onExport,
  platform,
  stages
}: BuildWorkflowFooterProps): JSX.Element => {
  return (
    <div className="sticky bottom-0 mt-8 rounded-2xl border border-outline-variant/10 bg-surface/85 px-5 py-4 backdrop-blur-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-outline">
            Global Completion
          </p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Progress: {completedCount} of {stages.length} stages completed
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {stages.map((stage) => (
            <span
              key={stage.id}
              className={`h-3 w-3 rounded-full ${
                stage.status === "complete"
                  ? "bg-secondary"
                  : stage.id === currentStageId
                    ? "bg-primary animate-pulse"
                    : "bg-surface-container-high"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-surface px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
            {platform}
          </span>
          <button
            type="button"
            onClick={onExport}
            className="gradient-cta glow-primary rounded-xl px-4 py-2 text-sm font-semibold text-on-primary"
          >
            Export All
          </button>
        </div>
      </div>
    </div>
  );
};
