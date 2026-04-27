# Bugfix Requirements Document

## Introduction

This document addresses critical bugs in the AI provider integration system that prevent providers (OpenAI, Google Gemini, Anthropic, OpenRouter, Ollama) from functioning correctly when users provide API keys. The system has three interconnected defects:

1. **API keys are stored in plaintext** instead of being encrypted before saving to the database
2. **Base URL configuration is ignored** when saving provider settings, breaking providers that require custom endpoints (OpenRouter, Ollama)
3. **Unused encrypted store exists** - A properly implemented `aiStore.ts` with encryption exists but is not being used by the UI

These bugs affect all AI providers and prevent the application from securely storing credentials and properly configuring provider endpoints.

## Bug Analysis

### Current Behavior (Defect)

**1. API Key Encryption**

1.1 WHEN a user saves an API key through the Settings page THEN the system stores the API key in plaintext in the IndexedDB database without encryption

1.2 WHEN the system retrieves API keys from the database THEN it attempts to decrypt them using `decryptString()`, but since they were never encrypted, it returns the plaintext key or fails

1.3 WHEN the system displays masked API keys in the UI THEN it masks the plaintext key directly, exposing the key structure instead of showing encrypted data

**2. Base URL Configuration**

2.1 WHEN a user configures a custom base URL for providers like OpenRouter or Ollama THEN the `handleSaveProvider` function in SettingsPage ignores the `baseUrl` parameter

2.2 WHEN the system saves provider configuration THEN it does not pass the `baseUrl` to the `saveProvider` function, causing the base URL to be lost

2.3 WHEN providers like OpenRouter or Ollama attempt to make API calls THEN they use incorrect or missing base URLs, causing API requests to fail

**3. Code Architecture**

3.1 WHEN the Settings page and Onboarding flow need to save provider data THEN they use `useAIProviders` hook which lacks encryption

3.2 WHEN examining the codebase THEN there exists a properly implemented `aiStore.ts` with encryption using `encryptString()` that is not imported or used anywhere

3.3 WHEN the system initializes THEN it has two conflicting implementations for provider management with different security characteristics

### Expected Behavior (Correct)

**1. API Key Encryption**

2.1 WHEN a user saves an API key through the Settings page THEN the system SHALL encrypt the API key using `encryptString()` before storing it in the IndexedDB database

2.2 WHEN the system retrieves API keys from the database THEN it SHALL decrypt them using `decryptString()` to obtain the plaintext key for API calls

2.3 WHEN the system displays masked API keys in the UI THEN it SHALL decrypt the key first, then mask the plaintext version for display

**2. Base URL Configuration**

2.4 WHEN a user configures a custom base URL for any provider THEN the `handleSaveProvider` function SHALL accept the `baseUrl` parameter

2.5 WHEN the system saves provider configuration THEN it SHALL pass the `baseUrl` to the `saveProvider` function and persist it in the database

2.6 WHEN providers like OpenRouter or Ollama make API calls THEN they SHALL use the configured base URL from the provider configuration

**3. Code Architecture**

2.7 WHEN the Settings page and Onboarding flow need to save provider data THEN they SHALL use a single, consistent implementation with proper encryption

2.8 WHEN examining the codebase THEN there SHALL be one authoritative provider management implementation that handles encryption correctly

2.9 WHEN the system initializes THEN it SHALL use the encrypted provider store for all provider operations

### Unchanged Behavior (Regression Prevention)

**1. Provider Functionality**

3.1 WHEN a user with existing provider configurations upgrades THEN the system SHALL CONTINUE TO recognize and decrypt legacy plaintext keys using the fallback mechanism in `decryptString()`

3.2 WHEN a user saves a provider without changing the API key THEN the system SHALL CONTINUE TO preserve the existing encrypted key

3.3 WHEN a user selects a default provider THEN the system SHALL CONTINUE TO update the default provider correctly

**2. UI Behavior**

3.4 WHEN a user views the provider settings page THEN the system SHALL CONTINUE TO display provider cards with connection status and masked keys

3.5 WHEN a user edits provider settings THEN the system SHALL CONTINUE TO show the API key input, base URL input (for applicable providers), and model selector

3.6 WHEN a user saves provider settings THEN the system SHALL CONTINUE TO show success/error toast notifications

**3. Database Operations**

3.7 WHEN the system performs provider operations THEN it SHALL CONTINUE TO use Dexie transactions for atomic updates

3.8 WHEN a provider is set as default THEN the system SHALL CONTINUE TO clear other default flags and update app settings

3.9 WHEN a provider is deleted THEN the system SHALL CONTINUE TO promote the next provider to default if the deleted one was default
