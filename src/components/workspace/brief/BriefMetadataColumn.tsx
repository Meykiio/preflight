import { useState } from "react";
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

const TARGET_USER_EXAMPLES = [
  "Freelance graphic designers, ages 25-45",
  "Small business owners selling on Etsy",
  "Content creators managing multiple platforms",
  "Remote teams needing better collaboration"
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
  const [showUserExamples, setShowUserExamples] = useState(false);

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-surface-container p-5">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">groups</span>
          <h2 className="font-headline text-xl font-semibold text-on-surface">Target User</h2>
        </div>
        <p className="mt-2 text-xs text-on-surface-variant">
          Who has this problem? Think about their job, skills, and current workflow.
        </p>
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
            placeholder="e.g., Freelance designers, Small business owners"
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
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-on-surface-variant">
            Add 1-3 target user types.
          </p>
          <button
            type="button"
            onClick={() => setShowUserExamples(!showUserExamples)}
            className="text-xs text-primary transition hover:text-on-surface"
          >
            {showUserExamples ? "Hide Examples" : "Show Examples"}
          </button>
        </div>
        {showUserExamples && (
          <div className="mt-3 rounded-lg border border-outline-variant/10 bg-surface p-3 text-sm text-on-surface-variant">
            <p className="font-medium text-on-surface">Examples:</p>
            <ul className="mt-1 list-inside list-disc space-y-1">
              {TARGET_USER_EXAMPLES.map((example, index) => (
                <li key={index}>{example}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="rounded-xl bg-surface-container p-5">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">stacked_line_chart</span>
          <h2 className="font-headline text-xl font-semibold text-on-surface">
            Tech Stack (Optional)
          </h2>
        </div>
        <p className="mt-2 text-xs text-on-surface-variant">
          Already have tech preferences? Add them here. Not sure? Skip for now — AI can recommend later.
        </p>
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
          placeholder="Type a tech name and press Enter (e.g., React, Python)"
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
