import Link from "next/link"
import type { Metadata } from "next"
import { BarChart3, BookOpen, CheckCircle2, ExternalLink, ShieldCheck, RefreshCw } from "lucide-react"
import { siteConfig } from "@/lib/constants"
import { AFFILIATE_DISCLOSURE } from "@/lib/affiliates"

export const metadata: Metadata = {
  title: "我们如何评测交易所、钱包与基础设施",
  description:
    "币圈指南的评测方法：费率、流动性、安全性、产品体验和更新机制；说明数据来源、编辑评分、联盟披露与纠错政策。",
  alternates: { canonical: `${siteConfig.url}/methodology` },
  openGraph: {
    title: "我们如何评测交易所、钱包与基础设施",
    description: "评测维度、数据来源、更新机制、联盟披露和纠错政策。",
    url: `${siteConfig.url}/methodology`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "article",
  },
}

const dimensions = [
  {
    title: "费率与成本",
    weight: "30%",
    body: "标准现货/合约费率、Maker/Taker、VIP/平台币折扣、出入金与提现网络费用。所有费率注明核对日期，活动不计入基础分。",
  },
  {
    title: "流动性与深度",
    weight: "20%",
    body: "主流交易对盘口深度、点差、滑点和大额成交体验；小币种额外看退出流动性。",
  },
  {
    title: "安全与合规",
    weight: "20%",
    body: "储备/保护基金、历史安全事件、KYC/地区限制、托管方式和可验证的公开信息。",
  },
  {
    title: "产品与体验",
    weight: "15%",
    body: "现货/合约/理财/钱包等产品完整度、下单与出入金流程、中文支持、移动端体验。",
  },
  {
    title: "透明度与支持",
    weight: "15%",
    body: "费率页、公告、帮助中心、客服入口和问题处理的可验证性；不把营销话术计入评分。",
  },
]

const rules = [
  "评测基于公开资料、官方费率页、产品界面和公开数据；不把传闻当事实。",
  "每个交易所/品牌页标注最后核对日期；费率、活动和地区限制会变化。",
  "编辑评分是 5 分制，不是用户评分，也不代表收益承诺。",
  "联盟链接不影响评分；合作方标识只表示有返佣关系，不代表“更安全”。",
  "发现错误会更新页面；重大更正会在页面标注更新时间。",
]

export default function MethodologyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "我们如何评测",
    description: "币圈指南的评测维度、数据来源、更新机制和联盟披露。",
    url: `${siteConfig.url}/methodology`,
    inLanguage: siteConfig.locale,
    isPartOf: { "@id": siteConfig.url },
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-medium tracking-[0.18em] text-gold">METHODOLOGY</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            我们如何评测
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            评测的目标不是“排个名”，而是帮读者判断：这个平台适合谁、成本是多少、最坏情况是什么。
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            最后核对：2026-10-29 · 适用于交易所、钱包、跨链桥、预言机和教程内容
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
        <section>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <BarChart3 className="h-6 w-6 text-gold" />
            评分维度
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {dimensions.map((item) => (
              <div key={item.title} className="rounded-xl border border-border/60 bg-card p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold">{item.title}</h3>
                  <span className="text-xs font-medium text-gold">{item.weight}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            总分换算为 5 分制并保留一位小数。评分只用于同站内容对比，不构成投资建议；不同用户的使用场景不同，适合的交易所也不同。
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <BookOpen className="h-6 w-6 text-gold" />
            数据来源
          </h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li>• 交易所/项目官方费率页、公告、帮助中心与开发文档</li>
            <li>• 产品界面截图、公开的链上/市场数据</li>
            <li>• 本站实测记录与读者反馈（会标注来源/日期）</li>
            <li>• 对无法验证的宣传语、收益承诺和“内部消息”，不写入评测</li>
          </ul>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <CheckCircle2 className="h-6 w-6 text-gold" />
            编辑规则
          </h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
            {rules.map((rule) => <li key={rule}>• {rule}</li>)}
          </ul>
        </section>

        <section className="rounded-2xl border border-gold/20 bg-gold/[0.04] p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <ShieldCheck className="h-5 w-5 text-gold" />
            联盟披露
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {AFFILIATE_DISCLOSURE} 合作方标识、邀请码和“注册”按钮代表返佣关系，不代表官方背书、收益保证或排名承诺。评分和推荐理由独立于佣金。
          </p>
          <Link href="/disclosure" className="mt-3 inline-flex items-center text-sm font-medium text-gold">
            查看完整联盟披露 <ExternalLink className="ml-1 h-3.5 w-3.5" />
          </Link>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <RefreshCw className="h-6 w-6 text-gold" />
            更新与纠错
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            费率、活动和地区限制会变化，核心页面至少每月复核一次；发现错误会尽快更新。若你发现数据过期、链接失效或事实错误，欢迎通过
            <Link href="/contact" className="mx-1 text-gold underline underline-offset-4">反馈页面</Link>
            发邮件或留言，并附页面链接和依据。
          </p>
        </section>

        <section className="rounded-xl border border-border/60 bg-muted/20 p-5 text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">限制：</strong>
          本站是信息与教程平台，不是持牌投资顾问。评测基于公开信息和编辑判断，无法覆盖每个人的税务、合规和风险承受能力；重大决策请咨询专业人士。
        </section>
      </div>
    </div>
  )
}
