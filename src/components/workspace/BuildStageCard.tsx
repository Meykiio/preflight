import { memo, useState } from "react";
import { CopyButton } from "@/components/shared/CopyButton";
import { cn } from "@/lib/utils";
import type { BuildStage } from "@/types";

interface BuildStageCardProps {
  onStatusChange: (stage: BuildStage) => void;
  stage: BuildStage;
}

const STATUS_LABELS: Record<BuildStage["status"], string> = {
  locked: "Locked",
  "not-started": "Not Started",
  "in-progress": "In Progress",
  complete: "Complete"
};

const STATUS_TONES: Record<BuildStage["status"], string> = {
  locked: "bg-outline/10 text-outline",
  "not-started": "bg-surface-container-high text-on-surface-variant",
  "in-progress": "bg-secondary/10 text-secondary",
  complete: "bg-secondary/20 text-secondary"
};

const BuildStageCardComponent = ({
  onStatusChange,
  stage
}: BuildStageCardProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(stage.status === "in-progress");
  const isLocked = stage.status === "locked";
  const stageTone =
    stage.stageNumber <= 2
      ? "bg-primary/20 text-primary"
      : stage.stageNumber <= 4
        ? "bg-secondary/20 text-secondary"
        : "bg-outline-variant/20 text-on-surface";

  return (
    <article
      className={cn(
        "relative rounded-xl border border-outline-variant/10 bg-surface-container p-5 transition-all",
        stage.status === "in-progress" ? "border-l-[3px] border-l-primary" : "",
        stage.status === "complete" ? "opacity-80" : "",
        isLocked ? "opacity-40" : ""
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg font-mono text-sm font-bold",
            stageTone
          )}
        >
          {stage.stageNumber.toString().padStart(2, "0")}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="font-headline text-lg font-semibold text-on-surface">
                {stage.name}
              </h3>
              <p className="mt-1 text-sm text-outline">{stage.description}</p>
            </div>
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em]",
                STATUS_TONES[stage.status]
              )}
            >
              {stage.status === "complete" ? (
                <span className="material-symbols-outlined text-xs">check</span>
              ) : stage.status === "in-progress" ? (
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary" />
              ) : null}
              {STATUS_LABELS[stage.status]}
            </span>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-on-surface-variant">
            {Array.from({ length: 5 }).map((_, index) => (
              <span
                key={index}
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  index < Math.min(stage.stageNumber, 5)
                    ? "bg-primary"
                    : "bg-surface-container-high"
                )}
              />
            ))}
            <span>{stage.status === "complete" ? "Steps complete" : "Steps queued"}</span>
          </div>

          <div className="mt-4 rounded-xl bg-surface-container-lowest">
            <div className="flex items-center justify-between border-b border-outline-variant/10 px-4 py-3">
              <span className="rounded-full bg-surface px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
                {stage.name.replace(/\s+/g, "-").toUpperCase()}.txt
              </span>
              <div className="flex items-center gap-2">
                {!isLocked ? <CopyButton text={stage.promptContent} size="sm" /> : null}
                <button
                  type="button"
                  onClick={() => setIsExpanded((current) => !current)}
                  className="rounded-full p-2 text-on-surface-variant transition hover:bg-surface hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-base">
                    {isExpanded ? "expand_less" : "expand_more"}
                  </span>
                </button>
              </div>
            </div>

            {isExpanded ? (
              <pre className="overflow-x-auto whitespace-pre-wrap px-4 py-4 font-mono text-sm text-secondary">
                {stage.promptContent}
              </pre>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              disabled={isLocked}
              onClick={() => onStatusChange(stage)}
              className="gradient-cta glow-primary rounded-xl px-4 py-2 text-sm font-semibold text-on-primary disabled:opacity-50"
            >
              {stage.status === "not-started" && "Start Stage"}
              {stage.status === "in-progress" && "Mark Complete"}
              {stage.status === "complete" && "Mark In Progress"}
              {stage.status === "locked" && "Locked"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export const BuildStageCard = memo(BuildStageCardComponent);
BuildStageCard.displayName = "BuildStageCard";
