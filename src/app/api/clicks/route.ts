import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

// ── Validation schemas ──────────────────────────────────────────

const clicksQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  targetType: z.enum(["exchange", "article"]).optional(),
  targetId: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
})

const createClickSchema = z.object({
  targetId: z.string().min(1, "targetId 不能为空"),
  targetType: z.enum(["exchange", "article"], {
    error: "targetType 必须是 exchange 或 article",
  }),
})

// ── Handlers ────────────────────────────────────────────────────

// POST /api/clicks - Record a click (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createClickSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "参数校验失败",
          details: parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 },
      )
    }

    const { targetId, targetType } = parsed.data

    // Get IP, user agent, referer from headers
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      request.headers.get("cf-connecting-ip") ||
      null
    const userAgent = request.headers.get("user-agent") || null
    const referer = request.headers.get("referer") || null

    // Use a transaction to record click and increment counter atomically
    await prisma.$transaction(async (tx) => {
      // Create click log
      await tx.clickLog.create({
        data: {
          targetId,
          targetType,
          ip: ip ? ip.split(",")[0].trim() : null,
          userAgent,
          referer,
        },
      })

      // Increment click count on the target
      if (targetType === "exchange") {
        await tx.exchange.update({
          where: { id: targetId },
          data: { clickCount: { increment: 1 } },
        })
      } else if (targetType === "article") {
        await tx.article.update({
          where: { id: targetId },
          data: { clickCount: { increment: 1 } },
        })
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error recording click:", error)
    return NextResponse.json(
      { error: "记录点击失败" },
      { status: 500 }
    )
  }
}

// GET /api/clicks - Get click logs (admin only, paginated)
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const parsed = clicksQuerySchema.safeParse(
      Object.fromEntries(searchParams.entries()),
    )
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "参数校验失败",
          details: parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 },
      )
    }
    const { page, pageSize, targetType, targetId, dateFrom, dateTo } = parsed.data

    const where: Record<string, unknown> = {}

    if (targetType) {
      where.targetType = targetType
    }
    if (targetId) {
      where.targetId = targetId
    }
    if (dateFrom || dateTo) {
      const createdAt: Record<string, Date> = {}
      if (dateFrom) {
        createdAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        createdAt.lte = new Date(dateTo)
      }
      where.createdAt = createdAt
    }

    const skip = (page - 1) * pageSize

    const [logs, total] = await Promise.all([
      prisma.clickLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.clickLog.count({ where }),
    ])

    return NextResponse.json({
      logs,
      total,
      page,
      pageSize,
    })
  } catch (error) {
    console.error("Error fetching click logs:", error)
    return NextResponse.json(
      { error: "获取点击记录失败" },
      { status: 500 }
    )
  }
}
