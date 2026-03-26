import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  icon?: string;
  description?: string;
  action?: ReactNode;
}

/**
 * Consistent card styling for all sections
 * Use this for uniform padding, borders, and spacing
 */
export const SectionCard = ({
  children,
  className,
  title,
  icon,
  description,
  action
}: SectionCardProps): JSX.Element => {
  return (
    <section className={cn("rounded-xl bg-surface-container p-5", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {icon && (
              <span className="material-symbols-outlined text-primary">{icon}</span>
            )}
            {title && (
              <h2 className="font-headline text-xl font-semibold text-on-surface">
                {title}
              </h2>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {description && (
        <p className="mb-4 text-sm text-on-surface-variant">{description}</p>
      )}
      {children}
    </section>
  );
};
