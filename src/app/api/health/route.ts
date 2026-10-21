import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

/**
 * Liveness/readiness probe used by the uptime workflow and external monitors.
 * Public on purpose: it exposes no configuration or user data.
 */
export async function GET() {
  const startedAt = Date.now()

  try {
    await prisma.$queryRaw`SELECT 1`

    return NextResponse.json(
      {
        status: "ok",
        db: "ok",
        latencyMs: Date.now() - startedAt,
        commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
        timestamp: new Date().toISOString(),
      },
      { headers: { "Cache-Control": "no-store" } }
    )
  } catch {
    return NextResponse.json(
      {
        status: "error",
        db: "error",
        latencyMs: Date.now() - startedAt,
        commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
        timestamp: new Date().toISOString(),
      },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    )
  }
}
