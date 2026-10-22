/**
 * Set the referral URL + invite code for newly approved exchange partners.
 *
 * Dry run:
 *   node scripts/update-partner-links.mjs
 * Apply:
 *   node scripts/update-partner-links.mjs --apply
 */
import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"

config({ path: ".env.production.local", quiet: true })
config({ path: ".env.local", quiet: true })

const prisma = new PrismaClient()
const APPLY = process.argv.includes("--apply")

const PARTNERS = {
  "gate-io": {
    referralUrl: "https://www.gatesites.cc/zh/signup/VANGBG8NUQ?ref_type=103",
    inviteCode: "VANGBG8NUQ",
  },
  aster: {
    referralUrl: "https://www.asterdex.com/zh-CN/referral/1evT2I",
    inviteCode: "1evT2I",
  },
  bitget: {
    referralUrl: "https://share.glassgs.com/u/K2017LFC?clacCode=X7QCEV4X",
    inviteCode: "X7QCEV4X",
  },
}

async function main() {
  console.log(APPLY ? "Applying partner links…" : "Dry run (pass --apply to write)")

  for (const [slug, data] of Object.entries(PARTNERS)) {
    const exchange = await prisma.exchange.findUnique({ where: { slug } })
    if (!exchange) {
      console.warn(`[missing] ${slug}`)
      continue
    }

    console.log(
      `[partner] ${slug}: ${exchange.referralUrl ?? "null"} -> ${data.referralUrl}; code ${exchange.inviteCode ?? "null"} -> ${data.inviteCode}`,
    )
    if (APPLY) {
      await prisma.exchange.update({
        where: { slug },
        data: {
          referralUrl: data.referralUrl,
          inviteCode: data.inviteCode,
        },
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
