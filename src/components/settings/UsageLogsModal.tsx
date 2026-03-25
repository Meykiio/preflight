import { useDialogAccessibility } from "@/hooks/useDialogAccessibility";
import { formatDate } from "@/lib/utils";
import type { UsageLogEntry } from "@/lib/appData";

interface UsageLogsModalProps {
  entries: UsageLogEntry[];
  isOpen: boolean;
  onClose: () => void;
}

export const UsageLogsModal = ({
  entries,
  isOpen,
  onClose
}: UsageLogsModalProps): JSX.Element | null => {
  const dialogRef = useDialogAccessibility<HTMLDivElement>(isOpen, onClose);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface-dim/80 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="usage-logs-title"
        className="glass-panel w-full max-w-2xl rounded-2xl border border-outline-variant/15 bg-surface-container p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              Usage Logs
            </p>
            <h2
              id="usage-logs-title"
              className="mt-2 font-headline text-2xl font-semibold text-on-surface"
            >
              Generation history
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-on-surface-variant transition hover:bg-surface hover:text-on-surface"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="mt-6 max-h-[420px] space-y-3 overflow-y-auto pr-1">
          {entries.length > 0 ? (
            entries.map((entry) => (
              <article
                key={entry.id}
                className="rounded-xl border border-outline-variant/10 bg-surface p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-headline text-lg font-semibold text-on-surface">
                    {entry.label}
                  </p>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
                    {formatDate(entry.createdAt)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-on-surface-variant">{entry.meta}</p>
              </article>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-outline-variant/20 bg-surface px-6 py-12 text-center">
              <p className="font-headline text-xl font-semibold text-on-surface">
                No generation events yet
              </p>
              <p className="mt-2 text-sm text-on-surface-variant">
                Logs will appear here after you generate prompts and artifacts.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
