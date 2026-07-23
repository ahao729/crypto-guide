import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/constants"
import { BookOpen, Clock, ArrowRight, Newspaper } from "lucide-react"
import { ArticleSearchClient } from "@/components/article-search-client"

// 当有 searchParams 时 Next.js 自动降级为动态渲染，无需 force-dynamic

export const metadata: Metadata = {
  title: `加密货币与区块链文章教程 | ${siteConfig.shortName}`,
  description: "涵盖交易所教程、区块链知识、交易策略、行业资讯和 DeFi 指南，助您快速入门加密货币世界。",
  keywords: ["加密货币教程", "区块链知识", "交易策略", "DeFi 指南", "数字货币入门", "交易所教程", "比特币", "以太坊"],
  openGraph: {
    title: `加密货币与区块链文章教程 | ${siteConfig.shortName}`,
    description: "涵盖交易所教程、区块链知识、交易策略、行业资讯和 DeFi 指南。",
    url: `${siteConfig.url}/articles`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `加密货币与区块链文章教程 | ${siteConfig.shortName}`,
    description: "涵盖交易所教程、区块链知识、交易策略、行业资讯和 DeFi 指南。",
  },
  alternates: {
    canonical: `${siteConfig.url}/articles`,
  },
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string; q?: string; tag?: string }>
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const activeCategorySlug = resolvedSearchParams?.category
  const searchQuery = resolvedSearchParams?.q?.trim()
  const activeTagSlug = resolvedSearchParams?.tag

  const buildHref = (overrides: {
    category?: string | null
    tag?: string | null
    q?: string | null
  }) => {
    const params = new URLSearchParams()
    const category = overrides.category !== undefined ? overrides.category : activeCategorySlug
    const tag = overrides.tag !== undefined ? overrides.tag : activeTagSlug
    const q = overrides.q !== undefined ? overrides.q : searchQuery

    if (category) params.set("category", category)
    if (tag) params.set("tag", tag)
    if (q) params.set("q", q)

    const qs = params.toString()
    return qs ? `/articles?${qs}` : "/articles"
  }

  const allArticles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: {
      category: true,
      tags: {
        include: { tag: true },
      },
    },
  })

  // Filter by category, search query, and tag
  const articles = allArticles.filter((a) => {
    if (activeCategorySlug && a.category?.slug !== activeCategorySlug) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const matchesTitle = a.title.toLowerCase().includes(q)
      const matchesExcerpt = a.excerpt?.toLowerCase().includes(q) ?? false
      if (!matchesTitle && !matchesExcerpt) return false
    }
    if (activeTagSlug) {
      const hasTag = a.tags.some((t) => t.tag.slug === activeTagSlug)
      if (!hasTag) return false
    }
    return true
  })

  // Group by category for richer layout
  const categories = await prisma.category.findMany({
    where: { type: "article" },
    orderBy: { sortOrder: "asc" },
  })

  const articleCounts = new Map<string, number>()
  categories.forEach((cat) => {
    articleCounts.set(
      cat.id,
      allArticles.filter((a) => a.categoryId === cat.id).length
    )
  })

  // Latest article for hero
  const latestArticle = articles[0]
  const remainingArticles = articles.slice(1)

  return (
    <div className="min-h-screen">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${siteConfig.url}/articles`,
            name: "加密货币与区块链文章教程",
            description: "涵盖交易所教程、区块链知识、交易策略、行业资讯和 DeFi 指南",
            url: `${siteConfig.url}/articles`,
            inLanguage: siteConfig.locale,
            isPartOf: {
              "@id": `${siteConfig.url}`,
            },
            mainEntity: {
              "@type": "ItemList",
              itemListElement: articles.map((article, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "Article",
                  "@id": `${siteConfig.url}/articles/${article.slug}`,
                  headline: article.title,
                  ...(article.excerpt && { description: article.excerpt }),
                  ...(article.publishedAt && { datePublished: article.publishedAt.toISOString() }),
                  ...(article.author && { author: { "@type": "Person", name: article.author } }),
                  url: `${siteConfig.url}/articles/${article.slug}`,
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
                name: "文章",
                item: `${siteConfig.url}/articles`,
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
              文章
              <span className="text-gradient-gold ml-2">资讯</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              最新的加密货币行业资讯、交易所教程、交易策略和深度分析
            </p>
          </div>
        </div>
      </section>

      {/* Category Sidebar + Content */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="order-2 lg:order-1">
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <ArticleSearchClient />

              {/* Categories */}
              <div className="rounded-xl border border-border/60 bg-card p-4">
                <h3 className="mb-3 text-sm font-semibold">文章分类</h3>
                <div className="space-y-1">
                  <Link
                    href="/articles"
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gold/5 hover:text-gold ${
                      !activeCategorySlug
                        ? "bg-gold/10 text-gold font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span>全部文章</span>
                    <span className="text-xs text-muted-foreground/60">{articles.length}</span>
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/articles?category=${cat.slug}`}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gold/5 hover:text-gold ${
                        activeCategorySlug === cat.slug
                          ? "bg-gold/10 text-gold font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-muted-foreground/60">
                        {articleCounts.get(cat.id) ?? 0}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick links */}
              <div className="rounded-xl border border-border/60 bg-card p-4">
                <h3 className="mb-3 text-sm font-semibold">快速导航</h3>
                <div className="space-y-2">
                  <Link
                    href="/exchanges"
                    className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                    交易所对比
                  </Link>
                  <Link
                    href="/faq"
                    className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                    常见问题
                  </Link>
                  <Link
                    href="/tools"
                    className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                    实用工具
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="order-1 lg:order-2">
            {articles.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 py-24">
                <Newspaper className="h-12 w-12 text-muted-foreground/40" />
                <h3 className="mt-4 text-lg font-medium text-muted-foreground">暂无文章</h3>
                <p className="mt-1 text-sm text-muted-foreground/60">文章正在加紧撰写中，请稍后再来</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Featured / Latest Article */}
                {latestArticle && (
                  <Link
                    href={`/articles/${latestArticle.slug}`}
                    className="group relative block overflow-hidden rounded-xl border border-border/60 transition-all hover:border-gold/20 hover:shadow-lg"
                  >
                    <div className="grid md:grid-cols-2">
                      <div className="relative aspect-[16/10] md:aspect-auto">
                        {latestArticle.coverImage ? (
                          <Image
                            src={latestArticle.coverImage}
                            alt={latestArticle.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                            priority
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-gold/10">
                            <BookOpen className="h-16 w-16 text-gold/30" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center p-6 lg:p-8">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-gold/10 text-gold-dark hover:bg-gold/20">最新</Badge>
                          {latestArticle.category && (
                            <Badge variant="secondary" className="text-[10px]">
                              {latestArticle.category.name}
                            </Badge>
                          )}
                        </div>
                        <h2 className="mt-3 text-2xl font-bold group-hover:text-gold transition-colors">
                          {latestArticle.title}
                        </h2>
                        {latestArticle.excerpt && (
                          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                            {latestArticle.excerpt}
                          </p>
                        )}
                        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                          {latestArticle.publishedAt && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(latestArticle.publishedAt)}
                            </span>
                          )}
                          {latestArticle.author && (
                            <span>{latestArticle.author}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Article Grid */}
                {remainingArticles.length > 0 && (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {remainingArticles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                )}

                {remainingArticles.length === 0 && latestArticle && (
                  <p className="text-center text-sm text-muted-foreground">
                    更多文章即将发布
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function ArticleCard({
  article,
}: {
  article: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    coverImage: string | null
    author: string | null
    publishedAt: Date | null
    category: { name: string; slug: string } | null
    tags: { tag: { name: string; slug: string } }[]
  }
}) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all hover:border-gold/30 hover:shadow-md hover:bg-card/80"
    >
      {/* Cover */}
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
            <BookOpen className="h-10 w-10 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          {article.category && (
            <Badge variant="secondary" className="text-[10px]">
              {article.category.name}
            </Badge>
          )}
        </div>
        <h3 className="mt-2 line-clamp-2 text-base font-semibold group-hover:text-gold transition-colors">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
        )}
        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {article.publishedAt && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(article.publishedAt)}
              </span>
            )}
            {article.author && <span>{article.author}</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}
