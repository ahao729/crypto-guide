/**
 * Anonymous search-query report.
 *
 * Usage:
 *   npm run report:search
 *   SEARCH_REPORT_DAYS=7 npm run report:search
 */
import fs from "node:fs"
import path from "node:path"
import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"

config({ path: ".env.production.local", quiet: true })
config({ path: ".env.local", quiet: true })

const prisma = new PrismaClient()
const days = Math.max(1, Number(process.env.SEARCH_REPORT_DAYS || 28))
const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
const outDir = process.env.REPORT_OUT_DIR || "reports"

async function main() {
  const logs = await prisma.searchLog.findMany({
    where: { createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
    take: 5000,
  })

  const byQuery = new Map()
  for (const log of logs) {
    const key = log.query.trim().toLowerCase()
    const existing = byQuery.get(key) || {
      query: log.query.trim(),
      count: 0,
      zeroResult: 0,
      lastSeen: log.createdAt,
    }
    existing.count += 1
    if (log.resultCount === 0) existing.zeroResult += 1
    if (log.createdAt > existing.lastSeen) existing.lastSeen = log.createdAt
    byQuery.set(key, existing)
  }

  const rows = [...byQuery.values()].sort((a, b) => b.count - a.count)
  const zero = rows.filter((row) => row.zeroResult > 0).sort((a, b) => b.zeroResult - a.zeroResult)

  const report = {
    generatedAt: new Date().toISOString(),
    periodDays: days,
    since: since.toISOString(),
    totalSearches: logs.length,
    uniqueQueries: rows.length,
    topQueries: rows.slice(0, 30),
    zeroResultQueries: zero.slice(0, 30),
  }

  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, "search-latest.json"), JSON.stringify(report, null, 2))

  const lines = [
    "# Anonymous search report",
    "",
    `Generated: ${report.generatedAt}`,
    `Window: last ${days} days`,
    `Searches: **${report.totalSearches}** · unique: **${report.uniqueQueries}**`,
    "",
    "## Top queries",
    "",
    "| Query | Searches | Zero-result | Last seen |",
    "|---|---:|---:|---|",
    ...report.topQueries.map(
      (row) =>
        `| ${row.query.replaceAll("|", "\\|")} | ${row.count} | ${row.zeroResult} | ${row.lastSeen.toISOString().slice(0, 10)} |`,
    ),
    "",
    "## Content gaps (zero-result)",
    "",
    "These queries returned no articles, exchanges or brands. Consider a guide or directory entry.",
    "",
    "| Query | Searches | Zero-result |",
    "|---|---:|---:|",
    ...report.zeroResultQueries.map(
      (row) => `| ${row.query.replaceAll("|", "\\|")} | ${row.count} | ${row.zeroResult} |`,
    ),
    "",
    "> Search logs contain only query, result count and time; no IP, account or user agent.",
    "",
  ]
  const markdown = lines.join("\n")
  fs.writeFileSync(path.join(outDir, "search-latest.md"), markdown)
  console.log(markdown)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
