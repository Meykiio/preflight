import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { AppLayout } from "@/components/layout/AppLayout";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { SplashScreen } from "@/components/splash/SplashScreen";
import { ToastProvider } from "@/components/shared/ToastProvider";
import { useFirstLaunch } from "@/hooks/useFirstLaunch";
import { useSettings } from "@/hooks/useSettings";
import db from "@/lib/db";

type AppPhase = "splash" | "onboarding" | "app";

const ProjectHubPage = lazy(() =>
  import("@/pages/ProjectHubPage").then((module) => ({
    default: module.ProjectHubPage
  }))
);
const ProjectWorkspacePage = lazy(() =>
  import("@/pages/ProjectWorkspacePage").then((module) => ({
    default: module.ProjectWorkspacePage
  }))
);
const SettingsPage = lazy(() =>
  import("@/pages/SettingsPage").then((module) => ({
    default: module.SettingsPage
  }))
);
const DocumentationPage = lazy(() => import("@/pages/DocumentationPage"));
const NotFoundPage = lazy(() =>
  import("@/pages/NotFoundPage").then((module) => ({
    default: module.NotFoundPage
  }))
);
const PrivacyPage = lazy(() =>
  import("@/pages/PrivacyPage").then((module) => ({
    default: module.PrivacyPage
  }))
);
const TermsPage = lazy(() =>
  import("@/pages/TermsPage").then((module) => ({
    default: module.TermsPage
  }))
);

const RouteFallback = (): JSX.Element => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="rounded-2xl border border-outline-variant/10 bg-surface-container px-6 py-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
        Loading Workspace
      </p>
      <div className="mt-3 h-2 w-48 overflow-hidden rounded-full bg-surface-container-high">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
      </div>
    </div>
  </div>
);

const App = (): JSX.Element => {
  const { completeOnboarding, isFirstLaunch, isLoading } = useFirstLaunch();
  const { settings } = useSettings();
  const [phase, setPhase] = useState<AppPhase>("splash");
  const [hasSplashCompleted, setHasSplashCompleted] = useState(false);

  // Theme is always dark - no switching needed
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("light");
    html.classList.add("dark");
  }, []);

  // Disable browser scroll restoration - we handle it manually
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    void db.initializeDefaults().catch((error: unknown) => {
      console.error("Failed to initialize Preflight defaults.", error);
    });
  }, []);

  useEffect(() => {
    if (!hasSplashCompleted || isLoading) {
      return;
    }

    setPhase(isFirstLaunch ? "onboarding" : "app");
  }, [hasSplashCompleted, isFirstLaunch, isLoading]);

  const appRoutes = useMemo(
    () => (
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<ProjectHubPage />} />
            <Route path="/project/:projectId" element={<ProjectWorkspacePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/docs" element={<DocumentationPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    ),
    []
  );

  if (phase === "splash") {
    return <SplashScreen onComplete={() => setHasSplashCompleted(true)} />;
  }

  return (
    <ToastProvider>
      <ErrorBoundary>
        {appRoutes}
        {phase === "onboarding" ? (
          <OnboardingFlow
            onComplete={async () => {
              await completeOnboarding();
              setPhase("app");
            }}
          />
        ) : null}
      </ErrorBoundary>
    </ToastProvider>
  );
};

export default App;
