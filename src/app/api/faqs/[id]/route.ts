import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET /api/faqs/[id] - Get single FAQ
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const faq = await prisma.fAQ.findUnique({
      where: { id },
    })

    if (!faq) {
      return NextResponse.json({ error: "常见问题不存在" }, { status: 404 })
    }

    return NextResponse.json(faq)
  } catch (error) {
    console.error("Error fetching FAQ:", error)
    return NextResponse.json(
      { error: "获取常见问题详情失败" },
      { status: 500 }
    )
  }
}

// PUT /api/faqs/[id] - Update FAQ (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const { id } = await params

    const existing = await prisma.fAQ.findUnique({
      where: { id },
    })
    if (!existing) {
      return NextResponse.json({ error: "常见问题不存在" }, { status: 404 })
    }

    const body = await request.json()

    const faq = await prisma.fAQ.update({
      where: { id },
      data: {
        ...(body.question !== undefined && { question: body.question }),
        ...(body.answer !== undefined && { answer: body.answer }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
        ...(body.published !== undefined && { published: body.published }),
      },
    })

    revalidatePath("/")
    revalidatePath("/faq")

    return NextResponse.json(faq)
  } catch (error) {
    console.error("Error updating FAQ:", error)
    return NextResponse.json(
      { error: "更新常见问题失败" },
      { status: 500 }
    )
  }
}

// DELETE /api/faqs/[id] - Delete FAQ (admin only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const { id } = await params

    const existing = await prisma.fAQ.findUnique({
      where: { id },
    })
    if (!existing) {
      return NextResponse.json({ error: "常见问题不存在" }, { status: 404 })
    }

    await prisma.fAQ.delete({
      where: { id },
    })

    revalidatePath("/")
    revalidatePath("/faq")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting FAQ:", error)
    return NextResponse.json(
      { error: "删除常见问题失败" },
      { status: 500 }
    )
  }
}
