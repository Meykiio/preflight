import { cn } from "@/lib/utils";
import type { Platform } from "@/types";

const PLATFORM_OPTIONS: Platform[] = [
  "lovable",
  "bolt",
  "cursor",
  "claude-code",
  "replit",
  "v0",
  "other"
];

interface BriefMetadataColumnProps {
  onAddTargetUser: () => void;
  onAddTechStack: () => void;
  onChangeTargetUserInput: (value: string) => void;
  onChangeTechStackInput: (value: string) => void;
  onRemoveTargetUser: (user: string) => void;
  onRemoveTechStackTag: (tag: string) => void;
  onTogglePlatform: (platform: Platform) => void;
  targetPlatforms: Platform[];
  targetUserInput: string;
  targetUsers: string[];
  techStack: string[];
  techStackInput: string;
}

export const BriefMetadataColumn = ({
  onAddTargetUser,
  onAddTechStack,
  onChangeTargetUserInput,
  onChangeTechStackInput,
  onRemoveTargetUser,
  onRemoveTechStackTag,
  onTogglePlatform,
  targetPlatforms,
  targetUserInput,
  targetUsers,
  techStack,
  techStackInput
}: BriefMetadataColumnProps): JSX.Element => {
  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-surface-container p-5">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">groups</span>
          <h2 className="font-headline text-xl font-semibold text-on-surface">Target User</h2>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {targetUsers.map((user) => (
            <button
              key={user}
              type="button"
              onClick={() => onRemoveTargetUser(user)}
              className="rounded-full bg-primary/10 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-primary"
            >
              {user}
            </button>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={targetUserInput}
            onChange={(event) => onChangeTargetUserInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onAddTargetUser();
              }
            }}
            placeholder="Add a user type"
            className="w-full rounded-xl bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none placeholder:text-on-surface-variant"
          />
          <button
            type="button"
            onClick={onAddTargetUser}
            className="rounded-xl bg-surface-container-lowest px-4 py-3 text-sm text-on-surface transition hover:bg-surface"
          >
            Add
          </button>
        </div>
      </section>

      <section className="rounded-xl bg-surface-container p-5">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">stacked_line_chart</span>
          <h2 className="font-headline text-xl font-semibold text-on-surface">
            Tech Stack Hint
          </h2>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {techStack.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onRemoveTechStackTag(tag)}
              className="rounded-full bg-secondary/10 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-secondary"
            >
              {tag}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={techStackInput}
          onChange={(event) => onChangeTechStackInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onAddTechStack();
            }
          }}
          placeholder="Type a tech name and press Enter"
          className="mt-4 w-full rounded-xl bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none placeholder:text-on-surface-variant"
        />
      </section>

      <section className="rounded-xl bg-surface-container p-5">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">desktop_windows</span>
          <h2 className="font-headline text-xl font-semibold text-on-surface">
            Target Platforms
          </h2>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {PLATFORM_OPTIONS.map((platform) => {
            const isSelected = targetPlatforms.includes(platform);

            return (
              <button
                key={platform}
                type="button"
                onClick={() => onTogglePlatform(platform)}
                className={cn(
                  "rounded-xl border px-3 py-2 text-xs uppercase tracking-[0.18em] transition",
                  isSelected
                    ? "border-primary/40 bg-primary/15 text-primary"
                    : "border-outline-variant/15 bg-surface-container-lowest text-on-surface-variant hover:text-on-surface"
                )}
              >
                {platform}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
