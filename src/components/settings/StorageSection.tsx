interface StorageSectionProps {
  onClearAllData: () => void;
  onExportJson: () => void;
  onOpenLogs: () => void;
}

export const StorageSection = ({
  onClearAllData,
  onExportJson,
  onOpenLogs
}: StorageSectionProps): JSX.Element => {
  return (
    <section className="rounded-2xl border border-outline-variant/10 bg-surface-container p-6">
      <h2 className="font-headline text-lg font-semibold uppercase tracking-[0.14em] text-on-surface">
        Storage
      </h2>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={onExportJson}
          className="flex w-full items-center justify-between rounded-xl bg-surface px-4 py-4 text-left transition hover:bg-surface-container-high"
        >
          <span className="flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface-variant">
              file_download
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.14em] text-on-surface">
              Export JSON
            </span>
          </span>
          <span className="material-symbols-outlined text-on-surface-variant">
            arrow_forward_ios
          </span>
        </button>

        <button
          type="button"
          onClick={onOpenLogs}
          className="flex w-full items-center justify-between rounded-xl bg-surface px-4 py-4 text-left transition hover:bg-surface-container-high"
        >
          <span className="flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface-variant">
              history
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.14em] text-on-surface">
              Usage Logs
            </span>
          </span>
          <span className="material-symbols-outlined text-on-surface-variant">
            arrow_forward_ios
          </span>
        </button>

        <button
          type="button"
          onClick={onClearAllData}
          className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl border border-tertiary/20 bg-tertiary/10 px-4 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-tertiary transition hover:bg-tertiary/15"
        >
          <span className="material-symbols-outlined text-base">delete_forever</span>
          <span>Clear All Data</span>
        </button>
      </div>
    </section>
  );
};
