import type { Platform, ProjectStatus } from "@/types";

export type FilterValue = "all" | ProjectStatus;
export type SortValue = "updated" | "created" | "name";
export type ViewMode = "grid" | "list";

export const FILTER_OPTIONS: { label: string; value: FilterValue }[] = [
  { label: "All", value: "all" },
  { label: "Ideation", value: "ideation" },
  { label: "Researching", value: "researching" },
  { label: "Designing", value: "designing" },
  { label: "Building", value: "building" },
  { label: "Shipped", value: "shipped" }
];

interface ImportedProjectShape {
  description?: string;
  name: string;
  status?: ProjectStatus;
  targetPlatforms?: Platform[];
  techStack?: string[];
}

const isPlatform = (value: string): value is Platform =>
  ["lovable", "bolt", "cursor", "claude-code", "replit", "v0", "other"].includes(
    value
  );

const isProjectStatus = (value: string): value is ProjectStatus =>
  ["ideation", "researching", "designing", "building", "shipped"].includes(value);

export const parseImportedProjects = (payload: unknown): ImportedProjectShape[] => {
  const collection =
    Array.isArray(payload)
      ? payload
      : typeof payload === "object" &&
          payload !== null &&
          Array.isArray((payload as { projects?: unknown[] }).projects)
        ? (payload as { projects: unknown[] }).projects
        : null;

  if (!collection) {
    throw new Error("Expected an array of projects or a { projects: [] } payload.");
  }

  return collection
    .filter(
      (item): item is Record<string, unknown> =>
        typeof item === "object" && item !== null && typeof item.name === "string"
    )
    .map((item) => ({
      name: item.name as string,
      description: typeof item.description === "string" ? item.description : "",
      status:
        typeof item.status === "string" && isProjectStatus(item.status)
          ? item.status
          : "ideation",
      targetPlatforms: Array.isArray(item.targetPlatforms)
        ? item.targetPlatforms.filter(
            (value): value is Platform => typeof value === "string" && isPlatform(value)
          )
        : [],
      techStack: Array.isArray(item.techStack)
        ? item.techStack.filter((value): value is string => typeof value === "string")
        : []
    }));
};
