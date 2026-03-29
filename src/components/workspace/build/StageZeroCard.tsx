import { downloadAsFile } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STAGE_0_PROMPT = `# [OPTIONAL] STAGE 0 — PROJECT CONTEXT SCAN

> **This stage is optional but strongly recommended for best results.**
> Run this prompt BEFORE Stage 1 if you have pre-organized your project files
> using the recommended DOCS folder structure below.

---

## RECOMMENDED FOLDER STRUCTURE

For optimal results, organize your project folder like this before starting:

\`\`\`
YOUR_PROJECT/
└── DOCS/
    ├── 01-RESEARCH/        ← Research reports (PDF, MD) from Perplexity, Gemini, ChatGPT
    ├── 02-DESIGN/          ← UI design exports (PNG, SVG) + design-system.md from Stitch/v0
    ├── 03-PRD/             ← PRD.md · SYSTEM_INSTRUCTIONS.md · RULES.md (or .cursorrules)
    └── 04-BUILD_PROMPTS/   ← BUILD_STAGE_*.md files exported from Preflight
\`\`\`

You can add additional folders or files — the agent will read everything it finds.
You don't have to follow this exact structure — adapt it to your workflow.

---

## PROMPT (paste into your AI coding tool)

Please scan the current project directory recursively.

Your goal is to read and understand every document, file, and folder you find — especially anything inside a DOCS folder or equivalent.

Specifically:
- If you find research files (PDF, MD): extract the key insights, competitor analysis, and technical recommendations.
- If you find design files or a design-system file: understand the visual language, component patterns, and UI guidelines.
- If you find a PRD.md: this is your primary product specification. Read it fully. Every feature, data model, and acceptance criterion matters.
- If you find SYSTEM_INSTRUCTIONS or a rules file (.cursorrules, CLAUDE.md): these are your operating rules for this project. Follow them for all subsequent prompts.
- If you find BUILD_STAGE files: understand the build sequence ahead of time so you can anticipate what's coming.

If some folders or files are missing, that is fine — scan what exists and move on.

After scanning, respond with:
1. A summary of what you found and read.
2. A brief statement of what the project is and what you'll be building.
3. Confirmation that you are ready to receive Stage 1.

Do not start building yet. Only read, understand, and confirm.
`;

export const StageZeroCard = (): JSX.Element => {
  return (
    <article
      className={cn(
        "relative w-full max-w-full rounded-xl border-2 border-dashed border-outline-variant/20 bg-surface-container/50 p-5 transition-all"
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold",
            "bg-outline-variant/10 text-outline-variant"
          )}
        >
          00
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1 pr-4">
              <div className="flex items-center gap-2">
                <h3 className="break-words font-headline text-lg font-semibold text-on-surface">
                  Project Context Scan
                </h3>
                <span className="shrink-0 rounded-full bg-outline-variant/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-outline-variant">
                  Optional
                </span>
              </div>
              <p className="mt-1 break-words text-sm text-outline">
                Scan your DOCS folder and load all context before building
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-surface-container-lowest">
            <div className="flex items-center justify-between border-b border-outline-variant/10 px-4 py-3">
              <span className="rounded-full bg-surface px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
                CONTEXT_SCAN.txt
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    downloadAsFile(STAGE_0_PROMPT, "BUILD_STAGE_0_CONTEXT_SCAN.md");
                  }}
                  className="rounded-full p-2 text-on-surface-variant transition hover:bg-surface hover:text-on-surface"
                  title="Download stage prompt"
                >
                  <span className="material-symbols-outlined text-base">download</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(STAGE_0_PROMPT);
                  }}
                  className="rounded-full p-2 text-on-surface-variant transition hover:bg-surface hover:text-on-surface"
                  title="Copy to clipboard"
                >
                  <span className="material-symbols-outlined text-base">content_copy</span>
                </button>
              </div>
            </div>

            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm text-on-surface-variant transition hover:text-on-surface">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">info</span>
                  View prompt preview
                </span>
                <span className="material-symbols-outlined transition group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <pre className="overflow-x-auto whitespace-pre-wrap border-t border-outline-variant/10 px-4 py-4 font-mono text-sm text-secondary">
                {STAGE_0_PROMPT}
              </pre>
            </details>
          </div>

          <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-xl text-primary">lightbulb</span>
              <div className="text-sm">
                <p className="font-semibold text-on-surface">When to use this stage</p>
                <p className="mt-1 text-on-surface-variant">
                  Use Stage 0 when you've exported all your Preflight outputs (Research, Design, PRD, Build Prompts) 
                  to a DOCS folder. The AI will read everything and build context before starting Stage 1.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
