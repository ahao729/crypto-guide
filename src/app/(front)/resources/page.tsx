import { prisma } from "@/lib/prisma"
import type { Metadata } from "next"
import { siteConfig } from "@/lib/constants"
import { ResourcesClient } from "./ResourcesClient"

export const revalidate = 900 // 15 minutes

export const metadata: Metadata = {
  title: `免费资源库：加密货币教程、Excel 模板与工具 | ${siteConfig.shortName}`,
  description: "免费阅读加密货币入门、交易所与链上分析教程，下载交易记录、仓位管理、DCA 定投 Excel 模板，另有行情与图表工具。",
  keywords: ["加密货币资源", "区块链教程", "免费下载", "Excel 模板", "交易记录模板", "仓位管理", "DCA 定投", "加密货币工具"],
  openGraph: {
    title: `免费资源库：加密货币教程、Excel 模板与工具 | ${siteConfig.shortName}`,
    description: "免费阅读加密货币入门、交易所与链上分析教程，下载交易记录、仓位管理、DCA 定投 Excel 模板，另有行情与图表工具。",
    url: `${siteConfig.url}/resources`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `免费资源库：加密货币教程、Excel 模板与工具 | ${siteConfig.shortName}`,
    description: "免费阅读加密货币入门、交易所与链上分析教程，下载交易记录、仓位管理、DCA 定投 Excel 模板，另有行情与图表工具。",
  },
  alternates: {
    canonical: `${siteConfig.url}/resources`,
  },
}

export default async function ResourcesPage() {
  // 从数据库获取所有已发布资源，按分类和排序字段分组
  const resources = await prisma.resource.findMany({
    where: { published: true },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  })

  // 按分类分组
  const categoryGroups: Record<string, typeof resources> = {}
  for (const resource of resources) {
    const cat = resource.category || "other"
    if (!categoryGroups[cat]) categoryGroups[cat] = []
    categoryGroups[cat].push(resource)
  }

  const totalDownloads = resources.reduce((sum, r) => sum + r.downloadCount, 0)
  const totalCount = resources.length

  const resourcesJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `免费资源库 - ${siteConfig.name}`,
    description:
      "加密货币教程、Excel 模板与实用工具，免费阅读和下载。",
    url: `${siteConfig.url}/resources`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: totalCount,
      itemListElement: resources.map((resource, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: resource.title,
        url: `${siteConfig.url}/resources/${resource.slug}`,
      })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(resourcesJsonLd) }}
      />
      <ResourcesClient
        categoryGroups={categoryGroups}
        totalDownloads={totalDownloads}
        totalCount={totalCount}
      />
    </>
  )
}
