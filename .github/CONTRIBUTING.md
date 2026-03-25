# Contributing to Preflight

Thank you for your interest in contributing to Preflight! This document provides guidelines and instructions for contributing.

## 🎯 What is Preflight?

Preflight is an open-source Project Operating System for vibe coders — builders who use AI coding assistants (Lovable, Bolt, Cursor, Claude Code, Replit, v0, etc.) to build apps. It eliminates chaotic, fragmented workflows by providing a structured, AI-ready build pipeline.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Contributions](#making-contributions)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Coding Standards](#coding-standards)
- [Questions?](#questions)

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing. We expect all contributors to follow these guidelines to maintain a welcoming and inclusive community.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a branch** for your feature or bug fix
4. **Make your changes** following our coding standards
5. **Test your changes** thoroughly
6. **Submit a pull request**

## Development Setup

### Prerequisites

- Node.js 20+ 
- pnpm (recommended) or npm
- Git

### Installation

```bash
# Clone your fork
git clone https://github.com/Meykiio/preflight.git
cd preflight

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run tests
- `pnpm typecheck` - Run TypeScript type checking

## Making Contributions

### Types of Contributions We Welcome

- **Bug fixes** - Fix any issues you find
- **New features** - Add features that align with our roadmap
- **Documentation** - Improve docs, add examples, fix typos
- **UI/UX improvements** - Enhance the user experience
- **Performance optimizations** - Make Preflight faster
- **Tests** - Add or improve test coverage

### How to Propose a Feature

1. Check the [Issues](https://github.com/preflight/preflight/issues) to see if it's already discussed
2. Create a new issue with the "Feature Request" template
3. Wait for feedback from maintainers
4. Once approved, create a PR

## Pull Request Guidelines

### Before Submitting

- [ ] Your code follows our [Coding Standards](#coding-standards)
- [ ] You've tested your changes locally
- [ ] You've added tests if applicable
- [ ] Your code passes type checking (`pnpm typecheck`)
- [ ] Your code builds successfully (`pnpm build`)
- [ ] You've updated documentation if needed

### PR Title Format

Use conventional commits format:
- `feat: add new feature`
- `fix: resolve issue with X`
- `docs: update README`
- `style: improve formatting`
- `refactor: clean up X component`
- `test: add tests for X`
- `chore: update dependencies`

### PR Description

Include:
- What changes you made
- Why you made them
- How to test the changes
- Screenshots if UI changed

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- No `any` types - use proper type definitions
- Export interfaces for shared types
- Follow existing type patterns

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use meaningful variable names
- Add PropTypes or TypeScript types for all props

### Styling

- Use Tailwind CSS utility classes
- Follow existing design patterns
- Use CSS variables for theme colors
- Maintain responsive design

### Code Organization

- Group related files in folders
- Use index.ts for exports
- Keep imports organized
- Remove unused imports

## Questions?

- **General questions**: Open a [Discussion](https://github.com/preflight/preflight/discussions)
- **Bug reports**: Open an [Issue](https://github.com/preflight/preflight/issues)
- **Feature requests**: Open an [Issue](https://github.com/preflight/preflight/issues)

## Thank You!

Every contribution, no matter how small, makes Preflight better. Thank you for being part of our community!

---

Built with ❤️ by the Preflight Team
