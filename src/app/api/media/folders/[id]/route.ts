import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// PATCH /api/media/folders/[id] - Rename a folder
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "请输入分类名称" }, { status: 400 })
    }

    const existing = await prisma.mediaFolder.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "分类不存在" }, { status: 404 })
    }

    const slug = name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\u4e00-\u9fa5-]/g, "")

    // Check for duplicate slug (excluding self)
    const duplicate = await prisma.mediaFolder.findFirst({
      where: { slug, id: { not: id } },
    })
    if (duplicate) {
      return NextResponse.json({ error: "该分类名称已存在" }, { status: 409 })
    }

    const updated = await prisma.mediaFolder.update({
      where: { id },
      data: { name: name.trim(), slug },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating folder:", error)
    return NextResponse.json({ error: "重命名分类失败" }, { status: 500 })
  }
}

// DELETE /api/media/folders/[id] - Delete a folder (media items become uncategorized)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const { id } = await params

    const folder = await prisma.mediaFolder.findUnique({ where: { id } })
    if (!folder) {
      return NextResponse.json({ error: "分类不存在" }, { status: 404 })
    }

    // Set all media in this folder to folderId = null
    await prisma.media.updateMany({
      where: { folderId: id },
      data: { folderId: null },
    })

    // Delete the folder
    await prisma.mediaFolder.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting folder:", error)
    return NextResponse.json(
      { error: "删除分类失败" },
      { status: 500 }
    )
  }
}
