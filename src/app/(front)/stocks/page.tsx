import Link from "next/link"
import type { Metadata } from "next"
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Landmark,
  ShieldAlert,
  TrendingUp,
} from "lucide-react"
import { siteConfig } from "@/lib/constants"
import { AFFILIATE_DISCLOSURE } from "@/lib/affiliates"

export const revalidate = 1800

export const metadata: Metadata = {
  title: "美股与 ETF 入门：用币安交易美股、ETF 与 bStocks",
  description:
    "美股新手入门：币安美股/ETF 开户、入金、交易时间，bStocks 与直接股票的区别，SPY/VOO/QQQ 怎么选，附风险与地区限制说明。",
  keywords: [
    "美股入门",
    "币安美股",
    "币安买美股",
    "bStocks",
    "美股ETF",
    "SPY",
    "VOO",
    "QQQ",
    "美股开户",
  ],
  openGraph: {
    title: "美股与 ETF 入门：用币安交易美股、ETF 与 bStocks",
    description:
      "从开户、入金到交易时间：美股/ETF 与 bStocks 的区别、ETF 选择和常见风险。",
    url: `${siteConfig.url}/stocks`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "美股与 ETF 入门",
    description: "币安美股/ETF、bStocks、SPY/VOO/QQQ 与风险说明。",
  },
  alternates: {
    canonical: `${siteConfig.url}/stocks`,
  },
}

const guides = [
  {
    slug: "binance-us-stocks-guide",
    title: "币安美股怎么买？2026 开户、入金与交易时间",
    description:
      "从注册、KYC、入金到第一笔美股/ETF 订单，拆解直接股票与 bStocks 的区别和常见坑。",
    icon: Landmark,
    label: "开户与入金",
  },
  {
    slug: "bstocks-vs-us-stocks",
    title: "bStocks 是什么？和直接买美股、ETF 有什么区别",
    description:
      "1:1 支持、24/7 交易、BNB Chain：bStocks 的机制、权利、折溢价和发行方风险。",
    icon: Clock,
    label: "产品机制",
  },
  {
    slug: "us-stock-etf-beginners",
    title: "美股 ETF 新手怎么选？SPY、VOO、QQQ 区别",
    description:
      "标普 500 与纳斯达克 100 的差异、费率和流动性，第一只 ETF 的选择框架。",
    icon: BookOpen,
    label: "ETF 入门",
  },
]

const faqs = [
  {
    q: "币安可以买美股吗？",
    a: "币安已向部分非美国市场开放美股和 ETF 交易，并推出 bStocks。是否可用取决于注册地、KYC 和币安页面提示；美国用户通常不可用。",
  },
  {
    q: "bStocks 和直接买股票一样吗？",
    a: "不一样。bStocks 是 1:1 支持的代币化证券，支持 24/7 交易；直接股票/ETF 按美股交易时段运行。权利、托管、赎回和税务处理以发行文件和币安公告为准。",
  },
  {
    q: "在币安买美股需要什么账户？",
    a: "需要币安账户并完成 KYC；部分地区还需要额外的股票/ETF 功能开通。入金方式按页面支持的方式操作。",
  },
  {
    q: "美股 ETF 选 SPY、VOO 还是 QQQ？",
    a: "SPY 和 VOO 都跟踪标普 500，差异主要在费率、流动性和交易结构；QQQ 跟踪纳斯达克 100，科技权重更高、波动更大。没有适合所有人的答案。",
  },
  {
    q: "中国大陆用户可以直接买吗？",
    a: "以币安注册页和 KYC 结果为准。如果提示地区不支持，不要用 VPN、假地址或他人身份绕过；改用你所在地区可合规使用的平台。",
  },
]

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${siteConfig.url}/stocks`,
  name: "美股与 ETF 入门",
  description:
    "美股、ETF 与 bStocks 入门：开户、入金、交易时间、产品区别和风险。",
  url: `${siteConfig.url}/stocks`,
  inLanguage: siteConfig.locale,
  isPartOf: { "@id": siteConfig.url },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: guides.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "WebPage",
        "@id": `${siteConfig.url}/articles/${guide.slug}`,
        name: guide.title,
        description: guide.description,
        url: `${siteConfig.url}/articles/${guide.slug}`,
      },
    })),
  },
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "首页", item: siteConfig.url },
    {
      "@type": "ListItem",
      position: 2,
      name: "美股与 ETF",
      item: `${siteConfig.url}/stocks`,
    },
  ],
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
}

export default function StocksPage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.03] to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/[0.1] via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/[0.06] px-3 py-1 text-xs font-medium text-gold">
                <TrendingUp className="h-3.5 w-3.5" />
                美股 · ETF · bStocks
              </div>
              <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
                美股与 ETF 入门
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
                用币安一个账户了解美股、ETF 和 bStocks：先看开户与入金，再分清代币化证券和直接持股，最后用小额资金试单。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/go/binance?src=stocks&placement=hero"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-gold px-6 text-sm font-semibold text-white shadow-md shadow-gold/20 transition-all hover:shadow-lg hover:shadow-gold/30"
                >
                  注册币安
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/articles/binance-us-stocks-guide"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-semibold transition-colors hover:bg-muted"
                >
                  先看开户教程
                </Link>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {AFFILIATE_DISCLOSURE} 美股/ETF 功能按地区开放，美国用户通常不可用。
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["直接股票/ETF", "按美股交易时段，适合传统证券交易"],
                ["bStocks", "1:1 支持、24/7 交易，代币化证券"],
                ["非美国市场", "以注册地和 KYC 结果为准，不绕过限制"],
                ["风险优先", "股票会波动，先小额、再考虑加仓"],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
                >
                  <CheckCircle2 className="h-5 w-5 text-gold" />
                  <h2 className="mt-3 font-semibold">{title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">先看这三篇</h2>
          <p className="mt-3 text-muted-foreground">
            从开户到产品机制，再到 ETF 选择，按顺序看少踩坑。
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/articles/${guide.slug}`}
              className="group rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:border-gold/40 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold">
                  <guide.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-gold">{guide.label}</span>
              </div>
              <h3 className="mt-4 text-base font-semibold leading-snug transition-colors group-hover:text-gold">
                {guide.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {guide.description}
              </p>
              <div className="mt-4 flex items-center text-xs font-medium text-gold">
                阅读全文 <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                直接股票，还是 bStocks？
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                两者都能提供股票/ETF 的经济敞口，但交易时间、权利和风险不同。不要把 bStocks 当成“无风险股票”，也不要把 24/7 交易当成更高收益。
              </p>
              <Link
                href="/articles/bstocks-vs-us-stocks"
                className="mt-5 inline-flex items-center text-sm font-medium text-gold"
              >
                看完整机制对比 <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-xs text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">维度</th>
                    <th className="px-4 py-3 font-medium">直接股票/ETF</th>
                    <th className="px-4 py-3 font-medium">bStocks</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["交易时间", "美股交易时段", "24/7"],
                    ["形态", "传统证券敞口", "1:1 支持的代币化证券"],
                    ["主要风险", "市场、汇率、托管", "市场、发行/托管、折溢价"],
                    ["适合", "偏好传统证券交易", "想用币安账户 24/7 交易"],
                  ].map(([label, a, b]) => (
                    <tr key={label} className="border-t border-border/40">
                      <td className="px-4 py-3 font-medium">{label}</td>
                      <td className="px-4 py-3 text-muted-foreground">{a}</td>
                      <td className="px-4 py-3 text-muted-foreground">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <ShieldAlert className="h-5 w-5 text-gold" />
            <h2 className="mt-3 text-xl font-bold">先看风险，再看收益</h2>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>• 股票/ETF 会波动，bStocks 也会跟随标的下跌。</li>
              <li>• 休市时 bStocks 仍可交易，可能出现折溢价。</li>
              <li>• 发行方、托管、赎回和税务处理与直接持股可能不同。</li>
              <li>• 地区限制以币安页面为准，不要用 VPN/假资料绕过。</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-gold/25 bg-gold/[0.04] p-6">
            <Landmark className="h-5 w-5 text-gold" />
            <h2 className="mt-3 text-xl font-bold">准备好再开始</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              先完成币安注册和 KYC，确认所在地区支持股票/ETF，再小额入金试单。不要为了“赶上行情”跳过安全和地区限制。
            </p>
            <Link
              href="/go/binance?src=stocks&placement=bottom"
              className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-gradient-gold px-5 text-sm font-semibold text-white shadow-sm"
            >
              注册币安
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/articles/binance-us-stocks-guide"
              className="mt-3 block text-xs text-muted-foreground underline underline-offset-4"
            >
              先读开户教程
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border/40 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight">
            常见问题
          </h2>
          <div className="mt-8 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-border/60 bg-card p-5"
              >
                <summary className="cursor-pointer list-none font-medium">
                  {faq.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground">
            本文只做信息整理，不构成投资建议。美股/ETF、bStocks 的可用性、费率、权利和税务以币安官方页面及发行文件为准。
          </p>
        </div>
      </section>
    </div>
  )
}
