import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

// ── Validation schemas ──────────────────────────────────────────

const exchangesQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().trim().min(1).optional(),
  status: z.enum(["active", "inactive"]).optional(),
})

const createExchangeSchema = z.object({
  name: z.string().trim().min(1, "交易所名称不能为空").max(100, "交易所名称不能超过 100 个字符"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug 不能为空")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug 只能包含小写字母、数字和连字符"),
  logo: z.string().max(500).nullish(),
  description: z.string().max(1000).nullish(),
  content: z.string().nullish(),
  rating: z.number().min(0, "评分不能小于 0").max(5, "评分不能大于 5").default(0),
  referralUrl: z.string().url("推广链接格式无效").nullish(),
  inviteCode: z.string().max(50).nullish(),
  feeRate: z.string().max(100).nullish(),
  spotFee: z.string().max(100).nullish(),
  futuresFee: z.string().max(100).nullish(),
  features: z.string().max(2000).nullish(),
  supportedCoins: z.string().max(500).nullish(),
  regulation: z.string().max(500).nullish(),
  status: z.enum(["active", "inactive"]).default("active"),
  sortOrder: z.number().int().min(0).default(0),
  isFeatured: z.boolean().default(false),
  isPopular: z.boolean().default(false),
  categoryId: z.string().nullish(),
})

// ── Handlers ────────────────────────────────────────────────────

// GET /api/exchanges - List exchanges with optional category (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parsed = exchangesQuerySchema.safeParse(
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
    const { category, search, status } = parsed.data

    const where: Record<string, unknown> = {}

    // Filter by status if provided, default to active only
    if (status) {
      where.status = status
    } else {
      where.status = "active"
    }

    if (category) {
      where.category = { slug: category }
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const exchanges = await prisma.exchange.findMany({
      where,
      orderBy: [
        { isFeatured: "desc" },
        { isPopular: "desc" },
        { sortOrder: "asc" },
        { clickCount: "desc" },
      ],
      include: {
        category: true,
      },
    })

    return NextResponse.json(exchanges)
  } catch (error) {
    console.error("Error fetching exchanges:", error)
    return NextResponse.json(
      { error: "获取交易所列表失败" },
      { status: 500 }
    )
  }
}

// POST /api/exchanges - Create exchange (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = createExchangeSchema.safeParse(body)
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

    const data = parsed.data

    // Check slug uniqueness
    const existingSlug = await prisma.exchange.findUnique({
      where: { slug: data.slug },
    })
    if (existingSlug) {
      return NextResponse.json({ error: "Slug 已存在" }, { status: 409 })
    }

    const exchange = await prisma.exchange.create({
      data: {
        name: data.name,
        slug: data.slug,
        logo: data.logo ?? null,
        description: data.description ?? null,
        content: data.content ?? null,
        rating: data.rating,
        referralUrl: data.referralUrl ?? null,
        inviteCode: data.inviteCode ?? null,
        feeRate: data.feeRate ?? null,
        spotFee: data.spotFee ?? null,
        futuresFee: data.futuresFee ?? null,
        features: data.features ?? null,
        supportedCoins: data.supportedCoins ?? null,
        regulation: data.regulation ?? null,
        status: data.status,
        sortOrder: data.sortOrder,
        isFeatured: data.isFeatured,
        isPopular: data.isPopular,
        categoryId: data.categoryId ?? null,
      },
      include: {
        category: true,
      },
    })

    revalidatePath("/")
    revalidatePath("/exchanges")

    return NextResponse.json(exchange, { status: 201 })
  } catch (error) {
    console.error("Error creating exchange:", error)
    return NextResponse.json(
      { error: "创建交易所失败" },
      { status: 500 }
    )
  }
}


