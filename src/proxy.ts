import { NextRequest, NextResponse } from "next/server"
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session"

/**
 * Gate the admin UI (Next.js 16 "proxy" convention, formerly middleware).
 * This is an optimistic redirect only: every API route verifies the same
 * cookie independently, so bypassing this layer cannot grant write access.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // The login page must stay reachable while logged out.
  if (pathname === "/admin/login") {
    return NextResponse.next()
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value
  const session = await verifySessionToken(token)

  if (session) {
    return NextResponse.next()
  }

  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = "/admin/login"
  loginUrl.search = ""
  loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`)

  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/admin/:path*"],
}
