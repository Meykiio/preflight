import { useProject } from "@/hooks/useProject";
import { useProjectStore } from "@/stores/projectStore";

export const Header = (): JSX.Element => {
  const selectedProjectId = useProjectStore((state) => state.selectedProjectId);
  const { project } = useProject(selectedProjectId ?? undefined);

  return (
    <header className="glass-panel sticky top-0 z-40 h-16 border-b border-outline-variant/10 px-6 backdrop-blur-2xl bg-[var(--surface-container-lowest)]/80">
      <div className="flex h-full items-center justify-between">
        <div className="flex min-w-0 items-center gap-3">
          {project ? (
            <span className="truncate font-headline text-lg font-bold tracking-tight text-on-surface">
              {project.name}
            </span>
          ) : (
            <span className="font-headline text-lg font-bold tracking-tight text-on-surface">
              Preflight
            </span>
          )}
        </div>
      </div>
    </header>
  );
};
