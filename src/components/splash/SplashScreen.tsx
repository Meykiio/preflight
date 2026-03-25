import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({
  onComplete
}: SplashScreenProps): JSX.Element => {
  const [isVisible, setIsVisible] = useState(true);
  const [showTagline, setShowTagline] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    const taglineTimer = window.setTimeout(() => setShowTagline(true), 300);
    const progressTimer = window.setTimeout(() => setShowProgress(true), 500);
    const fadeTimer = window.setTimeout(() => setIsVisible(false), 2500);
    const completeTimer = window.setTimeout(() => onComplete(), 2800);

    return () => {
      window.clearTimeout(taglineTimer);
      window.clearTimeout(progressTimer);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-surface-container-lowest transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 noise-texture opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-primary/8 blur-3xl" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center px-8 text-center">
        <div
          className={`relative transition-all duration-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          <div className="absolute inset-0 scale-125 rounded-2xl bg-primary/20 blur-3xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-outline-variant/15 bg-surface-container-highest">
            <span
              className="material-symbols-outlined text-5xl text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              pentagon
            </span>
            <span className="material-symbols-outlined absolute text-xl text-on-primary-container">
              rocket_launch
            </span>
          </div>
        </div>

        <div className="mt-8">
          <h1 className="font-headline text-[32px] font-bold tracking-tighter text-on-surface">
            Preflight
          </h1>
          <p
            className={`mt-2 font-mono text-[11px] uppercase tracking-[0.28em] text-outline transition-opacity duration-500 ${
              showTagline ? "opacity-100" : "opacity-0"
            }`}
          >
            Your launchpad. Every build.
          </p>
        </div>

        <div className="mt-12 w-full">
          <div className="h-[3px] overflow-hidden rounded-full bg-surface-variant">
            <div
              className={`h-full rounded-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_12px_rgba(197,192,255,0.4)] transition-all duration-[1900ms] ease-out ${
                showProgress ? "w-full" : "w-0"
              }`}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[10px] uppercase tracking-[0.24em]">
            <span className="flex items-center gap-2 font-mono text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_6px_rgba(110,218,180,0.5)]" />
              Systems Nominal
            </span>
            <span className="flex items-center gap-2 font-mono text-primary/60">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
              Syncing Vault
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-8">
        <div className="mb-2 h-px w-24 bg-outline-variant/20" />
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-outline/40">
          Ready for ignition
        </p>
      </div>

      <div className="absolute bottom-8 right-8 text-right">
        <div className="flex items-center justify-end gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-outline/40">
            Build Hash
          </span>
          <span className="rounded bg-surface-container-high px-1.5 py-0.5 font-mono text-[10px] text-on-surface-variant">
            0x7C6FFD
          </span>
        </div>
        <div className="mt-1 flex items-center justify-end gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-outline/40">
            Environment
          </span>
          <span className="rounded bg-secondary/10 px-1.5 py-0.5 font-mono text-[10px] text-secondary">
            Production
          </span>
        </div>
        <p className="mt-3 font-headline text-[11px] font-bold uppercase tracking-[0.25em] text-outline">
          v0.1.0
        </p>
      </div>
    </div>
  );
};
