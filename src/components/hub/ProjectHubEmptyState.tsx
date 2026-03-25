interface ProjectHubEmptyStateProps {
  onCreateProject: () => void;
}

export const ProjectHubEmptyState = ({
  onCreateProject
}: ProjectHubEmptyStateProps): JSX.Element => {
  return (
    <div className="py-24 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary/40">
        <span className="material-symbols-outlined text-5xl">rocket_launch</span>
      </div>
      <h2 className="mt-6 font-headline text-[28px] font-bold text-on-surface">
        No projects yet.
      </h2>
      <p className="mt-3 text-outline">
        Start with an idea. Preflight handles the rest.
      </p>
      <button
        type="button"
        onClick={onCreateProject}
        className="gradient-cta glow-primary mt-8 rounded-xl px-5 py-3 text-sm font-semibold text-on-primary"
      >
        Create your first project
      </button>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          ["Guided Setup", "Bootstrap a project shell in minutes."],
          ["Templates", "Turn repeated project patterns into momentum."],
          ["Vault Training", "Collect the research and files your build needs."]
        ].map(([title, description]) => (
          <div
            key={title}
            className="rounded-2xl border border-outline-variant/10 bg-surface-container p-5 text-left"
          >
            <h3 className="font-headline text-lg font-semibold text-on-surface">
              {title}
            </h3>
            <p className="mt-2 text-sm text-on-surface-variant">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
