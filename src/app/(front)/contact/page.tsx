import type { Metadata } from "next"
import Link from "next/link"
import {
  AlertTriangle,
  Bug,
  Clock,
  ExternalLink,
  Handshake,
  MessageSquare,
  ShieldCheck,
} from "lucide-react"
import { siteConfig, socialLinks } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "反馈与纠错",
  description:
    "本站不设官方邮箱，也不向访客发送邮件。内容纠错、死链、合作与安全问题，请通过 Telegram 或 X 反馈。",
  openGraph: {
    title: "反馈与纠错",
    description:
      "本站不设官方邮箱，也不向访客发送邮件。请通过 Telegram 或 X 反馈问题。",
  },
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
}

const telegram = socialLinks.find((link) => link.label === "Telegram")
const xProfile = socialLinks.find((link) => link.label === "X")

const feedbackItems = [
  {
    icon: Bug,
    title: "内容纠错 / 死链",
    description: "数据过期、费率写错、链接打不开、文章事实有误。",
  },
  {
    icon: Handshake,
    title: "合作与联盟",
    description: "交易所、工具、资源类合作；请附上项目介绍和合作方式。",
  },
  {
    icon: ShieldCheck,
    title: "安全与隐私",
    description: "发现钓鱼链接、仿冒页面或隐私问题，请优先告知。",
  },
]

const faqs = [
  {
    q: "为什么不设官方邮箱？",
    a: "本站目前不通过邮件做客服或营销，也不收集访客邮箱。反馈统一走 Telegram 或 X，减少垃圾邮件和钓鱼风险。",
  },
  {
    q: "多久会回复？",
    a: "会尽快查看，但不承诺固定时限。涉及安全或大面积错误的问题会优先处理。",
  },
  {
    q: "可以投稿或合作吗？",
    a: "可以。请在 Telegram 或 X 私信里说明主题、受众和合作方式；不接受保证收益、带单、代操作类合作。",
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "反馈与纠错",
            description: "通过 Telegram 或 X 向币圈指南反馈问题",
            url: `${siteConfig.url}/contact`,
            inLanguage: siteConfig.locale,
          }),
        }}
      />

      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/[0.08] via-transparent to-transparent" />
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
          <MessageSquare className="mx-auto h-12 w-12 text-gold/60" />
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            反馈与纠错
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            本站不设官方邮箱，也不向访客发送邮件。内容纠错、死链、合作或安全问题，
            请通过 Telegram 或 X 找到我们。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {telegram && (
              <Button className="bg-gradient-gold text-white shadow-md shadow-gold/20" asChild>
                <a href={telegram.href} target="_blank" rel="noopener noreferrer">
                  加入 Telegram
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
            {xProfile && (
              <Button variant="outline" asChild>
                <a href={xProfile.href} target="_blank" rel="noopener noreferrer">
                  打开 X
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            不通过邮件沟通，也不收集访客邮箱。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {feedbackItems.map((item) => (
            <div key={item.title} className="rounded-xl border border-border/60 bg-card p-5">
              <item.icon className="h-5 w-5 text-gold" />
              <h2 className="mt-3 font-semibold">{item.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <Separator className="my-10" />

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <Clock className="h-5 w-5 text-gold" />
              反馈时请附上
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>• 出问题的页面链接</li>
              <li>• 截图或具体错误描述</li>
              <li>• 你的设备/浏览器（如果是显示问题）</li>
              <li>• 涉及数据时，附上官方来源链接</li>
            </ul>
          </div>
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              不处理的范围
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>• 投资建议、买卖点位、代操作账户</li>
              <li>• 交易所账户冻结/KYC/提现问题（请联系交易所客服）</li>
              <li>• 保证收益、带单、信号群类合作</li>
              <li>• 任何索要私钥、助记词或验证码的请求</li>
            </ul>
          </div>
        </div>

        <Separator className="my-10" />

        <h2 className="text-xl font-bold">常见问题</h2>
        <div className="mt-4 space-y-3">
          {faqs.map((faq) => (
            <details key={faq.q} className="rounded-xl border border-border/60 bg-card p-4">
              <summary className="cursor-pointer font-medium">{faq.q}</summary>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {faq.a}
              </p>
            </details>
          ))}
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          想先了解我们？看看{" "}
          <Link href="/about" className="text-gold underline">
            社区介绍
          </Link>{" "}
          或{" "}
          <Link href="/disclosure" className="text-gold underline">
            联盟披露
          </Link>
          。
        </p>
      </section>
    </div>
  )
}
