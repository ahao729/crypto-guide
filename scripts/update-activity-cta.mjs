import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
const slug = "binance-okx-new-user-campaigns-2026"
const row = await prisma.article.findUnique({ where: { slug } })
if (!row) throw new Error("article not found")
let content = row.content

const top = `## 通过本站链接注册

如果你还没有账号，可以通过本站专属链接注册。通过链接注册我们可能获得佣金，不影响你的手续费；活动资格和奖励仍以交易所页面为准。

- [注册币安 Binance](/go/cmq31dwtf000xjrf3xf2vgo6p)
- [注册 OKX](/go/cmq31dxdn000zjrf3hu4waqzo)

`
if (!content.includes(top)) throw new Error("top block not found")
content = content.replace(
  top,
  `> 说明：下方每个活动都附有本站注册链接；通过链接注册我们可能获得佣金，不影响你的手续费。活动资格、奖励和截止时间以官方页面为准。\n\n`
)

const binanceCta = `\n\n**注册入口：** [通过本站链接注册币安](/go/cmq31dwtf000xjrf3xf2vgo6p)（联盟链接，注册后我们可能获得佣金，不影响你的手续费）`
const okxCta = `\n\n**注册入口：** [通过本站链接注册 OKX](/go/cmq31dxdn000zjrf3hu4waqzo)（联盟链接，注册后我们可能获得佣金，不影响你的手续费）`

const items = [
  ["官方入口：[币安新手嘉年华：黄金版](https://www.binance.com/zh-CN/support/announcement/detail/752527d39fef4c52a029f98f87b78655)", binanceCta],
  ["官方入口：[十月推荐邀请赛](https://www.binance.com/zh-CN/support/announcement/detail/143edb7fd3204d1696b37ef752a6b032)", binanceCta],
  ["官方入口：[十月免费领礼品](https://www.binance.com/zh-CN/support/announcement/detail/7c3238813d184da2a322bead95945df6)", binanceCta],
  ["官方入口：[OKX 新手福利包](https://www.okx.com/zh-hans/campaigns/learn-bonus2024)", okxCta],
  ["官方入口：[OKX Deposit and Trade to Earn](https://www.okx.com/zh-hans/campaigns/deposit-trade-earn)", okxCta],
  ["官方入口：[Football Ant 新用户任务](https://www.okx.com/zh-hans/campaigns/footballant)", okxCta],
]
for (const [line, cta] of items) {
  if (!content.includes(line)) throw new Error(`missing line: ${line}`)
  content = content.replace(line, line + cta)
}

await prisma.article.update({
  where: { slug },
  data: { content },
})
console.log("updated", content.length, "binance_cta", (content.match(/注册币安/g) || []).length, "okx_cta", (content.match(/注册 OKX/g) || []).length)
await prisma.$disconnect()
