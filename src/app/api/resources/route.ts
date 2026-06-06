import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET /api/resources - List all resources (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const published = searchParams.get("published")

    const where: Record<string, unknown> = {}

    if (category) {
      where.category = category
    }

    if (published === "all") {
      // Show all (no filter)
    } else if (published === "true") {
      where.published = true
    } else if (published === "false") {
      where.published = false
    } else if (!published) {
      // Default: only show published for public
      where.published = true
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const resources = await prisma.resource.findMany({
      where,
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
    })

    return NextResponse.json(resources)
  } catch (error) {
    console.error("Error fetching resources:", error)
    return NextResponse.json(
      { error: "获取资源列表失败" },
      { status: 500 }
    )
  }
}

// POST /api/resources - Create resource (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const body = await request.json()

    // Manual validation for required fields
    if (!body.title || typeof body.title !== "string" || body.title.trim() === "") {
      return NextResponse.json({ error: "资源标题不能为空" }, { status: 400 })
    }

    const resource = await prisma.resource.create({
      data: {
        title: body.title,
        description: body.description || null,
        category: body.category || "newbie",
        type: body.type || "file",
        fileUrl: body.fileUrl || null,
        fileSize: body.fileSize || null,
        externalUrl: body.externalUrl || null,
        icon: body.icon || null,
        tags: body.tags || null,
        downloadCount: typeof body.downloadCount === "number" ? body.downloadCount : 0,
        sortOrder: typeof body.sortOrder === "number" ? body.sortOrder : 0,
        published: body.published !== undefined ? !!body.published : true,
      },
    })

    revalidatePath("/")
    revalidatePath("/resources")

    return NextResponse.json(resource, { status: 201 })
  } catch (error) {
    console.error("Error creating resource:", error)
    return NextResponse.json(
      { error: "创建资源失败" },
      { status: 500 }
    )
  }
}
