import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET /api/faqs - List FAQs (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get("published")

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

    if (!body.question || typeof body.question !== "string" || body.question.trim() === "") {
      return NextResponse.json({ error: "问题不能为空" }, { status: 400 })
    }
    if (!body.answer || typeof body.answer !== "string" || body.answer.trim() === "") {
      return NextResponse.json({ error: "答案不能为空" }, { status: 400 })
    }

    const faq = await prisma.fAQ.create({
      data: {
        question: body.question,
        answer: body.answer,
        category: body.category || "通用",
        sortOrder: typeof body.sortOrder === "number" ? body.sortOrder : 0,
        published: body.published !== undefined ? body.published : true,
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
