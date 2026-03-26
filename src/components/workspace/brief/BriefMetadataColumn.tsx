import { useState } from "react";
import { cn } from "@/lib/utils";

const TARGET_USER_EXAMPLES = [
  "Freelance graphic designers, ages 25-45",
  "Small business owners selling on Etsy",
  "Content creators managing multiple platforms",
  "Remote teams needing better collaboration"
];

interface BriefMetadataColumnProps {
  onAddTargetUser: () => void;
  onChangeTargetUserInput: (value: string) => void;
  onRemoveTargetUser: (user: string) => void;
  targetUserInput: string;
  targetUsers: string[];
}

export const BriefMetadataColumn = ({
  onAddTargetUser,
  onChangeTargetUserInput,
  onRemoveTargetUser,
  targetUserInput,
  targetUsers
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

      <section className="rounded-xl border border-dashed border-outline-variant/20 bg-surface-container/50 p-5">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-tertiary">info</span>
          <h2 className="font-headline text-xl font-semibold text-on-surface">Tech Stack</h2>
        </div>
        <p className="mt-2 text-sm text-on-surface-variant">
          Tech stack recommendations will be generated automatically after you complete your research. 
          Our AI will analyze your brief and research to recommend the best technologies for your specific project.
        </p>
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-surface p-3 text-xs text-on-surface-variant">
          <span className="material-symbols-outlined text-sm">lightbulb</span>
          <span>After research completes, you'll see a "Generate Tech Stack" button with personalized recommendations.</span>
        </div>
      </section>
    </div>
  );
};
