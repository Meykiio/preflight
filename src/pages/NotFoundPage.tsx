import { Link } from "react-router-dom";

export const NotFoundPage = (): JSX.Element => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6">
      <div className="max-w-lg text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-surface-container-high">
            <span className="material-symbols-outlined text-5xl text-primary">
              explore_off
            </span>
          </div>
        </div>

        <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
          404 Error
        </p>

        <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight text-on-surface">
          Page not found
        </h1>

        <p className="mt-4 text-on-surface-variant">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="gradient-cta glow-primary inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-on-primary transition"
          >
            <span className="material-symbols-outlined text-base">home</span>
            <span>Back to Project Hub</span>
          </Link>

          <Link
            to="/docs"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-surface-container-high px-6 py-3 font-semibold text-on-surface transition hover:bg-surface-container-highest"
          >
            <span className="material-symbols-outlined text-base">help</span>
            <span>View Documentation</span>
          </Link>
        </div>

        <div className="mt-12 text-xs text-on-surface-variant">
          <p>If you believe this is an error, please report it on GitHub.</p>
        </div>
      </div>
    </div>
  );
};
