import { VaultFileCard } from "@/components/workspace/VaultFileCard";
import type { VaultFile } from "@/types";

interface VaultLibraryGridProps {
  files: VaultFile[];
  onDeleteFile: (fileId: string, fileName: string) => void;
  onDownloadFile: (file: VaultFile) => void;
  onToggleContext: (fileId: string) => void;
  uploadingCards: VaultFile[];
}

export const VaultLibraryGrid = ({
  files,
  onDeleteFile,
  onDownloadFile,
  onToggleContext,
  uploadingCards
}: VaultLibraryGridProps): JSX.Element => {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        {uploadingCards.map((file) => (
          <VaultFileCard
            key={file.id}
            file={file}
            isUploading
            onDelete={() => undefined}
            onDownload={() => undefined}
            onToggleContext={() => undefined}
          />
        ))}

        {files.map((file) => (
          <VaultFileCard
            key={file.id}
            file={file}
            onDelete={() => onDeleteFile(file.id, file.name)}
            onDownload={onDownloadFile}
            onToggleContext={onToggleContext}
          />
        ))}

        {files.length === 0 && uploadingCards.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-outline-variant/20 bg-surface px-6 py-16 text-center md:col-span-2">
            <span className="material-symbols-outlined text-5xl text-outline/40">
              inventory_2
            </span>
            <p className="mt-4 font-headline text-xl font-semibold text-on-surface">
              No files match this view
            </p>
            <p className="mt-2 text-sm text-on-surface-variant">
              Upload fresh context or adjust the active filters to surface more assets.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
