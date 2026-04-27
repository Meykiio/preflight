/**
 * Security utilities for Preflight.
 * Handles encryption/decryption of sensitive data like API keys.
 */

const STORAGE_KEY_NAME = "preflight_storage_encryption_key";

/**
 * Generates a random storage key and saves it to localStorage if it doesn't exist.
 */
export const initializeStorageKey = async (): Promise<void> => {
  if (localStorage.getItem(STORAGE_KEY_NAME)) return;

  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  const keyBase64 = btoa(String.fromCharCode(...array));
  localStorage.setItem(STORAGE_KEY_NAME, keyBase64);
};

/**
 * Gets the storage key from localStorage.
 */
const getStorageKey = async (): Promise<CryptoKey> => {
  let keyBase64 = localStorage.getItem(STORAGE_KEY_NAME);
  if (!keyBase64) {
    await initializeStorageKey();
    keyBase64 = localStorage.getItem(STORAGE_KEY_NAME)!;
  }

  const keyBuffer = Uint8Array.from(atob(keyBase64), c => c.charCodeAt(0));
  
  return window.crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
};

/**
 * Encrypts a string using the storage key.
 */
export const encryptString = async (text: string): Promise<string> => {
  if (!text) return "";
  
  try {
    const key = await getStorageKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(text);
    
    const encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encoded
    );
    
    const encryptedArray = new Uint8Array(encrypted);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);
    
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error("Encryption failed:", error);
    return text; // Fallback to plaintext on error (should not happen normally)
  }
};

/**
 * Decrypts a string using the storage key.
 */
export const decryptString = async (encryptedBase64: string): Promise<string> => {
  if (!encryptedBase64) return "";
  
  // If it doesn't look like base64 or is very short, it might be plaintext
  if (encryptedBase64.length < 16) return encryptedBase64;

  try {
    const key = await getStorageKey();
    const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
    
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);
    
    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encrypted
    );
    
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    // If decryption fails, it might be legacy plaintext
    return encryptedBase64;
  }
};
