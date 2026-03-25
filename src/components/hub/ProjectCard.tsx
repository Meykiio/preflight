import { memo, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useArtifacts } from "@/hooks/useArtifacts";
import { useBrief } from "@/hooks/useBrief";
import { useBuildStages } from "@/hooks/useBuildStages";
import { useProjects } from "@/hooks/useProjects";
import { useToast } from "@/hooks/useToast";
import { cn, formatDate } from "@/lib/utils";
import { useProjectStore } from "@/stores/projectStore";
import type { Platform, Project } from "@/types";
import { StatusBadge } from "@/components/shared/StatusBadge";

interface ProjectCardProps {
  project: Project;
  isInBatchMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (projectId: string) => void;
}

const MODULE_ICONS = [
  { id: "brief", icon: "description" },
  { id: "research_prompt", icon: "analytics" },
  { id: "design_prompt", icon: "palette" },
  { id: "prd", icon: "article" },
  { id: "system_instructions", icon: "terminal" },
  { id: "rules_file", icon: "rule" },
  { id: "build_prompt", icon: "build" }
] as const;

const getGradientForProject = (projectId: string): string => {
  let hash = 0;
  for (let i = 0; i < projectId.length; i++) {
    hash = projectId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const gradients = [
    "linear-gradient(135deg, rgba(197,192,255,0.15) 0%, rgba(139,128,255,0.08) 50%, rgba(10,10,15,0) 100%)",
    "linear-gradient(135deg, rgba(110,218,180,0.15) 0%, rgba(197,192,255,0.08) 50%, rgba(10,10,15,0) 100%)",
    "linear-gradient(135deg, rgba(255,185,93,0.15) 0%, rgba(197,192,255,0.08) 50%, rgba(10,10,15,0) 100%)",
    "linear-gradient(135deg, rgba(197,192,255,0.1) 0%, rgba(110,218,180,0.12) 50%, rgba(10,10,15,0) 100%)",
    "linear-gradient(135deg, rgba(139,128,255,0.12) 0%, rgba(255,185,93,0.08) 50%, rgba(10,10,15,0) 100%)",
    "linear-gradient(135deg, rgba(255,185,93,0.1) 0%, rgba(110,218,180,0.12) 50%, rgba(10,10,15,0) 100%)",
    "linear-gradient(135deg, rgba(197,192,255,0.18) 0%, rgba(110,218,180,0.08) 100%)",
    "linear-gradient(135deg, rgba(255,185,93,0.15) 0%, rgba(139,128,255,0.08) 100%)"
  ];
  
  return gradients[Math.abs(hash) % gradients.length];
};

export const ProjectCard = memo(({
  project,
  isInBatchMode = false,
  isSelected = false,
  onToggleSelect
}: ProjectCardProps): JSX.Element => {
  const navigate = useNavigate();
  const { updateProject, deleteProject } = useProjects();
  const toast = useToast();
  const selectProject = useProjectStore((state) => state.selectProject);
  const { brief } = useBrief(project.id);
  const { artifacts } = useArtifacts(project.id);
  const { stages } = useBuildStages(project.id);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(project.name);
  const [editDescription, setEditDescription] = useState(project.description);
  const [editTechStack, setEditTechStack] = useState(project.techStack.join(", "));
  const [editPlatforms, setEditPlatforms] = useState<Platform[]>(project.targetPlatforms);

  const cardGradient = useMemo(() => getGradientForProject(project.id), [project.id]);

  const completedStages = stages.filter((stage) => stage.status === "complete").length;
  const progress = stages.length === 0 ? 0 : Math.round((completedStages / stages.length) * 100);
  const artifactTypes = new Set(artifacts.map((artifact) => artifact.type));
  const hasBriefContent = Boolean(
    brief?.problem ||
      brief?.targetUser ||
      brief?.notes ||
      brief?.coreFeatures.length ||
      brief?.inspirations.length
  );

  const openProject = (): void => {
    if (isInBatchMode || isEditing) {
      onToggleSelect?.(project.id);
      return;
    }
    selectProject(project.id);
    navigate(`/project/${project.id}`);
  };

  const handleDelete = async (event: React.MouseEvent): Promise<void> => {
    event.stopPropagation();
    setIsMenuOpen(false);
    const confirmed = window.confirm(`Delete "${project.name}"? This action cannot be undone.`);
    if (!confirmed) return;
    await deleteProject(project.id);
    toast.success("Project deleted.");
  };

  const handleEditStatus = async (newStatus: Project["status"]): Promise<void> => {
    await updateProject(project.id, { status: newStatus });
    setIsMenuOpen(false);
    toast.success("Project status updated.");
  };

  const handleStartEdit = (event: React.MouseEvent): void => {
    if (isInBatchMode) return;
    event.stopPropagation();
    setIsMenuOpen(false);
    setIsEditing(true);
  };

  const handleSaveEdit = async (): Promise<void> => {
    const techStackArray = editTechStack.split(",").map((s) => s.trim()).filter(Boolean);
    await updateProject(project.id, {
      name: editName.trim() || project.name,
      description: editDescription.trim(),
      techStack: techStackArray,
      targetPlatforms: editPlatforms
    });
    setIsEditing(false);
    toast.success("Project updated.");
  };

  const handleCancelEdit = (): void => {
    setIsEditing(false);
    setEditName(project.name);
    setEditDescription(project.description);
    setEditTechStack(project.techStack.join(", "));
    setEditPlatforms(project.targetPlatforms);
  };

  const togglePlatform = (platform: Platform): void => {
    setEditPlatforms((current) =>
      current.includes(platform)
        ? current.filter((p) => p !== platform)
        : [...current, platform]
    );
  };

  if (isEditing) {
    return (
      <article
        className="glass-panel group relative rounded-xl border border-outline-variant/10 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <StatusBadge status={project.status} />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSaveEdit}
                className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-lg bg-surface px-3 py-1.5 text-xs text-on-surface-variant transition hover:bg-surface-container-high"
              >
                Cancel
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-label-sm uppercase tracking-[0.2em] text-on-surface-variant">
              Project name
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full rounded-lg border border-outline-variant/15 bg-surface px-3 py-2 text-body-sm text-on-surface outline-none focus:border-primary/40 terminal-glow"
            />
          </div>

          <div>
            <label className="mb-1 block text-label-sm uppercase tracking-[0.2em] text-on-surface-variant">
              One-line description
            </label>
            <input
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="What does this app do?"
              className="w-full rounded-lg border border-outline-variant/15 bg-surface px-3 py-2 text-body-sm text-on-surface outline-none focus:border-primary/40 terminal-glow"
            />
          </div>

          <div>
            <label className="mb-1 block text-label-sm uppercase tracking-[0.2em] text-on-surface-variant">
              Tech stack (comma-separated)
            </label>
            <input
              type="text"
              value={editTechStack}
              onChange={(e) => setEditTechStack(e.target.value)}
              placeholder="React, Tailwind, Supabase"
              className="w-full rounded-lg border border-outline-variant/15 bg-surface px-3 py-2 text-body-sm text-on-surface outline-none focus:border-primary/40 terminal-glow"
            />
          </div>

          <div>
            <label className="mb-2 block text-label-sm uppercase tracking-[0.2em] text-on-surface-variant">
              Target platforms
            </label>
            <div className="flex flex-wrap gap-2">
              {(["lovable", "bolt", "cursor", "v0", "replit", "other"] as Platform[]).map((platform) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => togglePlatform(platform)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-label-md uppercase tracking-[0.15em] transition",
                    editPlatforms.includes(platform)
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "bg-surface text-on-surface-variant border border-outline-variant/20 hover:bg-surface-container-high"
                  )}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={openProject}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openProject();
        }
      }}
      className="glass-panel group relative overflow-hidden rounded-xl border border-outline-variant/10 p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-glow-primary"
      style={{ background: cardGradient }}
    >
      {/* Noise texture overlay */}
      <div className="noise-texture absolute inset-0 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <StatusBadge status={project.status} />

          {isInBatchMode ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onToggleSelect?.(project.id);
              }}
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all",
                isSelected
                  ? "border-primary bg-primary text-on-primary"
                  : "border-outline-variant bg-surface text-transparent hover:border-primary/40"
              )}
            >
              <span className="material-symbols-outlined text-sm">{isSelected ? "check" : ""}</span>
            </button>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                aria-label="Project options"
                className="rounded-full p-2 text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-lg">more_vert</span>
              </button>

              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                  <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl border border-outline-variant/15 bg-surface-container p-2 shadow-elevation-2">
                    <button
                      type="button"
                      onClick={() => handleEditStatus("ideation")}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-body-sm text-on-surface transition hover:bg-surface-container-high"
                    >
                      <span className="material-symbols-outlined text-base">lightbulb</span>
                      Set to Ideation
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditStatus("researching")}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-body-sm text-on-surface transition hover:bg-surface-container-high"
                    >
                      <span className="material-symbols-outlined text-base">search</span>
                      Set to Researching
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditStatus("designing")}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-body-sm text-on-surface transition hover:bg-surface-container-high"
                    >
                      <span className="material-symbols-outlined text-base">palette</span>
                      Set to Designing
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditStatus("building")}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-body-sm text-on-surface transition hover:bg-surface-container-high"
                    >
                      <span className="material-symbols-outlined text-base">build</span>
                      Set to Building
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditStatus("shipped")}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-body-sm text-on-surface transition hover:bg-surface-container-high"
                    >
                      <span className="material-symbols-outlined text-base">rocket_launch</span>
                      Set to Shipped
                    </button>
                    <div className="my-2 h-px bg-outline-variant/20" />
                    <button
                      type="button"
                      onClick={handleStartEdit}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-body-sm text-on-surface transition hover:bg-surface-container-high"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                      Edit project details
                    </button>
                    <div className="my-2 h-px bg-outline-variant/20" />
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-body-sm text-tertiary transition hover:bg-tertiary/10"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                      Delete project
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Project Icon & Title */}
        <div className="mt-4 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary group-hover:scale-105 transition-transform duration-300">
            <span className="material-symbols-outlined">deployed_code</span>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-headline text-headline-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
              {project.name}
            </h2>
            <p className="mt-1 text-body-sm text-outline line-clamp-2 min-h-[2.5rem]">
              {project.description || "No description yet."}
            </p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-label-md text-on-surface-variant">
            <span>Progress</span>
            <span className={cn(
              "font-mono font-semibold",
              progress === 100 ? "text-secondary" : "text-on-surface"
            )}>
              {progress}%
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-variant">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                progress === 100 
                  ? "progress-teal" 
                  : "bg-gradient-to-r from-primary to-secondary"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Module Indicators */}
          <div className="mt-4 flex items-center gap-2">
            {MODULE_ICONS.map((item) => {
              const isFilled =
                item.id === "brief" ? hasBriefContent : artifactTypes.has(item.id);

              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border text-sm transition-all duration-300",
                    isFilled
                      ? "border-primary/20 bg-primary/10 text-primary shadow-glow-primary"
                      : "border-outline-variant/20 bg-surface text-outline"
                  )}
                >
                  <span className="material-symbols-outlined text-base">
                    {item.icon}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-end justify-between gap-3 pt-4 border-t border-outline-variant/10">
          <span className="text-label-sm text-outline">
            Updated {formatDate(project.updatedAt)}
          </span>
          <div className="flex flex-wrap justify-end gap-1.5">
            {project.targetPlatforms.length > 0 ? (
              project.targetPlatforms.map((platform) => (
                <span
                  key={platform}
                  className="rounded-md bg-surface px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-on-surface-variant border border-outline-variant/20"
                >
                  {platform}
                </span>
              ))
            ) : (
              <span className="rounded-md bg-surface px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-on-surface-variant border border-outline-variant/20">
                Local
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
});

ProjectCard.displayName = "ProjectCard";
