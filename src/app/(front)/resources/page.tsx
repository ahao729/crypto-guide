import type { Metadata } from "next"
import { siteConfig } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import {
  Download,
  FileText,
  Table,
  ExternalLink,
  BookOpen,
  Wrench,
  TrendingUp,
  Shield,
  LineChart,
  Zap,
  Globe,
  Wallet,
  Layers,
  Database,
  BarChart3,
  Users,
  Star,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

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

// ── Data ──

interface ResourceItem {
  label: string
  href: string
  size?: string
  downloads?: number
  tags?: string[]
  external?: boolean
}

interface ResourceCategory {
  icon: React.ElementType
  title: string
  description: string
  gradient: string
  items: ResourceItem[]
}

const resourceCategories: ResourceCategory[] = [
  {
    icon: BookOpen,
    title: "新手入门包",
    description: "从零开始学习加密货币的基础知识、钱包创建、交易所注册等指南",
    gradient: "from-blue-500/20 via-blue-500/5 to-transparent",
    items: [
      {
        label: "加密货币入门指南（PDF）",
        href: "https://drive.google.com/uc?export=download&id=1-sample-crypto-guide",
        size: "2.4 MB",
        downloads: 15230,
        tags: ["新手必读", "PDF"],
      },
      {
        label: "主流交易所注册教程",
        href: "https://drive.google.com/uc?export=download&id=1-sample-exchange-guide",
        size: "1.8 MB",
        downloads: 9870,
        tags: ["教程", "PDF"],
      },
      {
        label: "钱包安全使用手册",
        href: "https://drive.google.com/uc?export=download&id=1-sample-wallet-guide",
        size: "3.1 MB",
        downloads: 7650,
        tags: ["安全", "钱包"],
      },
      {
        label: "区块链技术白皮书导读",
        href: "https://drive.google.com/uc?export=download&id=1-sample-whitepaper",
        size: "4.2 MB",
        downloads: 5430,
        tags: ["进阶", "PDF"],
      },
    ],
  },
  {
    icon: Table,
    title: "交易模板",
    description: "专业的交易记录表格、仓位管理模板和策略复盘工具",
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    items: [
      {
        label: "交易记录模板（Excel）",
        href: "https://drive.google.com/uc?export=download&id=1-sample-trading-log",
        size: "0.6 MB",
        downloads: 21300,
        tags: ["Excel", "热门"],
      },
      {
        label: "仓位管理计算表",
        href: "https://drive.google.com/uc?export=download&id=1-sample-position-size",
        size: "0.8 MB",
        downloads: 12800,
        tags: ["Excel", "风控"],
      },
      {
        label: "交易复盘日志模板",
        href: "https://drive.google.com/uc?export=download&id=1-sample-journal",
        size: "0.4 MB",
        downloads: 8920,
        tags: ["Notion", "复盘"],
      },
      {
        label: "DCA 定投计划表",
        href: "https://drive.google.com/uc?export=download&id=1-sample-dca-plan",
        size: "0.3 MB",
        downloads: 6310,
        tags: ["Excel", "定投"],
      },
    ],
  },
  {
    icon: Wrench,
    title: "推荐工具",
    description: "精选的加密货币实用工具，提升您的交易和分析效率",
    gradient: "from-purple-500/20 via-purple-500/5 to-transparent",
    items: [
      {
        label: "CoinGecko — 行情追踪",
        href: "https://www.coingecko.com",
        tags: ["网站", "免费"],
        external: true,
        downloads: 50000,
      },
      {
        label: "TradingView — 专业图表",
        href: "https://www.tradingview.com",
        tags: ["网站", "图表"],
        external: true,
        downloads: 45000,
      },
      {
        label: "Dune — 链上数据分析",
        href: "https://dune.com",
        tags: ["网站", "链上"],
        external: true,
        downloads: 32000,
      },
      {
        label: "Etherscan — Gas 费监控",
        href: "https://etherscan.io/gastracker",
        tags: ["网站", "Gas"],
        external: true,
        downloads: 28000,
      },
      {
        label: "DefiLlama — DeFi 数据",
        href: "https://defillama.com",
        tags: ["网站", "DeFi"],
        external: true,
        downloads: 21000,
      },
      {
        label: "Messari — 研究报告",
        href: "https://messari.io",
        tags: ["网站", "研究"],
        external: true,
        downloads: 15000,
      },
    ],
  },
  {
    icon: ExternalLink,
    title: "实用链接",
    description: "各大交易所、钱包、区块浏览器等常用链接汇总",
    gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
    items: [
      {
        label: "全球主流交易所导航",
        href: "/exchanges",
        tags: ["本站"],
      },
      {
        label: "区块浏览器汇总",
        href: "https://www.blockchain.com/explorer",
        tags: ["网站", "区块链"],
        external: true,
        downloads: 18000,
      },
      {
        label: "DeFi 项目推荐",
        href: "https://defillama.com",
        tags: ["网站", "DeFi"],
        external: true,
        downloads: 14000,
      },
      {
        label: "优质加密博客推荐",
        href: "https://www.theblock.co",
        tags: ["网站", "资讯"],
        external: true,
        downloads: 12000,
      },
    ],
  },
]

// ── Icon colors map ──

const iconStyles: Record<string, string> = {
  "from-blue-500/20": "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  "from-emerald-500/20": "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  "from-purple-500/20": "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  "from-amber-500/20": "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
}

function getIconStyle(gradient: string): string {
  const key = gradient.split(" ")[0]
  return iconStyles[key] || iconStyles["from-blue-500/20"]
}

function formatDownloads(count: number): string {
  if (count >= 10000) return (count / 10000).toFixed(1) + "万"
  if (count >= 1000) return (count / 1000).toFixed(1) + "k"
  return count.toString()
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

export default function ResourcesPage() {
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

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/[0.08] via-transparent to-transparent" />
        <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-gold/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-amber-500 shadow-lg shadow-gold/20">
              <Download className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              资源
              <span className="text-gradient-gold ml-2">下载</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              PDF 教程、交易模板、实用工具——高质量加密资源，助您快速成长
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="mx-auto max-w-7xl px-4 -mt-6 sm:px-6 lg:px-8">
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-6 rounded-xl border border-border/60 bg-card/80 p-5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm">
            <Download className="h-4 w-4 text-gold-dark dark:text-gold-light" />
            <span className="text-muted-foreground">总下载量:</span>
            <span className="font-semibold">28.6 万+</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-blue-500" />
            <span className="text-muted-foreground">资源数量:</span>
            <span className="font-semibold">18 项</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Star className="h-4 w-4 text-amber-500" />
            <span className="text-muted-foreground">热门资源:</span>
            <span className="font-semibold">交易记录模板</span>
          </div>
        </div>
      </section>

      {/* ── Resource Categories ── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {resourceCategories.map((cat) => (
            <div
              key={cat.title}
              className="group relative overflow-hidden rounded-xl border border-border/60 bg-card transition-all hover:shadow-md"
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-60`} />

              <div className="relative p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${getIconStyle(cat.gradient)} transition-transform group-hover:scale-105`}
                  >
                    <cat.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{cat.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <ul className="mt-5 space-y-2.5">
                  {cat.items.map((item) => (
                    <li key={item.label}>
                      {item.href.startsWith("/") ? (
                        <Link
                          href={item.href}
                          className="flex items-center justify-between gap-3 rounded-lg border border-border/40 bg-muted/20 px-4 py-3 transition-colors hover:bg-muted/40"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="font-medium text-sm truncate">
                              {item.label}
                            </span>
                            {item.tags?.map((tag) => (
                              <span
                                key={tag}
                                className="hidden shrink-0 rounded-md bg-muted-foreground/10 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex shrink-0 items-center gap-3">
                            {item.downloads && (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Download className="h-3 w-3" />
                                {formatDownloads(item.downloads)}
                              </span>
                            )}
                            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </Link>
                      ) : (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-3 rounded-lg border border-border/40 bg-muted/20 px-4 py-3 transition-colors hover:bg-muted/40"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="font-medium text-sm truncate">
                              {item.label}
                            </span>
                            {item.tags?.map((tag) => (
                              <span
                                key={tag}
                                className="hidden shrink-0 rounded-md bg-muted-foreground/10 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block"
                              >
                                {tag}
                              </span>
                            ))}
                            {item.external && (
                              <ExternalLink className="hidden h-3 w-3 shrink-0 text-muted-foreground sm:inline-block" />
                            )}
                          </div>
                          <div className="flex shrink-0 items-center gap-3">
                            {item.downloads && (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Download className="h-3 w-3" />
                                {formatDownloads(item.downloads)}
                              </span>
                            )}
                            {item.size && (
                              <span className="text-xs text-muted-foreground">
                                {item.size}
                              </span>
                            )}
                            {item.external ? (
                              <ExternalLink className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                            ) : (
                              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                            )}
                          </div>
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">没有找到需要的资源？</h2>
          <p className="mt-2 text-muted-foreground">
            告诉我们您需要的资源，我们会尽快为您整理上传
          </p>
          <a
            href="mailto:resources@bqzn.top"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-gradient-gold px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-gold/20 transition-opacity hover:opacity-90"
          >
            请求资源
          </a>
        </div>
      </section>
    </div>
  )
}
