import { Command } from "cmdk";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/types";

export interface CommandPaletteAction {
  hidden?: boolean;
  icon: string;
  id: string;
  label: string;
  onSelect: () => void | Promise<void>;
  shortcut?: string;
}

interface CommandPaletteProject {
  id: string;
  name: string;
  status: ProjectStatus;
}

interface CommandPaletteContentProps {
  actions: CommandPaletteAction[];
  isLoading: boolean;
  navigationItems: CommandPaletteAction[];
  onProjectSelect: (projectId: string) => void;
  onQueryChange: (query: string) => void;
  platformLinks: CommandPaletteAction[];
  projectTabs: CommandPaletteAction[];
  projects: CommandPaletteProject[];
  query: string;
}

const CommandPaletteItem = ({
  icon,
  label,
  onSelect,
  shortcut
}: Omit<CommandPaletteAction, "hidden" | "id">): JSX.Element => {
  return (
    <Command.Item
      onSelect={() => void onSelect()}
      className={cn(
        "mt-2 flex cursor-pointer items-center justify-between rounded-lg px-3 py-3 text-sm text-on-surface outline-none transition",
        "data-[selected=true]:bg-surface-container-high data-[selected=true]:text-primary"
      )}
    >
      <span className="flex items-center gap-3">
        <span className="material-symbols-outlined text-base">{icon}</span>
        <span>{label}</span>
      </span>
      {shortcut ? (
        <span className="rounded-md bg-surface px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
          {shortcut}
        </span>
      ) : null}
    </Command.Item>
  );
};

export const CommandPaletteContent = ({
  actions,
  isLoading,
  navigationItems,
  onProjectSelect,
  onQueryChange,
  platformLinks,
  projectTabs,
  projects,
  query
}: CommandPaletteContentProps): JSX.Element => {
  return (
    <Command className="overflow-hidden">
      <div className="flex items-center gap-3 border-b border-outline-variant/10 px-4 py-3">
        <span className="material-symbols-outlined text-on-surface-variant">search</span>
        <Command.Input
          data-autofocus
          autoFocus
          value={query}
          onValueChange={onQueryChange}
          placeholder="Search projects, navigation, actions"
          className="w-full bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant"
        />
        <span className="rounded-md bg-surface px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
          ⌘K
        </span>
      </div>

      <Command.List className="max-h-[420px] overflow-y-auto p-2">
        <Command.Empty className="px-3 py-10 text-center">
          <span className="material-symbols-outlined text-4xl text-outline/40">
            travel_explore
          </span>
          <p className="mt-3 text-sm text-on-surface">No results for "{query}"</p>
          <p className="mt-1 text-xs text-on-surface-variant">
            Try a project name, route, or quick action.
          </p>
        </Command.Empty>

        <Command.Group
          heading="Projects"
          className="mb-3 text-xs uppercase tracking-[0.2em] text-on-surface-variant"
        >
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="mt-2 h-12 animate-pulse rounded-lg bg-surface-container-high"
              />
            ))
          ) : projects.length === 0 ? (
            <div className="mt-2 rounded-lg bg-surface px-3 py-4 text-sm text-on-surface-variant">
              No projects yet. Create one from the quick actions below.
            </div>
          ) : (
            projects.map((project) => (
              <Command.Item
                key={project.id}
                onSelect={() => onProjectSelect(project.id)}
                className={cn(
                  "mt-2 flex cursor-pointer items-center justify-between rounded-lg px-3 py-3 text-sm text-on-surface outline-none transition",
                  "data-[selected=true]:bg-surface-container-high data-[selected=true]:text-primary"
                )}
              >
                <span className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-base">folder</span>
                  <span>{project.name}</span>
                </span>
                <StatusBadge status={project.status} />
              </Command.Item>
            ))
          )}
        </Command.Group>

        <Command.Group
          heading="Navigate"
          className="mb-3 text-xs uppercase tracking-[0.2em] text-on-surface-variant"
        >
          {navigationItems.map((item) => (
            <CommandPaletteItem key={item.id} {...item} />
          ))}
          {projectTabs.map((item) => (
            <CommandPaletteItem key={item.id} {...item} />
          ))}
        </Command.Group>

        <Command.Group
          heading="Actions"
          className="text-xs uppercase tracking-[0.2em] text-on-surface-variant"
        >
          {actions
            .filter((item) => !item.hidden)
            .map((item) => (
              <CommandPaletteItem key={item.id} {...item} />
            ))}
        </Command.Group>

        <Command.Group
          heading="Open Platform"
          className="mt-3 text-xs uppercase tracking-[0.2em] text-on-surface-variant"
        >
          {platformLinks.map((item) => (
            <CommandPaletteItem key={item.id} {...item} shortcut="Open" />
          ))}
        </Command.Group>
      </Command.List>
    </Command>
  );
};
