import type { Metadata } from "next"
import Link from "next/link"
import { siteConfig } from "@/lib/constants"

export const metadata: Metadata = {
  title: `联盟披露与风险提示 - ${siteConfig.name}`,
  description:
    "币圈指南的联盟链接披露、内容独立性说明与加密资产风险提示。本站内容不构成投资建议。",
  alternates: {
    canonical: `${siteConfig.url}/disclosure`,
  },
}

const sections = [
  {
    id: "affiliate",
    title: "联盟链接披露",
    paragraphs: [
      "本站部分外部链接属于联盟（推广）链接，包括但不限于交易所、TradingView 等产品或服务。当你通过这些链接注册、订阅或购买时，本站可能获得佣金。",
      "佣金不会增加你的购买价格，也不会影响我们对产品的评价。我们只会在自己了解或有实际使用场景的页面放置链接，并尽量说明适用人群与限制。",
      "联盟合作不构成对任何产品的担保。产品的费率、活动、可用地区和条款以官方页面为准，并可能随时调整。",
    ],
  },
  {
    id: "independence",
    title: "内容独立性",
    paragraphs: [
      "评测、教程和工具内容由编辑独立整理；联盟关系不会换取正面评价，也不会删除客观缺点。",
      "如果某篇内容包含联盟链接，页面会在链接附近或文末给出提示。你也可以通过不包含联盟参数的官方网址访问相关产品。",
    ],
  },
  {
    id: "risk",
    title: "风险提示",
    paragraphs: [
      "加密资产价格波动极大，可能在短时间内大幅下跌，甚至归零。杠杆、合约、期权等衍生品会放大风险，可能导致全部本金损失。",
      "本站所有内容仅供信息与教育参考，不构成投资、法律、税务或会计建议，也不构成任何买卖要约或收益承诺。",
      "请根据自身财务状况、风险承受能力和所在地区的法律法规独立决策；必要时咨询持牌专业人士。过往表现不代表未来收益。",
    ],
  },
  {
    id: "data",
    title: "数据与时效",
    paragraphs: [
      "行情、费率和活动信息来自第三方接口或公开资料，可能存在延迟、遗漏或错误；请以交易所或产品官方页面为准。",
      "我们会尽量更新内容，但不保证所有信息在任何时点都完整、准确。发现错误可通过下方反馈页面联系更正。",
    ],
  },
] as const

export default function DisclosurePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        联盟披露与风险提示
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        最后更新：2026 年 10 月
      </p>

      <div className="mt-10 space-y-10">
        {sections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-border/60 bg-muted/30 p-5 text-sm leading-relaxed text-muted-foreground">
        如果你认为某处披露不清晰，或发现链接/数据错误，请发邮件到{" "}
        <a
          href={`mailto:${siteConfig.contactEmail}`}
          className="underline hover:text-gold"
        >
          {siteConfig.contactEmail}
        </a>
        ，或到{" "}
        <Link href="/contact" className="underline hover:text-gold">
          反馈与纠错
        </Link>{" "}
        页面留言。也可以先阅读{" "}
        <Link href="/about" className="underline hover:text-gold">
          关于我们
        </Link>{" "}
        与{" "}
        <Link href="/privacy" className="underline hover:text-gold">
          隐私政策
        </Link>
        。
      </div>
    </div>
  )
}
