import { useRef, useState } from "react";

interface ProjectTechStackFieldProps {
  techStack: string[];
  onAddTechStack: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

const clearInput = (input: HTMLInputElement | null): void => {
  if (input) {
    input.value = "";
  }
};

export const ProjectTechStackField = ({
  techStack,
  onAddTechStack,
  onRemoveTag
}: ProjectTechStackFieldProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddTag = (): void => {
    const value = inputRef.current?.value.trim() ?? "";
    if (value && !techStack.includes(value)) {
      onAddTechStack(value);
      clearInput(inputRef.current);
    }
  };

  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-on-surface-variant">
        Tech stack tags
      </label>
      <div className="rounded-2xl border border-outline-variant/15 bg-surface p-3">
        <div className="flex flex-wrap gap-2">
          {techStack.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onRemoveTag(tag)}
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-primary"
            >
              <span>{tag}</span>
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a tag and press Enter"
            className="w-full bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleAddTag();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="rounded-lg bg-surface-container-high px-3 py-2 text-sm text-on-surface transition hover:bg-surface-bright"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
