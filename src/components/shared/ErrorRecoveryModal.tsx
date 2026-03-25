import { useEffect, useState } from "react";
import { resumeGeneration, clearCheckpoint } from "@/services/ai/checkpoint";
import type { GenerationCheckpoint } from "@/services/ai/checkpoint";

interface ErrorRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  onResume: (checkpoint: GenerationCheckpoint) => void;
}

export const ErrorRecoveryModal = ({
  isOpen,
  onClose,
  onRetry,
  onResume
}: ErrorRecoveryModalProps): JSX.Element | null => {
  const [checkpoint, setCheckpoint] = useState<GenerationCheckpoint | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Check for recoverable generation
      const savedCheckpoint = resumeGeneration();
      setCheckpoint(savedCheckpoint);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleResume = () => {
    if (checkpoint) {
      onResume(checkpoint);
      onClose();
    }
  };

  const handleRetry = () => {
    if (checkpoint) {
      clearCheckpoint();
    }
    onRetry();
    onClose();
  };

  const handleCancel = () => {
    if (checkpoint) {
      clearCheckpoint();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="recovery-title"
        className="relative z-10 w-full max-w-md rounded-2xl bg-surface-container p-6 shadow-elevation-2"
      >
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error/10">
          <span className="material-symbols-outlined text-error">
            {checkpoint ? "recover" : "error"}
          </span>
        </div>

        {/* Title */}
        <h2
          id="recovery-title"
          className="text-center font-headline text-xl font-semibold text-on-surface"
        >
          {checkpoint ? "Resume Generation?" : "Generation Failed"}
        </h2>

        {/* Description */}
        <p className="mt-3 text-center text-sm text-on-surface-variant">
          {checkpoint
            ? `Found ${checkpoint.tokenCount} tokens from previous generation. Would you like to resume where you left off?`
            : "The generation encountered an error. You can retry or cancel."}
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3">
          {checkpoint && (
            <button
              type="button"
              onClick={handleResume}
              className="gradient-cta glow-primary rounded-xl px-4 py-3 text-sm font-semibold text-on-primary"
            >
              Resume Generation
            </button>
          )}

          <button
            type="button"
            onClick={handleRetry}
            className="rounded-xl border border-outline-variant/15 bg-surface-container-high px-4 py-3 text-sm text-on-surface transition hover:bg-surface-bright"
          >
            {checkpoint ? "Start Over" : "Retry"}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl px-4 py-3 text-sm text-on-surface-variant transition hover:text-on-surface"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
