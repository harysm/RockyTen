/**
 * Cryptographic utility for password hashing and verification.
 * Uses native Web Crypto API (PBKDF2 with SHA-256) for strong security without external dependencies.
 */

const SALT_BYTES = 16;
const ITERATIONS = 50000;
const KEY_LEN_BITS = 256;

function bufToHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

function hexToBuf(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export async function hashPassword(password: string): Promise<string> {
  const cryptoObj = globalThis.crypto;
  if (!cryptoObj || !cryptoObj.subtle) {
    // Fallback: simple base64 encoded with prefix if crypto.subtle is unavailable
    return `plain$${btoa(encodeURIComponent(password))}`;
  }

  // Generate 16 bytes random salt
  const salt = new Uint8Array(SALT_BYTES);
  cryptoObj.getRandomValues(salt);

  const encoder = new TextEncoder();
  const passwordKey = await cryptoObj.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await cryptoObj.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as any,
      iterations: ITERATIONS,
      hash: "SHA-256"
    },
    passwordKey,
    KEY_LEN_BITS
  );

  const saltHex = bufToHex(salt);
  const hashHex = bufToHex(derivedBits);

  return `pbkdf2$${ITERATIONS}$${saltHex}$${hashHex}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  if (!stored) return false;

  // 1. Check if stored in PBKDF2 format: pbkdf2$<iterations>$<salt>$<hash>
  if (stored.startsWith("pbkdf2$")) {
    const parts = stored.split("$");
    if (parts.length === 4) {
      const iterations = parseInt(parts[1], 10);
      const saltHex = parts[2];
      const expectedHashHex = parts[3];

      const cryptoObj = globalThis.crypto;
      if (!cryptoObj || !cryptoObj.subtle) {
        return false;
      }

      const salt = hexToBuf(saltHex);
      const encoder = new TextEncoder();
      const passwordKey = await cryptoObj.subtle.importKey(
        "raw",
        encoder.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits"]
      );

      const derivedBits = await cryptoObj.subtle.deriveBits(
        {
          name: "PBKDF2",
          salt: salt as any,
          iterations: iterations,
          hash: "SHA-256"
        },
        passwordKey,
        KEY_LEN_BITS
      );

      const computedHashHex = bufToHex(derivedBits);
      return computedHashHex === expectedHashHex;
    }
  }

  // 2. Check if stored in fallback base64 format: plain$<encoded>
  if (stored.startsWith("plain$")) {
    try {
      const decoded = decodeURIComponent(atob(stored.slice(6)));
      return decoded === password;
    } catch {
      return false;
    }
  }

  // 3. Fallback for legacy plain text passwords (e.g. initial demo accounts '123456', 'owner123')
  return stored === password;
}

export function isPasswordEncrypted(stored: string): boolean {
  return typeof stored === "string" && (stored.startsWith("pbkdf2$") || stored.startsWith("plain$"));
}
