import type { Metadata } from "next"
import {
  FileText,
  Scale,
  Ban,
  Shield,
  AlertTriangle,
  Copyright,
  CheckCircle,
  HelpCircle,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { siteConfig } from "@/lib/constants"

export const metadata: Metadata = {
  title: "服务条款 - CryptoGuide",
  description: "使用 CryptoGuide 网站和服务前请仔细阅读本服务条款。使用本网站即表示您同意这些条款。",
  openGraph: {
    title: "服务条款 - CryptoGuide",
    description: "使用 CryptoGuide 网站和服务前请仔细阅读本服务条款。",
  },
}

const sections = [
  {
    icon: CheckCircle,
    title: "接受条款",
    content:
      "访问或使用 CryptoGuide 网站（以下简称&quot;本网站&quot;）即表示您同意受本服务条款的约束。如果您不同意这些条款的全部内容，请勿使用本网站。我们保留随时修改这些条款的权利，修改后的条款一经发布即生效。您有责任定期查看本页面以了解变更情况。",
  },
  {
    icon: Scale,
    title: "服务说明",
    content:
      "CryptoGuide 是一个提供加密货币交易所信息、指南和比较的资源平台。我们提供的信息仅供一般参考目的，不构成投资建议、财务建议或任何形式的推荐。加密货币市场具有高度波动性和风险，您在做出任何投资决策前应自行进行研究并咨询专业人士。",
  },
  {
    icon: Ban,
    title: "使用限制",
    content:
      "您同意不以任何非法或本条款禁止的方式使用本网站。您不得：复制、修改、分发、出售或租赁本网站的任何部分；使用任何自动化手段（包括爬虫、机器人）访问或抓取本网站内容；干扰或破坏本网站的正常运行；上传或传播任何病毒、恶意代码或其他有害技术；从事任何可能损害、禁用或过度负担本网站基础设施的行为。",
  },
  {
    icon: Shield,
    title: "知识产权",
    content:
      "本网站上的所有内容，包括但不限于文字、图形、标志、图标、图像、音频片段、数字下载、数据汇编和软件，均为 CryptoGuide 或其内容提供商的财产，受适用的知识产权法律保护。未经我们明确的书面许可，不得以任何方式复制、转载、重新发布、上传、发布、传输或分发这些内容。",
  },
  {
    icon: AlertTriangle,
    title: "免责声明",
    content:
      "本网站的信息按&quot;现状&quot;提供，不附带任何明示或暗示的保证。我们不保证信息的准确性、完整性、及时性或适用于任何特定目的。加密货币投资存在重大财务风险，您可能会损失部分或全部投资。CryptoGuide 不对因使用本网站信息而导致的任何损失或损害承担责任。过往表现不代表未来结果。",
  },
  {
    icon: Copyright,
    title: "第三方链接与内容",
    content:
      "本网站可能包含指向第三方网站、交易所或服务的链接。这些链接仅供方便之用，不代表我们对这些第三方的内容、产品、服务或做法的认可。我们对第三方网站的隐私实践、安全措施或内容不承担任何责任。您与任何第三方的互动完全由您自行承担风险。",
  },
  {
    icon: HelpCircle,
    title: "条款变更",
    content:
      "我们保留随时修改或更新本服务条款的权利。当条款发生重大变更时，我们会在本页面发布通知并更新上方的生效日期。继续使用本网站即表示您同意修改后的条款。如果您不同意任何修改，您应停止使用本网站。",
  },
  {
    icon: FileText,
    title: "联系我们",
    content:
      "如果您对本服务条款有任何疑问、意见或投诉，请通过本网站的联系页面与我们取得联系。我们将尽力在合理时间内回复您的咨询。",
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "服务条款",
            description: "CryptoGuide 服务条款",
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "首页", item: siteConfig.url },
                { "@type": "ListItem", position: 2, name: "服务条款" },
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
            <Scale className="mx-auto h-12 w-12 text-gold/60" />
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              服务条款
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              最后更新：{new Date().getFullYear()} 年 {new Date().getMonth() + 1} 月
            </p>
            <p className="mt-2 text-sm text-muted-foreground/70">
              使用本网站前请仔细阅读以下条款
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-4xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-border/60 bg-card p-6 sm:p-8">
          <p className="text-sm leading-relaxed text-muted-foreground">
            欢迎访问 {siteConfig.name}。本服务条款（以下简称&quot;条款&quot;）适用于您对 CryptoGuide 网站（以下简称&quot;本网站&quot;）的访问和使用。
            通过访问或使用本网站，您确认已阅读、理解并同意受这些条款的约束。如果您不同意这些条款，请勿使用本网站。
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-12">
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

      {/* Bottom CTA */}
      <section className="border-t border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <HelpCircle className="mx-auto h-10 w-10 text-gold/60" />
          <h2 className="mt-4 text-2xl font-bold">还有疑问？</h2>
          <p className="mt-2 text-muted-foreground">
            如果您对服务条款有任何疑问，请随时联系我们
          </p>
          <a
            href="/contact"
            className="mt-6 inline-flex items-center rounded-lg bg-gradient-gold px-6 py-3 text-sm font-medium text-white shadow-md shadow-gold/20 transition-all hover:shadow-lg hover:shadow-gold/30"
          >
            联系我们
            <FileText className="ml-2 h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  )
}
