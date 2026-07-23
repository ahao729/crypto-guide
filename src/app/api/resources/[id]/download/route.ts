import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST /api/resources/[id]/download - Track download and optionally serve file
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Try slug first, then fallback to id
    let existing = await prisma.resource.findUnique({ where: { slug: id } })
    if (!existing) {
      existing = await prisma.resource.findUnique({ where: { id } })
    }
    if (!existing) {
      return NextResponse.json({ error: "资源不存在" }, { status: 404 })
    }

    // Update download count
    const resource = await prisma.resource.update({
      where: { id: existing.id },
      data: {
        downloadCount: { increment: 1 },
      },
    })

    // For file type resources, we could redirect to the file
    // For now, just track the download
    if (resource.type === "file" && resource.fileUrl) {
      // Return the file URL so client can download
      return NextResponse.json({
        success: true,
        fileUrl: resource.fileUrl,
        downloads: resource.downloadCount,
      })
    }

    // For external resources, just return success
    return NextResponse.json({
      success: true,
      downloads: resource.downloadCount,
    })
  } catch (error) {
    console.error("Error tracking download:", error)
    // Don't block the download on error
    return NextResponse.json(
      { success: false, error: "下载记录失败" },
      { status: 500 }
    )
  }
}
