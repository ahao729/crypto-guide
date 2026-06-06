import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET /api/exchanges/[id] - Get single exchange by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const exchange = await prisma.exchange.findUnique({
      where: { id },
      include: { category: true },
    })

    if (!exchange) {
      return NextResponse.json({ error: "交易所不存在" }, { status: 404 })
    }

    return NextResponse.json(exchange)
  } catch (error) {
    console.error("Error fetching exchange:", error)
    return NextResponse.json(
      { error: "获取交易所详情失败" },
      { status: 500 }
    )
  }
}

// PUT /api/exchanges/[id] - Update exchange (admin only)
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

    const existing = await prisma.exchange.findUnique({
      where: { id },
    })
    if (!existing) {
      return NextResponse.json({ error: "交易所不存在" }, { status: 404 })
    }

    const body = await request.json()

    // If slug is being changed, check uniqueness
    if (body.slug && body.slug !== existing.slug) {
      const slugConflict = await prisma.exchange.findUnique({
        where: { slug: body.slug },
      })
      if (slugConflict) {
        return NextResponse.json({ error: "Slug 已存在" }, { status: 409 })
      }
    }

    const exchange = await prisma.exchange.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.logo !== undefined && { logo: body.logo }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.rating !== undefined && { rating: body.rating }),
        ...(body.referralUrl !== undefined && { referralUrl: body.referralUrl }),
        ...(body.inviteCode !== undefined && { inviteCode: body.inviteCode }),
        ...(body.feeRate !== undefined && { feeRate: body.feeRate }),
        ...(body.spotFee !== undefined && { spotFee: body.spotFee }),
        ...(body.futuresFee !== undefined && { futuresFee: body.futuresFee }),
        ...(body.features !== undefined && { features: body.features }),
        ...(body.supportedCoins !== undefined && { supportedCoins: body.supportedCoins }),
        ...(body.regulation !== undefined && { regulation: body.regulation }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
        ...(body.isFeatured !== undefined && { isFeatured: body.isFeatured }),
        ...(body.isPopular !== undefined && { isPopular: body.isPopular }),
        ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
      },
      include: { category: true },
    })

    revalidatePath("/")
    revalidatePath("/exchanges")
    revalidatePath(`/exchanges/${exchange.slug}`)

    return NextResponse.json(exchange)
  } catch (error) {
    console.error("Error updating exchange:", error)
    return NextResponse.json(
      { error: "更新交易所失败" },
      { status: 500 }
    )
  }
}

// DELETE /api/exchanges/[id] - Delete exchange (admin only)
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

    const existing = await prisma.exchange.findUnique({
      where: { id },
    })
    if (!existing) {
      return NextResponse.json({ error: "交易所不存在" }, { status: 404 })
    }

    await prisma.exchange.delete({
      where: { id },
    })

    revalidatePath("/")
    revalidatePath("/exchanges")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting exchange:", error)
    return NextResponse.json(
      { error: "删除交易所失败" },
      { status: 500 }
    )
  }
}
