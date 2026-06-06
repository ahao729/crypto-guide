import type { Metadata } from "next"
import { siteConfig } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, Users, Shield, Sparkles, Link, Gift, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: `加入社群 - ${siteConfig.name}`,
  description: `加入${siteConfig.name}官方社群，与万千加密货币投资者一起交流交易所评测、撸空投、链上机会和投资心得。`,
  keywords: ["币圈社群", "加密货币交流群", "交易所讨论群", "撸空投社群", "币圈交流群", "Telegram群", "Discord社区"],
  openGraph: {
    title: `加入社群 - ${siteConfig.name}`,
    description: `加入${siteConfig.name}官方社群，与万千加密货币投资者一起交流交易所评测、撸空投、链上机会和投资心得。`,
    url: `${siteConfig.url}/about`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `加入社群 - ${siteConfig.name}`,
    description: `加入${siteConfig.name}官方社群，与万千加密货币投资者一起交流交易所评测、撸空投、链上机会和投资心得。`,
  },
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
}

const features = [
  {
    icon: MessageCircle,
    title: "实时交流",
    description: "与群友实时讨论交易所动态、市场热点和撸毛机会，信息不再滞后",
  },
  {
    icon: Gift,
    title: "专属福利",
    description: "社群成员专享交易所返佣加码、空投白名单和合作渠道VIP通道",
  },
  {
    icon: Users,
    title: "万人在线",
    description: "汇聚数千名加密货币爱好者，不同水平互相帮助，共同成长",
  },
  {
    icon: Shield,
    title: "安全预警",
    description: "第一时间推送交易所安全事件、钓鱼预警和平台风险提示",
  },
  {
    icon: Sparkles,
    title: "策略分享",
    description: "群友分享撸空投教程、交互策略和链上工具使用心得",
  },
  {
    icon: Link,
    title: "资源互通",
    description: "交易所返佣链接、撸空投教程、行业研报等资源一站式获取",
  },
]

const platforms = [
  {
    name: "Telegram 群",
    description: "最活跃的主阵地，实时讨论交易所评测、撸空投和链上机会",
    members: "3,000+ 群友",
    href: "https://t.me/your_group_link",
    icon: ExternalLink,
    color: "bg-sky-500/10 text-sky-500",
  },
  {
    name: "Discord 社区",
    description: "按主题分频道的深度交流空间，适合长文讨论和资源沉淀",
    members: "1,500+ 成员",
    href: "https://discord.gg/your_invite",
    icon: ExternalLink,
    color: "bg-indigo-500/10 text-indigo-500",
  },
  {
    name: "微信群",
    description: "面向中文用户的便捷交流群，每日精选内容推送",
    members: "已开 5 群",
    href: "https://t.me/your_wechat_bot",
    icon: ExternalLink,
    color: "bg-emerald-500/10 text-emerald-500",
  },
]

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: `加入社群 - ${siteConfig.name}`,
  description: `加入${siteConfig.name}官方社群，与万千加密货币投资者一起交流交易所评测、撸空投、链上机会和投资心得。`,
  url: `${siteConfig.url}/about`,
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${siteConfig.url}/about`,
  },
}

const aboutBreadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "首页", item: siteConfig.url },
    { "@type": "ListItem", position: 2, name: "加入社群", item: `${siteConfig.url}/about` },
  ],
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutBreadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/[0.08] via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              加入
              <span className="text-gradient-gold ml-2">币圈社群</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              与万千加密货币投资者一起交流、分享、成长
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button className="bg-gradient-gold text-white shadow-md shadow-gold/20" asChild>
                <a href="https://t.me/your_group_link" target="_blank" rel="noopener noreferrer">
                  加入 Telegram 群
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://discord.gg/your_invite" target="_blank" rel="noopener noreferrer">
                  加入 Discord
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border/60 bg-card p-6 text-center">
            <div className="text-3xl font-bold text-gold">5,000+</div>
            <div className="mt-1 text-sm text-muted-foreground">社群成员</div>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-6 text-center">
            <div className="text-3xl font-bold text-gold">3</div>
            <div className="mt-1 text-sm text-muted-foreground">交流平台</div>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-6 text-center">
            <div className="text-3xl font-bold text-gold">每日</div>
            <div className="mt-1 text-sm text-muted-foreground">活跃讨论</div>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-6 text-center">
            <div className="text-3xl font-bold text-gold">免费</div>
            <div className="mt-1 text-sm text-muted-foreground">加入社群</div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Why Join */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">为什么加入我们</h2>
          <p className="mt-2 text-muted-foreground">一个纯粹的加密货币交流社区，拒绝广告、拒绝噪音</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border/60 bg-card p-6 transition-all hover:border-gold/30 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10">
                <feature.icon className="h-6 w-6 text-gold" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Platforms */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">选择你的平台</h2>
          <p className="mt-2 text-muted-foreground">无论你习惯哪个平台，我们都有一席之地</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {platforms.map((platform) => (
            <a
              key={platform.name}
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-border/60 bg-card p-6 transition-all hover:border-gold/30 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${platform.color}`}>
                  <platform.icon className="h-6 w-6" />
                </div>
                <span className="text-xs text-muted-foreground">{platform.members}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold group-hover:text-gold transition-colors">
                {platform.name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{platform.description}</p>
              <div className="mt-4 flex items-center text-sm font-medium text-gold opacity-0 transition-opacity group-hover:opacity-100">
                立即加入
                <ExternalLink className="ml-1 h-3 w-3" />
              </div>
            </a>
          ))}
        </div>
      </section>

      <Separator />

      {/* Rules */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Shield className="mx-auto h-10 w-10 text-gold/60" />
          <h2 className="mt-4 text-2xl font-bold">社群守则</h2>
          <p className="mt-2 text-muted-foreground">
            为了维护高质量的交流环境，请所有成员遵守以下基本规则
          </p>
          <div className="mt-8 text-left space-y-4">
            <div className="rounded-lg border border-border/60 bg-card p-4">
              <p className="font-medium">1. 禁止广告与垃圾信息</p>
              <p className="mt-1 text-sm text-muted-foreground">未经许可不得发送任何形式的广告、推广链接或垃圾信息</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-card p-4">
              <p className="font-medium">2. 尊重他人，理性讨论</p>
              <p className="mt-1 text-sm text-muted-foreground">禁止人身攻击、辱骂、歧视性言论，保持友好交流氛围</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-card p-4">
              <p className="font-medium">3. 谨防诈骗与私信骚扰</p>
              <p className="mt-1 text-sm text-muted-foreground">管理员不会主动私信索要钱财或私钥，请勿向陌生人转账</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-card p-4">
              <p className="font-medium">4. 禁止讨论违法内容</p>
              <p className="mt-1 text-sm text-muted-foreground">不得讨论洗钱、非法集资、传销等违法活动</p>
            </div>
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="border-t border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <Users className="mx-auto h-10 w-10 text-gold/60" />
          <h2 className="mt-4 text-2xl font-bold">立即加入我们</h2>
          <p className="mt-2 text-muted-foreground">
            和数千名加密货币爱好者一起，在投资路上不再孤单
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button className="bg-gradient-gold text-white shadow-md shadow-gold/20" asChild>
              <a href="https://t.me/your_group_link" target="_blank" rel="noopener noreferrer">
                Telegram 群
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://discord.gg/your_invite" target="_blank" rel="noopener noreferrer">
                Discord 社区
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://t.me/your_wechat_bot" target="_blank" rel="noopener noreferrer">
                微信群
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
