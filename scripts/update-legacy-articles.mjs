/**
 * Refresh five thin/outdated articles with 2026 content.
 * Apply: node scripts/update-legacy-articles.mjs --apply
 */
import fs from "node:fs"
import path from "node:path"
import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"

config({ path: ".env.production.local", quiet: true })
config({ path: ".env.local", quiet: true })

const prisma = new PrismaClient()
const APPLY = process.argv.includes("--apply")

const pages = {
  "crypto-tax-guide": {
    title: "加密货币税务指南 2026：应税事件、成本记录与申报清单",
    excerpt: "2026 加密税务框架：哪些行为应税、成本基础怎么记、DeFi/空投/NFT 怎么处理，附申报前检查清单。",
    file: "content/legacy/crypto-tax-guide.md",
  },
  "stablecoin-complete-guide": {
    title: "稳定币完全指南 2026：USDT、USDC、DAI 的风险与使用场景",
    excerpt: "稳定币不只是 1:1 锚定：对比法币抵押、加密抵押和收益型稳定币，拆解脱锚、储备、托管和监管风险。",
    file: "content/legacy/stablecoin-complete-guide.md",
  },
  "defi-complete-guide": {
    title: "DeFi 去中心化金融入门 2026：借贷、DEX、收益与风险",
    excerpt: "从 DEX、借贷、稳定币到流动性，拆解 DeFi 的收益来源、合约/授权/清算风险和新手操作顺序。",
    file: "content/legacy/defi-complete-guide.md",
  },
  "airdrop-guide-2026": {
    title: "加密货币空投指南 2026：交互、成本与防骗清单",
    excerpt: "空投不是稳赚：拆解交互流程、成本、反女巫、骗局信号和税务记录，附防骗检查清单。",
    file: "content/legacy/airdrop-guide-2026.md",
  },
  "ethereum-staking-complete-guide": {
    title: "以太坊质押指南 2026：Solo、LST 与交易所质押的风险对比",
    excerpt: "以太坊质押四种方式对比：32 ETH Solo、质押池、LST 和交易所质押，拆解 slashing、脱锚、流动性和锁仓风险。",
    file: "content/legacy/ethereum-staking-complete-guide.md",
  },
}

async function main() {
  for (const [slug, page] of Object.entries(pages)) {
    const article = await prisma.article.findUnique({ where: { slug } })
    if (!article) {
      console.warn(`[missing] ${slug}`)
      continue
    }
    const content = fs.readFileSync(path.resolve(page.file), "utf8")
    console.log(`[update] ${slug}: ${article.title} -> ${page.title} (${content.length} chars)`)
    if (APPLY) {
      await prisma.article.update({
        where: { slug },
        data: { title: page.title, excerpt: page.excerpt, content },
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
