import { useEffect, useRef } from "react";
import { Outlet, useLocation, useMatch } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { useCommandPalette } from "@/hooks/useCommandPalette";
import { useProjectStore } from "@/stores/projectStore";
import { useUIStore } from "@/stores/uiStore";

export const AppLayout = (): JSX.Element => {
  const location = useLocation();
  const projectMatch = useMatch("/project/:projectId");
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const activeTab = useUIStore((state) => state.activeTab);
  const setActiveTab = useUIStore((state) => state.setActiveTab);
  const selectProject = useProjectStore((state) => state.selectProject);
  const mainRef = useRef<HTMLElement>(null);

  useCommandPalette();

  // Scroll main content to top on every route change
  useEffect(() => {
    // Force scroll to top immediately
    const timer = setTimeout(() => {
      if (mainRef.current) {
        mainRef.current.scrollTop = 0;
      }
      // Also scroll window as fallback
      window.scrollTo(0, 0);
    }, 0);
    
    return () => clearTimeout(timer);
  }, [location.pathname, location.search, location.state]);

  useEffect(() => {
    const projectId = projectMatch?.params.projectId ?? null;
    selectProject(projectId);
  }, [projectMatch?.params.projectId, selectProject]);

  useEffect(() => {
    if (location.pathname === "/" && activeTab !== "projects") {
      setActiveTab("projects");
      return;
    }

    if (location.pathname === "/settings" && activeTab !== "settings") {
      setActiveTab("settings");
      return;
    }

    if (projectMatch && activeTab === "projects") {
      setActiveTab("brief");
    }
  }, [activeTab, location.pathname, projectMatch, setActiveTab]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-surface-container-lowest text-on-surface">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-secondary/5 blur-[100px]" />
        <div className="noise-texture absolute inset-0 opacity-70" />
      </div>

      <div className="relative flex">
        <Sidebar />

        <div
          className={`flex min-h-screen flex-1 flex-col transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            sidebarCollapsed ? "pl-16" : "pl-60"
          }`}
        >
          <Header />
          <main ref={mainRef} key={location.pathname} className="relative z-10 flex-1 overflow-y-auto px-6 py-8">
            <Outlet />
          </main>
        </div>

        <CommandPalette />
      </div>
    </div>
  );
};
