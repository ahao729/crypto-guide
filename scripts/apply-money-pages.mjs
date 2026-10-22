/**
 * Replace two money-page bodies from content/money-pages/*.md.
 *
 * Dry run:
 *   node scripts/apply-money-pages.mjs
 * Apply:
 *   node scripts/apply-money-pages.mjs --apply
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
  "binance-registration-guide": {
    title: "币安 Binance 注册教程 2026：邮箱、KYC、2FA 与入金步骤",
    excerpt:
      "2026 年币安注册流程：邮箱/手机号、验证码、KYC、2FA、防钓鱼码、入金和第一笔交易，附常见问题与官方来源。",
    file: "content/money-pages/binance-registration-guide.md",
  },
  "exchange-fee-comparison": {
    title: "2026 交易所手续费对比：现货、合约与隐藏成本",
    excerpt:
      "对比币安、OKX、Bybit、Bitget、Gate 等交易所的标准现货/合约费率，附 $10,000 与 $50,000 成本示例、隐藏成本和核对方法。",
    file: "content/money-pages/exchange-fee-comparison.md",
  },
}

async function main() {
  console.log(APPLY ? "Applying money pages…" : "Dry run (pass --apply to write)")

  for (const [slug, page] of Object.entries(pages)) {
    const article = await prisma.article.findUnique({ where: { slug } })
    if (!article) {
      console.warn(`[missing] ${slug}`)
      continue
    }
    const content = fs.readFileSync(path.resolve(page.file), "utf8")
    console.log(
      `[update] ${slug}: ${article.title} -> ${page.title} (${content.length} chars)`,
    )
    if (APPLY) {
      await prisma.article.update({
        where: { slug },
        data: { title: page.title, excerpt: page.excerpt, content },
      })
    }
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
