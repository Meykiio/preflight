interface OnboardingProgressProps {
  step: 1 | 2 | 3 | 4;
}

export const OnboardingProgress = ({
  step
}: OnboardingProgressProps): JSX.Element => {
  return (
    <div className="absolute left-0 top-0 flex h-1.5 w-full overflow-hidden rounded-t-xl bg-surface-container-lowest">
      {[1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className={`flex-1 ${
            step >= index ? "bg-primary" : "bg-surface-container-lowest"
          } ${index === 2 && step === 1 ? "bg-primary/20" : ""}`}
        />
      ))}
    </div>
  );
};
