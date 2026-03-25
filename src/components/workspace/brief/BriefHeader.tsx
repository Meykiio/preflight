import { cn } from "@/lib/utils";

interface BriefHeaderProps {
  completionScore: boolean;
  onBlurProjectName: () => void;
  onChangeProjectName: (value: string) => void;
  projectName: string;
  saveState: "idle" | "saving" | "saved";
}

export const BriefHeader = ({
  completionScore,
  onBlurProjectName,
  onChangeProjectName,
  projectName,
  saveState
}: BriefHeaderProps): JSX.Element => {
  return (
    <div>
      <input
        type="text"
        value={projectName}
        onChange={(event) => onChangeProjectName(event.target.value)}
        onBlur={onBlurProjectName}
        placeholder="Untitled project"
        className="w-full bg-transparent font-headline text-[40px] font-bold tracking-tight text-on-surface outline-none placeholder:text-outline"
      />
      <div className="mt-3 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-outline">
        <span>Project Identity</span>
        <span
          className={cn(
            "rounded-full px-2 py-1",
            saveState === "saving"
              ? "bg-tertiary/10 text-tertiary"
              : saveState === "saved"
                ? "bg-secondary/10 text-secondary"
                : "bg-surface-container text-on-surface-variant"
          )}
        >
          {saveState === "saving" ? "Autosaving" : saveState === "saved" ? "Saved" : "Draft"}
        </span>
        {completionScore ? <span className="text-secondary">Complete</span> : null}
      </div>
    </div>
  );
};
