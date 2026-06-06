import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { unlink } from "fs/promises"
import path from "path"

// PATCH /api/media/[id] - Update media metadata (filename, alt, sortOrder)
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

    const existing = await prisma.media.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "素材不存在" }, { status: 404 })
    }

    const data: Record<string, string | number | null> = {}

    if (body.filename !== undefined) {
      if (!body.filename || !body.filename.trim()) {
        return NextResponse.json({ error: "文件名不能为空" }, { status: 400 })
      }
      data.filename = body.filename.trim()
    }

    if (body.alt !== undefined) {
      data.alt = body.alt?.trim() ?? null
    }

    if (body.sortOrder !== undefined) {
      data.sortOrder = Number(body.sortOrder) || 0
    }

    const updated = await prisma.media.update({
      where: { id },
      data,
      include: { folder: true },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating media:", error)
    return NextResponse.json({ error: "更新素材失败" }, { status: 500 })
  }
}

// DELETE /api/media/[id] - Delete a single media file
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

    const media = await prisma.media.findUnique({ where: { id } })
    if (!media) {
      return NextResponse.json({ error: "素材不存在" }, { status: 404 })
    }

    // Delete file from disk
    const filePath = path.join(process.cwd(), "public", media.url)
    try {
      await unlink(filePath)
    } catch {
      // File may already be deleted, continue
    }

    // Delete record from database
    await prisma.media.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting media:", error)
    return NextResponse.json({ error: "删除素材失败" }, { status: 500 })
  }
}
