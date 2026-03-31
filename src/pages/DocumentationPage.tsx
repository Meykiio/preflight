import { useState, useCallback } from "react";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

interface DocSection {
  id: string;
  title: string;
  icon: string;
  content: JSX.Element;
}

const DocumentationPage = (): JSX.Element => {
  const toast = useToast();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    introduction: true,
    "quick-start": true
  });
  const [searchQuery, setSearchQuery] = useState("");

  const handleDownloadSkill = useCallback((): void => {
    const link = document.createElement("a");
    link.href = "/skills/preflight-interactive-SKILL.md";
    link.download = "preflight-interactive-SKILL.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Claude skill downloaded.");
  }, [toast]);

  const toggleSection = (sectionId: string): void => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleExportPDF = useCallback((): void => {
    window.print();
    toast.info("Use your browser's print dialog to save as PDF.");
  }, [toast]);

  const sections: DocSection[] = [
    {
      id: "introduction",
      title: "What is Preflight?",
      icon: "rocket_launch",
      content: (
        <div className="space-y-4">
          <p className="text-body-sm text-on-surface">
            <strong className="text-on-surface">Preflight is not a coding tool. It's the layer that precedes coding.</strong>
          </p>
          <p className="text-body-sm text-on-surface">
            If you use AI coding assistants like Lovable, Bolt, Cursor, Claude Code, Replit, or v0, you know the frustration: 
            chaotic prompts, fragmented context, and builds that go nowhere. Preflight solves this by providing a{" "}
            <strong className="text-primary">structured project operating system</strong> that transforms your raw idea into 
            a complete, AI-ready build package.
          </p>
          
          <div className="rounded-xl border border-outline-variant/10 bg-surface p-5">
            <h4 className="font-headline text-sm font-semibold text-on-surface mb-3">The Problem</h4>
            <p className="text-body-sm text-on-surface-variant">
              Vibe coding without structure leads to abandoned projects. You jump between research, design, and coding 
              without a clear plan. Context gets lost. Builds stall.
            </p>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
            <h4 className="font-headline text-sm font-semibold text-on-surface mb-3">The Solution</h4>
            <p className="text-body-sm text-on-surface">
              Preflight guides you through a proven sequence: capture a structured brief → generate research prompts → 
              create design prompts → write a PRD → generate system instructions → produce sequential build prompts. 
              Each step builds on the last, with all context preserved.
            </p>
          </div>

          <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-5">
            <h4 className="font-headline text-sm font-semibold text-on-surface mb-3">Who It's For</h4>
            <p className="text-body-sm text-on-surface">
              Builders who use AI coding tools and want to ship complete projects, not just prototypes. Solo founders, 
              indie hackers, and developers who want AI to amplify their output, not replace their judgment.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "quick-start",
      title: "Quick Start Guide",
      icon: "flash_on",
      content: (
        <div className="space-y-4">
          <p className="text-body-sm text-on-surface">
            Get your first project from idea to build-ready prompts in 5 minutes.
          </p>

          <div className="space-y-3">
            <h4 className="font-headline text-sm font-semibold text-on-surface">Step 1: Create a Project</h4>
            <div className="rounded-xl bg-surface p-4 border border-outline-variant/10">
              <ol className="space-y-2 text-body-sm text-on-surface">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
                  Click <strong className="text-primary">New Project</strong> on the Project Hub
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
                  Enter a name and description for your app
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">3</span>
                  Select target platforms (Lovable, Bolt, Cursor, etc.)
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">4</span>
                  Add tech stack tags (React, Tailwind, Supabase, etc.)
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">5</span>
                  Click <strong className="text-primary">Create Project</strong>
                </li>
              </ol>
            </div>

            <h4 className="font-headline text-sm font-semibold text-on-surface mt-6">Step 2: Fill the Brief</h4>
            <div className="rounded-xl bg-surface p-4 border border-outline-variant/10">
              <ol className="space-y-2 text-body-sm text-on-surface">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
                  Navigate to the <strong className="text-primary">Brief</strong> tab
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
                  Define the problem you're solving (1-3 sentences)
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">3</span>
                  Describe target users (who, technical level, current solution)
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">4</span>
                  List core features (3-6, ordered by priority)
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">5</span>
                  Add tech stack hints and target platforms
                </li>
              </ol>
              <p className="mt-3 text-label-sm text-on-surface-variant">
                💡 <strong>Tip:</strong> The completion indicator shows when your brief is ready. Aim for 80%+ before proceeding.
              </p>
            </div>

            <h4 className="font-headline text-sm font-semibold text-on-surface mt-6">Step 3: Generate Research</h4>
            <div className="rounded-xl bg-surface p-4 border border-outline-variant/10">
              <ol className="space-y-2 text-body-sm text-on-surface">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
                  Go to <strong className="text-primary">Research</strong> tab
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
                  Select context nodes (Brief, Tech Stack, User Personas)
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">3</span>
                  Click <strong className="text-primary">Generate Research Prompt</strong>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">4</span>
                  Copy the generated prompt
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">5</span>
                  Paste into Perplexity, Gemini, or ChatGPT Deep Research
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">6</span>
                  Upload research results to the Vault
                </li>
              </ol>
            </div>

            <h4 className="font-headline text-sm font-semibold text-on-surface mt-6">Step 4: Generate Design</h4>
            <div className="rounded-xl bg-surface p-4 border border-outline-variant/10">
              <ol className="space-y-2 text-body-sm text-on-surface">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
                  Navigate to <strong className="text-primary">Design</strong> tab
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
                  Select target platform (Stitch, v0, Figma AI, etc.)
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">3</span>
                  Choose context nodes (Brief, Research Results)
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">4</span>
                  Click <strong className="text-primary">Generate Design Prompt</strong>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">5</span>
                  Copy and paste into your design platform
                </li>
              </ol>
            </div>

            <h4 className="font-headline text-sm font-semibold text-on-surface mt-6">Step 5: Generate PRD & System</h4>
            <div className="rounded-xl bg-surface p-4 border border-outline-variant/10">
              <ol className="space-y-2 text-body-sm text-on-surface">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
                  Go to <strong className="text-primary">PRD</strong> tab
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
                  Click <strong className="text-primary">Generate PRD</strong> — wait for completion
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">3</span>
                  Generate System Instructions for your platform
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">4</span>
                  Generate Rules File (.cursorrules / CLAUDE.md)
                </li>
              </ol>
            </div>

            <h4 className="font-headline text-sm font-semibold text-on-surface mt-6">Step 6: Build Your App</h4>
            <div className="rounded-xl bg-surface p-4 border border-outline-variant/10">
              <ol className="space-y-2 text-body-sm text-on-surface">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
                  Navigate to <strong className="text-primary">Build</strong> tab
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
                  Click <strong className="text-primary">Generate Full Build Workflow</strong>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">3</span>
                  Start with Stage 1 (Foundation)
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">4</span>
                  Copy prompt and paste into AI coding tool
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">5</span>
                  Mark stages complete as you progress
                </li>
              </ol>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "features",
      title: "Features Overview",
      icon: "feature_list",
      content: (
        <div className="space-y-4">
          <p className="text-body-sm text-on-surface">
            Preflight includes 7 core modules that guide you from idea to production-ready build package.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: "description",
                title: "Brief",
                desc: "Structured idea capture with autosave, completion scoring, and feature prioritization."
              },
              {
                icon: "analytics",
                title: "Research",
                desc: "Generate deep research prompts for Perplexity, Gemini, ChatGPT Deep Research."
              },
              {
                icon: "palette",
                title: "Design",
                desc: "Create design prompts for Stitch, v0, Figma AI, Locofy, Universal."
              },
              {
                icon: "article",
                title: "PRD",
                desc: "Full product requirements document with TypeScript data models and schemas."
              },
              {
                icon: "terminal",
                title: "System",
                desc: "System instructions + .cursorrules / CLAUDE.md for your AI coding tool."
              },
              {
                icon: "build",
                title: "Build",
                desc: "Sequential build workflow: Stage 0 → Foundation → Database → Features → Audit → Deploy."
              },
              {
                icon: "inventory_2",
                title: "Vault",
                desc: "Project file storage with context injection for generations. Max 10MB per file."
              },
              {
                icon: "key",
                title: "BYOK",
                desc: "Bring your own key — Anthropic, OpenAI, Google, DeepSeek, Groq, custom endpoints."
              }
            ].map((feature) => (
              <div key={feature.title} className="rounded-xl border border-outline-variant/10 bg-surface p-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-2xl text-primary shrink-0">
                    {feature.icon}
                  </span>
                  <div>
                    <h4 className="font-headline text-sm font-semibold text-on-surface">{feature.title}</h4>
                    <p className="mt-1 text-body-sm text-on-surface-variant">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "claude-skills",
      title: "Claude Skills",
      icon: "psychology",
      content: (
        <div className="space-y-4">
          <p className="text-body-sm text-on-surface">
            Use Preflight conversationally in Claude Desktop! Download the skill file and follow the setup guide.
          </p>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="font-headline text-lg font-semibold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">psychology</span>
                  Preflight Interactive Skill
                </h3>
                <p className="mt-2 text-body-sm text-on-surface">
                  Run the full 7-phase pipeline conversationally in Claude Desktop — from raw idea to build-ready prompts.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadSkill}
                className="gradient-cta glow-primary shrink-0 rounded-xl px-5 py-3 text-sm font-semibold text-on-primary"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">download</span>
                  Download
                </span>
              </button>
            </div>

            <div className="rounded-xl border border-outline-variant/10 bg-surface p-5">
              <h4 className="font-headline text-sm font-semibold text-on-surface mb-3">
                How to Add to Claude Desktop
              </h4>
              <ol className="space-y-2 text-body-sm text-on-surface">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
                  Click <strong className="text-primary">Download</strong> to get the skill file
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
                  Open <strong className="text-primary">Claude Desktop Settings</strong>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">3</span>
                  Go to <code className="bg-surface-container px-2 py-0.5 rounded text-primary">Developer</code> → <code className="bg-surface-container px-2 py-0.5 rounded text-primary">Skills</code>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">4</span>
                  Click <strong className="text-primary">Add Skill</strong> and select the downloaded file
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">5</span>
                  Start chatting: <em className="text-primary">"I have an app idea..."</em> or <em className="text-primary">"Help me build an app"</em>
                </li>
              </ol>
            </div>

            <div className="mt-4 rounded-xl border border-secondary/20 bg-secondary/5 p-4">
              <h4 className="font-headline text-sm font-semibold text-on-surface mb-2">What Gets Produced</h4>
              <ul className="space-y-1 text-body-sm text-on-surface">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-base text-secondary shrink-0 mt-0.5">check</span>
                  Structured project brief
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-base text-secondary shrink-0 mt-0.5">check</span>
                  Research prompt for Perplexity / Gemini / ChatGPT
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-base text-secondary shrink-0 mt-0.5">check</span>
                  Design prompt for Stitch / v0 / Figma AI
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-base text-secondary shrink-0 mt-0.5">check</span>
                  Complete PRD with TypeScript data model
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-base text-secondary shrink-0 mt-0.5">check</span>
                  System instructions + rules file
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-base text-secondary shrink-0 mt-0.5">check</span>
                  Sequential build prompts (Stage 0-7)
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "tips",
      title: "Tips & Best Practices",
      icon: "lightbulb",
      content: (
        <div className="space-y-4">
          <div className="rounded-xl border border-tertiary/20 bg-tertiary/5 p-5">
            <h4 className="font-headline text-sm font-semibold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">lightbulb</span>
              Brief Writing Tips
            </h4>
            <ul className="space-y-2 text-body-sm text-on-surface">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base text-tertiary shrink-0 mt-0.5">arrow_right</span>
                Be specific about the problem — avoid vague statements
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base text-tertiary shrink-0 mt-0.5">arrow_right</span>
                Describe users with details: "solo founders using Lovable" not just "developers"
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base text-tertiary shrink-0 mt-0.5">arrow_right</span>
                Order features by priority — what's absolutely essential for v1?
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base text-tertiary shrink-0 mt-0.5">arrow_right</span>
                Add tech stack preferences early — AI will recommend if unsure
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
            <h4 className="font-headline text-sm font-semibold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">search</span>
              Research Best Practices
            </h4>
            <ul className="space-y-2 text-body-sm text-on-surface">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base text-primary shrink-0 mt-0.5">arrow_right</span>
                Use Perplexity for fastest results, Gemini for deepest analysis
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base text-primary shrink-0 mt-0.5">arrow_right</span>
                Save all research to Vault — even partial results are valuable
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base text-primary shrink-0 mt-0.5">arrow_right</span>
                Look for direct user quotes — they reveal real pain points
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base text-primary shrink-0 mt-0.5">arrow_right</span>
                Pay attention to what competitors don't do well — that's your whitespace
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-5">
            <h4 className="font-headline text-sm font-semibold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">palette</span>
              Design Tips
            </h4>
            <ul className="space-y-2 text-body-sm text-on-surface">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base text-secondary shrink-0 mt-0.5">arrow_right</span>
                Stitch is best for complete app UI, v0 for individual components
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base text-secondary shrink-0 mt-0.5">arrow_right</span>
                Include reference apps in your design prompt for visual direction
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base text-secondary shrink-0 mt-0.5">arrow_right</span>
                Export designs as PNG and upload to Vault for the build agent
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base text-secondary shrink-0 mt-0.5">arrow_right</span>
                Dark theme is recommended for developer tools, lighter for consumer apps
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-outline-variant/10 bg-surface p-5">
            <h4 className="font-headline text-sm font-semibold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">build</span>
              Build Workflow Tips
            </h4>
            <ul className="space-y-2 text-body-sm text-on-surface">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base text-primary shrink-0 mt-0.5">arrow_right</span>
                Run Stage 0 (Context Scan) first if you have DOCS folder set up
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base text-primary shrink-0 mt-0.5">arrow_right</span>
                Never run two build stages at once — wait for each to complete
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base text-primary shrink-0 mt-0.5">arrow_right</span>
                Fix all errors before proceeding to the next stage
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base text-primary shrink-0 mt-0.5">arrow_right</span>
                Run <code className="bg-surface-container px-2 py-0.5 rounded text-primary">npm run build</code> after every stage
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base text-primary shrink-0 mt-0.5">arrow_right</span>
                Export all prompts as backup before starting the build
              </li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const filteredSections = sections.filter((section) =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-outline-variant/10 bg-surface-container/80 backdrop-blur-xl">
        <div className="mx-auto max-w-[1400px] px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="font-headline text-headline-xl font-bold text-on-surface flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl text-primary">menu_book</span>
                Preflight Documentation
              </h1>
              <p className="mt-1 text-body-sm text-on-surface-variant">
                Complete guide for builders — from idea to production-ready build package
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportPDF}
              className="rounded-xl border border-outline-variant/15 bg-surface px-4 py-2 text-sm text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface"
              title="Export documentation as PDF"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                Export PDF
              </span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documentation..."
                className="w-full rounded-xl border border-outline-variant/20 bg-surface py-2.5 pl-10 pr-4 text-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Table of Contents - Sidebar */}
          <aside className="hidden lg:col-span-1 lg:block">
            <div className="sticky top-28 rounded-2xl border border-outline-variant/10 bg-surface-container p-5">
              <h3 className="font-headline text-sm font-semibold text-on-surface mb-4 uppercase tracking-[0.15em]">
                Contents
              </h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => {
                      const element = document.getElementById(section.id);
                      element?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition",
                      expandedSections[section.id]
                        ? "text-primary bg-primary/5"
                        : "text-on-surface-variant hover:text-on-surface"
                    )}
                  >
                    <span className="material-symbols-outlined text-base">{section.icon}</span>
                    <span className="truncate">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Documentation Content */}
          <div className="lg:col-span-3 space-y-6">
            {filteredSections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="rounded-2xl border border-outline-variant/10 bg-surface-container overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 hover:bg-surface-container-high transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-2xl text-primary">{section.icon}</span>
                    <h2 className="font-headline text-headline-md font-bold text-on-surface">
                      {section.title}
                    </h2>
                  </div>
                  <span className={cn(
                    "material-symbols-outlined transition-transform",
                    expandedSections[section.id] ? "rotate-180" : ""
                  )}>
                    expand_less
                  </span>
                </button>

                {expandedSections[section.id] && (
                  <div className="px-6 pb-6">
                    <div className="h-px bg-outline-variant/10 mb-4" />
                    {section.content}
                  </div>
                )}
              </section>
            ))}

            {filteredSections.length === 0 && (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">search_off</span>
                <p className="text-body-lg text-on-surface-variant">No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-outline-variant/10 bg-surface-container">
        <div className="mx-auto max-w-[1400px] px-6 py-8">
          <div className="flex items-center justify-between gap-4">
            <p className="text-body-sm text-on-surface-variant">
              Preflight Documentation — Version 0.2.0
            </p>
            <p className="text-body-sm text-on-surface-variant">
              Built with ❤️ and AI by the Preflight Team
            </p>
          </div>
        </div>
      </footer>

      {/* Print Styles */}
      <style>{`
        @media print {
          aside, button, .sticky { display: none !important; }
          section { break-inside: avoid; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
};

export default DocumentationPage;
