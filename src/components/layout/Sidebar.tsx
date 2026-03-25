import { Link, useLocation, useNavigate } from "react-router-dom";
import { useProject } from "@/hooks/useProject";
import { PROJECT_LINKS, getProjectStatusTone } from "@/components/layout/sidebarConfig";
import { cn } from "@/lib/utils";
import { useProjectStore } from "@/stores/projectStore";
import { useUIStore } from "@/stores/uiStore";

export const Sidebar = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const activeTab = useUIStore((state) => state.activeTab);
  const setSidebarCollapsed = useUIStore((state) => state.setSidebarCollapsed);
  const setActiveTab = useUIStore((state) => state.setActiveTab);
  const selectedProjectId = useProjectStore((state) => state.selectedProjectId);
  const { project } = useProject(selectedProjectId ?? undefined);

  const isProjectsView = location.pathname === "/";
  const isSettingsView = location.pathname === "/settings";

  const navigateToProjects = (): void => {
    setActiveTab("projects");
    navigate("/");
  };

  const navigateToProjectTab = (tabId: string): void => {
    if (!selectedProjectId) {
      return;
    }

    setActiveTab(tabId);
    navigate(`/project/${selectedProjectId}`);
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex min-h-screen flex-col bg-[var(--surface-container-lowest)] px-2 py-4 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        sidebarCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* Project Info Card - Only when expanded */}
      {!sidebarCollapsed && project && (
        <div className="mb-6 overflow-hidden rounded-xl bg-surface px-3 py-3 mx-2">
          <p className="truncate font-headline text-sm font-semibold text-on-surface">
            {project.name}
          </p>
          <span
            className={cn(
              "mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]",
              getProjectStatusTone(project.status)
            )}
          >
            {project.status}
          </span>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-2">
        <nav className="space-y-1">
          <button
            type="button"
            onClick={navigateToProjects}
            className={cn(
              "relative flex w-full items-center justify-start gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition",
              isProjectsView
                ? "text-primary"
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            <span className={cn("material-symbols-outlined text-lg", isProjectsView && "fill-1")}>apps</span>
            {!sidebarCollapsed ? <span className="truncate">Projects</span> : null}
          </button>

          {selectedProjectId
            ? PROJECT_LINKS.map((link) => {
                const isActive =
                  location.pathname.startsWith("/project/") && activeTab === link.id;

                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => navigateToProjectTab(link.id)}
                    className={cn(
                      "relative flex w-full items-center justify-start gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition",
                      isActive
                        ? "text-primary"
                        : "text-on-surface-variant hover:text-on-surface"
                    )}
                  >
                    <span className={cn("material-symbols-outlined text-lg", isActive && "fill-1")}>
                      {link.icon}
                    </span>
                    {!sidebarCollapsed ? <span className="truncate">{link.label}</span> : null}
                  </button>
                );
              })
            : null}
        </nav>
      </div>

      {/* Bottom Section - Settings + Toggle */}
      <div className="mt-6 border-t border-surface-container px-2 pt-4 space-y-2">
        <Link
          to="/settings"
          onClick={() => setActiveTab("settings")}
          className={cn(
            "relative flex w-full items-center justify-start gap-3 rounded-xl px-3 py-2.5 text-sm transition",
            isSettingsView
              ? "text-primary"
              : "text-on-surface-variant hover:text-on-surface"
          )}
        >
          <span className={cn("material-symbols-outlined text-lg", isSettingsView && "fill-1")}>settings</span>
          {!sidebarCollapsed ? <span className="truncate">Settings</span> : null}
        </Link>

        {/* Toggle Button - At Bottom, Full Width */}
        <div className="py-2">
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={cn(
              "flex h-10 w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm transition-all duration-300",
              sidebarCollapsed
                ? "bg-primary text-on-primary shadow-glow-primary"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
            )}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className="material-symbols-outlined text-lg">
              {sidebarCollapsed ? "chevron_right" : "chevron_left"}
            </span>
            {!sidebarCollapsed && <span className="truncate">Collapse</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};
