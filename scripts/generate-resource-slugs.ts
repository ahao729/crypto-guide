/**
 * 为所有 Resource 记录生成 slug
 *
 * 策略：
 *   1. 如果已有 slug → 跳过
 *   2. 否则根据 title 生成拼音风格 slug
 *
 * 用法：npx tsx scripts/generate-resource-slugs.ts
 */

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

/** 中文标题 → URL slug 的映射表 */
const titleToSlug: Record<string, string> = {
  "加密货币入门完全指南": "crypto-beginners-guide",
  "交易所注册与安全设置教程": "exchange-registration-guide",
  "K线技术分析速查手册": "kline-technical-analysis",
  "合约交易入门与风险控制": "futures-trading-guide",
  "加密货币税务申报指南": "crypto-tax-guide",
  "区块链行业术语表": "blockchain-glossary",
  "交易记录追踪表格": "trading-log-template",
  "资产配置计算表": "portfolio-calculator",
  "合约保证金计算器": "futures-margin-calculator",
  "定投回测工具": "dca-backtest-tool",
  "加密钱包安全检测": "wallet-security-check",
  "Gas 费用查询工具": "gas-fee-tracker",
  "CoinMarketCap": "coinmarketcap",
  "CoinGecko": "coingecko",
  "TradingView": "tradingview",
}

function generateSlug(title: string): string {
  if (titleToSlug[title]) return titleToSlug[title]

  // fallback: lowercase, replace spaces with hyphens, strip non-alphanumeric
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-|-$/g, "") || `resource-${Date.now()}`
}

async function main() {
  const resources = await prisma.resource.findMany({
    select: { id: true, title: true, slug: true },
  })

  console.log(`Found ${resources.length} resources`)

  let updated = 0
  for (const r of resources) {
    if (r.slug) {
      console.log(`  ✓ "${r.title}" already has slug "${r.slug}"`)
      continue
    }
    const slug = generateSlug(r.title)
    await prisma.resource.update({
      where: { id: r.id },
      data: { slug },
    })
    console.log(`  → "${r.title}" → slug "${slug}"`)
    updated++
  }

  console.log(`\nDone. Updated ${updated} resources.`)
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
