import Link from "next/link"
import type { Metadata } from "next"
import {
  ArrowRight,
  Bot,
  Building2,
  Image as ImageIcon,
  Layers,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import { siteConfig } from "@/lib/constants"
import { AFFILIATE_DISCLOSURE } from "@/lib/affiliates"

export const revalidate = 1800

export const metadata: Metadata = {
  title: "热门赛道：Meme、NFT、RWA、Web3 与 AI 入门",
  description:
    "Meme 币、NFT、RWA、Web3.0 与 AI Agent 入门：交易逻辑、真实应用、币安 AI 产品、风险和防骗清单。",
  keywords: [
    "Meme币",
    "NFT",
    "RWA",
    "Web3.0",
    "AI Agent",
    "Binance AI",
    "Agentic Wallet",
    "x402",
    "B402",
  ],
  openGraph: {
    title: "热门赛道：Meme、NFT、RWA、Web3 与 AI",
    description:
      "五个高关注赛道的入门、风险与币安 AI 产品梳理。",
    url: `${siteConfig.url}/trends`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "热门赛道：Meme、NFT、RWA、Web3 与 AI",
    description: "五个赛道的入门、风险与工具。",
  },
  alternates: {
    canonical: `${siteConfig.url}/trends`,
  },
}

const topics = [
  {
    slug: "meme",
    title: "Meme 币",
    label: "高波动 · 流动性优先",
    description:
      "没有现金流，价格由注意力和流动性驱动。先学会看合约、持仓和撤池风险。",
    href: "/articles/meme-coin-guide-2026",
    icon: TrendingUp,
  },
  {
    slug: "nft",
    title: "NFT",
    label: "会员 · 游戏 · 凭证",
    description:
      "从头像炒作转向实际权益。流动性、合约和钱包安全比地板价更重要。",
    href: "/articles/nft-guide-2026",
    icon: ImageIcon,
  },
  {
    slug: "rwa",
    title: "RWA",
    label: "美债 · 基金 · 房地产",
    description:
      "把现实资产代币化，不消除发行方、托管和赎回风险。先看法律结构。",
    href: "/articles/rwa-guide-2026",
    icon: Building2,
  },
  {
    slug: "web3",
    title: "Web3.0",
    label: "钱包 · Layer2 · Agent",
    description:
      "从钱包、Gas、授权到 Layer2 和 AI Agent，理解开放应用的底层结构。",
    href: "/articles/web3-guide-2026",
    icon: Layers,
  },
  {
    slug: "ai",
    title: "AI × 币安",
    label: "Agent OS · Wallet · x402",
    description:
      "Binance AI、AI Pro、Agent OS、Skills Hub、Agentic Wallet 和 x402 全景。",
    href: "/articles/binance-ai-products-guide",
    icon: Bot,
  },
]

const faqs = [
  {
    q: "Meme 币、NFT、RWA 哪个适合新手？",
    a: "都不适合“闭眼买”。Meme 和 NFT 波动/流动性风险高，RWA 有发行方和监管风险。新手先学钱包、仓位和合约安全，再用小额测试。",
  },
  {
    q: "币安 AI 能自动交易吗？",
    a: "Binance AI Pro 提供 Prompt、Test、Trade 的流程，但 AI 策略可能失效或亏损。先测试、控制仓位，不要用生活资金。",
  },
  {
    q: "Agentic Wallet 和普通钱包有什么区别？",
    a: "它面向 AI Agent，强调独立账户、权限和预算控制；具体密钥/托管机制以官方文档为准。不要把主钱包私钥交给 Agent。",
  },
  {
    q: "RWA 是稳定币吗？",
    a: "不是。RWA 代币可能代表基金份额、债务或收益权，价格和赎回取决于底层资产与发行结构，不保本。",
  },
]

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${siteConfig.url}/trends`,
  name: "热门赛道：Meme、NFT、RWA、Web3 与 AI",
  description:
    "Meme 币、NFT、RWA、Web3.0 与 AI Agent 的入门、风险与币安 AI 产品。",
  url: `${siteConfig.url}/trends`,
  inLanguage: siteConfig.locale,
  isPartOf: { "@id": siteConfig.url },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: topics.map((topic, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "WebPage",
        "@id": `${siteConfig.url}${topic.href}`,
        name: topic.title,
        description: topic.description,
        url: `${siteConfig.url}${topic.href}`,
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
      name: "热门赛道",
      item: `${siteConfig.url}/trends`,
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

export default function TrendsPage() {
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
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/[0.06] px-3 py-1 text-xs font-medium text-gold">
              <Sparkles className="h-3.5 w-3.5" />
              Meme · NFT · RWA · Web3 · AI
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              热门赛道
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              五个高关注方向的入门、真实风险和工具。先看机制，再决定要不要用真钱。
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/go/binance?src=trends&placement=hero"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-gold px-6 text-sm font-semibold text-white shadow-md shadow-gold/20 transition-all hover:shadow-lg hover:shadow-gold/30"
              >
                注册币安
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/articles/binance-ai-products-guide"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-semibold transition-colors hover:bg-muted"
              >
                先看币安 AI 产品
              </Link>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {AFFILIATE_DISCLOSURE} 内容不构成投资建议。
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <Link
              key={topic.slug}
              href={topic.href}
              className="group flex flex-col rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:border-gold/40 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold">
                  <topic.icon className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-medium text-gold">{topic.label}</span>
              </div>
              <h2 className="mt-4 text-xl font-bold">{topic.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {topic.description}
              </p>
              <span className="mt-4 inline-flex items-center text-xs font-medium text-gold">
                阅读入门 <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 px-5 py-4 text-sm text-muted-foreground">
          <span>想直接看币安 AI 的 Agent 钱包和 x402？</span>
          <Link
            href="/articles/ai-agent-wallet-x402-guide"
            className="font-medium text-gold hover:underline"
          >
            读 Agentic Wallet 与 x402 入门 →
          </Link>
        </div>
      </section>

      <section className="border-y border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-card p-6">
              <ShieldAlert className="h-5 w-5 text-gold" />
              <h2 className="mt-3 text-xl font-bold">风险排序：先看最坏情况</h2>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>• Meme：归零、撤池、合约后门、MEV。</li>
                <li>• NFT：流动性差、假集合、钱包 Drainer。</li>
                <li>• RWA：发行方、托管、赎回和监管风险。</li>
                <li>• Web3：签名/授权、跨链桥、RPC 单点。</li>
                <li>• AI Agent：权限过大、恶意 Skill、自动扣费。</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-gold/25 bg-gold/[0.04] p-6">
              <Bot className="h-5 w-5 text-gold" />
              <h2 className="mt-3 text-xl font-bold">AI 不是收益保证</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                币安 AI、AI Pro、Agentic Wallet 和 x402 改变的是“执行方式”，不是“市场规律”。先用只读/测试功能，再小额实盘；不要让 Agent 拥有无限额度。
              </p>
              <Link
                href="/articles/ai-agent-wallet-x402-guide"
                className="mt-4 inline-flex items-center text-sm font-medium text-gold"
              >
                看 Agent 钱包安全流程 <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight">常见问题</h2>
        <div className="mt-8 space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="rounded-xl border border-border/60 bg-card p-5"
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
          本文只做信息整理，不构成投资建议。各赛道的合约、产品、地区限制和税务规则以官方页面为准。
        </p>
      </section>
    </div>
  )
}
