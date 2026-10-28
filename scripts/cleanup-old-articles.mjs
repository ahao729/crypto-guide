/**
 * Retire two thin/outdated articles and keep their URLs redirecting.
 * Apply: node scripts/cleanup-old-articles.mjs --apply
 */
import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"

config({ path: ".env.production.local", quiet: true })
config({ path: ".env.local", quiet: true })

const prisma = new PrismaClient()
const APPLY = process.argv.includes("--apply")

const RETIRE = [
  "hong-kong-crypto-regulation",
  "crypto-market-review-2026-q1",
]

async function main() {
  for (const slug of RETIRE) {
    const article = await prisma.article.findUnique({ where: { slug } })
    if (!article) continue
    console.log(`[retire] ${slug}: ${article.title}`)
    if (APPLY) {
      await prisma.article.update({ where: { slug }, data: { published: false } })
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
