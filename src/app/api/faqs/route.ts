import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

// ── Validation schemas ──────────────────────────────────────────

const faqsQuerySchema = z.object({
  published: z.enum(["true", "false", "all"]).optional(),
})

const createFaqSchema = z.object({
  question: z.string().trim().min(1, "问题不能为空").max(500, "问题不能超过 500 个字符"),
  answer: z.string().trim().min(1, "答案不能为空").max(5000, "答案不能超过 5000 个字符"),
  category: z.string().max(50).default("通用"),
  sortOrder: z.number().int().min(0).default(0),
  published: z.boolean().default(true),
})

// ── Handlers ────────────────────────────────────────────────────

// GET /api/faqs - List FAQs (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parsed = faqsQuerySchema.safeParse(
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
    const { published } = parsed.data

    const where: Record<string, unknown> = {}
    if (published === "true") {
      where.published = true
    } else if (published === "false") {
      where.published = false
    } else if (published === "all") {
      // Show all, no filter
    } else {
      // Default: only show published FAQs for public
      where.published = true
    }

    const faqs = await prisma.fAQ.findMany({
      where,
      orderBy: { sortOrder: "asc" },
    })

    return NextResponse.json(faqs)
  } catch (error) {
    console.error("Error fetching FAQs:", error)
    return NextResponse.json(
      { error: "获取常见问题列表失败" },
      { status: 500 }
    )
  }
}

// POST /api/faqs - Create FAQ (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = createFaqSchema.safeParse(body)
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

    const faq = await prisma.fAQ.create({
      data: {
        question: data.question,
        answer: data.answer,
        category: data.category,
        sortOrder: data.sortOrder,
        published: data.published,
      },
    })

    revalidatePath("/")
    revalidatePath("/faq")

    return NextResponse.json(faq, { status: 201 })
  } catch (error) {
    console.error("Error creating FAQ:", error)
    return NextResponse.json(
      { error: "创建常见问题失败" },
      { status: 500 }
    )
  }
}
