interface BuildWorkflowEmptyStateProps {
  onGenerate: () => void;
}

export const BuildWorkflowEmptyState = ({
  onGenerate
}: BuildWorkflowEmptyStateProps): JSX.Element => {
  return (
    <div className="rounded-2xl border border-dashed border-outline-variant/20 bg-surface px-6 py-12 text-center">
      <span className="material-symbols-outlined text-5xl text-outline/40">
        lock
      </span>
      <p className="mt-4 font-headline text-xl font-semibold text-on-surface">
        Generate your first build workflow above
      </p>
      <p className="mt-2 text-sm text-on-surface-variant">
        Preflight will turn your PRD into sequential implementation stages.
      </p>
      <button
        type="button"
        onClick={onGenerate}
        className="gradient-cta glow-primary mt-6 rounded-xl px-5 py-3 text-sm font-semibold text-on-primary"
      >
        Generate Build Workflow
      </button>
    </div>
  );
};
