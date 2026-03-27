import { memo } from "react";
import { cn } from "@/lib/utils";

interface GenerationProgressProps {
  isGenerating: boolean;
  progress: number; // 0-100
}

export const GenerationProgress = memo(({
  isGenerating,
  progress
}: GenerationProgressProps): JSX.Element => {
  // Calculate color based on progress
  // 0-50%: red to orange
  // 50-80%: orange to yellow-green
  // 80-100%: yellow-green to green
  const getProgressColor = (value: number) => {
    if (value < 50) {
      // Red to Orange (0-50%)
      const ratio = value / 50;
      const r = 239;
      const g = Math.round(68 + (168 - 68) * ratio);
      const b = 68;
      return `rgb(${r}, ${g}, ${b})`;
    } else if (value < 80) {
      // Orange to Yellow-Green (50-80%)
      const ratio = (value - 50) / 30;
      const r = Math.round(239 - (239 - 132) * ratio);
      const g = Math.round(168 + (221 - 168) * ratio);
      const b = Math.round(68 + (68 - 68) * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Yellow-Green to Green (80-100%)
      const ratio = (value - 80) / 20;
      const r = Math.round(132 + (34 - 132) * ratio);
      const g = Math.round(221 + (196 - 221) * ratio);
      const b = Math.round(68 + (87 - 68) * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  const progressColor = getProgressColor(progress);

  return (
    <div className="w-full space-y-2">
      {/* Progress Bar */}
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

      {/* Progress Text */}
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
});

GenerationProgress.displayName = "GenerationProgress";
