import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight, Bot, Search, ShieldCheck, Sparkles, Workflow } from "lucide-react"
import { siteConfig, substackUrl } from "@/lib/constants"

export const revalidate = 1800

export const metadata: Metadata = {
  title: "AI 工具与实战：搜索、Agent 与研究工作流",
  description:
    "不追 AI 新闻，只整理能直接用的工具和工作流：AI 搜索、Agent、资料研究、竞品分析，以及 AI × Crypto 的独立子栏目。",
  keywords: ["AI 工具", "AI 搜索", "AI Agent", "AI 工作流", "ChatGPT", "Perplexity", "Gemini"],
  openGraph: {
    title: "AI 工具与实战",
    description: "AI 搜索、Agent 与研究工作流；不追新闻，只讲怎么用。",
    url: `${siteConfig.url}/ai`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
  alternates: { canonical: `${siteConfig.url}/ai` },
}

const tools = [
  {
    slug: "ai-search-tools-comparison",
    title: "AI 搜索工具怎么选：ChatGPT、Perplexity、Gemini 的实用差异",
    description: "来源引用、文件处理、写作和多轮研究，按场景选而不是按参数选。",
    icon: Search,
    label: "AI 搜索",
  },
  {
    slug: "ai-research-workflow",
    title: "用 AI 做资料整理和竞品分析：一套可复制的工作流",
    description: "先找来源、再做证据表、最后人工写结论，附提示词和输出模板。",
    icon: Workflow,
    label: "研究工作流",
  },
]

const agents = [
  {
    slug: "ai-agent-guide",
    title: "AI Agent 是什么？和聊天机器人、自动化脚本的区别",
    description: "目标、工具、观察、验收：理解 Agent 的执行闭环和安全边界。",
    icon: Bot,
    label: "Agent 入门",
  },
]

const cryptoAi = [
  {
    slug: "binance-ai-products-guide",
    title: "币安 AI 产品全景：Binance AI、Agent OS 与 Agentic Wallet",
    description: "交易所 AI 助手、Agent 运行层、钱包和 x402 支付。",
  },
  {
    slug: "ai-agent-wallet-x402-guide",
    title: "AI Agent 怎么用钱包？Agentic Wallet、x402 与 B402 入门",
    description: "Agent 钱包、权限、预算和机器支付的实操风险。",
  },
]

const faqs = [
  {
    q: "为什么没有 AI 新闻？",
    a: "新闻时效短、竞争激烈，而且容易变成重复内容。这里优先做能长期使用的工具和工作流；重大变化会以分析形式更新。",
  },
  {
    q: "AI 内容和币安有关系吗？",
    a: "通用 AI 内容不绑定交易所，也没有币安 CTA。只有“AI × Crypto”子栏目会涉及币安 AI、Agentic Wallet 和 x402。",
  },
  {
    q: "AI 搜索的结果可以直接用吗？",
    a: "不建议。AI 可能编造来源或引用过期信息；重要结论要打开原始链接核对，并记录日期。",
  },
  {
    q: "适合什么基础的人？",
    a: "会用浏览器和基础办公软件即可。Agent 部分需要理解工具调用、权限和人工确认。",
  },
]

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${siteConfig.url}/ai`,
  name: "AI 工具与实战",
  description: "AI 搜索、Agent 与研究工作流；不追新闻，只讲怎么用。",
  url: `${siteConfig.url}/ai`,
  inLanguage: siteConfig.locale,
  isPartOf: { "@id": siteConfig.url },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [...tools, ...agents, ...cryptoAi].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "WebPage",
        "@id": `${siteConfig.url}/articles/${item.slug}`,
        name: item.title,
        description: item.description,
        url: `${siteConfig.url}/articles/${item.slug}`,
      },
    })),
  },
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

export default function AiPage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
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
              AI 工具 · Agent · 工作流
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              AI 工具与实战
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              不追新闻，只做能直接用的内容：AI 搜索、Agent、资料研究和竞品分析。
              通用 AI 不绑定交易所。
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="#tools"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-gold px-6 text-sm font-semibold text-white shadow-md shadow-gold/20"
              >
                先看工具 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href={substackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-semibold transition-colors hover:bg-muted"
              >
                Substack 更新
              </a>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              不构成投资建议；AI 输出可能出错，请核对原始来源。
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section id="tools" className="scroll-mt-24">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium tracking-[0.16em] text-gold">AI TOOLS</p>
              <h2 className="mt-2 text-2xl font-bold">AI 工具</h2>
            </div>
            <span className="text-xs text-muted-foreground">{tools.length} 篇</span>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {tools.map((item) => (
              <Link
                key={item.slug}
                href={`/articles/${item.slug}`}
                className="group rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:border-gold/40 hover:shadow-md"
              >
                <div className="flex items-center gap-2 text-gold">
                  <item.icon className="h-4 w-4" />
                  <span className="text-[11px] font-medium">{item.label}</span>
                </div>
                <h3 className="mt-3 text-xl font-bold leading-snug transition-colors group-hover:text-gold">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                <span className="mt-4 inline-flex items-center text-xs font-medium text-gold">
                  阅读 <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section id="agents" className="mt-12 scroll-mt-24">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium tracking-[0.16em] text-gold">AGENTS</p>
              <h2 className="mt-2 text-2xl font-bold">Agent / 自动化</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {agents.map((item) => (
              <Link
                key={item.slug}
                href={`/articles/${item.slug}`}
                className="group rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:border-gold/40 hover:shadow-md"
              >
                <div className="flex items-center gap-2 text-gold">
                  <item.icon className="h-4 w-4" />
                  <span className="text-[11px] font-medium">{item.label}</span>
                </div>
                <h3 className="mt-3 text-xl font-bold leading-snug transition-colors group-hover:text-gold">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                <span className="mt-4 inline-flex items-center text-xs font-medium text-gold">
                  阅读 <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
            <div className="rounded-2xl border border-border/60 bg-card p-6">
              <ShieldCheck className="h-5 w-5 text-gold" />
              <h3 className="mt-3 font-bold">先看安全边界</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Agent 能调用工具，也就可能误操作。先理解权限、预算、日志和人工确认，再考虑自动化。
              </p>
              <Link
                href="/articles/ai-agent-guide"
                className="mt-3 inline-flex items-center text-xs font-medium text-gold"
              >
                看 Agent 入门 <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-border/60 bg-muted/30 p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium tracking-[0.16em] text-gold">AI × CRYPTO</p>
              <h2 className="mt-2 text-2xl font-bold">只有这部分涉及交易所</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                币安 AI、Agentic Wallet、x402 等；和通用 AI 工具分开看。
              </p>
            </div>
            <Link
              href="/trends"
              className="text-xs font-medium text-gold hover:underline"
            >
              看热门赛道 →
            </Link>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {cryptoAi.map((item) => (
              <Link
                key={item.slug}
                href={`/articles/${item.slug}`}
                className="rounded-xl border border-border/50 bg-card p-4 transition-colors hover:border-gold/40"
              >
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-center text-2xl font-bold">常见问题</h2>
          <div className="mx-auto mt-6 max-w-3xl space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="rounded-xl border border-border/60 bg-card p-5">
                <summary className="cursor-pointer list-none font-medium">{faq.q}</summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
