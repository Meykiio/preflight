import type { VaultFile } from "@/types";

interface DesignHistoryCardProps {
  file: VaultFile;
  onDelete: () => void;
  onDownload: (file: VaultFile) => void;
}

const getPlatformLabel = (fileName: string): string => {
  const normalized = fileName.toLowerCase();

  if (normalized.includes("stitch")) {
    return "STITCH V4";
  }

  if (normalized.includes("v0")) {
    return "V0 RENDER";
  }

  if (normalized.includes("figma")) {
    return "FIGMA AI";
  }

  return "DESIGN FILE";
};

export const DesignHistoryCard = ({
  file,
  onDelete,
  onDownload
}: DesignHistoryCardProps): JSX.Element => {
  return (
    <article className="overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container">
      <div className="flex h-36 items-center justify-center bg-surface-container-lowest text-primary/70">
        <span className="material-symbols-outlined text-5xl">
          {file.mimeType.startsWith("image/") ? "image" : "draft"}
        </span>
      </div>
      <div className="p-4">
        <span className="rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
          {getPlatformLabel(file.name)}
        </span>
        <p className="mt-3 truncate text-sm font-medium text-on-surface">{file.name}</p>
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onDownload(file)}
            aria-label={`Download ${file.name}`}
            className="rounded-lg bg-surface px-3 py-2 text-xs text-on-surface transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-surface-container-high"
          >
            Download
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${file.name}`}
            className="rounded-lg bg-surface px-3 py-2 text-xs text-on-surface-variant transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-surface-container-high hover:text-on-surface"
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
};
