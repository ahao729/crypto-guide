import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
  buildObjectKey,
  deleteObject,
  getPublicUrl,
  isObjectStorageConfigured,
  putObject,
} from "@/lib/storage"

export const runtime = "nodejs"

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
]

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

// POST /api/upload - Upload image(s) (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const useObjectStorage = isObjectStorageConfigured()

    // Vercel's filesystem is read-only, so production must use object storage.
    // Local development still falls back to public/uploads for convenience.
    if (!useObjectStorage && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          error:
            "对象存储未配置，无法上传。请设置 S3_ENDPOINT / S3_BUCKET / S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY / S3_PUBLIC_BASE_URL",
        },
        { status: 503 }
      )
    }

    const formData = await request.formData()
    const folderId = (formData.get("folderId") as string | null) || null
    const files = formData.getAll("file") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "请选择要上传的文件" },
        { status: 400 }
      )
    }

    const localUploadDir = path.join(process.cwd(), "public", "uploads")
    if (!useObjectStorage) {
      await mkdir(localUploadDir, { recursive: true })
    }

    const results: { url: string; filename: string }[] = []
    const errors: { filename: string; error: string }[] = []
    let hadStorageError = false

    for (const file of files) {
      if (!(file instanceof File)) continue

      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push({
          filename: file.name,
          error: `不支持的文件格式: ${file.type}`,
        })
        continue
      }

      if (file.size > MAX_SIZE) {
        errors.push({
          filename: file.name,
          error: "文件大小超过 5MB 限制",
        })
        continue
      }

      const bytes = new Uint8Array(await file.arrayBuffer())
      let url: string
      let objectKey: string | null = null

      try {
        if (useObjectStorage) {
          objectKey = buildObjectKey(file.name)
          await putObject(objectKey, bytes, file.type)
          url = getPublicUrl(objectKey)
        } else {
          const ext = path.extname(file.name) || ".jpg"
          const filename = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 8)}${ext}`
          await writeFile(path.join(localUploadDir, filename), bytes)
          url = `/uploads/${filename}`
        }

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
      } catch (error) {
        // Do not leave an orphaned object when the DB write fails.
        if (objectKey) {
          await deleteObject(objectKey).catch(() => undefined)
        }
        console.error("Error uploading file:", error)
        hadStorageError = true
        errors.push({
          filename: file.name,
          error: "上传失败，请稍后重试",
        })
      }
    }

    revalidatePath("/")

    return NextResponse.json(
      {
        results,
        errors,
        success: results.length,
        failed: errors.length,
      },
      { status: results.length > 0 ? 201 : hadStorageError ? 500 : 400 }
    )
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "上传文件失败" }, { status: 500 })
  }
}
