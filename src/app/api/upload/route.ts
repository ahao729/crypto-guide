import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST /api/upload - Upload image(s) (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const formData = await request.formData()

    // Get folderId from form data
    const folderId = formData.get("folderId") as string | null

    // Check if multiple files are uploaded
    const files = formData.getAll("file") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "请选择要上传的文件" },
        { status: 400 }
      )
    }

    // Validate file types
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ]

    const maxSize = 5 * 1024 * 1024 // 5MB

    const uploadDir = path.join(process.cwd(), "public", "uploads")
    await mkdir(uploadDir, { recursive: true })

    const results: { url: string; filename: string }[] = []
    const errors: { filename: string; error: string }[] = []

    for (const file of files) {
      if (!(file instanceof File)) continue

      if (!allowedTypes.includes(file.type)) {
        errors.push({
          filename: file.name,
          error: `不支持的文件格式: ${file.type}`,
        })
        continue
      }

      if (file.size > maxSize) {
        errors.push({
          filename: file.name,
          error: `文件大小超过 5MB 限制`,
        })
        continue
      }

      // Generate unique filename
      const ext = path.extname(file.name) || ".jpg"
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`
      const filePath = path.join(uploadDir, filename)

      // Write file
      const buffer = Buffer.from(await file.arrayBuffer())
      await writeFile(filePath, buffer)

      const url = `/uploads/${filename}`

      // Save to Media table
      await prisma.media.create({
        data: {
          filename: file.name,
          url,
          type: file.type,
          size: file.size,
          folderId: folderId || null,
        },
      })

      results.push({ url, filename: file.name })
    }

    revalidatePath("/")

    return NextResponse.json(
      {
        results,
        errors,
        success: results.length,
        failed: errors.length,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "上传文件失败" },
      { status: 500 }
    )
  }
}
