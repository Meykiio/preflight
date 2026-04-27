/**
 * Bug Condition Exploration Test for AI Provider Integration
 * 
 * **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bugs exist
 * **DO NOT attempt to fix the test or the code when it fails**
 * **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
 * 
 * Validates: Requirements 1.1, 1.2, 2.1, 2.2
 * Property 1: Bug Condition - API Key Plaintext Storage and Base URL Loss
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useAIProviders } from "./useAIProviders";
import db from "@/lib/db";
import { encryptString, decryptString, initializeStorageKey } from "@/lib/security";

describe("Bug Condition Exploration: AI Provider Integration", () => {
  beforeEach(async () => {
    // Initialize encryption key
    await initializeStorageKey();
    
    // Clear database before each test
    await db.aiProviders.clear();
    await db.appSettings.clear();
  });

  afterEach(async () => {
    // Clean up after each test
    await db.aiProviders.clear();
    await db.appSettings.clear();
  });

  describe("Property 1: API Key Encryption", () => {
    it("should encrypt API keys before storing them in IndexedDB", async () => {
      const { result } = renderHook(() => useAIProviders());

      const testApiKey = "sk-test-123";
      const testProvider = {
        provider: "openai" as const,
        apiKey: testApiKey,
        model: "gpt-4",
        isDefault: true
      };

      // Save provider with API key
      await waitFor(async () => {
        const saved = await result.current.saveProvider(testProvider);
        expect(saved).not.toBeNull();
      });

      // Retrieve the provider directly from IndexedDB
      const storedProviders = await db.aiProviders.toArray();
      expect(storedProviders).toHaveLength(1);
      
      const storedProvider = storedProviders[0];
      const storedApiKey = storedProvider.apiKey;

      // **EXPECTED BEHAVIOR**: API key should be encrypted (not plaintext)
      // The encrypted key should be a base64 string that's longer than the original
      // and should NOT match the plaintext key
      expect(storedApiKey).not.toBe(testApiKey);
      expect(storedApiKey.length).toBeGreaterThan(testApiKey.length);
      
      // Verify it's actually encrypted by checking if it can be decrypted
      const decrypted = await decryptString(storedApiKey);
      expect(decrypted).toBe(testApiKey);

      // **BUG CONDITION**: If this test fails, it means:
      // - storedApiKey === testApiKey (stored in plaintext)
      // - This confirms Bug 1: API keys are stored without encryption
    });

    it("should not store API keys in plaintext format", async () => {
      const { result } = renderHook(() => useAIProviders());

      const testApiKey = "sk-proj-abc123xyz";
      const testProvider = {
        provider: "anthropic" as const,
        apiKey: testApiKey,
        model: "claude-3-5-sonnet-20241022",
        isDefault: false
      };

      await waitFor(async () => {
        const saved = await result.current.saveProvider(testProvider);
        expect(saved).not.toBeNull();
      });

      // Check what's actually stored in the database
      const storedProvider = await db.aiProviders.toCollection().first();
      expect(storedProvider).toBeDefined();

      // **EXPECTED BEHAVIOR**: The stored key should look like encrypted data
      // (base64 encoded, contains IV + encrypted data)
      const storedKey = storedProvider!.apiKey;
      
      // Encrypted keys should be base64 and significantly longer
      const isLikelyEncrypted = storedKey.length > testApiKey.length * 1.5;
      expect(isLikelyEncrypted).toBe(true);
      
      // Should not be the plaintext key
      expect(storedKey).not.toBe(testApiKey);

      // **BUG CONDITION**: If this fails, the key is stored in plaintext
    });
  });

  describe("Property 2: Base URL Persistence", () => {
    it("should persist base URL for OpenRouter provider", async () => {
      const { result } = renderHook(() => useAIProviders());

      const testBaseUrl = "https://openrouter.ai/api/v1";
      const testProvider = {
        provider: "openrouter" as const,
        apiKey: "sk-or-test-key",
        model: "openai/gpt-4",
        baseUrl: testBaseUrl,
        isDefault: false
      };

      // Save provider with base URL
      await waitFor(async () => {
        const saved = await result.current.saveProvider(testProvider);
        expect(saved).not.toBeNull();
      });

      // Retrieve the provider from IndexedDB
      const storedProvider = await db.aiProviders
        .where("provider")
        .equals("openrouter")
        .first();

      expect(storedProvider).toBeDefined();

      // **EXPECTED BEHAVIOR**: Base URL should be persisted and retrievable
      expect(storedProvider!.baseUrl).toBe(testBaseUrl);
      expect(storedProvider!.baseUrl).not.toBeUndefined();
      expect(storedProvider!.baseUrl).not.toBeNull();

      // **BUG CONDITION**: If this test fails, it means:
      // - storedProvider.baseUrl is undefined or null
      // - This confirms Bug 2: Base URLs are ignored when saving providers
    });

    it("should persist base URL for Ollama provider", async () => {
      const { result } = renderHook(() => useAIProviders());

      const testBaseUrl = "http://localhost:11434/v1";
      const testProvider = {
        provider: "ollama" as const,
        apiKey: "", // Ollama doesn't require API key
        model: "llama2",
        baseUrl: testBaseUrl,
        isDefault: false
      };

      // Save provider with base URL
      await waitFor(async () => {
        const saved = await result.current.saveProvider(testProvider);
        expect(saved).not.toBeNull();
      });

      // Retrieve the provider from IndexedDB
      const storedProvider = await db.aiProviders
        .where("provider")
        .equals("ollama")
        .first();

      expect(storedProvider).toBeDefined();

      // **EXPECTED BEHAVIOR**: Base URL should be persisted
      expect(storedProvider!.baseUrl).toBe(testBaseUrl);
      expect(storedProvider!.baseUrl).not.toBeUndefined();

      // **BUG CONDITION**: If this fails, base URL is lost during save
    });

    it("should preserve base URL when updating provider without changing it", async () => {
      const { result } = renderHook(() => useAIProviders());

      const originalBaseUrl = "https://openrouter.ai/api/v1";
      
      // First save with base URL
      const initialProvider = {
        provider: "openrouter" as const,
        apiKey: "sk-or-initial",
        model: "openai/gpt-4",
        baseUrl: originalBaseUrl,
        isDefault: false
      };

      let savedId: string | undefined;
      await waitFor(async () => {
        const saved = await result.current.saveProvider(initialProvider);
        expect(saved).not.toBeNull();
        savedId = saved!.id;
      });

      // Update provider without specifying base URL
      const updateProvider = {
        id: savedId,
        provider: "openrouter" as const,
        apiKey: "sk-or-updated",
        model: "openai/gpt-4-turbo",
        isDefault: false
        // Note: baseUrl is NOT provided in update
      };

      await waitFor(async () => {
        const updated = await result.current.saveProvider(updateProvider);
        expect(updated).not.toBeNull();
      });

      // Retrieve and verify base URL is preserved
      const storedProvider = await db.aiProviders.get(savedId!);
      expect(storedProvider).toBeDefined();

      // **EXPECTED BEHAVIOR**: Base URL should be preserved from original save
      expect(storedProvider!.baseUrl).toBe(originalBaseUrl);

      // **BUG CONDITION**: If this fails, base URL is lost on update
    });
  });

  describe("Combined Bug Conditions", () => {
    it("should handle both encryption and base URL for OpenRouter", async () => {
      const { result } = renderHook(() => useAIProviders());

      const testApiKey = "sk-or-combined-test";
      const testBaseUrl = "https://openrouter.ai/api/v1";
      
      const testProvider = {
        provider: "openrouter" as const,
        apiKey: testApiKey,
        model: "anthropic/claude-3-opus",
        baseUrl: testBaseUrl,
        isDefault: true
      };

      await waitFor(async () => {
        const saved = await result.current.saveProvider(testProvider);
        expect(saved).not.toBeNull();
      });

      const storedProvider = await db.aiProviders
        .where("provider")
        .equals("openrouter")
        .first();

      expect(storedProvider).toBeDefined();

      // **EXPECTED BEHAVIOR 1**: API key should be encrypted
      expect(storedProvider!.apiKey).not.toBe(testApiKey);
      const decrypted = await decryptString(storedProvider!.apiKey);
      expect(decrypted).toBe(testApiKey);

      // **EXPECTED BEHAVIOR 2**: Base URL should be persisted
      expect(storedProvider!.baseUrl).toBe(testBaseUrl);

      // **BUG CONDITIONS**: 
      // - If apiKey matches plaintext: Bug 1 exists
      // - If baseUrl is undefined: Bug 2 exists
    });
  });
});
