import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET /api/tags - List all tags
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")

    const where: Record<string, unknown> = {}
    if (search) {
      where.name = { contains: search }
    }

    const tags = await prisma.tag.findMany({
      where,
      include: {
        _count: {
          select: { articles: true },
        },
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(tags)
  } catch (error) {
    console.error("Error fetching tags:", error)
    return NextResponse.json(
      { error: "获取标签列表失败" },
      { status: 500 }
    )
  }
}

// POST /api/tags - Create tag (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const body = await request.json()

    if (!body.name || typeof body.name !== "string" || body.name.trim() === "") {
      return NextResponse.json({ error: "标签名称不能为空" }, { status: 400 })
    }
    if (!body.slug || typeof body.slug !== "string" || body.slug.trim() === "") {
      return NextResponse.json({ error: "Slug 不能为空" }, { status: 400 })
    }

    // Check uniqueness
    const existingName = await prisma.tag.findUnique({
      where: { name: body.name },
    })
    if (existingName) {
      return NextResponse.json({ error: "标签名称已存在" }, { status: 409 })
    }
    const existingSlug = await prisma.tag.findUnique({
      where: { slug: body.slug },
    })
    if (existingSlug) {
      return NextResponse.json({ error: "Slug 已存在" }, { status: 409 })
    }

    const tag = await prisma.tag.create({
      data: {
        name: body.name,
        slug: body.slug,
      },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    })

    revalidatePath("/")

    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    console.error("Error creating tag:", error)
    return NextResponse.json(
      { error: "创建标签失败" },
      { status: 500 }
    )
  }
}
