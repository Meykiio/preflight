# AI Provider Integration Bugfix Design

## Overview

This design addresses three critical bugs in the AI provider integration system that prevent secure credential storage and proper provider configuration. The fix consolidates two conflicting implementations (aiStore.ts and useAIProviders.ts) into a single encrypted solution, ensures base URL parameters are properly saved for providers like OpenRouter and Ollama, and removes unused providers to streamline the system to five core providers: OpenAI, Google Gemini, Anthropic, OpenRouter, and Ollama.

The approach is surgical: migrate the UI layer to use the existing encrypted aiStore.ts implementation, add base URL parameter handling to the save flow, and remove unused provider definitions from the catalog. This preserves all existing functionality while fixing the security vulnerability and configuration bugs.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bugs - when API keys are saved without encryption, when base URLs are ignored during save, or when unused providers clutter the system
- **Property (P)**: The desired behavior - API keys must be encrypted before storage, base URLs must be persisted correctly, and only the 5 core providers should be available
- **Preservation**: Existing provider management functionality (default provider selection, model selection, UI display) that must remain unchanged
- **useAIProviders**: The current hook in `src/hooks/useAIProviders.ts` that lacks encryption and ignores base URLs
- **aiStore**: The properly implemented Zustand store in `src/stores/aiStore.ts` with encryption support
- **encryptString**: Function in `src/lib/security.ts` that encrypts plaintext using AES-GCM
- **decryptString**: Function in `src/lib/security.ts` that decrypts encrypted data with fallback to plaintext for legacy keys
- **PROVIDER_CATALOG**: Configuration object in `src/lib/ai/providerCatalog.ts` defining available AI providers
- **SaveProviderInput**: Interface defining the parameters for saving provider configuration (provider, apiKey, model, isDefault, baseUrl)

## Bug Details

### Bug Condition

The bugs manifest in three distinct scenarios:

**Bug 1: API Key Encryption**
The bug occurs when a user saves an API key through the Settings page or Onboarding flow. The `useAIProviders` hook's `saveProvider` function stores the API key directly in IndexedDB without calling `encryptString()`, leaving credentials in plaintext.

**Bug 2: Base URL Configuration**
The bug occurs when a user configures a custom base URL for providers like OpenRouter or Ollama. The `handleSaveProvider` function in SettingsPage.tsx accepts a `baseUrl` parameter but never passes it to the `saveProvider` function, causing the base URL to be lost.

**Bug 3: Unused Providers**
The bug is architectural - the PROVIDER_CATALOG contains 10 providers (anthropic, openai, google, deepseek, groq, qwen, openrouter, ollama, lmstudio, custom) but the user only needs 5 (OpenAI, Google Gemini, Anthropic, OpenRouter, Ollama).

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type SaveProviderInput
  OUTPUT: boolean
  
  RETURN (input.apiKey IS NOT EMPTY AND NOT isEncrypted(input.apiKey))
         OR (input.baseUrl IS PROVIDED AND NOT isPersisted(input.baseUrl))
         OR (input.provider IN ['deepseek', 'groq', 'qwen', 'lmstudio', 'custom'])
END FUNCTION
```

### Examples

**Bug 1 Examples:**
- User saves OpenAI API key "sk-proj-abc123xyz" → Stored as plaintext "sk-proj-abc123xyz" in IndexedDB instead of encrypted blob
- User saves Anthropic API key "sk-ant-def456uvw" → Stored as plaintext, visible in browser DevTools → IndexedDB viewer
- System retrieves API key → Calls `decryptString()` on plaintext → Returns plaintext (fallback behavior masks the bug)

**Bug 2 Examples:**
- User configures OpenRouter with base URL "https://openrouter.ai/api/v1" → Base URL is lost, API calls fail
- User configures Ollama with base URL "http://localhost:11434/v1" → Base URL is not saved, provider cannot connect
- User edits provider without changing base URL → Existing base URL is preserved (edge case that works)

**Bug 3 Examples:**
- User sees DeepSeek provider card in Settings → Not needed, adds UI clutter
- User sees Groq, Qwen, LM Studio, Custom providers → Only 5 providers should be available
- Provider catalog contains unused definitions → Increases maintenance burden

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Provider card UI display with connection status, masked keys, and edit functionality must continue to work
- Default provider selection and model selection must continue to work
- Database transactions for atomic updates must continue to work
- Legacy plaintext key decryption fallback must continue to work for existing users
- Toast notifications for save success/error must continue to work
- Onboarding flow provider setup must continue to work

**Scope:**
All inputs that do NOT involve saving new API keys or base URLs should be completely unaffected by this fix. This includes:
- Viewing provider settings (read operations)
- Setting a provider as default (without changing keys)
- Deleting providers
- Viewing masked API keys
- Navigating between settings sections

## Hypothesized Root Cause

Based on the bug description and code analysis, the root causes are:

1. **Duplicate Implementation**: The codebase has two provider management implementations:
   - `useAIProviders` hook (used by UI) - lacks encryption, ignores base URLs
   - `aiStore` Zustand store (unused) - has proper encryption, but also lacks base URL handling
   
   The UI was built using the simpler hook before the encrypted store was created, and the migration was never completed.

2. **Missing Parameter Propagation**: The `handleSaveProvider` function in SettingsPage.tsx receives `baseUrl` from ProviderCard but doesn't pass it to `saveProvider`:
   ```typescript
   const handleSaveProvider = async (provider: AIProvider, apiKey: string): Promise<void> => {
     // baseUrl parameter is missing here!
   ```

3. **Incomplete Store Implementation**: The `aiStore.ts` has encryption but its `SaveProviderInput` interface and `saveProvider` function don't accept or handle the `baseUrl` parameter.

4. **Provider Catalog Bloat**: The PROVIDER_CATALOG was created with 10 providers for flexibility, but the user's requirements specify only 5 providers are needed.

## Correctness Properties

Property 1: Bug Condition - API Key Encryption

_For any_ provider save operation where an API key is provided, the fixed system SHALL encrypt the API key using `encryptString()` before storing it in IndexedDB, ensuring credentials are never stored in plaintext.

**Validates: Requirements 2.1, 2.2, 2.3**

Property 2: Bug Condition - Base URL Persistence

_For any_ provider save operation where a base URL is provided (OpenRouter, Ollama), the fixed system SHALL persist the base URL to the database and retrieve it correctly for API calls, ensuring custom endpoints work properly.

**Validates: Requirements 2.4, 2.5, 2.6**

Property 3: Bug Condition - Provider Cleanup

_For any_ provider selection operation, the fixed system SHALL only present the 5 core providers (OpenAI, Google Gemini, Anthropic, OpenRouter, Ollama) in the UI and catalog, removing unused providers.

**Validates: User's audit request**

Property 4: Preservation - Existing Functionality

_For any_ provider management operation that does NOT involve saving new API keys or base URLs (viewing, setting default, deleting), the fixed system SHALL produce exactly the same behavior as the original system, preserving all existing UI and database operations.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File 1**: `src/stores/aiStore.ts`

**Changes**:
1. **Add baseUrl to SaveProviderInput interface**: Add `baseUrl?: string` parameter
2. **Update saveProvider function**: Accept and persist baseUrl parameter
3. **Preserve baseUrl on key-only updates**: When user saves without changing baseUrl, preserve existing value

**File 2**: `src/hooks/useAIProviders.ts`

**Changes**:
1. **Add encryption to saveProvider**: Import and call `encryptString()` before storing API keys
2. **Add baseUrl parameter**: Update SaveProviderInput interface and function signature
3. **Add baseUrl to AIProviderSummary**: Include baseUrl in the provider snapshot for UI display

**File 3**: `src/pages/settings/SettingsPage.tsx`

**Changes**:
1. **Update handleSaveProvider signature**: Add `baseUrl?: string` parameter
2. **Pass baseUrl to saveProvider**: Forward baseUrl parameter to the hook's saveProvider function

**File 4**: `src/components/settings/ProviderSettingsSection.tsx`

**Changes**:
1. **Update onSaveProvider prop type**: Add `baseUrl?: string` parameter to the callback signature

**File 5**: `src/lib/ai/providerCatalog.ts`

**Changes**:
1. **Remove unused providers**: Delete deepseek, groq, qwen, lmstudio, custom from PROVIDER_CATALOG
2. **Update PROVIDER_ORDER**: Remove unused providers from the order array
3. **Keep only 5 providers**: anthropic, openai, google, openrouter, ollama

**File 6**: `src/components/onboarding/OnboardingProviderStep.tsx` (if it exists)

**Changes**:
1. **Update provider save call**: Ensure baseUrl is passed when saving providers during onboarding
2. **Verify encryption**: Confirm the onboarding flow uses the updated saveProvider with encryption

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bugs on unfixed code, then verify the fixes work correctly and preserve existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bugs BEFORE implementing the fix. Confirm or refute the root cause analysis.

**Test Plan**: Write tests that save provider configurations with API keys and base URLs, then inspect the database directly to verify encryption and persistence. Run these tests on the UNFIXED code to observe failures.

**Test Cases**:
1. **Plaintext API Key Test**: Save OpenAI provider with API key "sk-test-123" → Inspect IndexedDB → Verify key is stored as plaintext (will fail on unfixed code)
2. **Base URL Loss Test**: Save OpenRouter with base URL "https://openrouter.ai/api/v1" → Retrieve provider → Verify baseUrl is undefined (will fail on unfixed code)
3. **Ollama Base URL Test**: Save Ollama with base URL "http://localhost:11434/v1" → Retrieve provider → Verify baseUrl is undefined (will fail on unfixed code)
4. **Unused Provider Test**: Check PROVIDER_CATALOG → Verify it contains 10 providers including deepseek, groq, qwen (will fail on unfixed code)

**Expected Counterexamples**:
- API keys stored in plaintext format in IndexedDB aiProviders table
- Base URL field is undefined or null after saving providers with custom endpoints
- PROVIDER_CATALOG contains 10 providers instead of 5
- Possible causes: missing encryptString() call, baseUrl parameter not propagated, catalog not cleaned up

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := saveProvider_fixed(input)
  
  // Check encryption
  IF input.apiKey IS NOT EMPTY THEN
    storedKey := getFromDatabase(result.id).apiKey
    ASSERT isEncrypted(storedKey)
    ASSERT decryptString(storedKey) = input.apiKey
  END IF
  
  // Check base URL persistence
  IF input.baseUrl IS PROVIDED THEN
    storedBaseUrl := getFromDatabase(result.id).baseUrl
    ASSERT storedBaseUrl = input.baseUrl
  END IF
  
  // Check provider cleanup
  ASSERT input.provider IN ['anthropic', 'openai', 'google', 'openrouter', 'ollama']
END FOR
```

**Test Cases**:
1. **Encryption Verification**: Save provider with API key → Retrieve from IndexedDB → Verify key is encrypted (base64 blob, not plaintext)
2. **Decryption Verification**: Save provider with API key → Call decryptString() → Verify plaintext key is recovered correctly
3. **Base URL Persistence**: Save OpenRouter with base URL → Retrieve provider → Verify baseUrl matches input
4. **Ollama Base URL**: Save Ollama with custom base URL → Retrieve provider → Verify baseUrl is persisted
5. **Provider Catalog**: Check PROVIDER_CATALOG keys → Verify only 5 providers exist
6. **UI Provider Cards**: Load Settings page → Verify only 5 provider cards are displayed

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  // Test read operations
  ASSERT getProviders_original() = getProviders_fixed()
  
  // Test default provider selection
  ASSERT setDefault_original(providerId) = setDefault_fixed(providerId)
  
  // Test provider deletion
  ASSERT deleteProvider_original(providerId) = deleteProvider_fixed(providerId)
  
  // Test UI display
  ASSERT renderProviderCard_original(provider) = renderProviderCard_fixed(provider)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for read operations, default selection, and UI display, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Read Operations Preservation**: Retrieve all providers → Verify same data structure and fields are returned
2. **Default Provider Preservation**: Set provider as default → Verify default flag is set correctly and other defaults are cleared
3. **Provider Deletion Preservation**: Delete a provider → Verify it's removed and next provider becomes default if needed
4. **UI Display Preservation**: Render provider cards → Verify connection status, masked keys, and edit buttons work identically
5. **Model Selection Preservation**: Change provider model → Verify model is updated correctly
6. **Toast Notifications Preservation**: Save provider → Verify success/error toasts are displayed
7. **Legacy Key Decryption**: Load provider with legacy plaintext key → Verify decryptString() fallback works

### Unit Tests

- Test `encryptString()` and `decryptString()` with various API key formats
- Test `saveProvider()` with and without base URLs
- Test provider save with empty API key (for Ollama)
- Test provider save with existing provider (update scenario)
- Test default provider flag clearing when setting new default
- Test PROVIDER_CATALOG contains exactly 5 providers
- Test ProviderCard renders base URL input for OpenRouter and Ollama

### Property-Based Tests

- Generate random API keys and verify encryption/decryption round-trip
- Generate random base URLs and verify persistence
- Generate random provider configurations and verify all fields are saved correctly
- Test that all non-save operations (read, delete, set default) produce identical results before and after fix

### Integration Tests

- Test full Settings page flow: open page → edit provider → save with API key and base URL → verify encrypted storage
- Test Onboarding flow: select provider → enter API key → complete onboarding → verify encrypted storage
- Test provider switching: save multiple providers → set different defaults → verify correct provider is used
- Test legacy migration: load app with legacy plaintext keys → verify they still work via decryption fallback
- Test OpenRouter API call: save OpenRouter with base URL → make API call → verify correct endpoint is used
- Test Ollama API call: save Ollama with base URL → make API call → verify correct endpoint is used
