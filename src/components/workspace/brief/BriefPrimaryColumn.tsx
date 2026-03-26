import { useState } from "react";
import type { CoreFeature } from "@/types";

interface BriefPrimaryColumnProps {
  features: CoreFeature[];
  onAddFeature: () => void;
  onChangeProblem: (value: string) => void;
  onRemoveFeature: (featureId: string) => void;
  onUpdateFeature: (featureId: string, value: string) => void;
  problem: string;
}

const PROBLEM_EXAMPLE = "Freelance designers struggle to create unique print designs quickly. They waste hours on generic templates that don't stand out, losing potential sales on platforms like Etsy and Redbubble.";

const FEATURE_EXAMPLES = [
  "Drag-and-drop design editor with custom templates",
  "AI-powered design suggestions based on trends",
  "One-click export to print-on-demand platforms",
  "Real-time collaboration with team members"
];

export const BriefPrimaryColumn = ({
  features,
  onAddFeature,
  onChangeProblem,
  onRemoveFeature,
  onUpdateFeature,
  problem
}: BriefPrimaryColumnProps): JSX.Element => {
  const [showProblemExample, setShowProblemExample] = useState(false);
  const [showFeatureExamples, setShowFeatureExamples] = useState(false);

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
          placeholder="What problem does this solve? Be specific about who has this pain point and why it matters."
          className="mt-4 w-full rounded-xl bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none placeholder:text-on-surface-variant"
        />
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-on-surface-variant">
            Describe the pain point your users experience daily.
          </p>
          <button
            type="button"
            onClick={() => setShowProblemExample(!showProblemExample)}
            className="text-xs text-primary transition hover:text-on-surface"
          >
            {showProblemExample ? "Hide Example" : "Show Example"}
          </button>
        </div>
        {showProblemExample && (
          <div className="mt-3 rounded-lg border border-outline-variant/10 bg-surface p-3 text-sm text-on-surface-variant">
            <p className="font-medium text-on-surface">Example:</p>
            <p className="mt-1">{PROBLEM_EXAMPLE}</p>
          </div>
        )}
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
                placeholder="e.g., Drag-and-drop design editor"
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

        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-on-surface-variant">
            Start with 3-5 most important features. You can add more later.
          </p>
          <button
            type="button"
            onClick={() => setShowFeatureExamples(!showFeatureExamples)}
            className="text-xs text-primary transition hover:text-on-surface"
          >
            {showFeatureExamples ? "Hide Examples" : "Show Examples"}
          </button>
        </div>
        {showFeatureExamples && (
          <div className="mt-3 rounded-lg border border-outline-variant/10 bg-surface p-3 text-sm text-on-surface-variant">
            <p className="font-medium text-on-surface">Examples:</p>
            <ul className="mt-1 list-inside list-disc space-y-1">
              {FEATURE_EXAMPLES.map((example, index) => (
                <li key={index}>{example}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
};
