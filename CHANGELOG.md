# Changelog

All notable changes to Preflight will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Error monitoring with Sentry integration
- Analytics tracking for key user events
- Legal pages (Privacy Policy, Terms of Service)
- Custom 404 page
- ESLint and Prettier configuration
- Structured logging service

### Changed
- Replaced console statements with proper logging
- Enhanced encryption key security with PBKDF2 derivation

### Fixed
- Silent error failures in hooks
- Production console statement leakage

## [0.1.1] - 2025-01-XX

### Fixed
- API keys now encrypted using AES-GCM before IndexedDB storage
- Base URL persistence for OpenRouter and Ollama providers
- Removed unused AI providers (deepseek, groq, qwen, lmstudio, custom)

### Added
- Comprehensive test suite for AI provider integration (18 tests)
- Property-based testing with fast-check
- Bug condition exploration tests
- Preservation property tests

### Security
- API keys encrypted with Web Crypto API
- Fallback support for legacy plaintext keys
- Base URLs properly persisted for custom endpoints

## [0.1.0] - 2025-01-XX

### Added
- Initial release of Preflight
- Project management workflow (Brief → Research → Design → PRD → Build)
- AI provider integration (Anthropic, OpenAI, Google, OpenRouter, Ollama)
- Local-first architecture with Dexie (IndexedDB)
- Artifact generation system
- Vault file management
- Build stage workflow
- Onboarding flow
- Dark mode UI with Tailwind CSS
- Agent system prompts customization

### Features
- **Brief Module**: Capture project ideas with problem, target user, core features
- **Research Module**: Generate research prompts and manage context files
- **Design Module**: Generate design prompts and track design iterations
- **PRD Module**: Generate comprehensive Product Requirements Documents
- **Build Module**: Multi-stage build workflow with platform-specific prompts
- **Vault Module**: File upload and context management
- **Ship Module**: Version management and deployment tracking

[Unreleased]: https://github.com/Meykiio/preflight/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/Meykiio/preflight/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Meykiio/preflight/releases/tag/v0.1.0
