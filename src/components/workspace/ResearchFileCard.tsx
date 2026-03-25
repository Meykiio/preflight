import { formatFileSize } from "@/lib/utils";
import type { VaultFile } from "@/types";

interface ResearchFileCardProps {
  file: VaultFile;
  onDelete: () => void;
  onDownload: (file: VaultFile) => void;
  onToggleContext: (fileId: string) => void;
}

export const ResearchFileCard = ({
  file,
  onDelete,
  onDownload,
  onToggleContext
}: ResearchFileCardProps): JSX.Element => {
  return (
    <article className="rounded-2xl border border-outline-variant/10 bg-surface-container p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-on-surface">{file.name}</p>
          <p className="mt-1 text-xs text-on-surface-variant">
            {formatFileSize(file.size)} - Ready
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onDownload(file)}
            aria-label={`Download ${file.name}`}
            className="rounded-full p-2 text-on-surface-variant transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-surface hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-base">download</span>
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${file.name}`}
            className="rounded-full p-2 text-on-surface-variant transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-surface hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-base">delete</span>
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-surface px-3 py-3">
        <div>
          <p className="text-sm font-medium text-on-surface">Inject Context</p>
          <p className="text-xs text-on-surface-variant">
            Include this result in future generations.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onToggleContext(file.id)}
          aria-label={`Toggle context injection for ${file.name}`}
          className={`relative h-7 w-12 rounded-full transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            file.isActiveContext ? "bg-primary/50" : "bg-surface-container-high"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
              file.isActiveContext ? "left-6" : "left-1"
            }`}
          />
        </button>
      </div>
    </article>
  );
};
