import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { siteConfig } from "@/lib/constants"
import { ArrowLeft, Clock, User, Calendar } from "lucide-react"
import { processArticleHtml, estimateReadingTime } from "@/lib/article-utils"
import ArticleContent from "@/components/front/ArticleContent"
import ReadingProgress from "@/components/front/ReadingProgress"
import TableOfContents from "@/components/front/TableOfContents"
import ShareSection from "@/components/front/ShareSection"
import ArticleNavigation from "@/components/front/ArticleNavigation"

export const dynamic = "force-dynamic"

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await prisma.article.findUnique({
    where: { slug },
    select: { title: true, excerpt: true, coverImage: true, author: true, publishedAt: true, updatedAt: true },
  })

  if (!article) {
    return { title: "文章未找到" }
  }

  const title = article.title
  const description = article.excerpt?.slice(0, 160) || `${article.title} - 详细教程与指南`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt?.toISOString() || article.publishedAt?.toISOString(),
      authors: article.author ? [article.author] : undefined,
      images: article.coverImage ? [{ url: article.coverImage }] : undefined,
      url: `${siteConfig.url}/articles/${slug}`,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: article.coverImage ? [article.coverImage] : undefined,
    },
    alternates: {
      canonical: `${siteConfig.url}/articles/${slug}`,
    },
  }
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: {
        include: { tag: true },
      },
    },
  })

  if (!article || !article.published) {
    notFound()
  }

  // Process article content: markdown → HTML + heading IDs + TOC
  const { html: processedContent, headings } = article.content
    ? await processArticleHtml(article.content)
    : { html: "", headings: [] }

  const readingTime = article.content ? estimateReadingTime(processedContent) : 1

  // Fetch previous and next articles
  const prevArticle = article.publishedAt
    ? await prisma.article.findFirst({
        where: {
          published: true,
          publishedAt: { lt: article.publishedAt },
        },
        orderBy: { publishedAt: "desc" },
        select: { slug: true, title: true },
      })
    : null

  const nextArticle = article.publishedAt
    ? await prisma.article.findFirst({
        where: {
          published: true,
          publishedAt: { gt: article.publishedAt },
        },
        orderBy: { publishedAt: "asc" },
        select: { slug: true, title: true },
      })
    : null

  // Fetch related articles
  const relatedArticles = await prisma.article.findMany({
    where: {
      published: true,
      id: { not: article.id },
      ...(article.categoryId ? { categoryId: article.categoryId } : {}),
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  })

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.excerpt || undefined,
            keywords: article.tags.map(({ tag }) => tag.name).join(", ") || undefined,
            author: article.author ? { "@type": "Person", name: article.author } : undefined,
            datePublished: article.publishedAt?.toISOString(),
            dateModified: article.updatedAt?.toISOString() || article.publishedAt?.toISOString(),
            image: article.coverImage || undefined,
            publisher: {
              "@type": "Organization",
              name: siteConfig.name,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${siteConfig.url}/articles/${slug}`,
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
              {
                "@type": "ListItem",
                position: 1,
                name: "首页",
                item: siteConfig.url,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "文章",
                item: `${siteConfig.url}/articles`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: article.title,
                item: `${siteConfig.url}/articles/${slug}`,
              },
            ],
          }),
        }}
      />

      {/* Reading progress bar - full width fixed top */}
      <ReadingProgress />

      <div className="min-h-screen">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <div className="pt-8">
            <Link
              href="/articles"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-gold"
            >
              <ArrowLeft className="h-4 w-4" />
              返回文章列表
            </Link>
          </div>

          <div className="py-8">
            {/* Article Header - centered reading width */}
            <header className="mx-auto max-w-3xl">
              <div className="flex items-center gap-2">
                {article.category && (
                  <Badge variant="secondary">{article.category.name}</Badge>
                )}
              </div>
              <h1 className="mt-4 text-3xl font-bold leading-relaxed sm:text-4xl lg:text-5xl">
                {article.title}
              </h1>
              {article.excerpt && (
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  {article.excerpt}
                </p>
              )}

              {/* Meta */}
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {article.author && (
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    {article.author}
                  </span>
                )}
                {article.publishedAt && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {formatDate(article.publishedAt)}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  阅读约 {readingTime} 分钟
                </span>
              </div>
            </header>

            {/* Cover Image - constrained width */}
            {article.coverImage && (
              <div className="mt-8 overflow-hidden rounded-xl max-w-4xl mx-auto">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  width={1200}
                  height={675}
                  className="w-full object-cover"
                  priority
                />
              </div>
            )}

            {/* Main Content: TOC sidebar + Article (flex layout) */}
            <div className="mt-10 flex gap-12">
              {/* TOC Sidebar (Desktop) */}
              {headings.length > 0 && (
                <aside className="hidden lg:block w-56 shrink-0">
                  <div className="toc-container">
                    <TableOfContents headings={headings} />
                  </div>
                </aside>
              )}

              {/* Article Content - optimal reading width */}
              <div className="min-w-0 flex-1 max-w-4xl">
                <article>
                  {article.content ? (
                    <ArticleContent html={processedContent} />
                  ) : (
                    <p className="text-muted-foreground">文章内容正在编辑中...</p>
                  )}

                  {/* Tags */}
                  {article.tags.length > 0 && (
                    <div className="mt-10 flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">标签：</span>
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map(({ tag }) => (
                          <Link
                            key={tag.id}
                            href={`/articles?tag=${tag.slug}`}
                            className="rounded-full border border-border/60 px-3 py-1 text-xs transition-colors hover:border-gold/40 hover:text-gold"
                          >
                            {tag.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Share Section */}
                  <ShareSection title={article.title} />

                  {/* Previous / Next Article Navigation */}
                  <ArticleNavigation prev={prevArticle} next={nextArticle} />
                </article>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold">相关文章</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/articles/${related.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all hover:border-border hover:shadow-md"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    {related.coverImage ? (
                      <Image
                        src={related.coverImage}
                        alt={related.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-4xl font-bold text-gradient-gold">
                          {related.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="line-clamp-2 font-semibold group-hover:text-gold transition-colors">
                      {related.title}
                    </h3>
                    {related.excerpt && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {related.excerpt}
                      </p>
                    )}
                    <div className="mt-3 text-xs text-muted-foreground">
                      {related.publishedAt && formatDate(related.publishedAt)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
