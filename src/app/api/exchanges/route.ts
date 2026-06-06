import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET /api/exchanges - List all exchanges (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const status = searchParams.get("status")

    const where: Record<string, unknown> = {}

    if (category) {
      where.category = { slug: category }
    }

    if (status && status !== "all") {
      where.status = status
    } else if (!status) {
      // Default: only show active exchanges for public
      where.status = "active"
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const exchanges = await prisma.exchange.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: [
        { sortOrder: "asc" },
        { rating: "desc" },
      ],
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

    // Manual validation for required fields
    if (!body.name || typeof body.name !== "string" || body.name.trim() === "") {
      return NextResponse.json({ error: "交易所名称不能为空" }, { status: 400 })
    }
    if (!body.slug || typeof body.slug !== "string" || body.slug.trim() === "") {
      return NextResponse.json({ error: "Slug 不能为空" }, { status: 400 })
    }

    // Check slug uniqueness
    const existingSlug = await prisma.exchange.findUnique({
      where: { slug: body.slug },
    })
    if (existingSlug) {
      return NextResponse.json({ error: "Slug 已存在" }, { status: 409 })
    }

    const exchange = await prisma.exchange.create({
      data: {
        name: body.name,
        slug: body.slug,
        logo: body.logo || null,
        description: body.description || null,
        content: body.content || null,
        rating: typeof body.rating === "number" ? body.rating : 0,
        referralUrl: body.referralUrl || null,
        inviteCode: body.inviteCode || null,
        feeRate: body.feeRate || null,
        spotFee: body.spotFee || null,
        futuresFee: body.futuresFee || null,
        features: body.features || null,
        supportedCoins: body.supportedCoins || null,
        regulation: body.regulation || null,
        status: body.status || "active",
        sortOrder: typeof body.sortOrder === "number" ? body.sortOrder : 0,
        isFeatured: !!body.isFeatured,
        isPopular: !!body.isPopular,
        categoryId: body.categoryId || null,
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
