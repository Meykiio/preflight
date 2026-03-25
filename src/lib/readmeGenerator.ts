import type { Brief, Project } from "@/types";

interface GenerateReadmeInput {
  project: Project;
  brief: Brief | null;
  techStack?: string[];
}

export const generateReadme = (input: GenerateReadmeInput): string => {
  const { project, brief, techStack } = input;

  const features = brief?.coreFeatures
    ?.map((f) => `- ${f.text}`)
    .join("\n") ?? "- Feature coming soon";

  const targetUser = brief?.targetUser || "Users who need this solution";
  const problem = brief?.problem || "Solving an important problem";

  return `# ${project.name}

${project.description || "An amazing project built with Preflight"}

## Overview

${project.name} is designed for ${targetUser.toLowerCase()}. 

### The Problem

${problem}

## Features

${features}

## Tech Stack

${techStack && techStack.length > 0 
  ? techStack.map((tech) => `- ${tech}`).join("\n")
  : "- Built with modern web technologies"}

## Getting Started

### Prerequisites

- Node.js 20+ 
- pnpm (recommended) or npm

### Installation

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd ${project.name.toLowerCase().replace(/\s+/g, "-")}

# Install dependencies
pnpm install

# Start development server
pnpm dev
\`\`\`

### Build for Production

\`\`\`bash
pnpm build
pnpm preview
\`\`\`

## Project Structure

\`\`\`
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── lib/            # Utilities and helpers
├── services/       # API and business logic
├── stores/         # State management
└── types/          # TypeScript types
\`\`\`

## Available Scripts

- \`pnpm dev\` - Start development server
- \`pnpm build\` - Build for production
- \`pnpm preview\` - Preview production build
- \`pnpm test\` - Run tests

## Deployment

This project can be deployed to any static hosting platform:

- **Vercel**: Connect your repository for automatic deployments
- **Netlify**: Drag and drop the \`dist\` folder
- **GitHub Pages**: Use GitHub Actions for automated deployment

## License

MIT License - feel free to use this project for your needs.

---

Built with [Preflight](https://github.com/preflight) - The Project OS for vibe coders.
`;
};
