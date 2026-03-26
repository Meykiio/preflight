import { useState } from "react";
import type { TechStackRecommendation } from "@/services/generation/techStackRecommendation";

interface TechStackModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: TechStackRecommendation | null;
  onAccept: () => void;
  projectName: string;
}

export const TechStackModal = ({
  isOpen,
  onClose,
  recommendation,
  onAccept,
  projectName
}: TechStackModalProps): JSX.Element | null => {
  const [selectedAlternative, setSelectedAlternative] = useState<number | null>(null);

  if (!isOpen || !recommendation) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface-dim/80 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tech-stack-title"
        className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-outline-variant/15 bg-surface-container p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
              Tech Stack Recommendation
            </p>
            <h2 id="tech-stack-title" className="mt-2 font-headline text-2xl font-bold tracking-tight text-on-surface">
              Recommended for {projectName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Main Recommendations */}
        <div className="mt-6 space-y-6">
          {/* Frontend */}
          <section className="rounded-xl border border-outline-variant/10 bg-surface p-5">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">code</span>
              <h3 className="font-headline text-lg font-semibold text-on-surface">Frontend</h3>
            </div>
            <div className="mt-3">
              <p className="font-mono text-sm text-primary">{recommendation.frontend.name} {recommendation.frontend.version}</p>
              <p className="mt-2 text-sm text-on-surface-variant">{recommendation.frontend.rationale}</p>
            </div>
          </section>

          {/* Styling */}
          <section className="rounded-xl border border-outline-variant/10 bg-surface p-5">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary">palette</span>
              <h3 className="font-headline text-lg font-semibold text-on-surface">Styling</h3>
            </div>
            <div className="mt-3">
              <p className="font-mono text-sm text-secondary">{recommendation.styling.name} {recommendation.styling.version}</p>
              <p className="mt-2 text-sm text-on-surface-variant">{recommendation.styling.rationale}</p>
            </div>
          </section>

          {/* State Management */}
          <section className="rounded-xl border border-outline-variant/10 bg-surface p-5">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-tertiary">storage</span>
              <h3 className="font-headline text-lg font-semibold text-on-surface">State Management</h3>
            </div>
            <div className="mt-3">
              <p className="font-mono text-sm text-tertiary">{recommendation.stateManagement.name} {recommendation.stateManagement.version}</p>
              <p className="mt-2 text-sm text-on-surface-variant">{recommendation.stateManagement.rationale}</p>
            </div>
          </section>

          {/* Database */}
          <section className="rounded-xl border border-outline-variant/10 bg-surface p-5">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-success">database</span>
              <h3 className="font-headline text-lg font-semibold text-on-surface">Database</h3>
            </div>
            <div className="mt-3">
              <p className="font-mono text-sm text-success">{recommendation.database.name} {recommendation.database.version}</p>
              <p className="mt-2 text-sm text-on-surface-variant">{recommendation.database.rationale}</p>
            </div>
          </section>

          {/* Deployment */}
          <section className="rounded-xl border border-outline-variant/10 bg-surface p-5">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-warning">rocket_launch</span>
              <h3 className="font-headline text-lg font-semibold text-on-surface">Deployment</h3>
            </div>
            <div className="mt-3">
              <p className="font-mono text-sm text-warning">{recommendation.deployment.name}</p>
              <p className="mt-2 text-sm text-on-surface-variant">{recommendation.deployment.rationale}</p>
            </div>
          </section>

          {/* Alternatives */}
          {recommendation.alternatives.length > 0 && (
            <section className="rounded-xl border border-dashed border-outline-variant/20 bg-surface-container/50 p-5">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-outline">swap_horiz</span>
                <h3 className="font-headline text-lg font-semibold text-on-surface">Alternative Stacks</h3>
              </div>
              <div className="mt-4 space-y-3">
                {recommendation.alternatives.map((alt, index) => (
                  <label
                    key={index}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-outline-variant/15 bg-surface p-3 transition hover:bg-surface-container-high"
                  >
                    <input
                      type="radio"
                      name="alternative"
                      checked={selectedAlternative === index}
                      onChange={() => setSelectedAlternative(index)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-on-surface">{alt.name}</p>
                      <p className="mt-1 text-sm text-on-surface-variant">{alt.tradeoffs}</p>
                    </div>
                  </label>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-3 border-t border-outline-variant/10 pt-6">
          <button
            type="button"
            onClick={onAccept}
            className="gradient-cta glow-primary flex items-center justify-center gap-2 rounded-xl px-6 py-4 font-semibold text-on-primary"
          >
            <span className="material-symbols-outlined">check_circle</span>
            Accept This Stack
          </button>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-outline-variant/15 bg-surface-container px-6 py-4 text-sm text-on-surface transition hover:bg-surface-bright"
            >
              Maybe Later
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl px-6 py-4 text-sm text-on-surface-variant transition hover:text-on-surface"
            >
              Skip for Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
