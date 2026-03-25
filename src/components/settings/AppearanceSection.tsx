import { cn } from "@/lib/utils";

interface AppearanceSectionProps {
  userName: string;
  onChangeUserName: (userName: string) => void;
}

export const AppearanceSection = ({
  userName,
  onChangeUserName
}: AppearanceSectionProps): JSX.Element => {
  return (
    <section className="rounded-2xl border border-outline-variant/10 bg-surface-container p-6">
      <h2 className="font-headline text-lg font-semibold uppercase tracking-[0.14em] text-on-surface">
        Appearance
      </h2>

      <div className="mt-6 space-y-5">
        <div>
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
            Your name
          </label>
          <input
            type="text"
            value={userName}
            onChange={(event) => onChangeUserName(event.target.value)}
            placeholder="How should Preflight greet you?"
            className="w-full rounded-xl border border-outline-variant/15 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary/40"
          />
        </div>

        <div className="rounded-xl border border-outline-variant/10 bg-surface p-4 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-on-surface-variant">
            Dark Theme
          </p>
          <p className="mt-2 text-sm text-outline">
            Preflight uses a dark-only theme for optimal developer experience.
          </p>
        </div>
      </div>
    </section>
  );
};
