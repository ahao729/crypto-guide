import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

// ── Validation schemas ──────────────────────────────────────────

const resourcesQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().trim().min(1).optional(),
  published: z.enum(["true", "false", "all"]).optional(),
})

const createResourceSchema = z.object({
  title: z.string().trim().min(1, "资源标题不能为空").max(200, "资源标题不能超过 200 个字符"),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug 只能包含小写字母、数字和连字符")
    .optional(),
  description: z.string().max(1000).nullish(),
  content: z.string().nullish(),
  category: z.string().max(50).default("newbie"),
  type: z.string().max(50).default("file"),
  fileUrl: z.string().max(500).nullish(),
  fileSize: z.string().max(50).nullish(),
  externalUrl: z.string().max(500).nullish(),
  icon: z.string().max(50).nullish(),
  tags: z.string().max(500).nullish(),
  sortOrder: z.number().int().min(0).default(0),
  published: z.boolean().default(true),
})

// ── Helpers ─────────────────────────────────────────────────────

/** Convert Chinese + English title to URL-friendly slug */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, "-")   // non-word → dash
    .replace(/^-+|-+$/g, "")                  // trim dashes
    .slice(0, 120)                             // limit length
}

/** Ensure slug is unique by appending -N if needed */
async function ensureUniqueSlug(base: string): Promise<string> {
  let slug = base
  let counter = 1
  while (true) {
    const exists = await prisma.resource.findUnique({ where: { slug } })
    if (!exists) return slug
    slug = `${base}-${counter}`
    counter++
  }
}

// ── Handlers ────────────────────────────────────────────────────

// GET /api/resources - List all resources (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parsed = resourcesQuerySchema.safeParse(
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
    const { category, search, published } = parsed.data

    const where: Record<string, unknown> = {}

    if (category) {
      where.category = category
    }

    if (published === "all") {
      // Show all (no filter)
    } else if (published === "true") {
      where.published = true
    } else if (published === "false") {
      where.published = false
    } else {
      // Default: only show published for public
      where.published = true
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const resources = await prisma.resource.findMany({
      where,
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
    })

    return NextResponse.json(resources)
  } catch (error) {
    console.error("Error fetching resources:", error)
    return NextResponse.json(
      { error: "获取资源列表失败" },
      { status: 500 }
    )
  }
}

// POST /api/resources - Create resource (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = createResourceSchema.safeParse(body)
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

    // Auto-generate slug if not provided
    const slug = data.slug ?? await ensureUniqueSlug(generateSlug(data.title))

    const resource = await prisma.resource.create({
      data: {
        title: data.title,
        slug,
        description: data.description ?? null,
        content: data.content ?? null,
        category: data.category,
        type: data.type,
        fileUrl: data.fileUrl ?? null,
        fileSize: data.fileSize ?? null,
        externalUrl: data.externalUrl ?? null,
        icon: data.icon ?? null,
        tags: data.tags ?? null,
        sortOrder: data.sortOrder,
        published: data.published,
      },
    })

    revalidatePath("/")
    revalidatePath("/resources")

    return NextResponse.json(resource, { status: 201 })
  } catch (error) {
    console.error("Error creating resource:", error)
    return NextResponse.json(
      { error: "创建资源失败" },
      { status: 500 }
    )
  }
}
