/**
 * Remove template/placeholder affiliate links from exchanges we do not have a
 * partnership with, and clean the one article that hard-coded the old Bitget
 * code.
 *
 * Dry run (default):
 *   node scripts/clean-nonpartner-referrals.mjs
 *
 * Apply:
 *   node scripts/clean-nonpartner-referrals.mjs --apply
 *
 * The app already refuses to redirect non-partners through /go and neutralises
 * stale CROW5SEED links at render time. This script cleans the underlying data
 * so the admin UI and API are honest too.
 */
import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"

config({ path: ".env.production.local", quiet: true })
config({ path: ".env.local", quiet: true })

const prisma = new PrismaClient()
const APPLY = process.argv.includes("--apply")
const PARTNERS = new Set(["binance", "okx", "bybit", "gate-io", "aster"])

const OFFICIAL_URLS = {
  bitget: "https://www.bitget.com/",
  "gate-io": "https://www.gate.io/",
  kucoin: "https://www.kucoin.com/",
  mexc: "https://www.mexc.com/",
  htx: "https://www.htx.com/",
  bingx: "https://bingx.com/",
  lbank: "https://www.lbank.com/",
  coinw: "https://www.coinw.com/",
  deepcoin: "https://www.deepcoin.com/",
  hyperliquid: "https://app.hyperliquid.xyz/trade",
  aster: "https://www.asterdex.com/",
}

const STALE_LINK_REPLACEMENTS = [
  [
    /https:\/\/www\.bitget\.com\/referral\/CROW5SEED/g,
    "/exchanges/bitget",
  ],
  [/https:\/\/www\.gate\.io\/signup\/CROW5SEED/g, "/exchanges/gate-io"],
  [/https:\/\/www\.kucoin\.com\/[^\s)"']*CROW5SEED[^\s)"']*/g, "/exchanges/kucoin"],
  [/https:\/\/www\.mexc\.com\/[^\s)"']*CROW5SEED[^\s)"']*/g, "/exchanges/mexc"],
  [/https:\/\/www\.htx\.com\/[^\s)"']*CROW5SEED[^\s)"']*/g, "/exchanges/htx"],
  [/https:\/\/bingx\.com\/[^\s)"']*CROW5SEED[^\s)"']*/g, "/exchanges/bingx"],
  [/https:\/\/www\.lbank\.com\/[^\s)"']*CROW5SEED[^\s)"']*/g, "/exchanges/lbank"],
  [/https:\/\/www\.coinw\.com\/[^\s)"']*CROW5SEED[^\s)"']*/g, "/exchanges/coinw"],
  [/https:\/\/www\.deepcoin\.com\/[^\s)"']*CROW5SEED[^\s)"']*/g, "/exchanges/deepcoin"],
]

async function cleanExchanges() {
  const exchanges = await prisma.exchange.findMany()
  let changes = 0

  for (const exchange of exchanges) {
    if (PARTNERS.has(exchange.slug)) continue
    const official = OFFICIAL_URLS[exchange.slug]
    if (!official) continue

    const needsUpdate =
      exchange.referralUrl !== official || exchange.inviteCode !== null
    if (!needsUpdate) continue

    changes += 1
    console.log(
      `[exchange] ${exchange.slug}: ${exchange.referralUrl ?? "null"} -> ${official}; inviteCode: ${exchange.inviteCode ?? "null"} -> null`,
    )
    if (APPLY) {
      await prisma.exchange.update({
        where: { id: exchange.id },
        data: { referralUrl: official, inviteCode: null },
      })
    }
  }

  return changes
}

async function cleanArticles() {
  const articles = await prisma.article.findMany({
    select: { id: true, slug: true, content: true },
  })
  let changes = 0

  for (const article of articles) {
    if (!article.content?.includes("CROW5SEED")) continue

    let content = article.content
    for (const [pattern, replacement] of STALE_LINK_REPLACEMENTS) {
      content = content.replace(pattern, replacement)
    }
    content = content
      .replace(/点击链接注册 Bitget 账户/g, "查看 Bitget 评测与注册入口")
      .replace(
        /（使用推荐链接可享手续费折扣）/g,
        "（本站暂无该交易所联盟码，注册请核对官网）",
      )

    if (content === article.content) continue
    changes += 1
    console.log(`[article] ${article.slug}: rewrote stale affiliate link`)
    if (APPLY) {
      await prisma.article.update({
        where: { id: article.id },
        data: { content },
      })
    }

    if (content.includes("CROW5SEED")) {
      console.warn(
        `[article] ${article.slug}: still contains CROW5SEED after rewrite; review manually`,
      )
    }
  }

  return changes
}

async function main() {
  console.log(APPLY ? "Applying cleanup…" : "Dry run (pass --apply to write)")
  const exchangeChanges = await cleanExchanges()
  const articleChanges = await cleanArticles()
  console.log(
    `Done. exchanges=${exchangeChanges}, articles=${articleChanges}${APPLY ? "" : " (no writes)"}`,
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
