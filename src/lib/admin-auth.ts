import { NextResponse } from "next/server"
import { cookies } from "next/headers"

/**
 * Require admin authentication via admin_token cookie.
 * Returns null if authenticated, or a 401 NextResponse if not.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value

  if (!token || token !== "authenticated") {
    return NextResponse.json({ error: "未登录" }, { status: 401 })
  }

  return null // authenticated
}
