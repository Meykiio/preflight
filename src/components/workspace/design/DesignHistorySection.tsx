import type { RefObject } from "react";
import { DesignHistoryCard } from "@/components/workspace/DesignHistoryCard";
import type { VaultFile } from "@/types";

interface DesignHistorySectionProps {
  designFiles: VaultFile[];
  fileInputRef: RefObject<HTMLInputElement>;
  onDeleteFile: (fileId: string, fileName: string) => void;
  onDownloadFile: (file: VaultFile) => void;
  onUploadInputChange: (files: FileList | null) => void;
}

export const DesignHistorySection = ({
  designFiles,
  fileInputRef,
  onDeleteFile,
  onDownloadFile,
  onUploadInputChange
}: DesignHistorySectionProps): JSX.Element => {
  return (
    <section className="mt-8 rounded-2xl border border-outline-variant/10 bg-surface-container p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-headline text-2xl font-semibold text-on-surface">
            Output History
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Manage and view previously generated dashboard wireframes and uploaded design
            concepts.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-xl border border-outline-variant/15 bg-surface px-4 py-3 text-sm text-on-surface transition hover:bg-surface-container-high"
          >
            + Add Concept
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="gradient-cta glow-primary rounded-xl px-4 py-3 text-sm font-semibold text-on-primary"
          >
            Upload Design Output
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,application/pdf"
          className="hidden"
          onChange={(event) => onUploadInputChange(event.target.files)}
        />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {designFiles.length > 0 ? (
          designFiles.map((file) => (
            <DesignHistoryCard
              key={file.id}
              file={file}
              onDelete={() => onDeleteFile(file.id, file.name)}
              onDownload={onDownloadFile}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-outline-variant/10 bg-surface px-5 py-8 text-sm text-on-surface-variant md:col-span-2 xl:col-span-3">
            No design outputs uploaded yet.
          </div>
        )}
      </div>
    </section>
  );
};
