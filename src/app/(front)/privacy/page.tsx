import type { Metadata } from "next"
import Link from "next/link"
import { Shield, Lock, Cookie, Eye, Database, AlertTriangle, FileText, Mail } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { siteConfig } from "@/lib/constants"

export const metadata: Metadata = {
  title: "隐私政策",
  description: "了解我们如何收集、使用和保护您的个人信息。您的隐私对我们至关重要。",
  openGraph: {
    title: "隐私政策",
    description: "了解我们如何收集、使用和保护您的个人信息。",
  },
}

const sections = [
  {
    icon: Shield,
    title: "信息收集",
    content:
      "本站不要求注册账号，不主动收集访客邮箱，也不发送营销邮件或通讯。如果你通过邮件联系我们，我们会收到你的邮箱地址和邮件内容，仅用于回复你的问题。访问本站时，服务器日志和匿名分析工具可能记录 IP 地址、浏览器/设备类型、来源页面、访问时间和访问页面；点击出站链接时，我们会记录目标、时间和来源页面，用于统计与防滥用。使用站内搜索时，我们会记录搜索关键词、结果数量和日期；搜索日志不关联账号、IP 或设备信息，仅用于了解内容缺口和改进搜索。",
  },
  {
    icon: Cookie,
    title: "Cookie 与本地存储",
    content:
      "本站使用少量必要的本地存储来记住主题偏好，并使用匿名分析工具了解页面访问情况。我们不做广告画像，也不出售访客数据。你可以在浏览器中清除或禁用 Cookie/本地存储，但部分偏好设置可能失效。",
  },
  {
    icon: Eye,
    title: "信息使用",
    content:
      "收集的技术信息仅用于：分析内容效果、排查错误和死链、识别异常流量、改进站点结构和搜索。邮件只用于回复你的来信；我们不会用它向你发送营销邮件、推送营销信息，或建立个人画像。",
  },
  {
    icon: Database,
    title: "日志与点击数据",
    content:
      "服务器日志和出站点击记录会按运营需要保留一段合理时间。你可以通过反馈页面或邮件请求查询或删除与你相关的日志记录；我们会在核实后处理。",
  },
  {
    icon: Lock,
    title: "信息共享",
    content:
      "我们不会出售访客信息。仅在以下情况可能与第三方共享：使用托管、分析等必要服务商（受其隐私条款约束）；法律要求；或为保护本站和访客的合法权益。联盟链接的跳转由对应平台按其隐私政策处理。",
  },
  {
    icon: AlertTriangle,
    title: "第三方链接",
    content:
      "本站包含指向交易所、钱包、工具等第三方网站的链接，其中部分为联盟链接。这些网站有独立的隐私政策，我们无法控制其数据处理方式；在提交个人信息前，请先阅读对方的隐私政策。",
  },
  {
    icon: FileText,
    title: "政策更新",
    content:
      "本政策可能随功能调整而更新，最新版本会发布在本页面并标注更新日期。我们不会通过电子邮件另行通知。建议你在使用前查看本页。",
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "隐私政策",
            description: "币圈指南隐私政策",
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "首页", item: siteConfig.url },
                { "@type": "ListItem", position: 2, name: "隐私政策" },
              ],
            },
          }),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/[0.08] via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Shield className="mx-auto h-12 w-12 text-gold/60" />
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              隐私政策
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              最后更新：{new Date().getFullYear()} 年 {new Date().getMonth() + 1} 月
            </p>
            <p className="mt-2 text-sm text-muted-foreground/70">
              我们重视您的隐私，致力于保护您的个人信息
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <div className="rounded-xl border border-border/60 bg-card p-6 sm:p-8">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {siteConfig.name}（以下简称&quot;我们&quot;）深知个人信息对您的重要性，并会全力保护您的隐私。
              本隐私政策说明了在您使用币圈指南网站（以下简称&quot;本网站&quot;）时，我们如何收集、使用、存储和保护您的个人信息。
              请您仔细阅读本政策。继续使用本网站即表示您同意本政策中描述的数据处理实践。
            </p>
          </div>

          {sections.map((section, index) => (
            <div key={section.title}>
              {index > 0 && <Separator className="mb-12" />}
              <div className="flex gap-4 sm:gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                  <section.icon className="h-6 w-6 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="border-t border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <Mail className="mx-auto h-10 w-10 text-gold/60" />
          <h2 className="mt-4 text-2xl font-bold">有任何隐私相关问题？</h2>
          <p className="mt-2 text-muted-foreground">
            可以发邮件到{" "}
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-gold underline decoration-gold/40 underline-offset-4"
            >
              {siteConfig.contactEmail}
            </a>
            ，或通过反馈页面联系我们。
          </p>
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="mt-6 inline-flex items-center rounded-lg bg-gradient-gold px-6 py-3 text-sm font-medium text-white shadow-md shadow-gold/20 transition-all hover:shadow-lg hover:shadow-gold/30"
          >
            发邮件
            <Mail className="ml-2 h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  )
}
