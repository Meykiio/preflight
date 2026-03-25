import type { DropzoneInputProps, DropzoneRootProps } from "react-dropzone";

interface VaultSidebarPanelProps {
  activeContextTokens: number;
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
  isDragActive: boolean;
  onOpenPicker: () => void;
  totalBytesLabel: string;
  fileCount: number;
}

export const VaultSidebarPanel = ({
  activeContextTokens,
  getInputProps,
  getRootProps,
  isDragActive,
  onOpenPicker,
  totalBytesLabel,
  fileCount
}: VaultSidebarPanelProps): JSX.Element => {
  return (
    <div className="space-y-6">
      <section
        {...getRootProps()}
        className={`rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isDragActive ? "border-primary/40 bg-primary/5" : "border-outline-variant/25 bg-surface-container"
        }`}
      >
        <input {...getInputProps()} />
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-high">
          <span className="material-symbols-outlined text-[40px] text-outline">
            cloud_upload
          </span>
        </div>
        <h2 className="mt-5 font-headline text-2xl font-semibold text-on-surface">
          Drop your project brain here
        </h2>
        <p className="mt-2 text-sm text-on-surface-variant">
          Accepting PDF, MD, PNG, and JSON context files
        </p>
        <button
          type="button"
          onClick={onOpenPicker}
          className="mt-6 rounded-xl border border-outline-variant/15 bg-surface px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-on-surface transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-surface-container-high"
        >
          Select Assets
        </button>
      </section>

      <section className="rounded-2xl border border-outline-variant/10 bg-surface-container p-5">
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-on-surface-variant">Total Files</span>
            <span className="font-mono text-on-surface">{fileCount}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-on-surface-variant">Total Size</span>
            <span className="font-mono text-on-surface">{totalBytesLabel}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-on-surface-variant">Active Context</span>
            <span className="font-mono text-on-surface">
              {activeContextTokens.toLocaleString()} tokens
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
