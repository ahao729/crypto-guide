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
  title: "币安 vs OKX：2026 手续费、功能与适合人群对比",
  description:
    "币安和 OKX 怎么选？对比现货/合约手续费、产品功能、Web3 钱包、适合人群和注册入口，附 2026 年最新费率与常见问题。",
  keywords: [
    "币安 vs OKX",
    "币安和OKX哪个好",
    "币安手续费",
    "OKX手续费",
    "币安注册",
    "OKX注册",
    "交易所对比",
  ],
  openGraph: {
    title: "币安 vs OKX：2026 手续费、功能与适合人群对比",
    description:
      "从手续费、产品、Web3 钱包和适合人群四个维度对比币安与 OKX。",
    url: `${siteConfig.url}/compare/binance-vs-okx`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "币安 vs OKX：2026 手续费、功能与适合人群对比",
    description:
      "从手续费、产品、Web3 钱包和适合人群四个维度对比币安与 OKX。",
  },
  alternates: {
    canonical: `${siteConfig.url}/compare/binance-vs-okx`,
  },
}

const faqs = [
  {
    q: "币安和 OKX 哪个手续费更低？",
    a: "按标准用户现货费率，OKX 的 Maker 是 0.08%，币安是 0.10%；两者 Taker 都是 0.10%。合约费率各有差异，且用 BNB/OKB 抵扣、VIP 等级会改变实际费率，最终以官方费率页为准。",
  },
  {
    q: "第一次注册，选币安还是 OKX？",
    a: "如果目标是买现货、追求深度和中文活动，优先币安；如果更在意 Web3 钱包、链上交互和现货 Maker 费率，优先 OKX。两家都完成 KYC 后再入金，先小额测试。",
  },
  {
    q: "可以两个都注册吗？",
    a: "可以。两家是独立平台，分别完成 KYC 即可；但不要在同一平台重复注册或借用他人身份，避免触发风控。",
  },
  {
    q: "邀请码怎么填？",
    a: "通过本站链接进入注册页时，邀请码通常会自动填入；若没有显示，手动输入币安 BQZN1、OKX ACDDQ6TW。具体新户权益以官方活动页为准。",
  },
]

export default async function BinanceVsOkxPage() {
  const exchanges = await prisma.exchange.findMany({
    where: { slug: { in: ["binance", "okx"] }, status: "active" },
    include: { category: true },
  })

  const binance = exchanges.find((exchange) => exchange.slug === "binance")
  const okx = exchanges.find((exchange) => exchange.slug === "okx")
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

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
                name: "交易所对比",
                item: `${siteConfig.url}/exchanges`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "币安 vs OKX",
                item: `${siteConfig.url}/compare/binance-vs-okx`,
              },
            ],
          }),
        }}
      />

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
            币安 vs OKX：手续费、功能与适合人群
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            两家都是头部平台，但侧重点不同：币安胜在深度、产品和中文活动；OKX
            胜在 Web3 钱包和现货 Maker 费率。下面把关键差异拆开看。
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            最后更新：{formatDate(lastUpdated)} · 费率以官方页面为准
          </p>
        </header>

        {/* Quick verdict */}
        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gold/30 bg-gradient-to-b from-gold/[0.06] to-card p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold">新手第一站：币安</h2>
              <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] text-gold-dark">
                合作
              </span>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                交易深度和流动性最好，适合第一次买现货
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                中文界面、活动和教程最完整
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                邀请码 BQZN1，注册时自动填入
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold">进阶 / 链上：OKX</h2>
              <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] text-gold-dark">
                合作
              </span>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                现货 Maker 0.08%，比币安标准档低
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Web3 钱包和多链入口更顺手
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                邀请码 ACDDQ6TW，注册时自动填入
              </li>
            </ul>
          </div>
        </section>

        {/* Fee comparison */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold">手续费对比</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            标准用户基础费率；BNB/OKB 抵扣、VIP 等级和活动会改变实际费率。
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border/60">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">项目</th>
                  <th className="px-4 py-3 font-medium">币安 Binance</th>
                  <th className="px-4 py-3 font-medium">OKX</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                <tr>
                  <td className="px-4 py-3 text-muted-foreground">现货 Maker / Taker</td>
                  <td className="px-4 py-3">{binance?.spotFee ?? "Maker 0.10% / Taker 0.10%"}</td>
                  <td className="px-4 py-3">{okx?.spotFee ?? "Maker 0.08% / Taker 0.10%"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-muted-foreground">合约 Maker / Taker</td>
                  <td className="px-4 py-3">{binance?.futuresFee ?? "Maker 0.02% / Taker 0.04%"}</td>
                  <td className="px-4 py-3">{okx?.futuresFee ?? "Maker 0.02% / Taker 0.05%"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-muted-foreground">平台币抵扣</td>
                  <td className="px-4 py-3">BNB 支付可享折扣</td>
                  <td className="px-4 py-3">OKB 抵扣，按等级</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-muted-foreground">适合人群</td>
                  <td className="px-4 py-3">第一次注册、现货深度</td>
                  <td className="px-4 py-3">Web3、链上、Maker 交易</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground sm:hidden">
            表格可左右滑动，查看完整对比。
          </p>
        </section>

        {/* Feature comparison */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold">功能与体验</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/60 bg-card p-5">
              <h3 className="font-semibold">币安</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                产品线最全：现货、合约、理财、Launchpad、NFT 都有；中文教程和活动多，
                适合从零开始。缺点是界面信息密度高，新手容易迷路。
              </p>
              {binance && (
                <div className="mt-3 flex items-center gap-2">
                  <StarRating rating={binance.rating} size={12} showValue={false} />
                  <span className="text-xs text-muted-foreground">
                    {toFiveStarRating(binance.rating).toFixed(1)} / 5
                  </span>
                </div>
              )}
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-5">
              <h3 className="font-semibold">OKX</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                交易 + Web3 钱包一体化，链上入口顺手；现货 Maker 费率更低。
                适合已经熟悉交易所、想继续玩链上的人。缺点是部分活动地区限制更明显。
              </p>
              {okx && (
                <div className="mt-3 flex items-center gap-2">
                  <StarRating rating={okx.rating} size={12} showValue={false} />
                  <span className="text-xs text-muted-foreground">
                    {toFiveStarRating(okx.rating).toFixed(1)} / 5
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How to choose */}
        <section className="mt-12 rounded-2xl border border-border/60 bg-muted/20 p-6">
          <h2 className="text-xl font-bold">怎么选：一句话决策</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li>
              <strong className="text-foreground">第一次注册、只买现货：</strong>
              选币安。深度好，教程和中文活动多，出错成本低。
            </li>
            <li>
              <strong className="text-foreground">想要 Web3 钱包、经常上链：</strong>
              选 OKX。交易和钱包在同一个 App 里，少装一个工具。
            </li>
            <li>
              <strong className="text-foreground">主要做现货 Maker：</strong>
              OKX 的标准 Maker 费率更低；如果你用 BNB 抵扣，币安的实际费率也会变化。
            </li>
            <li>
              <strong className="text-foreground">还没决定：</strong>
              先注册币安完成第一笔小额买卖，熟悉流程后再开 OKX 对比，不要一上来就放大的资金。
            </li>
          </ul>
        </section>

        {/* CTA */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold">开始注册</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            通过本站链接注册，邀请码会自动填入；具体新户权益以官方页面为准。
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {binance && (
              <div className="rounded-xl border border-gold/30 bg-card p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold">币安 Binance</h3>
                  <span className="text-xs text-muted-foreground">邀请码 BQZN1</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  新手首选，现货深度和中文活动最全。
                </p>
                <ExchangeCtaLink
                  exchange={binance}
                  className="mt-4 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-gold px-4 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110"
                >
                  注册币安
                  <ExternalLink className="h-4 w-4" />
                </ExchangeCtaLink>
              </div>
            )}
            {okx && (
              <div className="rounded-xl border border-border/60 bg-card p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold">OKX</h3>
                  <span className="text-xs text-muted-foreground">邀请码 ACDDQ6TW</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Web3 钱包 + 低现货 Maker 费率，适合进阶。
                </p>
                <ExchangeCtaLink
                  exchange={okx}
                  className="mt-4 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-gold px-4 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110"
                >
                  注册 OKX
                  <ExternalLink className="h-4 w-4" />
                </ExchangeCtaLink>
              </div>
            )}
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
            {AFFILIATE_DISCLOSURE} 本文不构成投资建议，注册前请核对官网域名与地区限制。
          </p>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold">常见问题</h2>
          <div className="mt-4 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="rounded-xl border border-border/60 bg-card p-4"
              >
                <summary className="cursor-pointer font-medium">{faq.q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Related */}
        <section className="mt-12 border-t border-border/40 pt-6">
          <h2 className="text-lg font-semibold">继续看</h2>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link href="/exchanges" className="text-gold hover:text-gold-dark">
              全部交易所对比
            </Link>
            <Link href="/articles/binance-registration-guide" className="text-gold hover:text-gold-dark">
              币安注册教程
            </Link>
            <Link href="/articles/exchange-fee-comparison" className="text-gold hover:text-gold-dark">
              手续费全面对比
            </Link>
            <Link href="/exchange-ranking" className="text-gold hover:text-gold-dark">
              交易所排名
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
