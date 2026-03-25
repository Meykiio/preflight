import { cn } from "@/lib/utils";

interface GenerationProgressProps {
  isGenerating: boolean;
  tokenCount: number;
  lastSaved?: number;
  className?: string;
}

export const GenerationProgress = ({
  isGenerating,
  tokenCount,
  lastSaved,
  className
}: GenerationProgressProps): JSX.Element => {
  return (
    <div className={cn("flex items-center gap-4 text-xs", className)}>
      {/* Token Count */}
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-sm text-on-surface-variant">
          article
        </span>
        <span className="font-mono text-on-surface-variant">
          {tokenCount.toLocaleString()} tokens
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
