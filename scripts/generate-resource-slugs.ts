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
  // 新手入门
  "加密货币入门完全指南": "crypto-beginners-guide",
  // 交易所
  "交易所注册与安全设置教程": "exchange-registration-guide",
  "全球主流交易所导航": "exchange-directory",
  // 钱包
  "钱包安全使用手册": "wallet-security-handbook",
  // 图表
  "K线技术分析速查手册": "kline-technical-analysis",
  "CoinGecko 行情追踪": "coingecko-tracker",
  "TradingView 专业图表": "tradingview-charts",
  "链上数据分析指南": "onchain-analytics",
  // 交易
  "合约交易入门与风险控制": "futures-trading-guide",
  "交易记录追踪模板": "trading-log-template",
  // 工具
  "资产配置计算表": "portfolio-calculator",
  "仓位管理计算表": "position-manager",
  "合约保证金计算器": "futures-margin-calculator",
  "定投回测工具": "dca-backtest-tool",
  "DCA 定投计划表": "dca-plan",
  "Gas 费用查询工具": "gas-fee-tracker",
  "Gas 费优化指南": "gas-optimization",
  // 税务
  "加密货币税务申报指南": "crypto-tax-guide",
  // 术语
  "区块链行业术语表": "blockchain-glossary",
  // 学习
  "加密货币学习路线图": "learning-roadmap",
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
  // First, backfill any null slugs with temporary values so Prisma can read them
  await prisma.$executeRawUnsafe(
    `UPDATE "Resource" SET slug = 'pending-' || id WHERE slug IS NULL OR slug = ''`
  )

  const resources = await prisma.resource.findMany({
    select: { id: true, title: true, slug: true },
  })

  console.log(`Found ${resources.length} resources`)

  let updated = 0
  for (const r of resources) {
    if (r.slug && !r.slug.startsWith("pending-") && /^[\x20-\x7e]+$/.test(r.slug)) {
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
