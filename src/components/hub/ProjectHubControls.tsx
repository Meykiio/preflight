import { cn } from "@/lib/utils";
import {
  FILTER_OPTIONS,
  type FilterValue,
  type SortValue,
  type ViewMode
} from "@/components/hub/projectHubConfig";

interface ProjectHubControlsProps {
  filter: FilterValue;
  onChangeFilter: (value: FilterValue) => void;
  onChangeSort: (value: SortValue) => void;
  onChangeViewMode: (value: ViewMode) => void;
  sortBy: SortValue;
  viewMode: ViewMode;
}

export const ProjectHubControls = ({
  filter,
  onChangeFilter,
  onChangeSort,
  onChangeViewMode,
  sortBy,
  viewMode
}: ProjectHubControlsProps): JSX.Element => {
  return (
    <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((option) => {
          const isActive = filter === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChangeFilter(option.value)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-medium transition",
                isActive
                  ? "border-primary/30 bg-primary/15 text-primary"
                  : "border-transparent bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={sortBy}
          onChange={(event) => onChangeSort(event.target.value as SortValue)}
          className="rounded-xl border border-outline-variant/15 bg-surface-container px-4 py-2 text-sm text-on-surface outline-none"
        >
          <option value="updated">Last modified</option>
          <option value="created">Created</option>
          <option value="name">Name</option>
        </select>

        <div className="flex rounded-xl border border-outline-variant/15 bg-surface-container p-1">
          <button
            type="button"
            onClick={() => onChangeViewMode("grid")}
            className={cn(
              "rounded-lg p-2 transition",
              viewMode === "grid"
                ? "bg-surface-container-high text-primary"
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            <span className="material-symbols-outlined text-base">grid_view</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeViewMode("list")}
            className={cn(
              "rounded-lg p-2 transition",
              viewMode === "list"
                ? "bg-surface-container-high text-primary"
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            <span className="material-symbols-outlined text-base">view_list</span>
          </button>
        </div>
      </div>
    </div>
  );
};
