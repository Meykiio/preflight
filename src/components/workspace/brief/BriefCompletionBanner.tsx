interface BriefCompletionBannerProps {
  onContinue: () => void;
  projectName: string;
}

export const BriefCompletionBanner = ({
  onContinue,
  projectName
}: BriefCompletionBannerProps): JSX.Element => {
  return (
    <div className="sticky bottom-0 mt-8 rounded-2xl border border-outline-variant/10 bg-surface/80 px-5 py-4 backdrop-blur-md">
      <button
        type="button"
        onClick={onContinue}
        className="gradient-cta glow-primary flex w-full items-center justify-center gap-2 rounded-xl px-4 py-4 text-sm font-semibold text-on-primary"
      >
        <span>Brief looks complete -&gt; Generate Research Prompt</span>
        <span className="material-symbols-outlined text-base">arrow_forward</span>
      </button>
      <p className="mt-3 text-center text-sm text-on-surface-variant">
        This will initialize the Analysis Engine to find market gaps and technical
        feasibility for {projectName || "your project"}.
      </p>
    </div>
  );
};
