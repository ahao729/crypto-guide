import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { StarRating } from "@/components/front/StarRating"
import { InviteCodeCard } from "@/components/front/InviteCodeCard"
import { ExchangeCtaLink } from "@/components/front/ExchangeCtaLink"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { siteConfig } from "@/lib/constants"
import { getExchangeOfficialUrl, isExchangePartner } from "@/lib/affiliates"
import { processArticleHtml } from "@/lib/article-utils"
import { formatDate, toFiveStarRating } from "@/lib/utils"
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
  Shield,
  Zap,
  Coins,
  BarChart3,
  Globe,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Award,
  Clock,
} from "lucide-react"

export const revalidate = 3600 // 1 hour

export async function generateStaticParams() {
  const exchanges = await prisma.exchange.findMany({ select: { slug: true } })
  return exchanges.map((e) => ({ slug: e.slug }))
}

interface ExchangeDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ExchangeDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const exchange = await prisma.exchange.findUnique({ where: { slug } })

  if (!exchange) {
    return { title: "交易所未找到" }
  }

  const title = `${exchange.name} 评测与注册教程`
  const description = exchange.description
    ? exchange.description.slice(0, 160)
    : `${exchange.name} 加密货币交易所详细介绍，包括交易费率、支持币种、安全性和用户评价。`

  return {
    title,
    description,
    openGraph: {
      title: `${exchange.name} - 加密货币交易所`,
      description: exchange.description?.slice(0, 200),
      type: "website",
      url: `${siteConfig.url}/exchanges/${slug}`,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: exchange.logo ? [{ url: exchange.logo }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${exchange.name} - 加密货币交易所`,
      description: exchange.description?.slice(0, 200),
      images: exchange.logo ? [exchange.logo] : undefined,
    },
    alternates: {
      canonical: `${siteConfig.url}/exchanges/${slug}`,
    },
    ...(exchange.updatedAt
      ? { other: { "og:updated_time": exchange.updatedAt.toISOString() } }
      : {}),
  }
}

export default async function ExchangeDetailPage({ params }: ExchangeDetailPageProps) {
  const { slug } = await params

  const exchange = await prisma.exchange.findUnique({
    where: { slug },
    include: { category: true },
  })

  if (!exchange || exchange.status !== "active") {
    notFound()
  }

  const featureList = exchange.features?.split(/[,;；，]/).filter(Boolean) ?? []
  const coinList = exchange.supportedCoins?.split(",").filter(Boolean) ?? []
  const isDex = exchange.category?.slug === "dex"

  // Convert markdown content to HTML
  let contentHtml: string | null = null
  if (exchange.content) {
    const processed = await processArticleHtml(exchange.content, {
      withAnchors: false,
    })
    contentHtml = processed.html
  }

  // Get similar exchanges in the same category
  const similarExchanges = exchange.categoryId
    ? await prisma.exchange.findMany({
        where: {
          status: "active",
          categoryId: exchange.categoryId,
          id: { not: exchange.id },
        },
        take: 3,
        orderBy: [{ sortOrder: "asc" }, { clickCount: "desc" }],
      })
    : []

  // Editorial page, not a product listing. The old Product/AggregateRating
  // markup used a 10-point score with bestRating=5 and ratingCount=1, which is
  // invalid and looks self-serving. Keep the schema honest and simple.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${exchange.name} 评测与注册教程`,
    description:
      exchange.description?.slice(0, 200) ??
      `${exchange.name} 加密货币交易所评测与注册教程`,
    url: `${siteConfig.url}/exchanges/${slug}`,
    inLanguage: siteConfig.locale,
    about: {
      "@type": "Organization",
      name: exchange.name,
      url:
        getExchangeOfficialUrl(exchange.slug) ??
        `${siteConfig.url}/exchanges/${slug}`,
    },
    isPartOf: {
      "@id": `${siteConfig.url}/exchanges`,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  }

  return (
    <div className="min-h-screen">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "首页",
                item: siteConfig.url,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "交易所",
                item: `${siteConfig.url}/exchanges`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: exchange.name,
                item: `${siteConfig.url}/exchanges/${slug}`,
              },
            ],
          }),
        }}
      />
      {/* Back link */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/exchanges"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          返回交易所列表
        </Link>
      </div>

      {/* Hero / Header */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/[0.08] via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            {/* Left: Logo + Name + Info */}
            <div className="flex-1">
              <div className="flex items-start gap-6">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-muted shadow-md">
                  {exchange.logo ? (
                    <Image
                      src={exchange.logo} unoptimized
                      alt={exchange.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-3xl font-bold text-gold">
                      {exchange.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                      {exchange.name}
                    </h1>
                    {exchange.category && (
                      <Badge variant="secondary">{exchange.category.name}</Badge>
                    )}
                    {isExchangePartner(exchange.slug) && (
                      <Badge className="bg-gold/10 text-gold border-gold/20">
                        <Award className="mr-1 h-3 w-3" />
                        合作推荐
                      </Badge>
                    )}
                  </div>
                  {exchange.rating > 0 ? (
                    <StarRating rating={exchange.rating} className="mt-2" size={20} />
                  ) : (
                    <span className="mt-2 inline-block text-sm text-muted-foreground">
                      暂未评分
                    </span>
                  )}
                  {exchange.description && (
                    <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
                      {exchange.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right: CTA */}
            <div className="flex shrink-0 flex-col items-center gap-4">
              <ExchangeCtaLink
                exchange={exchange}
                source="exchange"
                placement="hero"
                className={
                  isExchangePartner(exchange.slug)
                    ? "inline-flex items-center gap-2 rounded-xl bg-gradient-gold px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-gold/20 transition-all hover:shadow-xl hover:shadow-gold/30"
                    : "inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background px-10 py-4 text-lg font-semibold text-foreground transition-colors hover:bg-muted"
                }
              >
                {isExchangePartner(exchange.slug) && !isDex
                  ? `注册 ${exchange.name}`
                  : "访问官网"}
                <ExternalLink className="h-5 w-5" />
              </ExchangeCtaLink>

              {isExchangePartner(exchange.slug) && exchange.inviteCode && !isDex ? (
                <p className="text-center text-xs leading-relaxed text-amber-600 dark:text-amber-400">
                  <span className="font-semibold">注册时邀请码自动填入：</span>
                  <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                    {exchange.inviteCode}
                  </code>
                  <br />
                  若未自动填入，请手动输入；权益以官方页面为准
                </p>
              ) : isDex ? (
                <p className="text-center text-xs leading-relaxed text-muted-foreground">
                  连接钱包前请核对官网域名；DEX 不代保管资产，先小额测试
                </p>
              ) : (
                <p className="text-center text-xs leading-relaxed text-muted-foreground">
                  官方入口（非联盟链接），不产生返佣
                </p>
              )}

              {isDex && (
                <Link
                  href="/articles/hyperliquid-vs-aster-dex-guide"
                  className="text-xs text-gold underline decoration-gold/40 underline-offset-4 transition-colors hover:text-gold-dark"
                >
                  查看 DEX 对比与风险清单
                </Link>
              )}

              {(slug === "binance" || slug === "okx") && (
                <Link
                  href="/articles/binance-okx-new-user-campaigns-2026"
                  className="text-xs text-gold underline decoration-gold/40 underline-offset-4 transition-colors hover:text-gold-dark"
                >
                  查看 10 月新用户活动整理
                </Link>
              )}

              {(slug === "binance" || slug === "okx") && (
                <Link
                  href="/compare/binance-vs-okx"
                  className="text-xs text-gold underline decoration-gold/40 underline-offset-4 transition-colors hover:text-gold-dark"
                >
                  币安 vs OKX 怎么选？
                </Link>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Left: Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* About Section */}
            {exchange.content && (
              <section>
                <h2 className="text-2xl font-bold">关于 {exchange.name}</h2>
                <div className="mt-4 prose prose-gray dark:prose-invert max-w-none">
                  <div
                    className="leading-relaxed text-foreground/90 [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:text-xl [&>h2]:font-bold [&>h3]:mt-6 [&>h3]:mb-3 [&>h3]:text-lg [&>h3]:font-semibold [&>p]:mb-4 [&>p]:leading-7 [&>ul]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:mb-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>li]:mb-1 [&>li]:leading-7 [&>a]:text-gold [&>a]:underline [&>a]:underline-offset-2"
                    dangerouslySetInnerHTML={{ __html: contentHtml ?? "" }}
                  />
                </div>
              </section>
            )}

            {/* Features */}
            {featureList.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 text-2xl font-bold">
                  <Zap className="h-6 w-6 text-gold" />
                  平台特色
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {featureList.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-4"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                      <span className="text-sm leading-relaxed">{feature.trim()}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Supported Coins */}
            {coinList.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 text-2xl font-bold">
                  <Coins className="h-6 w-6 text-gold" />
                  支持币种
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {coinList.map((coin, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="border-border/60 bg-background text-sm"
                    >
                      {coin.trim()}
                    </Badge>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-6">
            {/* Fee Card */}
            <div className="rounded-xl border border-border/60 bg-card">
              <div className="border-b border-border/40 p-4">
                <h3 className="flex items-center gap-2 font-semibold">
                  <BarChart3 className="h-4 w-4 text-gold" />
                  手续费率
                </h3>
              </div>
              <div className="divide-y divide-border/40">
                {exchange.spotFee && (
                  <div className="flex items-center justify-between p-4">
                    <span className="text-sm text-muted-foreground">现货交易</span>
                    <span className="font-semibold">{exchange.spotFee}</span>
                  </div>
                )}
                {exchange.futuresFee && (
                  <div className="flex items-center justify-between p-4">
                    <span className="text-sm text-muted-foreground">{isDex ? "永续交易" : "合约交易"}</span>
                    <span className="font-semibold">{exchange.futuresFee}</span>
                  </div>
                )}
                {exchange.feeRate && (
                  <div className="flex items-center justify-between p-4">
                    <span className="text-sm text-muted-foreground">整体费率</span>
                    <span className="font-semibold">{exchange.feeRate}</span>
                  </div>
                )}
              </div>
            </div>

            {isExchangePartner(exchange.slug) && exchange.inviteCode && !isDex && (
              <InviteCodeCard inviteCode={exchange.inviteCode} />
            )}

            {/* Regulation Card */}
            {exchange.regulation && (
              <div className="rounded-xl border border-border/60 bg-card">
                <div className="border-b border-border/40 p-4">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <Shield className="h-4 w-4 text-gold" />
                    {isDex ? "监管与风险" : "监管信息"}
                  </h3>
                </div>
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {exchange.regulation.includes("合规") || exchange.regulation.includes("持牌") ? (
                      <Shield className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                    ) : (
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                    )}
                    <span className="text-sm leading-relaxed">{exchange.regulation}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Card */}
            <div className="rounded-xl border border-border/60 bg-card">
              <div className="border-b border-border/40 p-4">
                <h3 className="flex items-center gap-2 font-semibold">
                  <TrendingUp className="h-4 w-4 text-gold" />
                  平台数据
                </h3>
              </div>
              <div className="divide-y divide-border/40">
                <div className="flex items-center justify-between p-4">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    {exchange.rating > 0 && (
                      <StarRating rating={exchange.rating} size={12} showValue={false} />
                    )}
                    编辑评分
                  </span>
                  <span className="font-semibold">
                    {exchange.rating > 0
                      ? `${toFiveStarRating(exchange.rating).toFixed(1)} / 5`
                      : "暂未评分"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    最后更新
                  </span>
                  <span className="font-semibold">
                    {formatDate(exchange.updatedAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    状态
                  </span>
                  <Badge
                    variant="outline"
                    className="border-green-500/30 text-green-600 bg-green-50 dark:bg-green-950/20"
                  >
                    运营中
                  </Badge>
                </div>
              </div>
            </div>

{/* CTA Button — removed per design simplification */}
          </div>
        </div>
      </div>

      {/* Similar Exchanges */}
      {similarExchanges.length > 0 && (
        <>
          <Separator />
          <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold">相似交易所推荐</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similarExchanges.map((similar) => (
                <Link
                  key={similar.id}
                  href={`/exchanges/${similar.slug}`}
                  className="group rounded-xl border border-border/60 bg-card p-5 transition-all hover:border-border hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {similar.logo ? (
                        <Image
                          src={similar.logo} unoptimized
                          alt={similar.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-lg font-bold text-gold">
                          {similar.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold transition-colors group-hover:text-gold">
                        {similar.name}
                      </h3>
                      {similar.rating > 0 && (
                        <StarRating rating={similar.rating} className="mt-1" />
                      )}
                      {similar.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {similar.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Bottom CTA */}
      <section className="border-t border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">
            {isExchangePartner(exchange.slug)
              ? isDex
                ? "准备开始在链上交易？"
                : `准备好注册 ${exchange.name} 了吗？`
              : `查看 ${exchange.name} 官方信息`}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {isExchangePartner(exchange.slug)
              ? isDex
                ? "先核对官网域名与网络，小额测试后再加大资金；DEX 不代保管资产。"
                : "通过本站链接注册，邀请码会自动填入；具体权益以官方页面为准。"
              : "本站暂无该交易所的联盟合作，以下为官方入口，不产生返佣。"}
          </p>

          <ExchangeCtaLink
            exchange={exchange}
            source="exchange"
            placement="bottom"
            className={
              isExchangePartner(exchange.slug)
                ? "mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-gold px-8 py-4 font-semibold text-white shadow-md shadow-gold/20 transition-all hover:shadow-lg hover:shadow-gold/30"
                : "mt-6 inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background px-8 py-4 font-semibold text-foreground transition-colors hover:bg-muted"
            }
          >
            {isExchangePartner(exchange.slug) && !isDex
              ? `注册 ${exchange.name}`
              : "访问官网"}
            <ArrowUpRight className="h-5 w-5" />
          </ExchangeCtaLink>

          {isExchangePartner(exchange.slug) && exchange.inviteCode && !isDex ? (
            <p className="mt-4 text-center text-xs leading-relaxed text-amber-600 dark:text-amber-400">
              <span className="font-semibold">注册时邀请码自动填入：</span>
              <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                {exchange.inviteCode}
              </code>
              <br />
              若未自动填入，请手动输入；权益以官方页面为准
            </p>
          ) : isDex ? (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              连接钱包前请核对官网域名；DEX 不代保管资产，先小额测试
            </p>
          ) : (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              官方入口（非联盟链接），不产生返佣
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
