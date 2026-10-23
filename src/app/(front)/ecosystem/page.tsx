import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight, ExternalLink, Network, ShieldCheck, Sparkles, Wallet } from "lucide-react"
import { siteConfig } from "@/lib/constants"
import { AFFILIATE_DISCLOSURE } from "@/lib/affiliates"
import {
  brandsByCategory,
  ecosystemBrands,
  ecosystemCategories,
  type EcosystemCategory,
} from "@/lib/ecosystem"
import { BrandMark } from "@/components/front/BrandMark"

export const revalidate = 1800

export const metadata: Metadata = {
  title: "基础设施地图：热钱包、跨链桥与预言机",
  description:
    "主流热钱包、跨链桥和预言机品牌目录：MetaMask、Trust Wallet、Phantom、Rabby、LayerZero、Wormhole、Chainlink、Pyth 等，附功能、支持链和风险。",
  keywords: [
    "热钱包",
    "MetaMask",
    "Trust Wallet",
    "Phantom",
    "Rabby",
    "跨链桥",
    "LayerZero",
    "Wormhole",
    "CCTP",
    "预言机",
    "Chainlink",
    "Pyth",
    "RedStone",
  ],
  openGraph: {
    title: "基础设施地图：热钱包、跨链桥与预言机",
    description: "品牌目录、支持网络、功能与风险，一篇看懂。",
    url: `${siteConfig.url}/ecosystem`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
  alternates: { canonical: `${siteConfig.url}/ecosystem` },
}

const guides = [
  {
    slug: "hot-wallet-comparison-2026",
    label: "热钱包",
    title: "热钱包怎么选？MetaMask、Trust Wallet、Phantom、Rabby 对比",
    description: "自托管、多链、安全提示和适用人群，别只看界面好看。",
  },
  {
    slug: "cross-chain-bridge-guide-2026",
    label: "跨链桥",
    title: "跨链桥怎么选？LayerZero、Wormhole、Across、CCTP 风险对比",
    description: "包装资产、原生资产、验证模型和退出路径。",
  },
  {
    slug: "wallet-security-visual-guide",
    label: "步骤图",
    title: "钱包安全设置步骤图：锁屏、签名检查与撤销授权",
    description: "用真实截图走一遍：锁屏、看风险提示、查授权、批量撤销。",
  },
  {
    slug: "bridge-small-test-visual-guide",
    label: "步骤图",
    title: "跨链桥小额测试步骤图：选链、核对、10 美元试单",
    description: "用 Stargate 和 Across 的界面，先小额验证再放大。",
  },
  {
    slug: "hardware-wallet-setup-visual-guide",
    label: "步骤图",
    title: "硬件钱包初始化步骤图：OneKey / Trezor",
    description: "官方 App、设备连接、PIN 与助记词备份，先小额测试。",
  },
  {
    slug: "oracle-guide-2026",
    label: "预言机",
    title: "预言机是什么？Chainlink、Pyth、RedStone 的作用与风险",
    description: "价格喂价、Pull 模式、争议解决和操纵风险。",
  },
]

const faqs = [
  {
    q: "热钱包和硬件钱包怎么选？",
    a: "热钱包联网、方便日常交互，但私钥暴露面更大；大额长期资产更适合硬件钱包/多签。可以小额热钱包 + 大额冷钱包组合。",
  },
  {
    q: "跨链桥最怕什么风险？",
    a: "合约漏洞、验证者/多签被攻破、包装资产脱锚、流动性不足和目标链拥堵。先小额、看审计和 TVL，不要一次跨大额。",
  },
  {
    q: "预言机价格一定准确吗？",
    a: "不一定。喂价可能延迟、节点可能异常、聚合器可能被操纵；协议应使用多个数据源/熔断机制，用户也要看清算规则。",
  },
  {
    q: "这些品牌和币安是什么关系？",
    a: "多数是独立项目/公司，不是币安官方产品。本页只做目录与风险整理；通过本站链接注册币安，我们可能获得佣金。",
  },
]

const sections: { category: EcosystemCategory; icon: typeof Wallet; id: string }[] = [
  { category: "wallet", icon: Wallet, id: "wallet" },
  { category: "bridge", icon: Network, id: "bridge" },
  { category: "oracle", icon: ShieldCheck, id: "oracle" },
]

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${siteConfig.url}/ecosystem`,
  name: "基础设施地图",
  description: "热钱包、跨链桥与预言机品牌目录。",
  url: `${siteConfig.url}/ecosystem`,
  inLanguage: siteConfig.locale,
  isPartOf: { "@id": siteConfig.url },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: ecosystemBrands.map((brand, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "WebPage",
        "@id": `${siteConfig.url}/ecosystem/${brand.category}/${brand.slug}`,
        name: brand.name,
        description: brand.tagline,
        url: `${siteConfig.url}/ecosystem/${brand.category}/${brand.slug}`,
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

export default function EcosystemPage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
              钱包 · 跨链桥 · 预言机
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              基础设施地图
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              18 个主流品牌的功能、支持网络和风险。先看“它解决什么问题”，再看“最坏情况是什么”。
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/go/binance?src=ecosystem&placement=hero"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-gold px-6 text-sm font-semibold text-white shadow-md shadow-gold/20 transition-all hover:shadow-lg hover:shadow-gold/30"
              >
                注册币安 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="#wallet"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-semibold transition-colors hover:bg-muted"
              >
                先看钱包
              </Link>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {AFFILIATE_DISCLOSURE} 目录不构成投资建议。
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {sections.map(({ category, icon: Icon, id }) => {
          const brands = brandsByCategory(category)
          return (
            <section key={category} id={id} className="scroll-mt-24 py-8">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-gold">
                    <Icon className="h-4 w-4" />
                    <span className="text-xs font-medium tracking-[0.16em]">
                      {ecosystemCategories[category].label}
                    </span>
                  </div>
                  <h2 className="mt-2 text-2xl font-bold">
                    {ecosystemCategories[category].plural}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {ecosystemCategories[category].description}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {brands.length} 个品牌
                </span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {brands.map((brand) => (
                  <Link
                    key={brand.slug}
                    href={`/ecosystem/${brand.category}/${brand.slug}`}
                    className="group rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all hover:border-gold/40 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <BrandMark brand={brand} />
                        <div>
                          <h3 className="font-semibold transition-colors group-hover:text-gold">
                            {brand.name}
                          </h3>
                          <p className="text-[11px] text-muted-foreground">{brand.type}</p>
                        </div>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {brand.tagline}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {brand.chains.slice(0, 3).map((chain) => (
                        <span
                          key={chain}
                          className="rounded-full border border-border/50 px-2 py-0.5 text-[10px] text-muted-foreground"
                        >
                          {chain}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}

        <section className="mt-10 border-t border-border/40 pt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">先读这三篇</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                品牌目录是“是什么”，文章解决“怎么选、怎么避开坑”。
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/articles/${guide.slug}`}
                className="group rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all hover:border-gold/40 hover:shadow-md"
              >
                <span className="text-[11px] font-medium text-gold">{guide.label}</span>
                <h3 className="mt-2 text-base font-semibold leading-snug transition-colors group-hover:text-gold">
                  {guide.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {guide.description}
                </p>
                <span className="mt-4 inline-flex items-center text-xs text-gold">
                  阅读全文 <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 border-t border-border/40 pt-10">
          <h2 className="text-center text-2xl font-bold">常见问题</h2>
          <div className="mx-auto mt-6 max-w-3xl space-y-3">
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
            本页只做信息整理，不构成投资建议。品牌功能、费率、支持链和地区限制以官方页面为准。
          </p>
        </section>
      </div>
    </div>
  )
}
