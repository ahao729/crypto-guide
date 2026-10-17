/**
 * Minimal signed-cookie session for the single-admin backend.
 *
 * Why not NextAuth?
 * - The site has exactly one privileged role (admin) and one credential source.
 * - NextAuth v5 is still beta, and the previous integration mixed three
 *   incompatible auth mechanisms (NextAuth session, a static `admin_token`
 *   cookie, and an unused `requireAdmin` helper).
 * - This implementation uses only Web Crypto (available in both Edge
 *   middleware and Node route handlers), so there is one verification path
 *   and no extra runtime dependency.
 *
 * Token format: base64url(JSON payload) + "." + base64url(HMAC-SHA256)
 */

export const SESSION_COOKIE = "admin_session"
export const SESSION_TTL_SECONDS = 8 * 60 * 60 // 8 hours

export interface AdminSession {
  /** User id */
  sub: string
  email: string
  name?: string | null
  role: string
  /** Issued at (unix seconds) */
  iat: number
  /** Expires at (unix seconds) */
  exp: number
}

const encoder = new TextEncoder()
const decoder = new TextDecoder()

function getSecret(): string {
  const secret = process.env.AUTH_SECRET
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET is missing or shorter than 32 characters. " +
        "Generate one with: openssl rand -base64 32"
    )
  }
  return secret
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = ""
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function fromBase64Url(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

async function importHmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  )
}

export interface SessionUser {
  id: string
  email: string
  name?: string | null
  role?: string | null
}

/** Create a signed session token. Throws if AUTH_SECRET is not configured. */
export async function createSessionToken(user: SessionUser): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const payload: AdminSession = {
    sub: user.id,
    email: user.email,
    name: user.name ?? null,
    role: user.role ?? "admin",
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  }

  const body = toBase64Url(encoder.encode(JSON.stringify(payload)))
  const signature = await crypto.subtle.sign(
    "HMAC",
    await importHmacKey(),
    encoder.encode(body)
  )

  return `${body}.${toBase64Url(new Uint8Array(signature))}`
}

/** Verify a signed session token. Returns null for missing/invalid/expired tokens. */
export async function verifySessionToken(
  token: string | undefined | null
): Promise<AdminSession | null> {
  if (!token) return null

  const parts = token.split(".")
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null

  const [body, signature] = parts

  try {
    const valid = await crypto.subtle.verify(
      "HMAC",
      await importHmacKey(),
      fromBase64Url(signature) as BufferSource,
      encoder.encode(body) as BufferSource
    )
    if (!valid) return null

    const payload = JSON.parse(decoder.decode(fromBase64Url(body))) as AdminSession
    const now = Math.floor(Date.now() / 1000)

    if (
      !payload ||
      typeof payload.sub !== "string" ||
      typeof payload.exp !== "number" ||
      payload.exp <= now
    ) {
      return null
    }

    if (payload.role !== "admin") return null

    return payload
  } catch {
    // Malformed base64/JSON, missing AUTH_SECRET, etc. — fail closed.
    return null
  }
}

/** Cookie attributes shared by login and logout. */
export function sessionCookieOptions(maxAge = SESSION_TTL_SECONDS) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  }
}
