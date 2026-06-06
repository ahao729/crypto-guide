import { prisma } from "@/lib/prisma"
import type { Metadata } from "next"
import { siteConfig } from "@/lib/constants"
import { HelpCircle } from "lucide-react"
import { FAQClient } from "./FAQClient"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: `常见问题解答 | ${siteConfig.shortName}`,
  description: "关于加密货币交易所注册、充值、交易、提现的常见问题解答，帮助您快速解决使用中遇到的问题。",
  keywords: ["加密货币常见问题", "交易所FAQ", "数字货币问答", "区块链问题解答", "交易所注册教程", "加密货币入门问题", "交易平台选择"],
  openGraph: {
    title: `常见问题解答 | ${siteConfig.shortName}`,
    description: "关于加密货币交易所注册、充值、交易、提现的常见问题解答。",
    url: `${siteConfig.url}/faq`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `常见问题解答 | ${siteConfig.shortName}`,
    description: "关于加密货币交易所注册、充值、交易、提现的常见问题解答。",
  },
  alternates: {
    canonical: `${siteConfig.url}/faq`,
  },
}

export default async function FAQPage() {
  const faqs = await prisma.fAQ.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  })

  // Group FAQs by category
  const grouped = faqs.reduce(
    (acc, faq) => {
      const category = faq.category || "通用"
      if (!acc[category]) acc[category] = []
      acc[category].push(faq)
      return acc
    },
    {} as Record<string, typeof faqs>
  )

  const totalFAQs = faqs.length

  // Build FAQPage JSON-LD
  const faqPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return (
    <div className="min-h-screen">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }}
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
                name: "常见问题",
                item: `${siteConfig.url}/faq`,
              },
            ],
          }),
        }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/[0.08] via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              常见问题
              <span className="text-gradient-gold ml-2">FAQ</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              关于加密货币交易所的常见问题解答，帮助您快速上手
            </p>
          </div>

          {/* Stats */}
          <div className="mt-10 flex justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-gold">{totalFAQs}</div>
              <div className="text-sm text-muted-foreground">收录问题</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold">{Object.keys(grouped).length}</div>
              <div className="text-sm text-muted-foreground">问题分类</div>
            </div>
          </div>

        </div>
      </section>

      <FAQClient grouped={grouped} totalFAQs={totalFAQs} />
    </div>
  )
}
