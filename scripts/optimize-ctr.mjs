/**
 * CTR-focused title/excerpt updates for four pages with impressions.
 * Apply: node scripts/optimize-ctr.mjs --apply
 */
import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"

config({ path: ".env.production.local", quiet: true })
config({ path: ".env.local", quiet: true })

const prisma = new PrismaClient()
const APPLY = process.argv.includes("--apply")

const updates = {
  "us-stock-etf-beginners": {
    title: "2026 第一只美股 ETF 怎么选：SPY、VOO、QQQ 费率/流动性对比",
    excerpt:
      "从费率、跟踪指数、流动性和适合人群 4 个维度对比 SPY、VOO、QQQ，附 2026 新手选择清单和币安交易注意事项。",
  },
  "binance-us-stocks-guide": {
    title: "2026 币安美股怎么买：开户、入金、bStocks 与交易时间",
    excerpt:
      "2026 币安美股流程：哪些地区能用、KYC/入金怎么走、直接股票与 bStocks 的 1:1 支持/24/7 差异、交易时间和常见失败原因。",
  },
  "exchange-fee-comparison": {
    title: "2026 交易所手续费对比：5 家现货/合约费率与 $10,000 成本",
    excerpt:
      "对比币安、OKX、Bybit、Bitget、Gate 5 家的现货/合约费率，附 $10,000 与 $50,000 成本示例、提现费和隐藏成本清单。",
  },
  "bstocks-vs-us-stocks": {
    title: "bStocks vs 直接买美股：1:1 支持、24/7 交易与风险（2026）",
    excerpt:
      "bStocks 和直接买美股/ETF 差在哪？对比 1:1 支持、24/7 交易、托管、折溢价、股息/投票权和税务，附 2026 选择清单。",
  },
}

async function main() {
  for (const [slug, update] of Object.entries(updates)) {
    const article = await prisma.article.findUnique({ where: { slug } })
    if (!article) {
      console.warn(`[missing] ${slug}`)
      continue
    }
    console.log(`[ctr] ${slug}`)
    console.log(`  old: ${article.title}`)
    console.log(`  new: ${update.title}`)
    if (APPLY) {
      await prisma.article.update({
        where: { slug },
        data: { title: update.title, excerpt: update.excerpt },
      })
    }
  }
  console.log(APPLY ? "Done." : "Dry run (pass --apply)")
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
