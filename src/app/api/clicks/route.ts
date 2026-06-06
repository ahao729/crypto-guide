import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// POST /api/clicks - Record a click (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { targetId, targetType } = body

    if (!targetId || !targetType) {
      return NextResponse.json(
        { error: "缺少必要参数 targetId 或 targetType" },
        { status: 400 }
      )
    }

    if (!["exchange", "article"].includes(targetType)) {
      return NextResponse.json(
        { error: "targetType 必须是 exchange 或 article" },
        { status: 400 }
      )
    }

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
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10)))
    const targetType = searchParams.get("targetType")
    const targetId = searchParams.get("targetId")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")

    const where: Record<string, unknown> = {}

    if (targetType && ["exchange", "article"].includes(targetType)) {
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
