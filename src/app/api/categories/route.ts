import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

// ── Validation schemas ──────────────────────────────────────────

const categoriesQuerySchema = z.object({
  type: z.enum(["exchange", "article"]).optional(),
})

const createCategorySchema = z.object({
  name: z.string().trim().min(1, "分类名称不能为空").max(50, "分类名称不能超过 50 个字符"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug 不能为空")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug 只能包含小写字母、数字和连字符"),
  description: z.string().max(200).nullish(),
  type: z.enum(["exchange", "article"]).default("exchange"),
  sortOrder: z.number().int().min(0).default(0),
})

// ── Handlers ────────────────────────────────────────────────────

// GET /api/categories - List all categories (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parsed = categoriesQuerySchema.safeParse(
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
    const { type } = parsed.data

    const where: Record<string, unknown> = {}
    if (type) {
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
    const parsed = createCategorySchema.safeParse(body)
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

    // Check uniqueness
    const existingName = await prisma.category.findUnique({
      where: { name: data.name },
    })
    if (existingName) {
      return NextResponse.json({ error: "分类名称已存在" }, { status: 409 })
    }
    const existingSlug = await prisma.category.findUnique({
      where: { slug: data.slug },
    })
    if (existingSlug) {
      return NextResponse.json({ error: "Slug 已存在" }, { status: 409 })
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description ?? null,
        type: data.type,
        sortOrder: data.sortOrder,
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
