import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET /api/articles/[id] - Get single article with tags and category
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        category: true,
        tags: {
          include: { tag: true },
        },
      },
    })

    if (!article) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 })
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json(
      { error: "获取文章详情失败" },
      { status: 500 }
    )
  }
}

// PUT /api/articles/[id] - Update article, handle tags
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const { id } = await params

    const existing = await prisma.article.findUnique({
      where: { id },
      include: { tags: true },
    })
    if (!existing) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 })
    }

    const body = await request.json()

    // If slug is being changed, check uniqueness
    if (body.slug && body.slug !== existing.slug) {
      const slugConflict = await prisma.article.findUnique({
        where: { slug: body.slug },
      })
      if (slugConflict) {
        return NextResponse.json({ error: "Slug 已存在" }, { status: 409 })
      }
    }

    // Handle tags: disconnect all, reconnect new set
    const tagIds: string[] = Array.isArray(body.tags) ? body.tags : []

    // Determine publishedAt
    let publishedAt = existing.publishedAt
    if (body.published === true && !existing.published) {
      publishedAt = new Date()
    } else if (body.published === false) {
      publishedAt = null
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.excerpt !== undefined && { excerpt: body.excerpt }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.coverImage !== undefined && { coverImage: body.coverImage }),
        ...(body.author !== undefined && { author: body.author }),
        ...(body.published !== undefined && { published: body.published }),
        publishedAt,
        ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
        // Disconnect all existing tags and reconnect
        tags: {
          deleteMany: {},
          create: tagIds.map((tagId: string) => ({
            tagId,
          })),
        },
      },
      include: {
        category: true,
        tags: {
          include: { tag: true },
        },
      },
    })

    revalidatePath("/")
    revalidatePath("/articles")
    revalidatePath(`/articles/${article.slug}`)

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error updating article:", error)
    return NextResponse.json(
      { error: "更新文章失败" },
      { status: 500 }
    )
  }
}

// DELETE /api/articles/[id] - Delete article (admin only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const { id } = await params

    const existing = await prisma.article.findUnique({
      where: { id },
    })
    if (!existing) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 })
    }

    await prisma.article.delete({
      where: { id },
    })

    revalidatePath("/")
    revalidatePath("/articles")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json(
      { error: "删除文章失败" },
      { status: 500 }
    )
  }
}
