import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next"
import { siteConfig, exchangeCategories } from "@/lib/constants";
import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"
import { Clock, ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: `专业的加密货币交易所评测与推荐 | ${siteConfig.shortName}`,
  description: siteConfig.description,
  keywords: ["加密货币交易所", "数字货币平台", "比特币交易", "交易所推荐", "币圈指南", "交易所评测", "加密货币投资", "OKX", "币安"],
  openGraph: {
    title: `专业的加密货币交易所评测与推荐 | ${siteConfig.shortName}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `专业的加密货币交易所评测与推荐 | ${siteConfig.shortName}`,
    description: siteConfig.description,
  },
  alternates: {
    canonical: siteConfig.url,
  },
}

export default async function Home() {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    description: siteConfig.description,
    url: siteConfig.url,
    inLanguage: siteConfig.locale,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/exchanges?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  const [latestArticles, rawSettings] = await Promise.all([
    prisma.article.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 6,
      select: {
        title: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
        category: { select: { name: true, slug: true } },
      },
    }),
    prisma.siteSetting.findMany(),
  ])

  const settingsMap = Object.fromEntries(
    rawSettings.map((s) => [s.key, s.value])
  )

  return (
    <div className="animate-fade-in">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-crypto">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-gold/5 blur-3xl" />
          <div className="absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-gold-light/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 sm:pb-28 sm:pt-36 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 text-xs font-medium text-gold-dark">
              最新加密交易所评测与推荐
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              发现最适合你的
              <span className="text-gradient-gold">加密货币交易所</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/exchanges"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-gold px-8 text-sm font-semibold text-white shadow-lg shadow-gold/20 transition-all hover:shadow-xl hover:shadow-gold/30 hover:brightness-110"
              >
                浏览交易所
              </Link>
              <Link
                href="/articles"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-8 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                阅读指南
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features / Stats Section */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/50 bg-card p-8 text-center shadow-sm transition-shadow hover:shadow-md">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">{settingsMap.stat_exchanges || "15"}+</h3>
              <p className="mt-1 text-sm text-muted-foreground">精选交易所评测</p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card p-8 text-center shadow-sm transition-shadow hover:shadow-md">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">{settingsMap.stat_articles || "50"}+</h3>
              <p className="mt-1 text-sm text-muted-foreground">深度教程与指南</p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card p-8 text-center shadow-sm transition-shadow hover:shadow-md">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">{settingsMap.stat_users || "10,000"}+</h3>
              <p className="mt-1 text-sm text-muted-foreground">活跃社区用户</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      {latestArticles.length > 0 && (
        <section className="section-padding border-t border-border/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">最新文章</h2>
              <p className="mt-3 text-muted-foreground">最新的加密货币行业资讯、教程与深度分析</p>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="group rounded-xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-gold/30"
                >
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {article.category && (
                      <span className="rounded-full bg-gold/10 px-2.5 py-0.5 text-gold-dark font-medium">
                        {article.category.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(article.publishedAt)}
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-semibold leading-snug group-hover:text-gold transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="mt-4 flex items-center text-xs font-medium text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                    阅读更多 <ArrowRight className="ml-1 h-3 w-3" />
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/articles"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                查看全部文章 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Category Section */}
      <section className="section-padding border-t border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">按分类浏览交易所</h2>
            <p className="mt-3 text-muted-foreground">无论你是新手还是专业交易者，都能找到适合你的平台</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {exchangeCategories
              .filter((c) => c.value !== "all")
              .map((category) => (
                <Link
                  key={category.value}
                  href={`/exchanges?category=${category.value}`}
                  className="group rounded-xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:border-gold/30 hover:shadow-md"
                >
                  <h3 className="font-semibold text-foreground group-hover:text-gold-dark">{category.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">查看推荐平台 &rarr;</p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">准备好开始了吗？</h2>
            <p className="mt-3 text-muted-foreground">加入数万用户，发现最适合你的交易平台</p>
            <div className="mt-8">
              <Link
                href="/exchanges"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-gold px-10 text-sm font-semibold text-white shadow-lg shadow-gold/20 transition-all hover:shadow-xl hover:shadow-gold/30 hover:brightness-110"
              >
                立即开始
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
