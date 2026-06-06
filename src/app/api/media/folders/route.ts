import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET /api/media/folders - List all folders
export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const folders = await prisma.mediaFolder.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        _count: { select: { media: true } },
      },
    })

    return NextResponse.json(folders)
  } catch (error) {
    console.error("Error fetching folders:", error)
    return NextResponse.json(
      { error: "获取分类列表失败" },
      { status: 500 }
    )
  }
}

// POST /api/media/folders - Create a new folder
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const body = await request.json()
    const { name } = body

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "请输入分类名称" },
        { status: 400 }
      )
    }

    const slug = name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\u4e00-\u9fa5-]/g, "")

    // Check for duplicate slug
    const existing = await prisma.mediaFolder.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { error: "该分类已存在" },
        { status: 409 }
      )
    }

    const folder = await prisma.mediaFolder.create({
      data: {
        name: name.trim(),
        slug,
      },
    })

    return NextResponse.json(folder, { status: 201 })
  } catch (error) {
    console.error("Error creating folder:", error)
    return NextResponse.json(
      { error: "创建分类失败" },
      { status: 500 }
    )
  }
}
