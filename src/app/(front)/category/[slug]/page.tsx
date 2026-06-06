import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { StarRating } from "@/components/front/StarRating"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/constants"
import { ArrowLeft, Coins, FileText, TrendingUp, Zap, ArrowUpRight } from "lucide-react"

export const dynamic = "force-dynamic"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ type?: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await prisma.category.findUnique({ where: { slug } })

  if (!category) {
    return { title: "分类未找到" }
  }

  const title = `${category.name} - ${siteConfig.name}`
  const description = category.description || `浏览 ${category.name} 分类下的加密货币交易所和文章内容`

  return {
    title,
    description,
    keywords: [`${category.name}`, `${category.name} 加密货币`, `${category.name} 交易所`, "加密资产分类"],
    openGraph: {
      title,
      description,
      type: "website",
      url: `${siteConfig.url}/category/${slug}`,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${siteConfig.url}/category/${slug}`,
    },
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const type = resolvedSearchParams?.type

  const category = await prisma.category.findUnique({
    where: { slug },
  })

  if (!category) {
    notFound()
  }

  // Determine what to show based on category type or query param override
  const showType = type || category.type

  const categoryJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} - ${siteConfig.name}`,
    description: category.description || `${category.name}分类下的内容`,
    url: `${siteConfig.url}/category/${slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/category/${slug}`,
    },
  }

  const categoryBreadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name: showType === "article" ? "文章" : "交易所",
        item: `${siteConfig.url}${showType === "article" ? "/articles" : "/exchanges"}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: `${siteConfig.url}/category/${slug}`,
      },
    ],
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryBreadcrumbJsonLd) }}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/[0.08] via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Link
            href={showType === "article" ? "/articles" : "/exchanges"}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            {showType === "article" ? "返回文章列表" : "返回交易所"}
          </Link>

          <div className="mt-6">
            <Badge variant="secondary" className="mb-4">
              {showType === "article" ? "文章分类" : "交易所分类"}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {showType === "article" ? (
          <ArticlesByCategory categoryId={category.id} categoryName={category.name} />
        ) : (
          <ExchangesByCategory categoryId={category.id} categoryName={category.name} />
        )}
      </section>
    </div>
  )
}

async function ExchangesByCategory({
  categoryId,
  categoryName,
}: {
  categoryId: string
  categoryName: string
}) {
  const exchanges = await prisma.exchange.findMany({
    where: {
      status: "active",
      categoryId,
    },
    orderBy: [{ sortOrder: "asc" }, { clickCount: "desc" }],
    include: { category: true },
  })

  const featured = exchanges.filter((e) => e.isFeatured)
  const rest = exchanges.filter((e) => !e.isFeatured)

  if (exchanges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 py-24">
        <Coins className="h-12 w-12 text-muted-foreground/40" />
        <h3 className="mt-4 text-lg font-medium text-muted-foreground">暂无交易所</h3>
        <p className="mt-1 text-sm text-muted-foreground/60">
          分类 &ldquo;{categoryName}&rdquo; 下暂无交易所数据
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {featured.length > 0 && (
        <div>
          <div className="mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gold" />
            <h2 className="text-xl font-semibold">推荐</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((exchange) => (
              <ExchangeCard key={exchange.id} exchange={exchange} featured />
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="mb-6 flex items-center gap-2">
          <Coins className="h-5 w-5 text-gold" />
          <h2 className="text-xl font-semibold">全部 ({rest.length})</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((exchange) => (
            <ExchangeCard key={exchange.id} exchange={exchange} />
          ))}
        </div>
      </div>
    </div>
  )
}

async function ArticlesByCategory({
  categoryId,
  categoryName,
}: {
  categoryId: string
  categoryName: string
}) {
  const articles = await prisma.article.findMany({
    where: {
      published: true,
      categoryId,
    },
    orderBy: { publishedAt: "desc" },
  })

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 py-24">
        <FileText className="h-12 w-12 text-muted-foreground/40" />
        <h3 className="mt-4 text-lg font-medium text-muted-foreground">暂无文章</h3>
        <p className="mt-1 text-sm text-muted-foreground/60">
          分类 &ldquo;{categoryName}&rdquo; 下暂无文章
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/articles/${article.slug}`}
          className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all hover:border-border hover:shadow-md"
        >
          <div className="relative aspect-[16/9] overflow-hidden bg-muted">
            {article.coverImage ? (
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-4xl font-bold text-gradient-gold">
                  {article.title.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col p-4">
            <h3 className="line-clamp-2 font-semibold transition-colors group-hover:text-gold">
              {article.title}
            </h3>
            {article.excerpt && (
              <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
                {article.excerpt}
              </p>
            )}
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              {article.publishedAt && (
                <span>
                  {new Date(article.publishedAt).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
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
      <Link href={`/exchanges/${exchange.slug}`} className="block p-5">
        <div className="flex items-start gap-4">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
            {exchange.logo ? (
              <Image
                src={exchange.logo}
                alt={exchange.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-lg font-bold text-gold">
                {exchange.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-semibold">{exchange.name}</h3>
              {exchange.inviteCode && (
                <Badge className="shrink-0 border-amber-300 bg-amber-50 text-[10px] text-amber-700 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                  邀请码
                </Badge>
              )}
            </div>
            <StarRating rating={exchange.rating} className="mt-1" />
          </div>
        </div>

        {exchange.description && (
          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
            {exchange.description}
          </p>
        )}

        {/* Fee Tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          {exchange.spotFee && (
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              现货 {exchange.spotFee}
            </span>
          )}
          {exchange.futuresFee && (
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              合约 {exchange.futuresFee}
            </span>
          )}
        </div>

        {/* Features */}
        {featureList.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {featureList.map((f, i) => (
              <span
                key={i}
                className="rounded-full bg-gold/[0.08] px-2 py-0.5 text-xs text-gold"
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
      </Link>

      {/* CTA */}
      <div className="border-t border-border/40 p-3">
        {exchange.referralUrl ? (
          <Link
            href={`/go/${exchange.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-gold py-2 text-sm font-medium text-white shadow-sm shadow-gold/20 transition-all hover:shadow-md hover:shadow-gold/30"
          >
            前往官网
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <Link
            href={`/exchanges/${exchange.slug}`}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border/60 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            查看详情
          </Link>
        )}
      </div>
    </div>
  )
}
