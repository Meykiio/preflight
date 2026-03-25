import { PLATFORM_TOGGLE_OPTIONS } from "@/lib/ai/providerCatalog";

interface PlatformLaunchersSectionProps {
  enabledLaunchers: string[];
  onToggleLauncher: (launcherId: string) => void;
}

export const PlatformLaunchersSection = ({
  enabledLaunchers,
  onToggleLauncher
}: PlatformLaunchersSectionProps): JSX.Element => {
  return (
    <section className="rounded-2xl border border-outline-variant/10 bg-surface-container p-6">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">rocket_launch</span>
        <h2 className="font-headline text-2xl font-semibold text-on-surface">
          Platform Launchers
        </h2>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {PLATFORM_TOGGLE_OPTIONS.map((platform) => {
          const isEnabled = enabledLaunchers.includes(platform.id);

          return (
            <div
              key={platform.id}
              className="flex items-center justify-between rounded-xl bg-surface px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">
                  {platform.icon}
                </span>
                <span className="font-headline text-sm font-semibold uppercase tracking-[0.1em] text-on-surface">
                  {platform.label}
                </span>
              </div>
              <button
                type="button"
                aria-label={`Toggle ${platform.label}`}
                onClick={() => onToggleLauncher(platform.id)}
                className={`relative h-6 w-11 rounded-full transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  isEnabled ? "bg-secondary" : "bg-surface-container-highest"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    isEnabled ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
