export const PROJECT_LINKS = [
  { id: "brief", icon: "description", label: "Brief" },
  { id: "research", icon: "analytics", label: "Research" },
  { id: "design", icon: "architecture", label: "Design" },
  { id: "prd", icon: "storage", label: "PRD" },
  { id: "build", icon: "terminal", label: "Build" },
  { id: "ship", icon: "rocket_launch", label: "Ship" },
  { id: "vault", icon: "inventory_2", label: "Vault" }
] as const;

export const getProjectStatusTone = (status: string): string => {
  if (status === "shipped") {
    return "bg-secondary/15 text-secondary";
  }

  if (status === "building") {
    return "bg-primary/15 text-primary";
  }

  if (status === "researching" || status === "designing") {
    return "bg-tertiary/15 text-tertiary";
  }

  return "bg-surface-container text-on-surface-variant";
};
