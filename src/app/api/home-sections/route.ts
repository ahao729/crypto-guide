import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET /api/home-sections - List sections (public, only published, ordered by sortOrder)
export async function GET() {
  try {
    const sections = await prisma.homeSection.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
    })

    return NextResponse.json(sections)
  } catch (error) {
    console.error("Error fetching home sections:", error)
    return NextResponse.json(
      { error: "获取首页板块失败" },
      { status: 500 }
    )
  }
}

// POST /api/home-sections - Create section (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const body = await request.json()

    if (!body.title || typeof body.title !== "string" || body.title.trim() === "") {
      return NextResponse.json({ error: "板块标题不能为空" }, { status: 400 })
    }
    if (!body.type || typeof body.type !== "string" || body.type.trim() === "") {
      return NextResponse.json({ error: "板块类型不能为空" }, { status: 400 })
    }

    const section = await prisma.homeSection.create({
      data: {
        title: body.title,
        subtitle: body.subtitle || null,
        type: body.type,
        sortOrder: typeof body.sortOrder === "number" ? body.sortOrder : 0,
        published: body.published !== undefined ? body.published : true,
      },
    })

    revalidatePath("/")

    return NextResponse.json(section, { status: 201 })
  } catch (error) {
    console.error("Error creating home section:", error)
    return NextResponse.json(
      { error: "创建首页板块失败" },
      { status: 500 }
    )
  }
}
