import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { siteConfig } from '@/lib/constants'
import { ecosystemBrands } from '@/lib/ecosystem'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url

  // Static pages. No `lastModified: new Date()` here: a timestamp that changes
  // on every request is not a real content-update signal.
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/articles`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/exchanges`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/exchange-ranking`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/stocks`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/trends`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/ecosystem`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/methodology`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/ai`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/compare/binance-vs-okx`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tools`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/faq`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/resources`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/options`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/contact`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/disclosure`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/terms`, changeFrequency: 'yearly', priority: 0.2 },
  ]

  // Calculator/tool pages are evergreen link magnets; they were missing from
  // the sitemap entirely.
  const toolPages: MetadataRoute.Sitemap = [
    '/tools/coin-info',
    '/tools/converter',
    '/tools/dca-calculator',
    '/tools/dca-index',
    '/tools/fee-comparison',
    '/tools/grid-calculator',
    '/tools/kline',
    '/tools/kline-patterns',
    '/tools/options-calculator',
    '/tools/profit-calculator',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const brandPages = ecosystemBrands.map((brand) => ({
    url: `${baseUrl}/ecosystem/${brand.category}/${brand.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Dynamic article pages
  const articles = await prisma.article.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true, publishedAt: true },
  })
  const articlePages = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: article.updatedAt || article.publishedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Dynamic exchange pages
  const exchanges = await prisma.exchange.findMany({
    where: { status: 'active' },
    select: { slug: true, updatedAt: true },
  })
  const exchangePages = exchanges.map((exchange) => ({
    url: `${baseUrl}/exchanges/${exchange.slug}`,
    lastModified: exchange.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Category pages
  const categories = await prisma.category.findMany({
    select: { slug: true, updatedAt: true },
  })
  const categoryPages = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: cat.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Resource pages
  const resources = await prisma.resource.findMany({
    select: { slug: true, updatedAt: true },
  })
  const resourcePages = resources.map((res) => ({
    url: `${baseUrl}/resources/${res.slug}`,
    lastModified: res.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [
    ...staticPages,
    ...toolPages,
    ...brandPages,
    ...articlePages,
    ...exchangePages,
    ...categoryPages,
    ...resourcePages,
  ]
}
