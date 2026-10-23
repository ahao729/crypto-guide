import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { ecosystemBrands } from "@/lib/ecosystem"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const q = (url.searchParams.get("q") ?? "").trim().slice(0, 60)

  if (q.length < 2) {
    return NextResponse.json({ query: q, articles: [], exchanges: [], brands: [] })
  }

  const [articles, exchanges] = await Promise.all([
    prisma.article.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { excerpt: { contains: q, mode: "insensitive" } },
        ],
      },
      orderBy: [{ publishedAt: "desc" }],
      take: 5,
      select: {
        slug: true,
        title: true,
        excerpt: true,
        category: { select: { name: true } },
      },
    }),
    prisma.exchange.findMany({
      where: {
        status: "active",
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      orderBy: [{ rating: "desc" }],
      take: 4,
      select: { slug: true, name: true, rating: true },
    }),
  ])

  const needle = q.toLowerCase()
  const brands = ecosystemBrands
    .filter((brand) =>
      `${brand.name} ${brand.tagline} ${brand.summary} ${brand.type}`
        .toLowerCase()
        .includes(needle),
    )
    .slice(0, 4)
    .map((brand) => ({
      slug: brand.slug,
      category: brand.category,
      name: brand.name,
      tagline: brand.tagline,
    }))

  return NextResponse.json(
    { query: q, articles, exchanges, brands },
    { headers: { "Cache-Control": "no-store" } },
  )
}
