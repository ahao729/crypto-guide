import { prisma } from "@/lib/prisma"
import type { Metadata } from "next"
import { siteConfig } from "@/lib/constants"
import { ResourcesClient } from "./ResourcesClient"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: `免费学习资源下载 | ${siteConfig.shortName}`,
  description: "提供加密货币新手入门教程、投资记录模板、实用工具和精选学习资源，免费下载助您快速入门加密世界。",
  keywords: ["加密货币资源", "区块链教程", "免费下载", "新手入门", "投资模板", "学习资料", "加密货币工具"],
  openGraph: {
    title: `免费学习资源下载 | ${siteConfig.shortName}`,
    description: "提供加密货币新手入门教程、投资记录模板、实用工具和精选学习资源，免费下载助您快速入门加密世界。",
    url: `${siteConfig.url}/resources`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `免费学习资源下载 | ${siteConfig.shortName}`,
    description: "提供加密货币新手入门教程、投资记录模板、实用工具和精选学习资源，免费下载助您快速入门加密世界。",
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

  return (
    <ResourcesClient
      categoryGroups={categoryGroups}
      totalDownloads={totalDownloads}
      totalCount={totalCount}
    />
  )
}
