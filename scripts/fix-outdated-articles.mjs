/**
 * Fix three articles that were generated with shifted dates, and retire the
 * duplicate halving article.
 *
 * Dry run:
 *   node scripts/fix-outdated-articles.mjs
 * Apply:
 *   node scripts/fix-outdated-articles.mjs --apply
 */
import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"

config({ path: ".env.production.local", quiet: true })
config({ path: ".env.local", quiet: true })

const prisma = new PrismaClient()
const APPLY = process.argv.includes("--apply")

const HALVING = `> 最后核对：2026-10-23。本文只做历史复盘与信息整理，不构成投资建议。

## 先说结论

- 比特币第四次减半发生在 **2024 年 4 月 20 日**，区块高度 840,000，区块奖励从 6.25 BTC 降到 3.125 BTC。
- 下一次（第五次）减半预计在 **2028 年**，奖励降到 1.5625 BTC。**2026 年没有减半。**
- 减半改变的是新增供给，不是价格保证。历史涨幅不能直接外推。

## 什么是比特币减半？

比特币的总供应量上限是 2100 万枚。协议规定每产生 210,000 个区块（约 4 年），区块奖励减半一次，直到 2140 年左右不再有新比特币产出。

减半的直接效果是：矿工每挖出一个区块获得的新币减少，市场新增供给下降。它不改变已有比特币的数量，也不改变需求。

## 历次减半时间表

| 次数 | 时间 | 区块奖励变化 |
|---|---|---|
| 第一次 | 2012 年 11 月 | 50 → 25 BTC |
| 第二次 | 2016 年 7 月 | 25 → 12.5 BTC |
| 第三次 | 2020 年 5 月 | 12.5 → 6.25 BTC |
| 第四次 | 2024 年 4 月 | 6.25 → 3.125 BTC |
| 第五次 | 预计 2028 年 | 3.125 → 1.5625 BTC |

## 2024 年这次有什么不同？

### 1. 现货 ETF 已经获批

美国 SEC 在 2024 年 1 月批准了多只比特币现货 ETF，传统券商账户可以直接配置。相比前几次减半，这次多了一条合规资金通道，但资金是否持续流入，取决于费率、宏观环境和配置需求，不能简单等同于“减半必涨”。

### 2. 矿工收入下降，算力会重新定价

减半后区块奖励减少，矿工收入下降。高成本矿机会被淘汰，算力可能短期波动，随后随着矿机迭代和电价变化重新平衡。关注矿工持仓、算力难度和手续费收入，比只看价格更有信息量。

### 3. 宏观环境不同

2024 年之后，利率、流动性和监管预期对加密资产的影响明显上升。减半只是供给端事件，不能单独决定周期。

## 常见误区

- **“2026 年还有一次减半”**：没有。第四次是 2024 年，第五次预计 2028 年。
- **“减半后马上暴涨”**：历史上下一次减半后的行情节奏并不一致，减半前也可能提前交易预期。
- **“减半后矿工一定关机”**：取决于电价、矿机效率和币价，低效矿机退出是逐步发生的。
- **“减半后供给归零”**：没有。奖励只是减半，新币仍会持续产出到 2140 年左右。

## 2028 年减半前可以关注什么？

1. **区块高度和预估时间**：每 210,000 个区块一次，实际日期会因出块速度略有偏差。
2. **ETF 资金流**：净流入/流出比单日价格更能反映机构需求。
3. **矿工成本与算力**：减半前后矿工行为会影响短期供给。
4. **Layer2 与支付场景**：手续费收入和真实使用量，决定长期叙事是否有支撑。

## 数据来源

- Bitcoin 白皮书：https://bitcoin.org/bitcoin.pdf
- 区块高度与减半数据：https://mempool.space/
- 现货 ETF 信息：https://www.sec.gov/

> 本文不构成投资建议。加密资产波动大，请自行研究并承担风险。`

const ETF = `> 最后核对：2026-10-23。本文只做信息整理，不构成投资建议。

## 时间线：不是 2026 年

- **2024 年 1 月 10 日**：美国 SEC 批准 11 只比特币现货 ETF 的上市申请。
- **2024 年 1 月 11 日**：首批产品开始交易。
- 2026 年讨论的重点已经不是“是否获批”，而是资金流、费率战和后续产品。

## 什么是比特币现货 ETF？

现货 ETF 直接持有比特币，基金份额在传统证券交易所交易。投资者用股票账户买卖，不需要自己保管私钥，也不需要注册加密交易所。托管由专业机构完成，但这也意味着你要信任发行方和托管方。

## 主要发行方与费率

| 发行方 | 代表产品 | 费率（以官方为准） |
|---|---|---|
| BlackRock | IBIT | 0.25% |
| Fidelity | FBTC | 0.25% |
| Ark Invest | ARKB | 0.21% |
| Grayscale | GBTC | 约 1.50% |

费率可能调整，也可能有阶段性减免；买入前看发行方官网的最新招募说明书。

## 对市场的影响

### 1. 合规资金通道打开

养老基金、保险公司、注册投资顾问等可以通过传统账户配置比特币，降低了操作门槛。但“可以配置”不等于“会配置”，实际资金流取决于授权范围、风控和客户需求。

### 2. 市场结构变化

ETF 让部分现货需求转到受监管的载体，托管、做市和申赎机制成为基础设施。长期看，流动性和市场深度可能改善；短期看，ETF 申赎和期货基差也会带来新的波动来源。

### 3. 监管框架更清晰

美国先建立了现货 ETF 的监管路径，其他市场可能跟进，但节奏和产品形式不同。不要把美国的进展直接套到所有地区。

## 2026 年回看时要注意什么？

- **净流入比单日涨幅重要**：连续净流入/流出反映配置需求。
- **费率竞争**：低费率产品会吸走长期资金，但流动性和跟踪误差也要看。
- **灰度折溢价**：GBTC 等产品的折溢价会影响套利和换仓。
- **不要用“获批”当买入理由**：获批是结构性事件，不是价格保证。

## 常见问题

**Q：现货 ETF 和期货 ETF 有什么区别？**
A：现货 ETF 持有真实比特币；期货 ETF 持有期货合约，存在展期成本和基差。

**Q：买 ETF 还需要交易所吗？**
A：不需要注册加密交易所，用普通券商账户即可；但你仍然承担比特币价格波动风险。

**Q：ETF 一定比直接买币安全吗？**
A：它解决了私钥保管问题，但引入了发行方、托管方和监管风险。两种方式各有利弊。

## 数据来源

- SEC 2024-01-10 批准公告：https://www.sec.gov/news/press-release/2024-3
- BlackRock iShares Bitcoin Trust：https://www.ishares.com/
- Fidelity Wise Origin Bitcoin Fund：https://www.fidelity.com/
- Grayscale Bitcoin Trust：https://www.grayscale.com/

> 本文不构成投资建议。加密资产波动大，请自行研究并承担风险。`

const DENCUN = `> 最后核对：2026-10-23。本文只做技术回顾，不构成投资建议。

## 时间线：2024 年 3 月，不是 2026 年

- **2024 年 3 月 13 日**：Dencun 硬分叉在以太坊主网激活（epoch 269568）。
- 核心提案是 **EIP-4844（Proto-Danksharding）**，引入 blob 数据空间。
- 此后以太坊还有 Pectra 等升级，具体时间与内容以以太坊基金会公告为准。

## EIP-4844 解决了什么？

在此之前，Layer2 把交易数据写入主网 calldata，成本高且长期占用区块空间。EIP-4844 新增一种临时的 blob 数据空间，专门给 L2 提交数据，blob 会在约 18 天后被删除，不永久占用状态。

这带来的直接变化是：L2 的数据可用性成本下降，转账费用随之降低。但降幅取决于具体 L2、网络拥堵和 blob 使用量，不能简单说“永远降低 90%”。

## 对 Layer2 的影响

- **费用下降**：Arbitrum、Optimism、Base 等 L2 的转账成本明显下降，但不同链、不同时段的差异很大。
- **吞吐提升**：blob 让 L2 可以更便宜地批量提交数据，但执行能力仍受各自排序器/证明系统限制。
- **竞争加剧**：低成本会让 L2 之间的费用战更明显，长期看用户体验和生态应用比“最低 Gas”更重要。

## 2026 年回看：哪些判断需要修正？

- **“Dencun 是 2026 年”**：错误。它是 2024 年 3 月的主网升级。
- **“L2 费用会一直很低”**：不一定。blob 需求上升、L2 排序器策略变化，都会影响实际费用。
- **“升级后所有 L2 都一样便宜”**：不同 L2 的架构、证明成本和排序器策略不同，费用差异仍然存在。

## 对普通用户的意义

1. 在 L2 上转账、交易前，先看当前 Gas 和桥接费用。
2. 大额跨链分步操作，先小额测试。
3. 不要因为“升级”就忽略合约、桥和排序器的风险。

## 数据来源

- Ethereum Dencun 主网公告：https://ethereum.org/en/roadmap/dencun/
- EIP-4844：https://eips.ethereum.org/EIPS/eip-4844
- blob 数据与费用：https://ethereum.org/en/developers/docs/

> 本文不构成投资建议。加密资产波动大，请自行研究并承担风险。`

const updates = {
  "bitcoin-halving-2026": {
    title: "比特币减半全解析：2024 年发生了什么，2028 年怎么看",
    excerpt:
      "比特币第四次减半已在 2024 年 4 月完成，区块奖励降至 3.125 BTC。本文回顾历次减半、这次的不同之处，以及 2028 年下一次减半前值得关注什么。",
    content: HALVING,
  },
  "bitcoin-spot-etf-approved": {
    title: "比特币现货 ETF 获批回看：2024 年 1 月发生了什么",
    excerpt:
      "美国 SEC 于 2024 年 1 月批准 11 只比特币现货 ETF。本文回顾获批时间线、主要发行方与费率、对市场的影响，以及 2026 年回看时需要注意什么。",
    content: ETF,
  },
  "ethereum-dencun-upgrade": {
    title: "以太坊 Dencun 升级回看：EIP-4844 如何降低 Layer2 费用",
    excerpt:
      "Dencun 于 2024 年 3 月 13 日在以太坊主网激活，核心是 EIP-4844（blob）。本文回顾升级内容、对 L2 费用的影响和 2026 年回看时的注意事项。",
    content: DENCUN,
  },
}

const UNPUBLISH = ["bitcoin-halving-2026-analysis"]

async function main() {
  console.log(APPLY ? "Applying article fixes…" : "Dry run (pass --apply to write)")

  for (const [slug, update] of Object.entries(updates)) {
    const article = await prisma.article.findUnique({ where: { slug } })
    if (!article) {
      console.warn(`[missing] ${slug}`)
      continue
    }
    console.log(
      `[update] ${slug}: ${article.title} -> ${update.title} (${update.content.length} chars)`,
    )
    if (APPLY) {
      await prisma.article.update({
        where: { slug },
        data: {
          title: update.title,
          excerpt: update.excerpt,
          content: update.content,
        },
      })
    }
  }

  for (const slug of UNPUBLISH) {
    const article = await prisma.article.findUnique({ where: { slug } })
    if (!article) continue
    console.log(`[unpublish] ${slug}`)
    if (APPLY) {
      await prisma.article.update({
        where: { slug },
        data: { published: false },
      })
    }
  }

  console.log("Done.")
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
