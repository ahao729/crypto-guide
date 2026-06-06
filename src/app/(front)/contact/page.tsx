import type { Metadata } from "next"
import { Mail, MessageSquare, Send, HelpCircle, ExternalLink } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { siteConfig, socialLinks } from "@/lib/constants"

export const metadata: Metadata = {
  title: "联系我们 - CryptoGuide",
  description: "有任何问题或建议？通过联系表单、社群或邮件与我们取得联系。",
  openGraph: {
    title: "联系我们 - CryptoGuide",
    description: "有任何问题或建议？通过联系表单、社群或邮件与我们取得联系。",
  },
}

const faqItems = [
  {
    q: "如何提交交易所的反馈或纠错？",
    a: "您可以通过下方联系表单直接提交，或在对应交易所页面底部找到「反馈」按钮。我们会在 2-3 个工作日内回复。",
  },
  {
    q: "我可以在 CryptoGuide 上发布合作内容吗？",
    a: "欢迎优质内容合作。请通过联系表单提交合作意向，附上您的项目简介和合作方式，我们会尽快评估并与您联系。",
  },
  {
    q: "发现网站错误怎么办？",
    a: "如果您发现任何错误、死链接或信息不准确，请通过表单告知我们。帮助我们改进就是对社区最大的贡献！",
  },
  {
    q: "一般回复时间是多久？",
    a: "我们通常在 1-3 个工作日内回复所有咨询。高峰时期可能会稍有延迟，请耐心等待。",
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "联系我们",
            description: "CryptoGuide 联系方式",
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "首页", item: siteConfig.url },
                { "@type": "ListItem", position: 2, name: "联系我们" },
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
            <MessageSquare className="mx-auto h-12 w-12 text-gold/60" />
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              联系我们
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              有任何问题、建议或合作意向？我们期待听到你的声音
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-border/60 bg-card p-6 sm:p-8">
              <h2 className="text-xl font-semibold">发送消息</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                填写以下表单，我们会尽快回复你
              </p>
              <form
                action={siteConfig.contactEmail ? `https://formspree.io/f/${siteConfig.contactEmail}` : "#"}
                method="POST"
                className="mt-8 space-y-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium">
                      姓名
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="你的名字"
                      className="mt-1.5 block w-full rounded-lg border border-border/60 bg-background px-4 py-2.5 text-sm shadow-sm placeholder:text-muted-foreground/50 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium">
                      邮箱
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="your@email.com"
                      className="mt-1.5 block w-full rounded-lg border border-border/60 bg-background px-4 py-2.5 text-sm shadow-sm placeholder:text-muted-foreground/50 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium">
                    主题
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="mt-1.5 block w-full rounded-lg border border-border/60 bg-background px-4 py-2.5 text-sm shadow-sm focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
                  >
                    <option value="">请选择主题</option>
                    <option value="feedback">网站反馈</option>
                    <option value="correction">信息纠错</option>
                    <option value="cooperation">合作咨询</option>
                    <option value="question">一般问题</option>
                    <option value="other">其他</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium">
                    消息
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder="请详细描述你的问题或建议..."
                    className="mt-1.5 block w-full rounded-lg border border-border/60 bg-background px-4 py-2.5 text-sm shadow-sm placeholder:text-muted-foreground/50 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 resize-y"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-gold text-white shadow-md shadow-gold/20 hover:shadow-lg hover:shadow-gold/30"
                >
                  发送消息
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Email */}
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <Mail className="h-6 w-6 text-gold" />
              <h3 className="mt-3 font-semibold">电子邮件</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                你也可以直接通过邮件联系我们
              </p>
              {siteConfig.contactEmail ? (
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="mt-2 inline-flex items-center text-sm font-medium text-gold hover:text-gold/80 transition-colors"
                >
                  {siteConfig.contactEmail}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  邮件联系方式即将上线
                </p>
              )}
            </div>

            {/* Social */}
            {socialLinks && socialLinks.length > 0 && (
              <div className="rounded-xl border border-border/60 bg-card p-6">
                <MessageSquare className="h-6 w-6 text-gold" />
                <h3 className="mt-3 font-semibold">加入社区</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  在社群中与其他加密爱好者交流
                </p>
                <div className="mt-4 space-y-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-2.5 text-sm transition-colors hover:border-gold/30 hover:bg-gold/[0.02]"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Response time */}
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <HelpCircle className="h-6 w-6 text-gold" />
              <h3 className="mt-3 font-semibold">回复时间</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                我们通常在 <strong>1-3 个工作日</strong>内回复所有咨询。
                高峰时期可能稍有延迟，感谢你的耐心。
              </p>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <HelpCircle className="mx-auto h-10 w-10 text-gold/60" />
          <h2 className="mt-4 text-2xl font-bold">常见问题</h2>
          <p className="mt-2 text-muted-foreground">
            联系之前，或许可以在下面找到答案
          </p>
        </div>
        <div className="mt-10 space-y-4">
          {faqItems.map((item) => (
            <div
              key={item.q}
              className="rounded-xl border border-border/60 bg-card p-5 transition-colors hover:border-gold/20"
            >
              <h3 className="font-semibold">{item.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">期待你的来信</h2>
          <p className="mt-2 text-muted-foreground">
            你的每一条反馈都在帮助我们变得更好
          </p>
        </div>
      </section>
    </div>
  )
}
