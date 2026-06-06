import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET /api/categories - List all categories (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // "exchange" or "article"

    const where: Record<string, unknown> = {}
    if (type && (type === "exchange" || type === "article")) {
      where.type = type
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        _count: {
          select: {
            exchanges: true,
            articles: true,
          },
        },
      },
      orderBy: { sortOrder: "asc" },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "获取分类列表失败" },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create category (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const body = await request.json()

    if (!body.name || typeof body.name !== "string" || body.name.trim() === "") {
      return NextResponse.json({ error: "分类名称不能为空" }, { status: 400 })
    }
    if (!body.slug || typeof body.slug !== "string" || body.slug.trim() === "") {
      return NextResponse.json({ error: "Slug 不能为空" }, { status: 400 })
    }

    // Check uniqueness
    const existingName = await prisma.category.findUnique({
      where: { name: body.name },
    })
    if (existingName) {
      return NextResponse.json({ error: "分类名称已存在" }, { status: 409 })
    }
    const existingSlug = await prisma.category.findUnique({
      where: { slug: body.slug },
    })
    if (existingSlug) {
      return NextResponse.json({ error: "Slug 已存在" }, { status: 409 })
    }

    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        type: body.type || "exchange",
        sortOrder: typeof body.sortOrder === "number" ? body.sortOrder : 0,
      },
      include: {
        _count: {
          select: {
            exchanges: true,
            articles: true,
          },
        },
      },
    })

    revalidatePath("/")

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: "创建分类失败" },
      { status: 500 }
    )
  }
}
