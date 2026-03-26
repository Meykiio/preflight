import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDialogAccessibility } from "@/hooks/useDialogAccessibility";
import { useProjects } from "@/hooks/useProjects";
import { useToast } from "@/hooks/useToast";
import { useProjectStore } from "@/stores/projectStore";

interface NewProjectModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const NewProjectModal = ({ isOpen, onOpenChange }: NewProjectModalProps): JSX.Element | null => {
  const navigate = useNavigate();
  const { createProject } = useProjects();
  const toast = useToast();
  const selectProject = useProjectStore((state) => state.selectProject);

  // Use refs for input values to prevent focus loss
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  const [showNameError, setShowNameError] = useState(false);
  const [showDescriptionError, setShowDescriptionError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback((): void => {
    if (nameRef.current) nameRef.current.value = "";
    if (descriptionRef.current) descriptionRef.current.value = "";
    setShowNameError(false);
    setShowDescriptionError(false);
    setIsSubmitting(false);
  }, []);

  const dialogRef = useDialogAccessibility<HTMLDivElement>(isOpen, () => {
    resetForm();
    onOpenChange(false);
  });

  // Focus name input when modal opens
  useEffect(() => {
    if (isOpen && nameRef.current) {
      setTimeout(() => nameRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const canSubmit = useMemo(() => {
    const nameValue = nameRef.current?.value.trim() ?? "";
    const descriptionValue = descriptionRef.current?.value.trim() ?? "";
    return nameValue.length > 0 && descriptionValue.length > 0;
  }, [isSubmitting]);

  const handleSubmit = useCallback(async (): Promise<void> => {
    const nameValue = nameRef.current?.value.trim() ?? "";
    const descriptionValue = descriptionRef.current?.value.trim() ?? "";

    if (!nameValue) {
      setShowNameError(true);
      nameRef.current?.focus();
      return;
    }

    if (!descriptionValue) {
      setShowDescriptionError(true);
      descriptionRef.current?.focus();
      return;
    }

    setIsSubmitting(true);

    const project = await createProject({
      name: nameValue,
      description: descriptionValue
    });
    
    if (!project) {
      toast.error("Project creation failed.");
      setIsSubmitting(false);
      return;
    }
    
    selectProject(project.id);
    resetForm();
    onOpenChange(false);
    toast.success("Project created.");
    navigate(`/project/${project.id}`);
  }, [createProject, toast, selectProject, resetForm, onOpenChange, navigate]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface-dim/80 px-4 backdrop-blur-sm"
      onClick={() => {
        resetForm();
        onOpenChange(false);
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-project-title"
        className="glass-panel w-full max-w-2xl rounded-2xl border border-outline-variant/15 bg-surface-container p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">New Project</p>
            <h2 id="new-project-title" className="mt-2 font-headline text-3xl font-bold tracking-tight text-on-surface">
              What are you building?
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
            className="rounded-full p-2 text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-on-surface-variant">
              Project name
            </label>
            <input
              ref={nameRef}
              type="text"
              placeholder="e.g., PrintFlow, TaskMaster, DesignHub"
              className="w-full rounded-xl border border-outline-variant/15 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary/40"
            />
            {showNameError ? (
              <p className="mt-2 text-sm text-tertiary">Project name is required.</p>
            ) : null}
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-on-surface-variant">
              One-line description
            </label>
            <input
              ref={descriptionRef}
              type="text"
              placeholder="e.g., A tool for creating custom print-on-demand designs"
              className="w-full rounded-xl border border-outline-variant/15 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary/40"
            />
            {showDescriptionError ? (
              <p className="mt-2 text-sm text-tertiary">Description is required.</p>
            ) : null}
          </div>
          <p className="text-sm text-on-surface-variant">
            Tip: You'll add more details like features and tech stack on the next screen.
          </p>
        </div>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={isSubmitting}
            className="gradient-cta glow-primary flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-on-primary disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Project"}
          </button>
          <button
            type="button"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
            className="mt-3 w-full text-sm text-on-surface-variant transition hover:text-on-surface"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
