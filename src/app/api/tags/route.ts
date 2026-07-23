import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

// ── Validation schemas ──────────────────────────────────────────

const tagsQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
})

const createTagSchema = z.object({
  name: z.string().trim().min(1, "标签名称不能为空").max(50, "标签名称不能超过 50 个字符"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug 不能为空")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug 只能包含小写字母、数字和连字符"),
})

// ── Handlers ────────────────────────────────────────────────────

// GET /api/tags - List all tags
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parsed = tagsQuerySchema.safeParse(
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
    const { search } = parsed.data

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
    const parsed = createTagSchema.safeParse(body)
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
    const existingName = await prisma.tag.findUnique({
      where: { name: data.name },
    })
    if (existingName) {
      return NextResponse.json({ error: "标签名称已存在" }, { status: 409 })
    }
    const existingSlug = await prisma.tag.findUnique({
      where: { slug: data.slug },
    })
    if (existingSlug) {
      return NextResponse.json({ error: "Slug 已存在" }, { status: 409 })
    }

    const tag = await prisma.tag.create({
      data: {
        name: data.name,
        slug: data.slug,
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
