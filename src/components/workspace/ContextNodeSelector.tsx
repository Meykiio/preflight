import { useArtifacts } from "@/hooks/useArtifacts";
import { useBrief } from "@/hooks/useBrief";
import { useVaultFiles } from "@/hooks/useVaultFiles";
import { cn } from "@/lib/utils";

interface ContextNodeSelectorProps {
  isOpen: boolean;
  onChangeNodes: (nodes: string[]) => void;
  projectId: string;
  selectedNodes: string[];
}

interface ContextNodeRow {
  id: string;
  icon: string;
  label: string;
  available: boolean;
}

export const ContextNodeSelector = ({
  isOpen,
  onChangeNodes,
  projectId,
  selectedNodes
}: ContextNodeSelectorProps): JSX.Element => {
  const { brief } = useBrief(projectId);
  const { artifacts } = useArtifacts(projectId);
  const { files } = useVaultFiles(projectId);

  const hasBriefContent = Boolean(
    brief?.problem ||
      brief?.targetUser ||
      brief?.notes ||
      brief?.coreFeatures.length ||
      brief?.inspirations.length
  );
  const researchFiles = files.filter((file) => file.category === "research");
  const designFiles = files.filter((file) => file.category === "design");
  const activeContextFiles = files.filter((file) => file.isActiveContext);
  const artifactTypes = new Set(artifacts.map((artifact) => artifact.type));

  const rows: ContextNodeRow[] = [
    { id: "brief", icon: "description", label: "Brief", available: hasBriefContent },
    {
      id: "research",
      icon: "analytics",
      label: "Research results",
      available: researchFiles.length > 0
    },
    {
      id: "design",
      icon: "architecture",
      label: "Design files",
      available: designFiles.length > 0
    },
    {
      id: "prd",
      icon: "article",
      label: "PRD",
      available: artifactTypes.has("prd")
    },
    {
      id: "system_instructions",
      icon: "terminal",
      label: "System Instructions",
      available: artifactTypes.has("system_instructions")
    }
  ];

  const toggleNode = (nodeId: string): void => {
    onChangeNodes(
      selectedNodes.includes(nodeId)
        ? selectedNodes.filter((value) => value !== nodeId)
        : [...selectedNodes, nodeId]
    );
  };

  return (
    <aside
      className={cn(
        "absolute right-0 top-0 z-20 h-full w-72 border-l border-outline-variant/15 bg-surface-container shadow-2xl transition-transform duration-200",
        "glass-panel",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="border-b border-outline-variant/10 px-5 py-4">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
          Context Nodes
        </p>
        <h2 className="mt-2 font-headline text-xl font-semibold text-on-surface">
          Inject available context
        </h2>
      </div>

      <div className="space-y-6 px-5 py-5">
        <div className="space-y-3">
          {rows.map((row) => (
            <label
              key={row.id}
              className={cn(
                "flex items-center justify-between rounded-xl border px-3 py-3",
                row.available
                  ? "border-outline-variant/10 bg-surface"
                  : "border-outline-variant/10 bg-surface/60 opacity-60"
              )}
            >
              <span className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedNodes.includes(row.id)}
                  disabled={!row.available}
                  onChange={() => toggleNode(row.id)}
                  className="h-4 w-4 rounded border-outline-variant/20 bg-surface"
                />
                <span className="material-symbols-outlined text-base text-on-surface-variant">
                  {row.icon}
                </span>
                <span className="text-sm text-on-surface">{row.label}</span>
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.2em]",
                  row.available
                    ? "bg-secondary/10 text-secondary"
                    : "bg-surface-container-high text-outline"
                )}
              >
                {row.available ? "Available" : "Missing data"}
              </span>
            </label>
          ))}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant">
            Active Vault Files
          </p>
          <div className="mt-3 space-y-2">
            {activeContextFiles.length > 0 ? (
              activeContextFiles.map((file) => {
                const nodeId = `vault:${file.id}`;

                return (
                  <label
                    key={file.id}
                    className="flex items-center gap-3 rounded-xl border border-outline-variant/10 bg-surface px-3 py-3"
                  >
                    <input
                      type="checkbox"
                      checked={selectedNodes.includes(nodeId)}
                      onChange={() => toggleNode(nodeId)}
                      className="h-4 w-4 rounded border-outline-variant/20 bg-surface"
                    />
                    <span className="material-symbols-outlined text-base text-on-surface-variant">
                      inventory_2
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm text-on-surface">{file.name}</p>
                      <p className="text-xs text-outline">{file.category}</p>
                    </div>
                  </label>
                );
              })
            ) : (
              <div className="rounded-xl border border-outline-variant/10 bg-surface px-3 py-4 text-sm text-outline">
                No active vault files yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
