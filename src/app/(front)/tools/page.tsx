import type { Metadata } from "next"
import { siteConfig } from "@/lib/constants"
import { ToolsPageClient } from "./client"

export const metadata: Metadata = {
  title: `实用工具 - ${siteConfig.name}`,
  description:
    "合约收益计算器、定投计算器、币种汇率转换、K线图分析、手续费对比等加密货币实用工具，助力交易决策",
  keywords: [
    "加密货币工具",
    "合约收益计算器",
    "定投计算器",
    "币种汇率转换",
    "K线图分析",
    "手续费对比",
    "加密计算器",
    "交易工具",
  ],
  openGraph: {
    title: `实用工具 - ${siteConfig.name}`,
    description:
      "合约收益计算器、定投计算器、币种汇率转换、K线图分析、手续费对比等加密货币实用工具",
    type: "website",
    url: `${siteConfig.url}/tools`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: `实用工具 - ${siteConfig.name}`,
    description:
      "合约收益计算器、定投计算器、币种汇率转换、K线图分析、手续费对比等加密货币实用工具",
  },
  alternates: {
    canonical: `${siteConfig.url}/tools`,
  },
}

const toolsJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: `实用工具 - ${siteConfig.name}`,
  description:
    "合约收益计算器、定投计算器、币种汇率转换、K线图分析、手续费对比等加密货币实用工具",
  url: `${siteConfig.url}/tools`,
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${siteConfig.url}/tools`,
  },
}

const toolsBreadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "首页", item: siteConfig.url },
    {
      "@type": "ListItem",
      position: 2,
      name: "实用工具",
      item: `${siteConfig.url}/tools`,
    },
  ],
}

export default function ToolsPage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolsBreadcrumbJsonLd) }}
      />

      {/* ──────────── Hero ──────────── */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/[0.08] via-transparent to-transparent" />
        <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-gold/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-gold-dark shadow-lg shadow-gold/20">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              实用
              <span className="text-gradient-gold ml-2">工具</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
               交易计算、定投模拟、汇率换算、费率对比——一站式加密工具集，助您智慧交易
            </p>
          </div>
        </div>
      </section>

      <ToolsPageClient />

      {/* ──────────── Suggestion CTA ──────────── */}
      <section className="border-t border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">需要其他工具？</h2>
          <p className="mt-2 text-muted-foreground">
            告诉我们您需要的工具，我们会尽快为您开发
          </p>
          <a
            href="mailto:suggest@crypto-guide.com"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-gradient-gold px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-gold/20 transition-opacity hover:opacity-90"
          >
            提交建议
          </a>
        </div>
      </section>
    </div>
  )
}
