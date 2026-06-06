import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET /api/tags/[id] - Get single tag
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    })

    if (!tag) {
      return NextResponse.json({ error: "标签不存在" }, { status: 404 })
    }

    return NextResponse.json(tag)
  } catch (error) {
    console.error("Error fetching tag:", error)
    return NextResponse.json(
      { error: "获取标签详情失败" },
      { status: 500 }
    )
  }
}

// PUT /api/tags/[id] - Update tag (admin only)
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

    const existing = await prisma.tag.findUnique({
      where: { id },
    })
    if (!existing) {
      return NextResponse.json({ error: "标签不存在" }, { status: 404 })
    }

    const body = await request.json()

    if (!body.name || typeof body.name !== "string" || body.name.trim() === "") {
      return NextResponse.json({ error: "标签名称不能为空" }, { status: 400 })
    }
    if (!body.slug || typeof body.slug !== "string" || body.slug.trim() === "") {
      return NextResponse.json({ error: "Slug 不能为空" }, { status: 400 })
    }

    // Check uniqueness (exclude current tag)
    const existingName = await prisma.tag.findFirst({
      where: { name: body.name, id: { not: id } },
    })
    if (existingName) {
      return NextResponse.json({ error: "标签名称已存在" }, { status: 409 })
    }
    const existingSlug = await prisma.tag.findFirst({
      where: { slug: body.slug, id: { not: id } },
    })
    if (existingSlug) {
      return NextResponse.json({ error: "Slug 已存在" }, { status: 409 })
    }

    const tag = await prisma.tag.update({
      where: { id },
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

    return NextResponse.json(tag)
  } catch (error) {
    console.error("Error updating tag:", error)
    return NextResponse.json(
      { error: "更新标签失败" },
      { status: 500 }
    )
  }
}

// DELETE /api/tags/[id] - Delete tag (admin only)
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

    const existing = await prisma.tag.findUnique({
      where: { id },
    })
    if (!existing) {
      return NextResponse.json({ error: "标签不存在" }, { status: 404 })
    }

    // Cascade delete will handle TagOnArticle entries
    await prisma.tag.delete({
      where: { id },
    })

    revalidatePath("/")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting tag:", error)
    return NextResponse.json(
      { error: "删除标签失败" },
      { status: 500 }
    )
  }
}
