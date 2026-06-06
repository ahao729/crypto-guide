import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET /api/media - List all media files (with search & folder filter)
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const skip = (page - 1) * limit
    const search = searchParams.get("search")
    const folderId = searchParams.get("folderId")

    const where: Record<string, unknown> = {}

    if (type) {
      where.type = { startsWith: type }
    }

    if (search) {
      where.filename = { contains: search }
    }

    if (folderId === "null" || folderId === "none") {
      where.folderId = null
    } else if (folderId) {
      where.folderId = folderId
    }

    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        skip,
        take: limit,
        include: {
          folder: true,
        },
      }),
      prisma.media.count({ where }),
    ])

    return NextResponse.json({ media, total })
  } catch (error) {
    console.error("Error fetching media:", error)
    return NextResponse.json(
      { error: "获取素材列表失败" },
      { status: 500 }
    )
  }
}

// POST /api/media/batch-delete - Batch delete media files
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const body = await request.json()
    const { action, ids } = body

    if (action === "batch-delete") {
      if (!Array.isArray(ids) || ids.length === 0) {
        return NextResponse.json(
          { error: "请选择要删除的素材" },
          { status: 400 }
        )
      }

      const { unlink } = await import("fs/promises")
      const path = await import("path")

      const mediaFiles = await prisma.media.findMany({
        where: { id: { in: ids } },
      })

      // Delete files from disk
      for (const media of mediaFiles) {
        const filePath = path.join(process.cwd(), "public", media.url)
        try {
          await unlink(filePath)
        } catch {
          // File may already be deleted, continue
        }
      }

      // Delete records from database
      await prisma.media.deleteMany({
        where: { id: { in: ids } },
      })

      return NextResponse.json({ success: true, deleted: ids.length })
    }

    if (action === "batch-move") {
      if (!Array.isArray(ids) || ids.length === 0) {
        return NextResponse.json(
          { error: "请选择要移动的素材" },
          { status: 400 }
        )
      }

      const { folderId } = body

      // Validate folderId if provided
      if (folderId) {
        const folder = await prisma.mediaFolder.findUnique({
          where: { id: folderId },
        })
        if (!folder) {
          return NextResponse.json({ error: "目标分类不存在" }, { status: 404 })
        }
      }

      await prisma.media.updateMany({
        where: { id: { in: ids } },
        data: { folderId: folderId || null },
      })

      return NextResponse.json({
        success: true,
        moved: ids.length,
        folderId: folderId || null,
      })
    }

    // POST /api/media - Create a media record directly (for multi-upload fallback)
    if (action === "create") {
      const { filename, url, type, size, folderId: targetFolderId } = body
      const media = await prisma.media.create({
        data: {
          filename,
          url,
          type,
          size,
          folderId: targetFolderId || null,
        },
      })
      return NextResponse.json(media, { status: 201 })
    }

    return NextResponse.json({ error: "未知操作" }, { status: 400 })
  } catch (error) {
    console.error("Error in media POST:", error)
    return NextResponse.json(
      { error: "操作失败" },
      { status: 500 }
    )
  }
}
