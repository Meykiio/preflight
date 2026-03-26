import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PanelProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  badge?: string;
}

/**
 * Standard panel component for side-by-side layouts
 * Use this for OutputPanel, ContextPanel, etc.
 */
export const Panel = ({
  children,
  className,
  title,
  subtitle,
  actions,
  badge
}: PanelProps): JSX.Element => {
  return (
    <div className={cn("rounded-xl border border-outline-variant/10 bg-surface-container p-5", className)}>
      {(title || actions) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && (
              <h3 className="font-headline text-lg font-semibold text-on-surface">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-on-surface-variant">{subtitle}</p>
            )}
            {badge && (
              <span className="mt-2 inline-flex rounded-full bg-secondary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-secondary">
                {badge}
              </span>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
