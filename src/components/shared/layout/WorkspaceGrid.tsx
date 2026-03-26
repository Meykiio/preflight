import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WorkspaceGridProps {
  children: ReactNode;
  className?: string;
}

/**
 * Standard 2-column grid layout for workspace pages
 * Use this for consistent layout across Brief, Research, Design, PRD pages
 */
export const WorkspaceGrid = ({ children, className }: WorkspaceGridProps): JSX.Element => {
  return (
    <div className={cn("grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]", className)}>
      {children}
    </div>
  );
};
