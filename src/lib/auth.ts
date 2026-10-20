import { cookies } from "next/headers"
import {
  SESSION_COOKIE,
  verifySessionToken,
  type AdminSession,
} from "./session"

export interface AuthSession {
  user: AdminSession
}

/**
 * Read and verify the admin session from the request cookies.
 *
 * Returns `null` for anonymous, expired, tampered, or unconfigured requests
 * (fail closed). API routes should keep the existing pattern:
 *
 *   const session = await auth()
 *   if (!session) return NextResponse.json({ error: "未登录" }, { status: 401 })
 */
export async function auth(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value
    const session = await verifySessionToken(token)
    return session ? { user: session } : null
  } catch {
    // cookies() can throw outside a request scope (e.g. during build).
    return null
  }
}
