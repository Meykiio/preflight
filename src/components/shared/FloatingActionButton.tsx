import { useUIStore } from "@/stores/uiStore";

const WORKSPACE_FLOW = ["brief", "research", "design", "prd", "build", "ship", "vault"] as const;

type WorkspaceStage = (typeof WORKSPACE_FLOW)[number];

interface FloatingActionButtonProps {
  onCompleteStage?: () => void;
}

export const FloatingActionButton = ({
  onCompleteStage
}: FloatingActionButtonProps): JSX.Element | null => {
  const activeTab = useUIStore((state) => state.activeTab);
  const setActiveTab = useUIStore((state) => state.setActiveTab);

  const currentIndex = WORKSPACE_FLOW.indexOf(activeTab as WorkspaceStage);
  const isLastStage = currentIndex === WORKSPACE_FLOW.length - 1;
  const nextStage = WORKSPACE_FLOW[currentIndex + 1];

  const handleCompleteAndContinue = () => {
    // Mark current stage as complete (callback to parent)
    onCompleteStage?.();

    // Navigate to next stage by updating activeTab
    if (nextStage) {
      setActiveTab(nextStage);
      // Scroll to top
      window.scrollTo(0, 0);
    }
  };

  const handleJustContinue = () => {
    if (nextStage) {
      setActiveTab(nextStage);
      window.scrollTo(0, 0);
    }
  };

  // Don't show on first stage (Brief) or last stage (Vault)
  if (currentIndex === -1 || currentIndex === 0 || isLastStage) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* Complete & Continue Button */}
      <button
        type="button"
        onClick={handleCompleteAndContinue}
        className="gradient-cta glow-primary flex items-center gap-2 rounded-full px-6 py-3 font-mono text-sm font-semibold text-on-primary shadow-elevation-2 transition hover:shadow-elevation-3"
        title="Mark current stage complete and go to next stage"
      >
        <span className="material-symbols-outlined text-lg">check_circle</span>
        Complete & Continue
      </button>

      {/* Just Continue Button (secondary) */}
      <button
        type="button"
        onClick={handleJustContinue}
        className="flex items-center gap-2 rounded-full border border-outline-variant/15 bg-surface-container px-6 py-3 font-mono text-sm text-on-surface shadow-elevation-1 transition hover:bg-surface-bright hover:shadow-elevation-2"
        title="Go to next stage without marking complete"
      >
        <span className="material-symbols-outlined text-lg">arrow_forward</span>
        Go to {nextStage === "prd" ? "PRD" : nextStage.charAt(0).toUpperCase() + nextStage.slice(1)}
      </button>
    </div>
  );
};
