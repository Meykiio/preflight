import type { RefObject } from "react";
import { ResearchFileCard } from "@/components/workspace/ResearchFileCard";
import type { VaultFile } from "@/types";

interface ResearchFilesSectionProps {
  fileInputRef: RefObject<HTMLInputElement>;
  isDragging: boolean;
  onDeleteFile: (fileId: string, fileName: string) => void;
  onDownloadFile: (file: VaultFile) => void;
  onDragEnter: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onToggleContext: (fileId: string) => void;
  onUploadInputChange: (files: FileList | null) => void;
  researchFiles: VaultFile[];
}

export const ResearchFilesSection = ({
  fileInputRef,
  isDragging,
  onDeleteFile,
  onDownloadFile,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onToggleContext,
  onUploadInputChange,
  researchFiles
}: ResearchFilesSectionProps): JSX.Element => {
  return (
    <section className="mt-8 rounded-2xl border border-outline-variant/10 bg-surface-container p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-headline text-2xl font-semibold text-on-surface">
              Research Results
            </h2>
            <span className="rounded-full bg-secondary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-secondary">
              Drag & Drop Ready
            </span>
          </div>
          <p className="mt-2 text-sm text-on-surface-variant">
            Upload PDFs, Markdown, or text files and selectively inject them into later
            generations.
          </p>
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-xl border border-outline-variant/15 bg-surface px-4 py-3 text-sm text-on-surface transition hover:bg-surface-container-high"
        >
          Upload Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.md,.txt,text/plain,text/markdown,application/pdf"
          className="hidden"
          onChange={(event) => onUploadInputChange(event.target.files)}
        />
      </div>

      <div
        className={`mt-6 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
          isDragging ? "border-primary/40 bg-primary/5" : "border-outline-variant/20 bg-surface"
        }`}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <p className="font-headline text-xl font-semibold text-on-surface">
          Drop research files here
        </p>
        <p className="mt-2 text-sm text-on-surface-variant">
          Accepted formats: PDF, Markdown, TXT
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {researchFiles.length > 0 ? (
          researchFiles.map((file) => (
            <ResearchFileCard
              key={file.id}
              file={file}
              onDelete={() => onDeleteFile(file.id, file.name)}
              onDownload={onDownloadFile}
              onToggleContext={onToggleContext}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-outline-variant/10 bg-surface px-5 py-8 text-sm text-on-surface-variant md:col-span-2 xl:col-span-3">
            No research result files uploaded yet.
          </div>
        )}
      </div>
    </section>
  );
};
