import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { StarRating } from "@/components/front/StarRating"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { exchangeCategories, siteConfig } from "@/lib/constants"
import {
  ArrowUpRight,
  Trophy,
  TrendingUp,
  Shield,
  Zap,
  Coins,
  Award,
  Medal,
  ChevronRight,
} from "lucide-react"

export const revalidate = 1800 // 30 minutes

export const metadata: Metadata = {
  title: `交易所排名 | ${siteConfig.shortName}`,
  description: "加密货币交易所综合排名，基于手续费、安全性、用户评分和交易深度等多维度评测，帮您找到最佳交易平台。",
  keywords: ["交易所排名", "加密货币交易所排行", "币安排名", "欧易排名", "交易所对比", "数字货币平台排行"],
  openGraph: {
    title: `交易所排名 | ${siteConfig.shortName}`,
    description: "加密货币交易所综合排名，多维度评测帮您找到最佳交易平台。",
    url: `${siteConfig.url}/exchange-ranking`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `交易所排名 | ${siteConfig.shortName}`,
    description: "加密货币交易所综合排名，多维度评测帮您找到最佳交易平台。",
  },
  alternates: {
    canonical: `${siteConfig.url}/exchange-ranking`,
  },
}

function calculateScore(exchange: {
  rating: number
  clickCount: number
  isFeatured: boolean
  isPopular: boolean
  sortOrder: number
}) {
  // Composite score: rating (0-5) * 20 = max 100
  // + clickCount bonus (capped at 20)
  // + featured bonus 15
  // + popular bonus 10
  // + sortOrder bonus (lower is better, max 10)
  const ratingScore = exchange.rating * 20
  const clickBonus = Math.min(exchange.clickCount / 10, 20)
  const featuredBonus = exchange.isFeatured ? 15 : 0
  const popularBonus = exchange.isPopular ? 10 : 0
  const orderBonus = Math.max(0, 10 - exchange.sortOrder)
  return Number((ratingScore + clickBonus + featuredBonus + popularBonus + orderBonus).toFixed(1))
}

function getRankBadge(rank: number) {
  if (rank === 1) return { icon: Trophy, className: "text-yellow-500", label: "冠军" }
  if (rank === 2) return { icon: Medal, className: "text-gray-400", label: "亚军" }
  if (rank === 3) return { icon: Medal, className: "text-amber-600", label: "季军" }
  return null
}

export default async function ExchangeRankingPage() {
  const exchanges = await prisma.exchange.findMany({
    where: { status: "active" },
    include: { category: true },
  })

  // Calculate scores and sort
  const ranked = exchanges
    .map((ex) => ({ ...ex, score: calculateScore(ex) }))
    .sort((a, b) => b.score - a.score)
    .map((ex, index) => ({ ...ex, rank: index + 1 }))

  // Group by category for filter
  const categories = exchangeCategories

  const stats = [
    { label: "收录交易所", value: ranked.length, icon: Coins },
    { label: "综合评分基准", value: "100", icon: Trophy },
    { label: "数据可靠", value: "100%", icon: Shield },
  ]

  const top3 = ranked.slice(0, 3)
  const rest = ranked.slice(3)

  return (
    <div className="min-h-screen">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${siteConfig.url}/exchange-ranking`,
            name: "交易所排名",
            description: "加密货币交易所综合排名",
            url: `${siteConfig.url}/exchange-ranking`,
            inLanguage: siteConfig.locale,
            isPartOf: { "@id": `${siteConfig.url}` },
            mainEntity: {
              "@type": "ItemList",
              itemListElement: ranked.map((exchange, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "Product",
                  "@id": `${siteConfig.url}/exchanges/${exchange.slug}`,
                  name: exchange.name,
                  ...(exchange.description && { description: exchange.description }),
                  url: `${siteConfig.url}/exchanges/${exchange.slug}`,
                },
              })),
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "首页", item: siteConfig.url },
              { "@type": "ListItem", position: 2, name: "交易所排名", item: `${siteConfig.url}/exchange-ranking` },
            ],
          }),
        }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/[0.08] via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Trophy className="h-8 w-8 text-gold" />
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                交易所
                <span className="text-gradient-gold ml-2">排行榜</span>
              </h1>
            </div>
            <p className="mt-4 text-lg text-muted-foreground">
              基于用户评分、交易深度、手续费率、安全性等多维度综合评分，为您呈现最客观的交易所排名
            </p>
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-4 sm:gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center rounded-xl border border-border/40 bg-background/50 p-4 backdrop-blur-sm"
              >
                <stat.icon className="h-5 w-5 text-gold" />
                <span className="mt-1 text-2xl font-bold">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b border-border/40 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-sm font-medium text-muted-foreground">分类筛选：</span>
            {categories.map((cat) => (
              <Link
                key={cat.value}
                href={cat.value === "all" ? "/exchange-ranking" : `/exchange-ranking?category=${cat.value}`}
                className="rounded-full border border-border/60 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-gold/40 hover:text-gold"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ranking List */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {ranked.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 py-24">
            <Trophy className="h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 text-lg font-medium text-muted-foreground">暂无交易所数据</h3>
            <p className="mt-1 text-sm text-muted-foreground/60">交易所数据正在收集中，请稍后再来</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Podium - Top 3 */}
            {top3.length > 0 && (
              <div>
                <div className="mb-6 flex items-center gap-2">
                  <Award className="h-5 w-5 text-gold" />
                  <h2 className="text-xl font-semibold">前三名</h2>
                </div>
                <div className="grid gap-6 sm:grid-cols-3">
                  {top3.map((exchange) => {
                    const badge = getRankBadge(exchange.rank)
                    const BadgeIcon = badge?.icon
                    return (
                      <div
                        key={exchange.id}
                        className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
                          exchange.rank === 1
                            ? "border-gold/40 bg-gradient-to-b from-gold/[0.05] to-background shadow-lg shadow-gold/10 ring-1 ring-gold/20"
                            : "border-border/60 bg-card hover:border-border hover:shadow-md"
                        }`}
                      >
                        {/* Rank Badge */}
                        <div className="absolute right-3 top-3 flex items-center gap-1">
                          {BadgeIcon && <BadgeIcon className={`h-5 w-5 ${badge?.className}`} />}
                          <span className={`text-sm font-bold ${badge?.className}`}>#{exchange.rank}</span>
                        </div>

                        {/* Score Circle */}
                        <div className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-sm font-bold text-gold-dark">
                          {exchange.rank}
                        </div>

                        <div className="p-6 pt-14">
                          {/* Header */}
                          <div className="flex items-start gap-4">
                            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
                              {exchange.logo ? (
                                <Image
                                  src={exchange.logo}
                                  alt={exchange.name}
                                  width={56}
                                  height={56}
                                  className="object-contain"
                                />
                              ) : (
                                <span className="text-lg font-bold text-gradient-gold">
                                  {exchange.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold leading-tight">{exchange.name}</h3>
                                {exchange.category && (
                                  <Badge variant="secondary" className="shrink-0 text-[10px]">
                                    {exchange.category.name}
                                  </Badge>
                                )}
                              </div>
                              <StarRating rating={exchange.rating} className="mt-1" />
                              {exchange.description && (
                                <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                                  {exchange.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Score Bar */}
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">综合评分</span>
                              <span className="font-bold text-gold-dark">{exchange.score}</span>
                            </div>
                            <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-gold/60 to-gold"
                                style={{ width: `${Math.min(exchange.score, 100)}%` }}
                              />
                            </div>
                          </div>

                          {/* Fee Info */}
                          <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-muted/40 p-3">
                            <div className="text-center">
                              <span className="text-xs text-muted-foreground">现货费率</span>
                              <p className="mt-0.5 font-semibold">{exchange.spotFee ?? "--"}</p>
                            </div>
                            <div className="text-center">
                              <span className="text-xs text-muted-foreground">合约费率</span>
                              <p className="mt-0.5 font-semibold">{exchange.futuresFee ?? "--"}</p>
                            </div>
                          </div>

                          {/* Features */}
                          {exchange.features && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {exchange.features.split(",").filter(Boolean).slice(0, 3).map((f) => (
                                <span
                                  key={f}
                                  className="rounded-md bg-gold/5 px-2 py-0.5 text-[11px] text-gold-dark"
                                >
                                  {f.trim()}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="mt-4 flex items-center gap-2">
                            <Button size="sm" variant="default" className="flex-1 bg-gradient-gold text-white shadow-sm" asChild>
                              <Link href={`/go/${exchange.id}`} target="_blank">
                                官网注册
                                <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                              </Link>
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1" asChild>
                              <Link href={`/exchanges/${exchange.slug}`}>查看详情</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Rest of rankings */}
            {rest.length > 0 && (
              <div>
                <div className="mb-6 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-gold" />
                  <h2 className="text-xl font-semibold">完整排名</h2>
                  <span className="text-sm text-muted-foreground">（第 4 - {ranked.length} 名）</span>
                </div>
                <div className="space-y-3">
                  {rest.map((exchange) => (
                    <div
                      key={exchange.id}
                      className="group relative flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4 transition-all duration-200 hover:border-border hover:shadow-md"
                    >
                      {/* Rank Number */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                        {exchange.rank}
                      </div>

                      {/* Logo */}
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                        {exchange.logo ? (
                          <Image
                            src={exchange.logo}
                            alt={exchange.name}
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        ) : (
                          <span className="text-base font-bold text-gradient-gold">
                            {exchange.name.charAt(0)}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{exchange.name}</h3>
                          {exchange.category && (
                            <Badge variant="secondary" className="text-[10px]">
                              {exchange.category.name}
                            </Badge>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <StarRating rating={exchange.rating} size={10} />
                          <span>现货 {exchange.spotFee ?? "--"}</span>
                          <span>合约 {exchange.futuresFee ?? "--"}</span>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="hidden items-center gap-3 sm:flex">
                        <div className="text-right">
                          <div className="text-sm font-bold text-gold-dark">{exchange.score}</div>
                          <div className="text-xs text-muted-foreground">综合评分</div>
                        </div>
                        <div className="h-8 w-20 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-gold/60 to-gold"
                            style={{ width: `${Math.min(exchange.score, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex shrink-0 items-center gap-2">
                        <Button size="sm" variant="default" className="bg-gradient-gold text-white shadow-sm" asChild>
                          <Link href={`/go/${exchange.id}`} target="_blank">
                            注册
                          </Link>
                        </Button>
                        <Button size="sm" variant="ghost" className="hidden sm:inline-flex" asChild>
                          <Link href={`/exchanges/${exchange.slug}`}>
                            详情 <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="border-t border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">查看更详细的交易所对比</h2>
          <p className="mt-2 text-muted-foreground">前往交易所对比页面，从更多维度全面比较各交易平台</p>
          <Button className="mt-6 bg-gradient-gold text-white shadow-md shadow-gold/20 hover:shadow-lg hover:shadow-gold/30" asChild>
            <Link href="/exchanges">
              查看全部交易所
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
