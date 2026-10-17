import { NextResponse } from "next/server"
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/session"

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.headers.set("Cache-Control", "no-store")
  response.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0))
  response.cookies.set("admin_token", "", { path: "/", maxAge: 0 })
  return response
}
