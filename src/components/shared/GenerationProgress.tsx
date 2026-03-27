import { cn } from "@/lib/utils";

interface GenerationProgressProps {
  isGenerating: boolean;
  tokenCount?: number;
  lastSaved?: number;
  progress?: number; // 0-100 for workflow generation
  className?: string;
}

export const GenerationProgress = ({
  isGenerating,
  tokenCount,
  lastSaved,
  progress,
  className
}: GenerationProgressProps): JSX.Element | null => {
  // If progress is provided, show progress bar mode
  if (progress !== undefined) {
    // Calculate color based on progress (red → orange → green)
    const getProgressColor = (value: number) => {
      if (value < 50) {
        const ratio = value / 50;
        return `rgb(239, ${Math.round(68 + (168 - 68) * ratio)}, 68)`;
      } else if (value < 80) {
        const ratio = (value - 50) / 30;
        return `rgb(${Math.round(239 - (239 - 132) * ratio)}, ${Math.round(168 + (221 - 168) * ratio)}, 68)`;
      } else {
        const ratio = (value - 80) / 20;
        return `rgb(${Math.round(132 + (34 - 132) * ratio)}, ${Math.round(221 + (196 - 221) * ratio)}, ${Math.round(68 + (87 - 68) * ratio)})`;
      }
    };

    const progressColor = getProgressColor(progress);

    return (
      <div className={cn("w-full space-y-2", className)}>
        <div className="relative h-2 overflow-hidden rounded-full bg-surface-container-high">
          <div
            className="absolute left-0 top-0 h-full transition-all duration-700 ease-out"
            style={{
              width: `${progress}%`,
              backgroundColor: progressColor,
              boxShadow: `0 0 10px ${progressColor}66`
            }}
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className={cn(
            "font-mono text-[10px] uppercase tracking-[0.18em]",
            isGenerating ? "text-primary animate-pulse" : "text-on-surface-variant"
          )}>
            {isGenerating ? "Generating..." : "Ready"}
          </span>
          <span
            className="font-mono text-sm font-semibold"
            style={{ color: progressColor }}
          >
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    );
  }

  // Original token count mode
  return (
    <div className={cn("flex items-center gap-4 text-xs", className)}>
      {/* Token Count */}
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-sm text-on-surface-variant">
          article
        </span>
        <span className="font-mono text-on-surface-variant">
          {tokenCount?.toLocaleString() ?? 0} tokens
        </span>
      </div>

      {/* Generation Status */}
      {isGenerating && (
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-secondary animate-spin">
            progress_activity
          </span>
          <span className="font-mono text-secondary">Generating...</span>
        </div>
      )}

      {/* Last Saved */}
      {lastSaved && !isGenerating && (
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-success">
            check_circle
          </span>
          <span className="font-mono text-success">
            Saved {new Date(lastSaved).toLocaleTimeString()}
          </span>
        </div>
      )}
    </div>
  );
};
