import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const slug = "binance-okx-new-user-campaigns-2026"
const title = "2026 币安 & OKX 新用户活动整理（10 月更新）"
const excerpt =
  "币安新手嘉年华、十月邀请赛、OKX 新手福利包与存款活动：官方入口、参与条件、奖励形式和避坑清单。活动状态以官方页面为准。"

const content = `# 2026 币安 & OKX 新用户活动整理（10 月更新）

> 最后整理：2026-10-22。活动时间、资格、奖励和地区限制以官方页面为准；本文只做入口整理，不构成投资建议。

## 先看结论

- **币安**：10 月可查到新手嘉年华黄金版、十月推荐邀请赛、十月免费领礼品三个活动入口。
- **OKX**：有新手福利包、存款/交易活动和新用户限时任务；部分页面会按地区切换或限制访问。
- 活动通常要求 KYC、净入金、交易量，奖励多为代币券、体验金或任务奖励，不一定是可直接提现的现金。
- 不要为了奖励重复注册、购买 KYC 或伪造地址；可能导致封号、冻结资产。

## 币安

### 1. 新手嘉年华：黄金版礼包

官方公告标题显示：瓜分 **200,000 美元等值奖池**。这是面向新用户的阶段活动，通常需要完成注册、身份认证、入金/交易等任务，具体任务和奖励档位以活动页为准。

官方入口：[币安新手嘉年华：黄金版](https://www.binance.com/zh-CN/support/announcement/detail/752527d39fef4c52a029f98f87b78655)

注意：

- 先看“活动规则”和“适用地区”，不是所有账号都能参加。
- 奖励通常有使用门槛、有效期或锁仓要求。
- 不要为了凑交易量做高频对敲，可能触发风控。

### 2. 十月推荐邀请赛

官方标题显示：邀请好友冲击排行榜，最高 **1,000 USDC 代币券**。这是邀请赛，不是单纯注册礼；适合有社群/内容渠道的人。

官方入口：[十月推荐邀请赛](https://www.binance.com/zh-CN/support/announcement/detail/143edb7fd3204d1696b37ef752a6b032)

注意：

- 排行榜通常按有效邀请人数、交易量或净入金计算。
- 被邀请人需要完成指定任务，才算有效。
- 代币券不是现金，使用规则以券面说明为准。

### 3. 十月免费领礼品

官方标题显示：邀 1 人解锁最高 **28.8 美金**，最高享 **$200 旅游基金**。属于十月限时邀请/礼品活动，具体奖励和名额以页面为准。

官方入口：[十月免费领礼品](https://www.binance.com/zh-CN/support/announcement/detail/7c3238813d184da2a322bead95945df6)

## OKX

### 1. 新手福利包

OKX 官方新手活动页标注“最高 200 美元礼包”，通常包含新手任务、交易体验或奖励券。页面会按地区展示不同内容，中文页面不一定对所有人开放。

官方入口：[OKX 新手福利包](https://www.okx.com/zh-hans/campaigns/learn-bonus2024)

注意：

- 先确认你的地区和账号是否符合资格。
- 任务可能包含 KYC、入金、交易、邀请等，完成顺序会影响奖励。
- 奖励券通常有使用期限和适用产品。

### 2. Deposit and Trade to Earn

OKX 的存款/交易活动，官方页面标注最高 **7% APY**。这类活动不是“新用户专属”，更适合已经有资金的用户；通常有锁仓、最低金额、地区限制。

官方入口：[OKX Deposit and Trade to Earn](https://www.okx.com/zh-hans/campaigns/deposit-trade-earn)

注意：

- APY 是年化参考，不是保证收益。
- 看清锁仓期限、提前赎回规则和奖励发放方式。
- 不要把全部资金锁进单一活动。

### 3. Football Ant 限时新用户任务

OKX 与 Football Ant 的限时新用户任务，官方页面标注为专属任务/合约仓位奖励。此类联名活动时间短、地区限制多，参加前先确认页面是否仍开放。

官方入口：[Football Ant 新用户任务](https://www.okx.com/zh-hans/campaigns/footballant)

## 怎么判断一个活动值不值得做

1. **看净收益**：奖励金额减去入金成本、交易手续费、滑点和锁仓机会成本。
2. **看门槛**：是否需要净入金、交易量、持仓天数、邀请人数。
3. **看发放**：是现金、代币券、体验金还是合约仓位；能否提现。
4. **看风险**：是否需要开合约、加杠杆或授权不熟悉的合约。
5. **看地区**：KYC 地区、IP、证件是否一致；不符合就不要硬做。

## 参加前的检查清单

- [ ] 从官网/官方 App 进入，不点搜索广告或陌生短链
- [ ] 确认活动时间、适用地区和账号资格
- [ ] 阅读活动规则中的“净入金/交易量/发放时间”
- [ ] 不购买 KYC、不共享验证码、不找人代注册
- [ ] 只使用闲钱，不借贷参加
- [ ] 保存活动页面截图和奖励记录
- [ ] 奖励到账后核对券面规则和有效期

## 常见问题

**新用户奖励能直接提现吗？**  
不一定。很多奖励是代币券、体验金或合约仓位，需要满足交易/提现条件。

**可以重复注册多个账号参加吗？**  
不建议。交易所通常禁止多账号/伪造信息，可能导致所有账号被冻结。

**活动页打不开怎么办？**  
可能是地区限制或活动已结束。以官方公告为准，不要从第三方链接强行进入。

**通过本站链接注册有额外费用吗？**  
没有。通过本站邀请链接注册，我们可能获得佣金，不影响你的价格；邀请码和活动以交易所页面为准。

## 最后提醒

活动变化很快，本文是 **2026-10-22 的入口整理**，不保证每个活动仍在进行。参加前请打开官方页面确认；如果活动已结束，不要为了“赶末班车”而追加资金。

> 风险提示：加密资产和衍生品交易风险很高，活动奖励不能抵消市场亏损。本文不构成投资建议。`

const tagDefs = [
  { name: "币安", slug: "binance" },
  { name: "OKX", slug: "okx" },
  { name: "新用户活动", slug: "new-user-campaigns" },
  { name: "注册奖励", slug: "signup-bonus" },
  { name: "活动汇总", slug: "campaigns" },
]

const category = await prisma.category.findUnique({ where: { slug: "guide" } })
if (!category) throw new Error("guide category not found")

const tags = []
for (const tag of tagDefs) {
  tags.push(
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: { name: tag.name },
      create: tag,
    })
  )
}

const article = await prisma.article.upsert({
  where: { slug },
  update: {
    title,
    excerpt,
    content,
    author: "币圈指南编辑部",
    published: true,
    publishedAt: new Date(),
    categoryId: category.id,
    tags: {
      deleteMany: {},
      create: tags.map((tag) => ({ tag: { connect: { id: tag.id } } })),
    },
  },
  create: {
    title,
    slug,
    excerpt,
    content,
    author: "币圈指南编辑部",
    published: true,
    publishedAt: new Date(),
    categoryId: category.id,
    tags: {
      create: tags.map((tag) => ({ tag: { connect: { id: tag.id } } })),
    },
  },
})

console.log("article", article.slug, article.id)
await prisma.$disconnect()
