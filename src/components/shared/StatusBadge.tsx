import { memo } from "react";
import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/types";

interface StatusBadgeProps {
  status: ProjectStatus;
}

const STATUS_TONES: Record<ProjectStatus, string> = {
  ideation: "text-outline bg-outline/10",
  researching: "text-tertiary bg-tertiary/10",
  designing: "text-primary bg-primary/10",
  building: "text-secondary bg-secondary/10",
  shipped: "text-secondary bg-secondary/10"
};

const DOT_TONES: Record<ProjectStatus, string> = {
  ideation: "bg-outline",
  researching: "bg-tertiary",
  designing: "bg-primary",
  building: "bg-secondary animate-pulse",
  shipped: "bg-secondary"
};

export const StatusBadge = memo(({ status }: StatusBadgeProps): JSX.Element => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider",
        STATUS_TONES[status]
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", DOT_TONES[status])} />
      <span>{status}</span>
    </span>
  );
});

StatusBadge.displayName = "StatusBadge";
