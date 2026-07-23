import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { siteConfig } from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${baseUrl}/articles`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/exchanges`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/resources`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
  ]

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

  return [...staticPages, ...articlePages, ...exchangePages, ...categoryPages, ...resourcePages]
}
