import { GenerationProgress } from "./GenerationProgress";

const PLATFORM_OPTIONS = ["Universal", "Lovable", "Cursor"];

const GENERATION_STEPS = [
  "Analyzing PRD...",
  "Generating stages...",
  "Complete"
];

interface BuildWorkflowHeaderProps {
  isGenerating: boolean;
  generationStep?: number; // 0 = analyzing, 1 = generating, 2 = complete
  onGenerate: () => void;
  onSelectPlatform: (platform: string) => void;
  platform: string;
}

export const BuildWorkflowHeader = ({
  isGenerating,
  generationStep = 0,
  onGenerate,
  onSelectPlatform,
  platform
}: BuildWorkflowHeaderProps): JSX.Element => {
  const currentStatus = isGenerating
    ? GENERATION_STEPS[Math.min(generationStep, GENERATION_STEPS.length - 1)]
    : "Orchestrate the entire workspace architecture in sequential prompts.";

  // Smooth progress animation: 0 → 33 → 67 → 100
  const progressPercentage = isGenerating
    ? generationStep === 0 ? 35 : generationStep === 1 ? 75 : 100
    : 0;

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-headline text-[32px] font-bold tracking-tight text-on-surface">
            Sequential Build Engine
          </h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
              Active Workspace
            </span>
            <span className="rounded-full bg-surface px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
              V1.0.42-STABLE
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {PLATFORM_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onSelectPlatform(option)}
              className={`rounded-xl border px-4 py-2 text-sm transition ${
                platform === option
                  ? "border-primary/20 bg-surface-container-high text-primary"
                  : "border-outline-variant/10 text-outline hover:text-on-surface"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={isGenerating}
        className="mt-8 flex w-full items-center justify-between rounded-xl border border-primary/20 bg-primary/10 p-5 text-left transition hover:bg-primary/15 disabled:opacity-50"
      >
        <div className="flex items-center gap-4">
          <span className={`material-symbols-outlined text-3xl text-primary ${isGenerating ? 'animate-spin' : ''}`}>
            {isGenerating ? "progress_activity" : "auto_awesome"}
          </span>
          <div className="flex-1">
            <p className="font-headline text-2xl font-semibold text-on-surface">
              Generate Full Build Workflow
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">
              {isGenerating ? currentStatus : currentStatus}
            </p>
            {isGenerating && (
              <div className="mt-3 w-full max-w-md">
                <GenerationProgress isGenerating={isGenerating} progress={progressPercentage} />
              </div>
            )}
          </div>
        </div>
        <span className="material-symbols-outlined text-3xl text-primary/60">
          {isGenerating ? "hourglass_empty" : "arrow_forward_ios"}
        </span>
      </button>
    </>
  );
};
