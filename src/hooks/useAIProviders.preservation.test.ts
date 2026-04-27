/**
 * Preservation Property Tests for AI Provider Integration
 * 
 * **IMPORTANT**: These tests verify that non-buggy operations remain unchanged
 * **EXPECTED OUTCOME**: Tests PASS on unfixed code (confirms baseline behavior to preserve)
 * 
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9
 * Property 2: Preservation - Non-Buggy Provider Operations
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useAIProviders } from "./useAIProviders";
import db from "@/lib/db";
import { initializeStorageKey } from "@/lib/security";
import * as fc from "fast-check";

describe("Preservation Property Tests: Non-Buggy Provider Operations", () => {
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

  describe("Property 2.1: Read Operations Preservation", () => {
    it("should return consistent data structure when retrieving all providers", async () => {
      const { result } = renderHook(() => useAIProviders());

      // Create a test provider
      const testProvider = {
        provider: "openai" as const,
        apiKey: "sk-test-read-ops",
        model: "gpt-4",
        isDefault: true
      };

      await waitFor(async () => {
        await result.current.saveProvider(testProvider);
      });

      // Observe the data structure returned by the read operation
      await waitFor(() => {
        expect(result.current.providers).toHaveLength(1);
      });

      const provider = result.current.providers[0];

      // **PRESERVATION**: The data structure should have these fields
      expect(provider).toHaveProperty("id");
      expect(provider).toHaveProperty("provider");
      expect(provider).toHaveProperty("model");
      expect(provider).toHaveProperty("isDefault");
      expect(provider).toHaveProperty("hasKey");
      expect(provider).toHaveProperty("maskedKey");
      expect(provider).toHaveProperty("createdAt");

      // Verify field types
      expect(typeof provider.id).toBe("string");
      expect(typeof provider.provider).toBe("string");
      expect(typeof provider.model).toBe("string");
      expect(typeof provider.isDefault).toBe("boolean");
      expect(typeof provider.hasKey).toBe("boolean");
      expect(typeof provider.maskedKey).toBe("string");
    });

    it("should correctly identify providers with API keys", async () => {
      const { result } = renderHook(() => useAIProviders());

      // Provider with API key
      const providerWithKey = {
        provider: "anthropic" as const,
        apiKey: "sk-ant-test-key",
        model: "claude-3-5-sonnet-20241022",
        isDefault: false
      };

      // Provider without API key (Ollama)
      const providerWithoutKey = {
        provider: "ollama" as const,
        apiKey: "",
        model: "llama2",
        isDefault: false
      };

      await waitFor(async () => {
        await result.current.saveProvider(providerWithKey);
        await result.current.saveProvider(providerWithoutKey);
      });

      await waitFor(() => {
        expect(result.current.providers).toHaveLength(2);
      });

      // **PRESERVATION**: hasKey should correctly reflect API key presence
      const anthropic = result.current.providers.find(p => p.provider === "anthropic");
      const ollama = result.current.providers.find(p => p.provider === "ollama");

      expect(anthropic?.hasKey).toBe(true);
      expect(ollama?.hasKey).toBe(false);
    });

    it("should mask API keys consistently in the UI", async () => {
      const { result } = renderHook(() => useAIProviders());

      // Test various API key lengths
      const testCases = [
        { key: "sk-short", expectedPattern: /^sk\.\.\.rt$/ },
        { key: "sk-test-medium-key", expectedPattern: /^sk-test\.\.\.key$/ },
        { key: "sk-proj-very-long-api-key-12345", expectedPattern: /^sk-proj\.\.\.345$/ }
      ];

      for (const testCase of testCases) {
        await db.aiProviders.clear();
        
        const provider = {
          provider: "openai" as const,
          apiKey: testCase.key,
          model: "gpt-4",
          isDefault: true
        };

        await waitFor(async () => {
          await result.current.saveProvider(provider);
        });

        await waitFor(() => {
          expect(result.current.providers).toHaveLength(1);
        });

        // **PRESERVATION**: Masking pattern should be consistent
        const maskedKey = result.current.providers[0].maskedKey;
        expect(maskedKey).toMatch(testCase.expectedPattern);
        expect(maskedKey).not.toBe(testCase.key); // Should not expose full key
      }
    });
  });

  describe("Property 2.2: Default Provider Selection Preservation", () => {
    it("should correctly set a provider as default", async () => {
      const { result } = renderHook(() => useAIProviders());

      // Create two providers
      const provider1 = {
        provider: "openai" as const,
        apiKey: "sk-test-1",
        model: "gpt-4",
        isDefault: true
      };

      const provider2 = {
        provider: "anthropic" as const,
        apiKey: "sk-test-2",
        model: "claude-3-5-sonnet-20241022",
        isDefault: false
      };

      let id1: string | undefined;
      let id2: string | undefined;

      await waitFor(async () => {
        const saved1 = await result.current.saveProvider(provider1);
        const saved2 = await result.current.saveProvider(provider2);
        id1 = saved1?.id;
        id2 = saved2?.id;
      });

      await waitFor(() => {
        expect(result.current.providers).toHaveLength(2);
      });

      // **PRESERVATION**: Default provider should be correctly identified
      expect(result.current.defaultProvider?.provider).toBe("openai");

      // Change default to provider2
      await waitFor(async () => {
        await result.current.setDefault(id2!);
      });

      await waitFor(() => {
        expect(result.current.defaultProvider?.provider).toBe("anthropic");
      });

      // Verify only one provider is default
      const providers = result.current.providers;
      const defaultCount = providers.filter(p => p.isDefault).length;
      expect(defaultCount).toBe(1);
    });

    it("should clear previous default when setting new default", async () => {
      const { result } = renderHook(() => useAIProviders());

      // Create multiple providers
      const providers = [
        { provider: "openai" as const, apiKey: "sk-1", model: "gpt-4", isDefault: true },
        { provider: "anthropic" as const, apiKey: "sk-2", model: "claude-3-5-sonnet-20241022", isDefault: false },
        { provider: "google" as const, apiKey: "sk-3", model: "gemini-2.0-flash-exp", isDefault: false }
      ];

      const ids: string[] = [];

      for (const provider of providers) {
        await waitFor(async () => {
          const saved = await result.current.saveProvider(provider);
          if (saved?.id) ids.push(saved.id);
        });
      }

      await waitFor(() => {
        expect(result.current.providers).toHaveLength(3);
      });

      // **PRESERVATION**: Setting a new default should clear the old one
      await waitFor(async () => {
        await result.current.setDefault(ids[2]); // Set Google as default
      });

      await waitFor(() => {
        const defaultProviders = result.current.providers.filter(p => p.isDefault);
        expect(defaultProviders).toHaveLength(1);
        expect(defaultProviders[0].provider).toBe("google");
      });
    });
  });

  describe("Property 2.3: Provider Deletion Preservation", () => {
    it("should successfully delete a non-default provider", async () => {
      const { result } = renderHook(() => useAIProviders());

      const provider1 = {
        provider: "openai" as const,
        apiKey: "sk-test-1",
        model: "gpt-4",
        isDefault: true
      };

      const provider2 = {
        provider: "anthropic" as const,
        apiKey: "sk-test-2",
        model: "claude-3-5-sonnet-20241022",
        isDefault: false
      };

      let id2: string | undefined;

      await waitFor(async () => {
        await result.current.saveProvider(provider1);
        const saved2 = await result.current.saveProvider(provider2);
        id2 = saved2?.id;
      });

      await waitFor(() => {
        expect(result.current.providers).toHaveLength(2);
      });

      // **PRESERVATION**: Deleting non-default provider should work correctly
      await waitFor(async () => {
        await result.current.deleteProvider(id2!);
      });

      await waitFor(() => {
        expect(result.current.providers).toHaveLength(1);
        expect(result.current.providers[0].provider).toBe("openai");
      });
    });

    it("should promote next provider to default when deleting default provider", async () => {
      const { result } = renderHook(() => useAIProviders());

      const provider1 = {
        provider: "openai" as const,
        apiKey: "sk-test-1",
        model: "gpt-4",
        isDefault: true
      };

      const provider2 = {
        provider: "anthropic" as const,
        apiKey: "sk-test-2",
        model: "claude-3-5-sonnet-20241022",
        isDefault: false
      };

      let id1: string | undefined;

      await waitFor(async () => {
        const saved1 = await result.current.saveProvider(provider1);
        await result.current.saveProvider(provider2);
        id1 = saved1?.id;
      });

      await waitFor(() => {
        expect(result.current.providers).toHaveLength(2);
      });

      // **PRESERVATION**: Deleting default should promote next provider
      await waitFor(async () => {
        await result.current.deleteProvider(id1!);
      });

      await waitFor(() => {
        expect(result.current.providers).toHaveLength(1);
        expect(result.current.providers[0].isDefault).toBe(true);
        expect(result.current.providers[0].provider).toBe("anthropic");
      });
    });
  });

  describe("Property 2.4: Model Selection Preservation", () => {
    it("should correctly update provider model", async () => {
      const { result } = renderHook(() => useAIProviders());

      const initialProvider = {
        provider: "openai" as const,
        apiKey: "sk-test-model",
        model: "gpt-4",
        isDefault: true
      };

      let providerId: string | undefined;

      await waitFor(async () => {
        const saved = await result.current.saveProvider(initialProvider);
        providerId = saved?.id;
      });

      await waitFor(() => {
        expect(result.current.providers[0].model).toBe("gpt-4");
      });

      // **PRESERVATION**: Model update should work correctly
      const updatedProvider = {
        id: providerId,
        provider: "openai" as const,
        apiKey: "sk-test-model",
        model: "gpt-4-turbo",
        isDefault: true
      };

      await waitFor(async () => {
        await result.current.saveProvider(updatedProvider);
      });

      await waitFor(() => {
        expect(result.current.providers[0].model).toBe("gpt-4-turbo");
      });
    });
  });

  describe("Property 2.5: Database Transaction Preservation", () => {
    it("should handle concurrent operations atomically", async () => {
      const { result } = renderHook(() => useAIProviders());

      const providers = [
        { provider: "openai" as const, apiKey: "sk-1", model: "gpt-4", isDefault: false },
        { provider: "anthropic" as const, apiKey: "sk-2", model: "claude-3-5-sonnet-20241022", isDefault: false },
        { provider: "google" as const, apiKey: "sk-3", model: "gemini-2.0-flash-exp", isDefault: false }
      ];

      // **PRESERVATION**: Multiple saves should complete successfully
      await waitFor(async () => {
        await Promise.all(providers.map(p => result.current.saveProvider(p)));
      });

      await waitFor(() => {
        expect(result.current.providers).toHaveLength(3);
      });

      // Verify all providers were saved
      const savedProviders = result.current.providers;
      expect(savedProviders.map(p => p.provider).sort()).toEqual(["anthropic", "google", "openai"]);
    });
  });

  describe("Property 2.6: Property-Based Tests - Read Operations", () => {
    it("should consistently return provider data for any valid provider configuration", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom("openai", "anthropic", "google", "openrouter", "ollama"),
          fc.string({ minLength: 0, maxLength: 100 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.boolean(),
          async (provider, apiKey, model, isDefault) => {
            // Clear database for each property test iteration
            await db.aiProviders.clear();
            await db.appSettings.clear();

            const { result } = renderHook(() => useAIProviders());

            const testProvider = {
              provider: provider as any,
              apiKey,
              model,
              isDefault
            };

            await waitFor(async () => {
              await result.current.saveProvider(testProvider);
            });

            await waitFor(() => {
              expect(result.current.providers).toHaveLength(1);
            });

            const saved = result.current.providers[0];

            // **PRESERVATION**: Data structure should always be consistent
            expect(saved).toHaveProperty("id");
            expect(saved).toHaveProperty("provider");
            expect(saved).toHaveProperty("model");
            expect(saved).toHaveProperty("isDefault");
            expect(saved).toHaveProperty("hasKey");
            expect(saved).toHaveProperty("maskedKey");

            // Verify values match input
            expect(saved.provider).toBe(provider);
            expect(saved.model).toBe(model);
            expect(saved.isDefault).toBe(isDefault);
            expect(saved.hasKey).toBe(apiKey.trim().length > 0);
          }
        ),
        { numRuns: 20 } // Run 20 random test cases
      );
    });
  });

  describe("Property 2.7: Property-Based Tests - Default Selection", () => {
    it("should maintain exactly one default provider after any setDefault operation", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(
            fc.record({
              provider: fc.constantFrom("openai", "anthropic", "google", "openrouter", "ollama"),
              apiKey: fc.string({ minLength: 5, maxLength: 50 }),
              model: fc.string({ minLength: 3, maxLength: 30 })
            }),
            { minLength: 2, maxLength: 5 }
          ),
          fc.nat(),
          async (providers, targetIndex) => {
            // Clear database for each property test iteration
            await db.aiProviders.clear();
            await db.appSettings.clear();

            const { result } = renderHook(() => useAIProviders());

            // Save all providers
            const ids: string[] = [];
            for (const provider of providers) {
              await waitFor(async () => {
                const saved = await result.current.saveProvider({
                  ...provider,
                  isDefault: false
                });
                if (saved?.id) ids.push(saved.id);
              });
            }

            await waitFor(() => {
              expect(result.current.providers.length).toBe(providers.length);
            });

            // Set one as default
            const targetId = ids[targetIndex % ids.length];
            await waitFor(async () => {
              await result.current.setDefault(targetId);
            });

            await waitFor(() => {
              // **PRESERVATION**: Exactly one provider should be default
              const defaultProviders = result.current.providers.filter(p => p.isDefault);
              expect(defaultProviders).toHaveLength(1);
              expect(defaultProviders[0].id).toBe(targetId);
            });
          }
        ),
        { numRuns: 10 } // Run 10 random test cases
      );
    });
  });

  describe("Property 2.8: Property-Based Tests - Deletion", () => {
    it("should correctly handle deletion for any provider configuration", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(
            fc.record({
              provider: fc.constantFrom("openai", "anthropic", "google", "openrouter", "ollama"),
              apiKey: fc.string({ minLength: 5, maxLength: 50 }),
              model: fc.string({ minLength: 3, maxLength: 30 })
            }),
            { minLength: 1, maxLength: 5 }
          ),
          fc.nat(),
          async (providers, deleteIndex) => {
            // Clear database for each property test iteration
            await db.aiProviders.clear();
            await db.appSettings.clear();

            const { result } = renderHook(() => useAIProviders());

            // Save all providers
            const ids: string[] = [];
            for (let i = 0; i < providers.length; i++) {
              await waitFor(async () => {
                const saved = await result.current.saveProvider({
                  ...providers[i],
                  isDefault: i === 0 // First one is default
                });
                if (saved?.id) ids.push(saved.id);
              });
            }

            const initialCount = providers.length;
            await waitFor(() => {
              expect(result.current.providers.length).toBe(initialCount);
            });

            // Delete one provider
            const targetId = ids[deleteIndex % ids.length];
            const wasDefault = deleteIndex % ids.length === 0;

            await waitFor(async () => {
              await result.current.deleteProvider(targetId);
            });

            await waitFor(() => {
              // **PRESERVATION**: Provider count should decrease by 1
              expect(result.current.providers.length).toBe(initialCount - 1);

              // If we deleted the default and there are remaining providers,
              // one should be promoted to default
              if (wasDefault && initialCount > 1) {
                const defaultProviders = result.current.providers.filter(p => p.isDefault);
                expect(defaultProviders.length).toBe(1);
              }
            });
          }
        ),
        { numRuns: 10 } // Run 10 random test cases
      );
    });
  });
});
