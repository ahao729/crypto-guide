import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET /api/categories/[id] - Get single category
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            exchanges: true,
            articles: true,
          },
        },
      },
    })

    if (!category) {
      return NextResponse.json({ error: "分类不存在" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json(
      { error: "获取分类详情失败" },
      { status: 500 }
    )
  }
}

// PUT /api/categories/[id] - Update category (admin only)
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

    const existing = await prisma.category.findUnique({
      where: { id },
    })
    if (!existing) {
      return NextResponse.json({ error: "分类不存在" }, { status: 404 })
    }

    const body = await request.json()

    // Check uniqueness if name/slug changed
    if (body.name && body.name !== existing.name) {
      const nameConflict = await prisma.category.findUnique({
        where: { name: body.name },
      })
      if (nameConflict) {
        return NextResponse.json({ error: "分类名称已存在" }, { status: 409 })
      }
    }
    if (body.slug && body.slug !== existing.slug) {
      const slugConflict = await prisma.category.findUnique({
        where: { slug: body.slug },
      })
      if (slugConflict) {
        return NextResponse.json({ error: "Slug 已存在" }, { status: 409 })
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.type !== undefined && { type: body.type }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
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

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json(
      { error: "更新分类失败" },
      { status: 500 }
    )
  }
}

// DELETE /api/categories/[id] - Delete category (admin only)
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

    const existing = await prisma.category.findUnique({
      where: { id },
    })
    if (!existing) {
      return NextResponse.json({ error: "分类不存在" }, { status: 404 })
    }

    // Check if category has associated exchanges or articles
    const count = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            exchanges: true,
            articles: true,
          },
        },
      },
    })

    if (count && (count._count.exchanges > 0 || count._count.articles > 0)) {
      return NextResponse.json(
        { error: "该分类下存在关联的交易所或文章，无法删除" },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id },
    })

    revalidatePath("/")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      { error: "删除分类失败" },
      { status: 500 }
    )
  }
}
