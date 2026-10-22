/**
 * Outbound-click attribution report.
 *
 * Usage:
 *   npm run report:attribution
 *   ATTRIBUTION_DAYS=7 npm run report:attribution
 *
 * This is click-level attribution only. Registration/deposit attribution
 * still requires the affiliate program's postback/sub-id support.
 */
import fs from "node:fs"
import path from "node:path"
import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"

config({ path: ".env.production.local", quiet: true })
config({ path: ".env.local", quiet: true })

const prisma = new PrismaClient()
const days = Math.max(1, Number(process.env.ATTRIBUTION_DAYS || 28))
const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
const outDir = process.env.REPORT_OUT_DIR || "reports"

function top(map, limit = 20) {
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit)
}

async function main() {
  const [logs, exchanges] = await Promise.all([
    prisma.clickLog.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.exchange.findMany({ select: { id: true, name: true, slug: true } }),
  ])

  const exchangeName = new Map(exchanges.map((x) => [x.id, x.name]))
  const byPlacement = new Map()
  const byTarget = new Map()
  const byDay = new Map()
  const byReferer = new Map()

  for (const log of logs) {
    const source = log.source || "(unknown)"
    const placement = log.placement || "(unknown)"
    const placementKey = `${source} / ${placement}`
    byPlacement.set(placementKey, (byPlacement.get(placementKey) || 0) + 1)

    const target = exchangeName.get(log.targetId) || log.targetId
    byTarget.set(target, (byTarget.get(target) || 0) + 1)

    const day = log.createdAt.toISOString().slice(0, 10)
    byDay.set(day, (byDay.get(day) || 0) + 1)

    if (log.referer) byReferer.set(log.referer, (byReferer.get(log.referer) || 0) + 1)
  }

  const report = {
    generatedAt: new Date().toISOString(),
    periodDays: days,
    since: since.toISOString(),
    totalClicks: logs.length,
    byPlacement: top(byPlacement).map(([key, clicks]) => ({ key, clicks })),
    byTarget: top(byTarget).map(([key, clicks]) => ({ key, clicks })),
    byDay: [...byDay.entries()].sort(([a], [b]) => a.localeCompare(b)),
    topReferers: top(byReferer, 30).map(([key, clicks]) => ({ key, clicks })),
  }

  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(
    path.join(outDir, "attribution-latest.json"),
    JSON.stringify(report, null, 2)
  )

  const lines = [
    "# Outbound click attribution",
    "",
    `Generated: ${report.generatedAt}`,
    `Window: last ${days} days`,
    `Total tracked clicks: **${logs.length}**`,
    "",
    "## By placement",
    "",
    "| Source / placement | Clicks |",
    "|---|---:|",
    ...report.byPlacement.map((row) => `| ${row.key} | ${row.clicks} |`),
    "",
    "## By exchange/tool",
    "",
    "| Target | Clicks |",
    "|---|---:|",
    ...report.byTarget.map((row) => `| ${row.key} | ${row.clicks} |`),
    "",
    "## By day",
    "",
    "| Date | Clicks |",
    "|---|---:|",
    ...report.byDay.map(([day, clicks]) => `| ${day} | ${clicks} |`),
    "",
    "> Click-level only. Registration/deposit attribution needs affiliate postback/sub-id.",
    "",
  ]
  const markdown = lines.join("\n")
  fs.writeFileSync(path.join(outDir, "attribution-latest.md"), markdown)
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
