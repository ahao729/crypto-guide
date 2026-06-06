import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET /api/site-settings - Get all settings as key-value object (public)
export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany()

    // Convert to a simple key-value object
    const result: Record<string, string> = {}
    for (const setting of settings) {
      result[setting.key] = setting.value
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching site settings:", error)
    return NextResponse.json(
      { error: "获取站点设置失败" },
      { status: 500 }
    )
  }
}

// PUT /api/site-settings - Bulk update settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const body = await request.json()

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "请求体必须是一个键值对对象" },
        { status: 400 }
      )
    }

    // Bulk upsert: for each key-value pair, create or update
    const operations = Object.entries(body).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    )

    await prisma.$transaction(operations)

    // Return the updated settings
    const settings = await prisma.siteSetting.findMany()
    const result: Record<string, string> = {}
    for (const setting of settings) {
      result[setting.key] = setting.value
    }

    revalidatePath("/")

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating site settings:", error)
    return NextResponse.json(
      { error: "更新站点设置失败" },
      { status: 500 }
    )
  }
}
