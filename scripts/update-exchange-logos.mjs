/**
 * Point exchange records at the official logo files.
 *
 * Dry run:
 *   node scripts/update-exchange-logos.mjs
 * Apply:
 *   node scripts/update-exchange-logos.mjs --apply
 */
import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"

config({ path: ".env.production.local", quiet: true })
config({ path: ".env.local", quiet: true })

const prisma = new PrismaClient()
const APPLY = process.argv.includes("--apply")

const LOGOS = {
  binance: "/images/exchanges/binance.png",
  okx: "/images/exchanges/okx.png",
  bybit: "/images/exchanges/bybit.png",
  bitget: "/images/exchanges/bitget.png",
  "gate-io": "/images/exchanges/gate.png",
  kucoin: "/images/exchanges/kucoin.png",
  htx: "/images/exchanges/htx.png",
}

async function main() {
  console.log(APPLY ? "Applying logo paths…" : "Dry run (pass --apply to write)")

  for (const [slug, logo] of Object.entries(LOGOS)) {
    const exchange = await prisma.exchange.findUnique({ where: { slug } })
    if (!exchange) {
      console.warn(`[missing] ${slug}`)
      continue
    }
    console.log(`[logo] ${slug}: ${exchange.logo ?? "null"} -> ${logo}`)
    if (APPLY) {
      await prisma.exchange.update({ where: { slug }, data: { logo } })
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
