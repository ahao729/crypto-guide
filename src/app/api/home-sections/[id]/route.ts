import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// PUT /api/home-sections/[id] - Update section (admin only)
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

    const existing = await prisma.homeSection.findUnique({
      where: { id },
    })
    if (!existing) {
      return NextResponse.json({ error: "板块不存在" }, { status: 404 })
    }

    const body = await request.json()

    const section = await prisma.homeSection.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.subtitle !== undefined && { subtitle: body.subtitle }),
        ...(body.type !== undefined && { type: body.type }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
        ...(body.published !== undefined && { published: body.published }),
      },
    })

    revalidatePath("/")

    return NextResponse.json(section)
  } catch (error) {
    console.error("Error updating home section:", error)
    return NextResponse.json(
      { error: "更新首页板块失败" },
      { status: 500 }
    )
  }
}

// DELETE /api/home-sections/[id] - Delete section (admin only)
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

    const existing = await prisma.homeSection.findUnique({
      where: { id },
    })
    if (!existing) {
      return NextResponse.json({ error: "板块不存在" }, { status: 404 })
    }

    await prisma.homeSection.delete({
      where: { id },
    })

    revalidatePath("/")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting home section:", error)
    return NextResponse.json(
      { error: "删除首页板块失败" },
      { status: 500 }
    )
  }
}
