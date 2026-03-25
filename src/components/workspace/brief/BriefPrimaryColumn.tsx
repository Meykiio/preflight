import type { CoreFeature } from "@/types";

interface BriefPrimaryColumnProps {
  features: CoreFeature[];
  onAddFeature: () => void;
  onChangeProblem: (value: string) => void;
  onRemoveFeature: (featureId: string) => void;
  onUpdateFeature: (featureId: string, value: string) => void;
  problem: string;
}

export const BriefPrimaryColumn = ({
  features,
  onAddFeature,
  onChangeProblem,
  onRemoveFeature,
  onUpdateFeature,
  problem
}: BriefPrimaryColumnProps): JSX.Element => {
  return (
    <div className="space-y-6">
      <section className="noise-texture rounded-xl bg-surface-container p-5">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-tertiary">warning</span>
          <h2 className="font-headline text-xl font-semibold text-on-surface">
            The Problem
          </h2>
        </div>
        <textarea
          rows={4}
          value={problem}
          onChange={(event) => onChangeProblem(event.target.value)}
          placeholder="What problem does this solve? Be specific."
          className="mt-4 w-full rounded-xl bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none placeholder:text-on-surface-variant"
        />
      </section>

      <section className="rounded-xl bg-surface-container p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            <h2 className="font-headline text-xl font-semibold text-on-surface">
              Core Features
            </h2>
          </div>
          <button
            type="button"
            onClick={onAddFeature}
            className="text-xs uppercase tracking-[0.18em] text-primary transition hover:text-on-surface"
          >
            Add Requirement
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="flex items-center gap-3 rounded-xl bg-surface-container-lowest px-3 py-3"
            >
              <span className="rounded-full bg-surface px-2 py-1 font-mono text-xs text-on-surface-variant">
                {(index + 1).toString().padStart(2, "0")}
              </span>
              <input
                type="text"
                value={feature.text}
                onChange={(event) => onUpdateFeature(feature.id, event.target.value)}
                placeholder="Describe a key requirement"
                className="w-full bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant"
              />
              <span className="material-symbols-outlined text-on-surface-variant">
                drag_indicator
              </span>
              <button
                type="button"
                onClick={() => onRemoveFeature(feature.id)}
                className="rounded-full p-1 text-on-surface-variant transition hover:bg-surface hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-base">delete</span>
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onAddFeature}
          className="mt-4 rounded-xl border border-outline-variant/15 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface transition hover:bg-surface"
        >
          Add Feature
        </button>
      </section>
    </div>
  );
};
