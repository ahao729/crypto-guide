import type { Metadata } from "next"
import { Shield, Lock, Cookie, Eye, Database, Mail, AlertTriangle, FileText } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { siteConfig } from "@/lib/constants"

export const metadata: Metadata = {
  title: "隐私政策 - CryptoGuide",
  description: "了解我们如何收集、使用和保护您的个人信息。您的隐私对我们至关重要。",
  openGraph: {
    title: "隐私政策 - CryptoGuide",
    description: "了解我们如何收集、使用和保护您的个人信息。",
  },
}

const sections = [
  {
    icon: Shield,
    title: "信息收集",
    content:
      "当您访问 CryptoGuide 时，我们可能会收集您主动提供的个人信息，例如您的电子邮件地址（当您订阅通讯时）以及您通过联系表单提交的信息。此外，我们会自动收集某些技术信息，包括 IP 地址、浏览器类型、操作系统、引用页面以及访问时间戳，这些信息有助于我们优化网站性能和用户体验。",
  },
  {
    icon: Cookie,
    title: "Cookie 的使用",
    content:
      "我们使用 Cookie 和类似跟踪技术来提升您的浏览体验。Cookie 是存储在您设备上的小型文本文件，用于记住您的偏好、分析网站流量以及提供个性化内容。您可以通过浏览器设置管理或禁用 Cookie，但请注意，某些功能可能因此无法正常使用。我们使用的 Cookie 包括必要的功能性 Cookie 以及用于匿名流量分析的分析性 Cookie。",
  },
  {
    icon: Database,
    title: "信息存储与安全",
    content:
      "我们采取合理的技术和组织措施来保护您的个人信息免受未经授权的访问、修改、披露或销毁。这些措施包括 SSL/TLS 加密传输、防火墙保护以及定期安全审计。然而，请注意，没有任何互联网传输或电子存储方法是完全安全的。您的信息仅在实现收集目的所必需的期限内保留，或按法律要求保留。",
  },
  {
    icon: Eye,
    title: "信息使用",
    content:
      "我们收集的信息用于以下目的：提供、维护和改进我们的服务；向您发送您所请求的信息（如通讯）；回复您的咨询和请求；分析使用趋势以优化网站内容和结构；检测、预防和解决技术问题或潜在的安全威胁。我们不会将您的个人信息用于与上述目的无关的用途。",
  },
  {
    icon: Lock,
    title: "信息共享与披露",
    content:
      "我们不会向第三方出售您的个人信息。我们仅在以下情况下可能与第三方共享您的信息：获得您的明确同意；为提供服务所必需的受信任合作伙伴（如邮件发送服务），且这些合作伙伴受保密协议约束；法律要求或为保护我们的合法权益。",
  },
  {
    icon: Mail,
    title: "您的权利",
    content:
      "根据适用的数据保护法律，您有权访问、更正或删除我们持有的您的个人信息。您还可以限制或反对某些数据处理活动，以及要求数据可携带性。如果您希望行使这些权利，请通过下方联系方式与我们联系。我们将在合理时间内响应您的请求。",
  },
  {
    icon: AlertTriangle,
    title: "第三方链接",
    content:
      "我们的网站可能包含指向第三方网站或服务的链接。这些网站拥有独立的隐私政策，我们对此不承担任何责任。我们建议您在提供个人信息前阅读所访问的任何第三方网站的隐私政策。",
  },
  {
    icon: FileText,
    title: "政策更新",
    content:
      "我们可能会不时更新本隐私政策。任何变更将在本页面发布更新版本，并附上修订日期。重大变更时，我们可能会通过网站通知或电子邮件方式提醒您。建议您定期查看本页面以了解最新信息。",
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
            description: "CryptoGuide 隐私政策",
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
              本隐私政策说明了在您使用 CryptoGuide 网站（以下简称&quot;本网站&quot;）时，我们如何收集、使用、存储和保护您的个人信息。
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
            如果您对本隐私政策有任何疑问或担忧，请随时与我们联系
          </p>
          <a
            href="/contact"
            className="mt-6 inline-flex items-center rounded-lg bg-gradient-gold px-6 py-3 text-sm font-medium text-white shadow-md shadow-gold/20 transition-all hover:shadow-lg hover:shadow-gold/30"
          >
            联系我们
            <Mail className="ml-2 h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  )
}
