import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight, Search as SearchIcon } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { siteConfig } from "@/lib/constants"
import { ecosystemBrands } from "@/lib/ecosystem"
import { BrandMark } from "@/components/front/BrandMark"

export const metadata: Metadata = {
  title: "搜索",
  description: "搜索币圈指南的文章、交易所和基础设施品牌。",
  robots: { index: false, follow: true },
  alternates: { canonical: `${siteConfig.url}/search` },
}

interface SearchPageProps {
  searchParams: Promise<{ q?: string | string[] }>
}

function getQuery(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value
  return (raw ?? "").trim().slice(0, 80)
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = getQuery(q)

  const [articles, exchanges] = query
    ? await Promise.all([
        prisma.article.findMany({
          where: {
            published: true,
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { excerpt: { contains: query, mode: "insensitive" } },
              { content: { contains: query, mode: "insensitive" } },
            ],
          },
          orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
          take: 12,
          select: {
            slug: true,
            title: true,
            excerpt: true,
            category: { select: { name: true, slug: true } },
          },
        }),
        prisma.exchange.findMany({
          where: {
            status: "active",
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              { content: { contains: query, mode: "insensitive" } },
            ],
          },
          orderBy: [{ rating: "desc" }],
          take: 8,
          select: {
            slug: true,
            name: true,
            description: true,
            rating: true,
          },
        }),
      ])
    : [[], []]

  const brands = query
    ? ecosystemBrands.filter((brand) =>
        `${brand.name} ${brand.tagline} ${brand.summary} ${brand.type}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      )
    : []

  const count = articles.length + exchanges.length + brands.length

  return (
    <div className="min-h-screen">
      <section className="border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-medium tracking-[0.18em] text-gold">SEARCH</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            搜索
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            搜文章、交易所和 18 个基础设施品牌。
          </p>
          <form action="/search" method="get" role="search" className="mt-6 flex gap-2">
            <label htmlFor="q" className="sr-only">
              搜索关键词
            </label>
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="q"
                name="q"
                defaultValue={query}
                placeholder="例如：币安注册、Meme、LayerZero、RWA"
                autoFocus={!query}
                className="h-11 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm outline-none transition-colors focus:border-gold/50"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-gold px-5 text-sm font-semibold text-white shadow-sm"
            >
              搜索
            </button>
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {!query ? (
          <section>
            <h2 className="text-lg font-bold">热门入口</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["币安美股怎么买", "/articles/binance-us-stocks-guide"],
                ["币安 AI 产品全景", "/articles/binance-ai-products-guide"],
                ["Meme 币风险清单", "/articles/meme-coin-guide-2026"],
                ["热钱包怎么选", "/articles/hot-wallet-comparison-2026"],
                ["跨链桥风险对比", "/articles/cross-chain-bridge-guide-2026"],
                ["交易所排名", "/exchange-ranking"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-xl border border-border/60 bg-card p-4 text-sm font-medium transition-colors hover:border-gold/40 hover:text-gold"
                >
                  {label}
                </Link>
              ))}
            </div>
          </section>
        ) : count === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-card p-8 text-center">
            <h2 className="text-lg font-bold">没有找到“{query}”</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              试试更短的关键词，或从下面的入口开始。
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {[
                ["文章", "/articles"],
                ["交易所", "/exchanges"],
                ["基础设施", "/ecosystem"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs hover:text-gold"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            <p className="text-sm text-muted-foreground">
              找到 <span className="font-medium text-foreground">{count}</span> 个结果
            </p>

            {articles.length > 0 && (
              <section>
                <h2 className="text-lg font-bold">文章</h2>
                <div className="mt-3 space-y-2">
                  {articles.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/articles/${article.slug}`}
                      className="block rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-gold/40"
                    >
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {article.category && (
                          <span className="rounded-full bg-gold/10 px-2 py-0.5 text-gold-dark">
                            {article.category.name}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2 font-semibold">{article.title}</h3>
                      {article.excerpt && (
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {article.excerpt}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {exchanges.length > 0 && (
              <section>
                <h2 className="text-lg font-bold">交易所</h2>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {exchanges.map((exchange) => (
                    <Link
                      key={exchange.slug}
                      href={`/exchanges/${exchange.slug}`}
                      className="rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-gold/40"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-semibold">{exchange.name}</h3>
                        <span className="text-xs text-gold">{exchange.rating.toFixed(1)}</span>
                      </div>
                      {exchange.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {exchange.description}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {brands.length > 0 && (
              <section>
                <h2 className="text-lg font-bold">基础设施</h2>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {brands.map((brand) => (
                    <Link
                      key={`${brand.category}-${brand.slug}`}
                      href={`/ecosystem/${brand.category}/${brand.slug}`}
                      className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-gold/40"
                    >
                      <BrandMark brand={brand} size="sm" />
                      <div>
                        <h3 className="font-semibold">{brand.name}</h3>
                        <p className="text-xs text-muted-foreground">{brand.tagline}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
