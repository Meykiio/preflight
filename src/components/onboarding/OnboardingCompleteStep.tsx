interface OnboardingCompleteStepProps {
  onComplete: () => void;
}

export const OnboardingCompleteStep = ({
  onComplete
}: OnboardingCompleteStepProps): JSX.Element => {
  return (
    <div className="p-10 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10 text-secondary">
        <svg viewBox="0 0 52 52" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="4">
          <path
            d="M14 28l8 8 16-18"
            className="origin-center [stroke-dasharray:40] [stroke-dashoffset:40] animate-[draw_0.6s_ease_forwards]"
          />
        </svg>
      </div>

      <h1 className="mt-8 font-headline text-4xl font-bold tracking-tight text-on-surface">
        You're all set.
      </h1>
      <p className="mt-3 text-on-surface-variant">
        Create your first project, or explore the interface.
      </p>

      <button
        type="button"
        onClick={onComplete}
        className="gradient-cta glow-primary mt-10 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 font-semibold text-on-primary"
      >
        <span>Open Preflight</span>
        <span className="material-symbols-outlined text-base">arrow_forward</span>
      </button>
    </div>
  );
};
