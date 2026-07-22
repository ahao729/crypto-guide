import type { Metadata } from "next"
import { siteConfig } from "@/lib/constants"
import { prisma } from "@/lib/prisma"
import { ResourcesClient } from "./ResourcesClient"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: `资源下载 - ${siteConfig.name}`,
  description:
    "加密货币新手入门教程 PDF、交易所注册指南、钱包安全手册、交易记录模板、仓位管理计算表、链上分析工具、Gas 费监控工具等资源免费下载",
  keywords: [
    "加密货币资源下载",
    "区块链新手入门PDF",
    "交易所注册教程",
    "钱包安全指南",
    "交易记录模板 Excel",
    "仓位管理计算表",
    "链上分析工具推荐",
    "加密货币学习资料",
    "数字货币教程",
  ],
  openGraph: {
    title: `资源下载 - ${siteConfig.name}`,
    description:
      "新手教程 PDF、交易模板、实用工具、优秀文章等加密货币资源免费下载",
    type: "website",
    url: `${siteConfig.url}/resources`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: `资源下载 - ${siteConfig.name}`,
    description:
      "新手教程 PDF、交易模板、实用工具、优秀文章等加密货币资源免费下载",
  },
  alternates: {
    canonical: `${siteConfig.url}/resources`,
  },
}

const resourcesJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: `资源下载 - ${siteConfig.name}`,
  description: "加密货币新手入门包、交易模板、实用工具推荐等资源免费下载",
  url: `${siteConfig.url}/resources`,
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "首页", item: siteConfig.url },
    {
      "@type": "ListItem",
      position: 2,
      name: "资源下载",
      item: `${siteConfig.url}/resources`,
    },
  ],
}

export default async function ResourcesPage() {
  // Server-side: fetch published resources from database
  const resources = await prisma.resource.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  })

  // Group by category
  const categoryGroups: Record<string, typeof resources> = {}
  for (const r of resources) {
    if (!categoryGroups[r.category]) {
      categoryGroups[r.category] = []
    }
    categoryGroups[r.category].push(r)
  }

  const totalDownloads = resources.reduce((sum, r) => sum + r.downloadCount, 0)

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(resourcesJsonLd) }}
      />

      <ResourcesClient
        categoryGroups={categoryGroups}
        totalDownloads={totalDownloads}
        totalCount={resources.length}
      />
    </div>
  )
}
