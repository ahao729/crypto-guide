import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

// ── Validation schemas ──────────────────────────────────────────

const articlesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  categoryId: z.string().optional(),
  tagId: z.string().optional(),
  published: z.enum(["true", "false"]).optional(),
  search: z.string().trim().min(1).optional(),
})

const createArticleSchema = z.object({
  title: z.string().trim().min(1, "文章标题不能为空").max(200, "文章标题不能超过 200 个字符"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug 不能为空")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug 只能包含小写字母、数字和连字符"),
  excerpt: z.string().max(500, "摘要不能超过 500 个字符").nullish(),
  content: z.string().nullish(),
  coverImage: z.string().url("封面图片格式无效").nullish(),
  author: z.string().max(100).nullish(),
  published: z.boolean().default(false),
  categoryId: z.string().nullish(),
  tags: z.array(z.string()).default([]),
})

// ── Handlers ────────────────────────────────────────────────────

// GET /api/articles - List articles with pagination (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parsed = articlesQuerySchema.safeParse(
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
    const { page, pageSize, categoryId, tagId, published, search } = parsed.data

    const where: Record<string, unknown> = {}

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (tagId) {
      where.tags = {
        some: { tagId },
      }
    }

    if (published) {
      where.published = published === "true"
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
    const parsed = createArticleSchema.safeParse(body)
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
    const existingSlug = await prisma.article.findUnique({
      where: { slug: data.slug },
    })
    if (existingSlug) {
      return NextResponse.json({ error: "Slug 已存在" }, { status: 409 })
    }

    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt ?? null,
        content: data.content ?? null,
        coverImage: data.coverImage ?? null,
        author: data.author ?? null,
        published: data.published,
        publishedAt: data.published ? new Date() : null,
        categoryId: data.categoryId ?? null,
        tags: {
          create: data.tags.map((tagId) => ({ tagId })),
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
