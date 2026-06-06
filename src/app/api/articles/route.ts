import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET /api/articles - List articles with pagination (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10)))
    const categoryId = searchParams.get("categoryId")
    const tagId = searchParams.get("tagId")
    const published = searchParams.get("published")
    const search = searchParams.get("search")

    const where: Record<string, unknown> = {}

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (tagId) {
      where.tags = {
        some: { tagId },
      }
    }

    if (published !== null) {
      if (published === "true") {
        where.published = true
      } else if (published === "false") {
        where.published = false
      }
    } else {
      // Default: only published articles for public
      where.published = true
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ]
    }

    const skip = (page - 1) * pageSize

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          category: true,
          tags: {
            include: { tag: true },
          },
        },
        orderBy: [
          { publishedAt: "desc" },
          { createdAt: "desc" },
        ],
        skip,
        take: pageSize,
      }),
      prisma.article.count({ where }),
    ])

    return NextResponse.json({
      articles,
      total,
      page,
      pageSize,
    })
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json(
      { error: "获取文章列表失败" },
      { status: 500 }
    )
  }
}

// POST /api/articles - Create article (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.title || typeof body.title !== "string" || body.title.trim() === "") {
      return NextResponse.json({ error: "文章标题不能为空" }, { status: 400 })
    }
    if (!body.slug || typeof body.slug !== "string" || body.slug.trim() === "") {
      return NextResponse.json({ error: "Slug 不能为空" }, { status: 400 })
    }

    // Check slug uniqueness
    const existingSlug = await prisma.article.findUnique({
      where: { slug: body.slug },
    })
    if (existingSlug) {
      return NextResponse.json({ error: "Slug 已存在" }, { status: 409 })
    }

    // Handle tags: array of tag IDs
    const tagIds: string[] = Array.isArray(body.tags) ? body.tags : []

    const article = await prisma.article.create({
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt || null,
        content: body.content || null,
        coverImage: body.coverImage || null,
        author: body.author || null,
        published: body.published === true,
        publishedAt: body.published === true ? new Date() : null,
        categoryId: body.categoryId || null,
        tags: {
          create: tagIds.map((tagId: string) => ({
            tagId,
          })),
        },
      },
      include: {
        category: true,
        tags: {
          include: { tag: true },
        },
      },
    })

    revalidatePath("/")
    revalidatePath("/articles")

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json(
      { error: "创建文章失败" },
      { status: 500 }
    )
  }
}
