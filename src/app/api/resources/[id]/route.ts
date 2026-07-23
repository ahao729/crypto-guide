import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET /api/resources/[id] - Get single resource by ID or slug
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Try slug first, then fallback to id
    let resource = await prisma.resource.findUnique({
      where: { slug: id },
    })
    if (!resource) {
      resource = await prisma.resource.findUnique({
        where: { id },
      })
    }

    if (!resource) {
      return NextResponse.json({ error: "资源不存在" }, { status: 404 })
    }

    return NextResponse.json(resource)
  } catch (error) {
    console.error("Error fetching resource:", error)
    return NextResponse.json(
      { error: "获取资源详情失败" },
      { status: 500 }
    )
  }
}

// PUT /api/resources/[id] - Update resource (admin only)
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

    const existing = await prisma.resource.findUnique({
      where: { id },
    })
    if (!existing) {
      return NextResponse.json({ error: "资源不存在" }, { status: 404 })
    }

    const body = await request.json()

    const resource = await prisma.resource.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.type !== undefined && { type: body.type }),
        ...(body.fileUrl !== undefined && { fileUrl: body.fileUrl }),
        ...(body.fileSize !== undefined && { fileSize: body.fileSize }),
        ...(body.externalUrl !== undefined && { externalUrl: body.externalUrl }),
        ...(body.icon !== undefined && { icon: body.icon }),
        ...(body.tags !== undefined && { tags: body.tags }),
        ...(body.downloadCount !== undefined && { downloadCount: body.downloadCount }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.published !== undefined && { published: body.published }),
      },
    })

    revalidatePath("/")
    revalidatePath("/resources")

    return NextResponse.json(resource)
  } catch (error) {
    console.error("Error updating resource:", error)
    return NextResponse.json(
      { error: "更新资源失败" },
      { status: 500 }
    )
  }
}

// DELETE /api/resources/[id] - Delete resource (admin only)
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

    const existing = await prisma.resource.findUnique({
      where: { id },
    })
    if (!existing) {
      return NextResponse.json({ error: "资源不存在" }, { status: 404 })
    }

    await prisma.resource.delete({
      where: { id },
    })

    revalidatePath("/")
    revalidatePath("/resources")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting resource:", error)
    return NextResponse.json(
      { error: "删除资源失败" },
      { status: 500 }
    )
  }
}
