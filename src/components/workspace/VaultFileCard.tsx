import { formatDate, formatFileSize, truncate } from "@/lib/utils";
import type { VaultFile } from "@/types";

interface VaultFileCardProps {
  file: VaultFile;
  isUploading?: boolean;
  onDelete: (fileId: string) => void;
  onDownload: (file: VaultFile) => void;
  onToggleContext: (fileId: string) => void;
}

const getFileTypeMeta = (
  file: VaultFile
): {
  accent: string;
  icon: string;
} => {
  const normalized = file.name.toLowerCase();

  if (normalized.endsWith(".pdf")) {
    return {
      accent: "text-tertiary",
      icon: "picture_as_pdf"
    };
  }

  if (normalized.endsWith(".md") || normalized.endsWith(".txt")) {
    return {
      accent: "text-primary",
      icon: "article"
    };
  }

  if (normalized.endsWith(".json") || normalized.endsWith(".zip")) {
    return {
      accent: "text-on-surface-variant",
      icon: "data_object"
    };
  }

  if (file.mimeType.startsWith("image/")) {
    return {
      accent: "text-secondary",
      icon: "image"
    };
  }

  return {
    accent: "text-on-surface-variant",
    icon: "draft"
  };
};

export const VaultFileCard = ({
  file,
  isUploading = false,
  onDelete,
  onDownload,
  onToggleContext
}: VaultFileCardProps): JSX.Element => {
  const meta = getFileTypeMeta(file);

  return (
    <article className="group relative rounded-2xl border border-outline-variant/10 bg-surface-container p-5 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:border-primary/30">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-outline-variant/15 bg-surface-container-lowest">
            <span className={`material-symbols-outlined text-2xl ${meta.accent}`}>
              {meta.icon}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-mono text-sm text-on-surface">
              {truncate(file.name, 34)}
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-on-surface-variant">
              {formatFileSize(file.size)} • Updated {formatDate(file.uploadedAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
          <button
            type="button"
            aria-label={`Download ${file.name}`}
            onClick={() => onDownload(file)}
            className="rounded-full p-1.5 text-on-surface-variant transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-surface hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-lg">download</span>
          </button>
          <button
            type="button"
            aria-label={`Delete ${file.name}`}
            onClick={() => onDelete(file.id)}
            className="rounded-full p-1.5 text-on-surface-variant transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-surface hover:text-tertiary"
          >
            <span className="material-symbols-outlined text-lg">delete</span>
          </button>
        </div>
      </div>

      {isUploading ? (
        <div className="mt-5 rounded-xl border border-outline-variant/10 bg-surface px-3 py-3">
          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span>Uploading to vault</span>
            <span className="font-mono uppercase tracking-[0.18em] text-primary">
              Active
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-container-high">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-secondary" />
          </div>
        </div>
      ) : (
        <div className="mt-5 flex items-center justify-between border-t border-outline-variant/10 pt-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
              Inject Context
            </p>
            <p className="mt-1 text-xs text-on-surface-variant">
              Include in future generations.
            </p>
          </div>
          <button
            type="button"
            aria-label={`Toggle context injection for ${file.name}`}
            onClick={() => onToggleContext(file.id)}
            className={`relative h-6 w-11 rounded-full transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              file.isActiveContext ? "bg-secondary" : "bg-surface-container-highest"
            }`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                file.isActiveContext ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>
      )}
    </article>
  );
};
