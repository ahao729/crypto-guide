import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { StarRating } from "@/components/front/StarRating"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { exchangeCategories, siteConfig } from "@/lib/constants"
import { ArrowUpRight, TrendingUp, Shield, Zap, Coins } from "lucide-react"

export const revalidate = 1800 // 30 minutes

export const metadata: Metadata = {
  title: `加密货币交易所对比评测 | ${siteConfig.shortName}`,
  description: "全面对比主流加密货币交易所的手续费、安全性、交易深度和用户评价，找到最适合您的交易平台。",
  keywords: ["加密货币交易所", "交易所对比", "数字货币平台", "比特币交易所", "交易所评测", "手续费对比", "币安", "欧易", "Coinbase"],
  openGraph: {
    title: `加密货币交易所对比评测 | ${siteConfig.shortName}`,
    description: "全面对比主流加密货币交易所的手续费、安全性、交易深度和用户评价。",
    url: `${siteConfig.url}/exchanges`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `加密货币交易所对比评测 | ${siteConfig.shortName}`,
    description: "全面对比主流加密货币交易所的手续费、安全性、交易深度和用户评价。",
  },
  alternates: {
    canonical: `${siteConfig.url}/exchanges`,
  },
}

export default async function ExchangesPage() {
  const exchanges = await prisma.exchange.findMany({
    where: { status: "active" },
    orderBy: [{ sortOrder: "asc" }, { clickCount: "desc" }],
    include: { category: true },
  })

  // Group by featured/popular
  const featured = exchanges.filter((e) => e.isFeatured)
  const popular = exchanges.filter((e) => e.isPopular && !e.isFeatured)
  const rest = exchanges.filter((e) => !e.isFeatured && !e.isPopular)

  const stats = [
    { label: "收录交易所", value: exchanges.length, icon: Coins },
    { label: "活期更新", value: "实时", icon: Zap },
    { label: "数据可靠", value: "100%", icon: Shield },
  ]

  return (
    <div className="min-h-screen">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${siteConfig.url}/exchanges`,
            name: "加密货币交易所对比评测",
            description: "全面对比主流加密货币交易所的手续费、安全性、交易深度和用户评价",
            url: `${siteConfig.url}/exchanges`,
            inLanguage: siteConfig.locale,
            isPartOf: {
              "@id": `${siteConfig.url}`,
            },
            mainEntity: {
              "@type": "ItemList",
              itemListElement: exchanges.map((exchange, index) => ({
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
              {
                "@type": "ListItem",
                position: 2,
                name: "交易所",
                item: `${siteConfig.url}/exchanges`,
              },
            ],
          }),
        }}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/[0.08] via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              交易所
              <span className="text-gradient-gold ml-2">对比</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              全面对比主流数字货币交易所的手续费、安全性、支持币种和用户体验，找到最适合您的交易平台
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
            <span className="mr-2 text-sm font-medium text-muted-foreground">分类：</span>
            {exchangeCategories.map((cat) => (
              <Link
                key={cat.value}
                href={cat.value === "all" ? "/exchanges" : `/exchanges?category=${cat.value}`}
                className="rounded-full border border-border/60 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-gold/40 hover:text-gold"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Exchange Listings */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {exchanges.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 py-24">
            <Coins className="h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 text-lg font-medium text-muted-foreground">暂无交易所数据</h3>
            <p className="mt-1 text-sm text-muted-foreground/60">交易所数据正在收集中，请稍后再来</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Featured */}
            {featured.length > 0 && (
              <div>
                <div className="mb-6 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-gold" />
                  <h2 className="text-xl font-semibold">推荐交易所</h2>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {featured.map((exchange) => (
                    <ExchangeCard key={exchange.id} exchange={exchange} featured />
                  ))}
                </div>
              </div>
            )}

            {/* Popular */}
            {popular.length > 0 && (
              <div>
                <div className="mb-6 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-gold" />
                  <h2 className="text-xl font-semibold">热门交易所</h2>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {popular.map((exchange) => (
                    <ExchangeCard key={exchange.id} exchange={exchange} />
                  ))}
                </div>
              </div>
            )}

            {/* All */}
            {rest.length > 0 && (
              <div>
                <div className="mb-6 flex items-center gap-2">
                  <Coins className="h-5 w-5 text-gold" />
                  <h2 className="text-xl font-semibold">全部交易所</h2>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((exchange) => (
                    <ExchangeCard key={exchange.id} exchange={exchange} />
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
          <h2 className="text-2xl font-bold">没有找到想要的交易所？</h2>
          <p className="mt-2 text-muted-foreground">联系我们推荐您关注的交易平台，我们会尽快收录</p>
          <Button className="mt-6 bg-gradient-gold text-white shadow-md shadow-gold/20 hover:shadow-lg hover:shadow-gold/30">
            提交推荐
          </Button>
        </div>
      </section>
    </div>
  )
}

function ExchangeCard({
  exchange,
  featured = false,
}: {
  exchange: {
    id: string
    name: string
    slug: string
    logo: string | null
    description: string | null
    rating: number
    spotFee: string | null
    futuresFee: string | null
    referralUrl: string | null
    features: string | null
    inviteCode: string | null
    category?: { name: string } | null
  }
  featured?: boolean
}) {
  const featureList = exchange.features?.split(",").filter(Boolean).slice(0, 3) ?? []

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
        featured
          ? "border-gold/30 bg-gradient-to-b from-gold/[0.03] to-background shadow-md shadow-gold/5 hover:shadow-lg hover:shadow-gold/10"
          : "border-border/60 bg-card hover:border-border hover:shadow-md"
      }`}
    >
      {featured && (
        <div className="absolute right-0 top-0 rounded-bl-lg bg-gold/10 px-3 py-1 text-xs font-medium text-gold-dark">
          推荐
        </div>
      )}

      <div className="p-6">
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
              {exchange.inviteCode && (
                <Badge className="shrink-0 border-amber-300 bg-amber-50 text-[10px] text-amber-700 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                  邀请码
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
        {featureList.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {featureList.map((f) => (
              <span
                key={f}
                className="rounded-md bg-gold/5 px-2 py-0.5 text-[11px] text-gold-dark"
              >
                {f.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Invite Code Reminder */}
        {exchange.inviteCode ? (
          <div className="mt-3 rounded-lg border border-amber-200/60 bg-amber-50/50 px-3 py-2 text-center dark:border-amber-800/30 dark:bg-amber-950/10">
            <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-400">
              <span className="font-semibold">注册时请使用邀请码：</span>
              <code className="mx-1 rounded bg-amber-100 px-1.5 py-0.5 font-mono text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                {exchange.inviteCode}
              </code>
              <br />
              填写后可享受专属手续费折扣
            </p>
            {/* DUXIN Benefit — only for Binance & OKX */}
            {(exchange.slug === "binance" || exchange.slug === "okx") && (
              <div className="mt-2 border-t border-amber-200/50 pt-2 dark:border-amber-800/20">
                <p className="text-xs leading-relaxed text-amber-600 dark:text-amber-400">
                  <span className="font-semibold text-amber-700 dark:text-amber-300">
                    专属福利：
                  </span>
                  通过本链接注册并使用邀请码{" "}
                  <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-sm font-bold text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                    DUXIN
                  </code>
                  ，可享受终身手续费折扣 + 专属返佣权益，交易越多省得越多！
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-3 rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-center">
            <p className="text-xs text-muted-foreground">
              通过本链接注册可能获得专属优惠
            </p>
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
          <Button size="sm" variant="outline" className="shrink-0" asChild>
            <Link href={`/exchanges/${exchange.slug}`}>
              详情
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

