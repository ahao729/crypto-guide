import { NextRequest, NextResponse } from "next/server"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/session"

export const runtime = "nodejs"

/**
 * Simple in-memory rate limit.
 *
 * Note: on Vercel this is per function instance, so it is a speed bump rather
 * than a global lock. It still blocks naive brute-force loops that reuse a
 * warm instance. A durable limiter (Upstash/Redis or Vercel Firewall) can
 * replace this later without changing the route contract.
 */
const WINDOW_MS = 5 * 60 * 1000
const MAX_ATTEMPTS = 5
const attempts = new Map<string, { count: number; resetAt: number }>()

// Always run one bcrypt comparison, even for unknown emails, so response
// timing does not reveal whether an account exists.
const DUMMY_PASSWORD_HASH =
  "$2b$12$efOyKVYUTwr9Nd6iwyTr2Or/LTAWYzaqpAUVXJaYvUK1FI./fSjPW"

// The old seed shipped this value in a public repository. Refuse it even if
// the production database has not been rotated yet, so the known credential
// cannot be used after this deploy.
const BLOCKED_PASSWORDS = new Set(["admin123"])

function getClientIp(request: NextRequest): string {
  // Vercel sets x-real-ip to the client address. Fall back to the last hop in
  // x-forwarded-for (the closest proxy), so a spoofed leading value cannot
  // bypass the limiter.
  const realIp = request.headers.get("x-real-ip")
  if (realIp) return realIp.trim()

  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    const hops = forwarded.split(",")
    return hops[hops.length - 1]?.trim() || "unknown"
  }

  return "unknown"
}

function pruneExpired(now: number) {
  for (const [key, value] of attempts) {
    if (value.resetAt <= now) attempts.delete(key)
  }
}

function isRateLimited(key: string): boolean {
  const now = Date.now()
  pruneExpired(now)
  const entry = attempts.get(key)
  return Boolean(entry && entry.count >= MAX_ATTEMPTS && entry.resetAt > now)
}

function recordFailure(key: string) {
  const now = Date.now()

  // Bound memory if an attacker sprays unique IPs at a warm instance.
  if (attempts.size > 10_000) attempts.clear()

  const entry = attempts.get(key)
  if (!entry || entry.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return
  }
  entry.count += 1
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "尝试次数过多，请 5 分钟后再试" },
      { status: 429 }
    )
  }

  try {
    const body = (await request.json().catch(() => null)) as
      | { email?: unknown; password?: unknown }
      | null

    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""
    const password = typeof body?.password === "string" ? body.password : ""

    if (!email || !password) {
      return NextResponse.json(
        { error: "请输入邮箱和密码" },
        { status: 400 }
      )
    }

    if (BLOCKED_PASSWORDS.has(password)) {
      recordFailure(ip)
      return NextResponse.json(
        {
          error:
            "默认口令已禁用，请先在服务器上执行 npm run rotate-admin 更换管理员口令",
        },
        { status: 403 }
      )
    }

    const user = await prisma.user.findUnique({ where: { email } })
    const passwordMatches = await compare(
      password,
      user?.password ?? DUMMY_PASSWORD_HASH
    )

    if (!user || !passwordMatches) {
      recordFailure(ip)
      // Same message for unknown account and wrong password.
      return NextResponse.json(
        { error: "邮箱或密码错误" },
        { status: 401 }
      )
    }

    if (user.role !== "admin") {
      recordFailure(ip)
      return NextResponse.json(
        { error: "该账号没有后台权限" },
        { status: 403 }
      )
    }

    attempts.delete(ip)

    const token = await createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })

    const response = NextResponse.json({ success: true })
    response.headers.set("Cache-Control", "no-store")
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions())
    // Drop the old insecure static cookie if a browser still has it.
    response.cookies.set("admin_token", "", { path: "/", maxAge: 0 })
    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "登录服务暂时不可用，请检查服务端 AUTH_SECRET 配置" },
      { status: 500 }
    )
  }
}
