import { cn } from "@/lib/utils";

interface ResearchContextCardProps {
  checked: boolean;
  description: string;
  disabled?: boolean;
  icon: string;
  label: string;
  metadata?: string;
  onToggle: () => void;
  statusLabel: string;
  compact?: boolean; // New prop for compact mode
}

export const ResearchContextCard = ({
  checked,
  description,
  disabled = false,
  icon,
  label,
  metadata,
  onToggle,
  statusLabel,
  compact = false
}: ResearchContextCardProps): JSX.Element => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        "w-full rounded-2xl border px-4 py-4 text-left transition",
        disabled
          ? "cursor-not-allowed border-outline-variant/10 bg-surface opacity-60"
          : checked
            ? "border-primary/30 bg-primary/10"
            : "border-outline-variant/10 bg-surface hover:bg-surface-container-high"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-base text-on-surface-variant">
            {disabled ? "lock" : icon}
          </span>
          <div>
            <p className="text-sm font-medium text-on-surface">{label}</p>
            {!compact && description && (
              <p className="mt-1 text-sm text-on-surface-variant">{description}</p>
            )}
          </div>
        </div>
        <span
          className={cn(
            "rounded-full px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em]",
            disabled
              ? "bg-surface-container-high text-outline"
              : checked
                ? "bg-secondary/10 text-secondary"
                : "bg-surface-container-high text-on-surface-variant"
          )}
        >
          {statusLabel}
        </span>
      </div>
    </button>
  );
};
