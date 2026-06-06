import Link from "next/link"
import type { Metadata } from "next"
import { siteConfig } from "@/lib/constants"
import { ArrowRight, BarChart3, TrendingUp, TrendingDown, Shield, DollarSign, Sparkles, BookOpen, Library } from "lucide-react"

export const metadata: Metadata = {
  title: `加密货币期权交易入门指南 | ${siteConfig.shortName}`,
  description:
    "了解加密货币期权的基础知识，包括看涨/看跌期权、行权价、权利金等核心概念，以及常用交易策略。使用我们的期权计算器模拟盈亏。",
  keywords: [
    "加密货币期权",
    "期权交易",
    "看涨期权",
    "看跌期权",
    "期权策略",
    "期权计算器",
    "数字货币期权",
    "比特币期权",
    "以太坊期权",
    "期权入门",
  ],
  openGraph: {
    title: `加密货币期权交易入门指南 | ${siteConfig.shortName}`,
    description: "了解加密货币期权的基础知识，包括看涨/看跌期权、行权价、权利金等核心概念，以及常用交易策略。",
    url: `${siteConfig.url}/options`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `加密货币期权交易入门指南 | ${siteConfig.shortName}`,
    description: "了解加密货币期权的基础知识，包括看涨/看跌期权、行权价、权利金等核心概念，以及常用交易策略。",
  },
  alternates: {
    canonical: `${siteConfig.url}/options`,
  },
}

const conceptCards = [
  {
    icon: TrendingUp,
    title: "看涨期权 (Call)",
    description:
      "赋予买方在到期日或之前以特定价格买入标的资产的权利，而非义务。当预期价格上涨时买入看涨期权。",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
  {
    icon: TrendingDown,
    title: "看跌期权 (Put)",
    description:
      "赋予买方在到期日或之前以特定价格卖出标的资产的权利，而非义务。当预期价格下跌时买入看跌期权。",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
  {
    icon: DollarSign,
    title: "权利金 (Premium)",
    description:
      "购买期权合约的价格，也是卖方承担风险所获得的收入。权利金受标的资产价格、波动率、到期时间等因素影响。",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  {
    icon: BarChart3,
    title: "行权价 (Strike Price)",
    description:
      "期权合约中约定的买卖标的资产的价格。行权价与标的资产当前价格的差值决定了期权的内在价值。",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    icon: Shield,
    title: "到期日 (Expiration)",
    description:
      "期权合约有效的最后日期。到期后期权将失效。欧式期权只能在到期日行权，美式期权可在到期前任何时间行权。",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  {
    icon: Sparkles,
    title: "期权类型",
    description:
      "主流加密期权采用欧式期权（仅到期行权），以现金结算。交易所以 OKX、Deribit、币安等平台为首选。",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
  },
]

const strategyCards = [
  {
    title: "买入看涨 (Long Call)",
    description: "预期市场大幅上涨时使用。亏损有限（仅权利金），收益理论无限。适合牛市行情。",
    risk: "有限亏损",
    reward: "理论无限收益",
  },
  {
    title: "买入看跌 (Long Put)",
    description: "预期市场大幅下跌时使用。亏损有限（仅权利金），收益随价格下跌而增加。适合熊市或对冲。",
    risk: "有限亏损",
    reward: "高杠杆收益",
  },
  {
    title: "卖出看涨 (Short Call)",
    description: "预期市场不涨或小幅下跌时使用。收益有限（仅权利金），风险理论无限。适合盘整行情。",
    risk: "理论无限风险",
    reward: "有限收益",
  },
  {
    title: "卖出看跌 (Short Put)",
    description: "预期市场不跌或小幅上涨时使用。收益有限（仅权利金），风险较大。适合温和看涨行情。",
    risk: "较大风险",
    reward: "有限收益",
  },
]

export default function OptionsPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "期权交易",
        item: `${siteConfig.url}/options`,
      },
    ],
  }

  return (
    <div className="min-h-screen animate-fade-in">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "加密货币期权交易入门指南",
            description: "了解加密货币期权的基础知识，包括看涨/看跌期权、行权价、权利金等核心概念，以及常用交易策略。",
            url: `${siteConfig.url}/options`,
            inLanguage: siteConfig.locale,
            isPartOf: {
              "@type": "WebPage",
              "@id": `${siteConfig.url}/options`,
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-purple/[0.03] to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-xs font-medium text-purple-500">
              加密货币衍生品
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              期权交易
              <span className="text-gradient-gold ml-2">入门指南</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              期权是一种强大的金融衍生工具，让您以有限的风险获取不对称的收益潜力。
              本文将帮助您快速理解加密期权交易的核心概念。
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/tools/options-calculator"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-gold px-6 text-sm font-semibold text-white shadow-lg shadow-gold/20 transition-all hover:shadow-xl hover:shadow-gold/30 hover:brightness-110"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                期权盈亏计算器
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What is Options Section */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight">什么是期权？</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              期权（Options）是一种赋予持有人在特定日期或之前，以约定价格买入或卖出标的资产权利的合约。
              与期货不同，期权买方没有必须履行的义务，因此最大亏损仅限于支付的权利金。
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              加密货币期权市场起源于 Deribit（现为 Bitstamp 旗下），目前已发展出以
              OKX、币安等交易所为代表的活跃市场。加密期权采用现金结算，以小博大，
              是专业交易者常用的风险管理工具。
            </p>
          </div>
        </div>
      </section>

      {/* Core Concepts Grid */}
      <section className="section-padding border-t border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">核心概念</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              掌握这些基本概念，是理解期权交易的第一步。
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {conceptCards.map((card) => {
              const Icon = card.icon
              return (
                <div
                  key={card.title}
                  className={`rounded-2xl border ${card.borderColor} ${card.bgColor} p-6 shadow-sm backdrop-blur-sm transition-all hover:shadow-md`}
                >
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${card.color} ${card.bgColor}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{card.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Option Greek Section (Simplified) */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">期权 Greeks</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              衡量期权价格对各类市场因素敏感度的核心指标。
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                symbol: "Δ Delta",
                desc: "标的资产价格变动 $1 时期权价格的变化量。看涨 Delta 为正值(0~1)，看跌为负值(-1~0)。",
              },
              {
                symbol: "Γ Gamma",
                desc: "标的资产价格变动 $1 时 Delta 的变化量。Gamma 越高，期权价格对标的资产波动越敏感。",
              },
              {
                symbol: "Θ Theta",
                desc: "时间每过去一天期权价格的变化（时间价值衰减）。买方厌恶 Theta，卖方喜爱 Theta。",
              },
              {
                symbol: "Ⅴ Vega",
                desc: "隐含波动率每变化 1% 时期权价格的变化量。波动率越高，期权越贵。",
              },
            ].map((greek) => (
              <div
                key={greek.symbol}
                className="rounded-xl border border-border/60 bg-card p-5 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-2 text-lg font-bold text-purple-500">{greek.symbol}</div>
                <p className="text-sm leading-relaxed text-muted-foreground">{greek.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Basic Strategies */}
      <section className="section-padding border-t border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">基础交易策略</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              四种最基本的期权单腿策略，适合初学者上手。
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
            {strategyCards.map((strategy) => (
              <div
                key={strategy.title}
                className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:shadow-md"
              >
                <h3 className="mb-2 text-lg font-semibold">{strategy.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{strategy.description}</p>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-muted-foreground">风险：</span>
                    <span
                      className={
                        strategy.risk.includes("无限")
                          ? "font-medium text-red-500"
                          : "font-medium text-green-500"
                      }
                    >
                      {strategy.risk}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">收益：</span>
                    <span
                      className={
                        strategy.reward.includes("无限")
                          ? "font-medium text-green-500"
                          : "font-medium text-amber-500"
                      }
                    >
                      {strategy.reward}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              策略选择应结合市场预期、风险承受能力和资金规模。使用下方的计算器模拟不同策略的盈亏情况。
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/20 via-purple-500/10 to-violet-600/20 p-8 sm:p-12">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="relative mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">试试期权盈亏计算器</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                输入标的资产价格、行权价、权利金等参数，即时观察到期盈亏曲线，帮助你更好地理解期权交易逻辑。
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/tools/options-calculator"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-gold px-8 text-sm font-semibold text-white shadow-lg shadow-gold/20 transition-all hover:shadow-xl hover:shadow-gold/30 hover:brightness-110"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  打开期权计算器
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Articles */}
      <section className="section-padding border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">推荐文章</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              深入了解更多加密货币期权交易知识，从入门到进阶一网打尽。
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
            <Link
              href="/articles/crypto-options-beginners-guide"
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-purple-500/30"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold group-hover:text-purple-500 transition-colors">
                加密货币期权交易入门
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                系统介绍加密货币期权的基础概念、常见交易策略和风险管理方法，帮助新手快速入门期权交易。
              </p>
              <div className="flex items-center text-sm font-medium text-purple-500">
                阅读更多
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
            <Link
              href="/articles/crypto-options-strategies"
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-purple-500/30"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                <Library className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold group-hover:text-purple-500 transition-colors">
                加密货币期权策略详解
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                深入解析加密货币期权的各类交易策略，包括价差策略、跨式组合和蝶式策略，助你提升交易水平。
              </p>
              <div className="flex items-center text-sm font-medium text-purple-500">
                阅读更多
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Disclaimer */}
      <section className="section-padding border-t border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs text-muted-foreground">
              风险提示：期权交易涉及重大风险，可能导致全部投资损失。本指南仅供教育参考，不构成任何投资建议。
              在参与期权交易前，请确保充分了解相关风险，并根据自身情况谨慎决策。
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
