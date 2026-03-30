import { useCallback } from "react";
import { useToast } from "@/hooks/useToast";

interface ClaudeSkill {
  id: string;
  name: string;
  description: string;
  fileName: string;
  features: string[];
}

const CLAUDE_SKILLS: ClaudeSkill[] = [
  {
    id: "preflight-interactive",
    name: "Preflight Interactive",
    description: "Run the full Preflight pipeline conversationally in Claude",
    fileName: "preflight-interactive-SKILL.md",
    features: [
      "7-phase pipeline from idea to build-ready prompts",
      "Research prompt for Perplexity/Gemini/ChatGPT",
      "Design prompt for Stitch/v0/Figma AI",
      "Complete PRD with TypeScript data model",
      "System instructions + rules file",
      "Sequential build prompts (Stage 0-7)"
    ]
  }
];

export const ClaudeSkillsSection = (): JSX.Element => {
  const toast = useToast();

  const handleDownload = useCallback((fileName: string, skillName: string): void => {
    const link = document.createElement("a");
    link.href = `/skills/${fileName}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${skillName} downloaded.`);
  }, [toast]);

  const handleAddToClaude = useCallback((): void => {
    navigator.clipboard.writeText(
      "1. Download the skill file\n" +
      "2. Open Claude Desktop Settings\n" +
      "3. Go to Developer → Skills\n" +
      "4. Click 'Add Skill' and select the file\n" +
      "5. Start chatting: 'I have an app idea...'"
    );
    toast.success("Instructions copied to clipboard!");
  }, [toast]);

  return (
    <section className="rounded-2xl border border-outline-variant/10 bg-surface-container p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl text-primary">
              psychology
            </span>
            <h2 className="font-headline text-xl font-bold text-on-surface">
              Claude Skills
            </h2>
          </div>
          <p className="mt-2 text-sm text-on-surface-variant">
            Use Preflight workflows directly in Claude Desktop — conversational AI that guides you through the entire pipeline.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddToClaude}
          className="rounded-xl border border-outline-variant/15 bg-surface px-4 py-2 text-xs text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface"
          title="Copy instructions to clipboard"
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">content_copy</span>
            How to Use
          </span>
        </button>
      </div>

      <div className="space-y-4">
        {CLAUDE_SKILLS.map((skill) => (
          <div
            key={skill.id}
            className="rounded-xl border border-outline-variant/10 bg-surface p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-secondary">
                    description
                  </span>
                  <h3 className="font-headline text-lg font-semibold text-on-surface">
                    {skill.name}
                  </h3>
                </div>
                <p className="mt-2 text-sm text-on-surface-variant">
                  {skill.description}
                </p>

                <div className="mt-4">
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-on-surface-variant">
                    What It Does
                  </p>
                  <ul className="mt-2 space-y-1">
                    {skill.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-on-surface"
                      >
                        <span className="material-symbols-outlined text-base text-secondary">
                          check
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDownload(skill.fileName, skill.name)}
                className="gradient-cta glow-primary shrink-0 rounded-xl px-5 py-3 text-sm font-semibold text-on-primary"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">download</span>
                  Download
                </span>
              </button>
            </div>

            {/* Usage Instructions */}
            <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-xl text-primary">
                  info
                </span>
                <div className="text-sm">
                  <p className="font-semibold text-on-surface">
                    How to Add to Claude Desktop
                  </p>
                  <ol className="mt-2 space-y-1 text-on-surface-variant">
                    <li>1. Click Download to get the skill file</li>
                    <li>2. Open Claude Desktop Settings</li>
                    <li>3. Go to <span className="font-mono text-primary">Developer</span> → <span className="font-mono text-primary">Skills</span></li>
                    <li>4. Click <span className="font-mono text-primary">Add Skill</span> and select the file</li>
                    <li>5. Start chatting: <span className="italic">"I have an app idea..."</span> or <span className="italic">"Help me build an app"</span></li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alternative Platforms Note */}
      <div className="mt-6 rounded-xl border border-outline-variant/10 bg-surface/50 p-4">
        <p className="text-sm text-on-surface-variant">
          <span className="font-semibold text-on-surface">Also available for:</span>{" "}
          These skills work with any AI assistant that supports custom skills or system prompts.
          For Lovable, Bolt, Cursor, and other platforms, use the main Preflight app to generate
          platform-specific prompts.
        </p>
      </div>
    </section>
  );
};
