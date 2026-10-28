import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight, CheckCircle2, ExternalLink, ShieldCheck } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { siteConfig } from "@/lib/constants"
import { AFFILIATE_DISCLOSURE } from "@/lib/affiliates"
import { StarRating } from "@/components/front/StarRating"
import { ExchangeCtaLink } from "@/components/front/ExchangeCtaLink"
import { formatDate, toFiveStarRating } from "@/lib/utils"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Bybit vs Bitget：2026 合约费率、跟单与适合人群对比",
  description:
    "Bybit 和 Bitget 怎么选？对比现货/合约费率、跟单交易、产品体验、适合人群与风险，附 2026 标准费率和注册入口。",
  keywords: [
    "Bybit vs Bitget",
    "Bybit 和 Bitget 哪个好",
    "Bybit 合约费率",
    "Bitget 跟单",
    "Bitget 手续费",
    "交易所对比",
  ],
  openGraph: {
    title: "Bybit vs Bitget：2026 合约费率、跟单与适合人群对比",
    description: "从合约费率、跟单、产品体验和风险四个维度对比 Bybit 与 Bitget。",
    url: `${siteConfig.url}/compare/bybit-vs-bitget`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bybit vs Bitget：2026 合约费率、跟单与适合人群对比",
    description: "从合约费率、跟单、产品体验和风险四个维度对比 Bybit 与 Bitget。",
  },
  alternates: {
    canonical: `${siteConfig.url}/compare/bybit-vs-bitget`,
  },
}

const faqs = [
  {
    q: "Bybit 和 Bitget 哪个手续费更低？",
    a: "标准现货两家都约 0.10%；合约 Bybit 约 Maker 0.01%/Taker 0.06%，Bitget 约 Maker 0.02%/Taker 0.06%。Bybit 的 Maker 更低，但实际成本还要看 VIP、活动、平台币抵扣和你的 Maker/Taker 比例。",
  },
  {
    q: "想跟单，选 Bybit 还是 Bitget？",
    a: "两家都有跟单/复制交易。Bitget 的跟单生态和交易员筛选更集中；Bybit 的衍生品体验和系统稳定性更强。跟单都会同步亏损，先看最大回撤、仓位和费率。",
  },
  {
    q: "Bybit 适合新手吗？",
    a: "如果只做现货可以了解；合约和跟单不适合作为第一站。先小额熟悉强平、资金费率和下单规则。",
  },
  {
    q: "Bitget 适合合约吗？",
    a: "可以，但 Bitget 的标准合约 Taker 与 Bybit 相同，优势更多在跟单/策略生态，而不是费率最低。",
  },
]

export default async function BybitVsBitgetPage() {
  const exchanges = await prisma.exchange.findMany({
    where: { slug: { in: ["bybit", "bitget"] }, status: "active" },
    include: { category: true },
  })
  const bybit = exchanges.find((exchange) => exchange.slug === "bybit")
  const bitget = exchanges.find((exchange) => exchange.slug === "bitget")
  const lastUpdated =
    exchanges
      .map((exchange) => exchange.updatedAt)
      .sort((a, b) => b.getTime() - a.getTime())[0] ?? new Date()

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "交易所对比", item: `${siteConfig.url}/exchanges` },
      {
        "@type": "ListItem",
        position: 3,
        name: "Bybit vs Bitget",
        item: `${siteConfig.url}/compare/bybit-vs-bitget`,
      },
    ],
  }

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="mx-auto max-w-4xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <Link
          href="/exchanges"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-gold"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          返回交易所对比
        </Link>

        <header className="mt-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold-dark">
            <ShieldCheck className="h-3.5 w-3.5" />
            2026 编辑对比 · 含联盟链接
          </div>
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
            Bybit vs Bitget：合约费率、跟单与适合人群
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            两家都以衍生品和跟单见长，但侧重点不同：Bybit 更偏交易执行和合约体验，
            Bitget 更偏跟单/策略生态。下面把费率、产品和风险拆开看。
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            最后更新：{formatDate(lastUpdated)} · 费率以官方页面为准
          </p>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gold/30 bg-gradient-to-b from-gold/[0.06] to-card p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold">合约执行：Bybit</h2>
              <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] text-gold-dark">合作</span>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                标准合约 Maker 0.01%，低于 Bitget 的 0.02%
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                衍生品工具、盘口和下单体验更成熟
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                邀请码 BQZN1
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold">跟单/策略：Bitget</h2>
              <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] text-gold-dark">合作</span>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                跟单生态和交易员筛选更集中
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                现货/合约产品齐全，BGB 活动较多
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                邀请码 X7QCEV4X
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">手续费对比</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            标准用户基础费率；VIP、平台币抵扣和活动会改变实际费率。
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border/60">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">项目</th>
                  <th className="px-4 py-3 font-medium">Bybit</th>
                  <th className="px-4 py-3 font-medium">Bitget</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                <tr>
                  <td className="px-4 py-3 text-muted-foreground">现货 Maker / Taker</td>
                  <td className="px-4 py-3">{bybit?.spotFee ?? "Maker 0.10% / Taker 0.10%"}</td>
                  <td className="px-4 py-3">{bitget?.spotFee ?? "Maker 0.10% / Taker 0.10%"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-muted-foreground">合约 Maker / Taker</td>
                  <td className="px-4 py-3">{bybit?.futuresFee ?? "Maker 0.01% / Taker 0.06%"}</td>
                  <td className="px-4 py-3">{bitget?.futuresFee ?? "Maker 0.02% / Taker 0.06%"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-muted-foreground">平台币/活动</td>
                  <td className="px-4 py-3">活动与 VIP 体系</td>
                  <td className="px-4 py-3">BGB 抵扣/活动</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-muted-foreground">适合人群</td>
                  <td className="px-4 py-3">合约执行/衍生品</td>
                  <td className="px-4 py-3">跟单/策略交易</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 rounded-lg bg-muted/30 p-3 text-sm leading-relaxed text-muted-foreground">
            以 $50,000 合约 Taker 为例：两家都是 0.06%，单边约 $30；Bybit Maker 0.01% 约 $5，
            Bitget Maker 0.02% 约 $10。高频吃单时，Taker 差距不大；挂单为主时 Bybit 更低。
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">功能与体验</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/60 bg-card p-5">
              <h3 className="font-semibold">Bybit</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                合约产品、下单工具和系统稳定性是强项，适合已经理解杠杆和强平的用户。
                跟单也有，但生态重心更偏交易本身。缺点是新手容易被合约功能吸引，忽略风险。
              </p>
              {bybit && (
                <div className="mt-3 flex items-center gap-2">
                  <StarRating rating={bybit.rating} size={12} showValue={false} />
                  <span className="text-xs text-muted-foreground">{toFiveStarRating(bybit.rating).toFixed(1)} / 5</span>
                </div>
              )}
              <Link href="/exchanges/bybit" className="mt-3 inline-flex text-xs font-medium text-gold">
                看完整 Bybit 评测 →
              </Link>
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-5">
              <h3 className="font-semibold">Bitget</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                跟单和交易员筛选更集中，适合想研究策略、复制交易的用户。现货/合约也齐全。
                缺点是跟单会同步亏损，高收益榜可能伴随高回撤。
              </p>
              {bitget && (
                <div className="mt-3 flex items-center gap-2">
                  <StarRating rating={bitget.rating} size={12} showValue={false} />
                  <span className="text-xs text-muted-foreground">{toFiveStarRating(bitget.rating).toFixed(1)} / 5</span>
                </div>
              )}
              <Link href="/exchanges/bitget" className="mt-3 inline-flex text-xs font-medium text-gold">
                看完整 Bitget 评测 →
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-border/60 bg-muted/20 p-6">
          <h2 className="text-xl font-bold">怎么选：一句话决策</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li><strong className="text-foreground">主要做合约、挂单多：</strong>Bybit，Maker 更低，执行工具更成熟。</li>
            <li><strong className="text-foreground">想跟单/研究交易员：</strong>Bitget，跟单生态更集中，但先看最大回撤。</li>
            <li><strong className="text-foreground">第一次做合约：</strong>两家都先小额、低杠杆；不要因为“费率低”就加大仓位。</li>
            <li><strong className="text-foreground">只做现货：</strong>两家标准费率相同，按地区、出入金和中文体验选。</li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">开始注册</h2>
          <p className="mt-2 text-sm text-muted-foreground">通过本站链接注册，邀请码通常会预填；具体权益以官方页面为准。</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {bybit && (
              <div className="rounded-xl border border-gold/30 bg-card p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold">Bybit</h3>
                  <span className="text-xs text-muted-foreground">邀请码 BQZN1</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">合约执行与衍生品工具更成熟。</p>
                <ExchangeCtaLink exchange={bybit} source="compare" placement="cta" className="mt-4 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-gold px-4 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110">
                  注册 Bybit <ExternalLink className="h-4 w-4" />
                </ExchangeCtaLink>
              </div>
            )}
            {bitget && (
              <div className="rounded-xl border border-border/60 bg-card p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold">Bitget</h3>
                  <span className="text-xs text-muted-foreground">邀请码 X7QCEV4X</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">跟单/策略生态更集中。</p>
                <ExchangeCtaLink exchange={bitget} source="compare" placement="cta" className="mt-4 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-gold px-4 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110">
                  注册 Bitget <ExternalLink className="h-4 w-4" />
                </ExchangeCtaLink>
              </div>
            )}
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
            {AFFILIATE_DISCLOSURE} 合约/跟单会放大亏损，本文不构成投资建议。
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">常见问题</h2>
          <div className="mt-4 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="rounded-xl border border-border/60 bg-card p-4">
                <summary className="cursor-pointer font-medium">{faq.q}</summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-xl border border-border/60 bg-card p-5">
          <h2 className="text-lg font-bold">继续阅读</h2>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link href="/articles/what-is-copy-trading-bitget" className="text-gold">Bitget 跟单教程</Link>
            <Link href="/articles/exchange-fee-comparison" className="text-gold">交易所手续费对比</Link>
            <Link href="/exchanges/bybit" className="text-gold">Bybit 评测</Link>
            <Link href="/exchanges/bitget" className="text-gold">Bitget 评测</Link>
          </div>
        </section>
      </div>
    </div>
  )
}
