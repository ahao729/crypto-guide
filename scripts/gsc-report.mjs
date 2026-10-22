/**
 * Pull a small Google Search Console report via a service account.
 *
 * Required env:
 *   GSC_SERVICE_ACCOUNT_JSON  full JSON key as a string (GitHub Actions secret)
 * Optional:
 *   GSC_SERVICE_ACCOUNT_FILE  path to the JSON key (local use)
 *   GSC_SITE                  default sc-domain:bqzn.top
 *   GSC_OUT_DIR               default reports
 */
import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"

const SITE = process.env.GSC_SITE || "sc-domain:bqzn.top"
const DAYS = Math.max(1, Number(process.env.GSC_DAYS || 28))
const OUT_DIR = process.env.GSC_OUT_DIR || "reports"
const KEY_JSON =
  process.env.GSC_SERVICE_ACCOUNT_JSON ||
  (process.env.GSC_SERVICE_ACCOUNT_FILE
    ? fs.readFileSync(process.env.GSC_SERVICE_ACCOUNT_FILE, "utf8")
    : "")

if (!KEY_JSON) {
  console.error("Missing GSC_SERVICE_ACCOUNT_JSON or GSC_SERVICE_ACCOUNT_FILE")
  process.exit(1)
}

const key = JSON.parse(KEY_JSON)
const b64url = (value) => Buffer.from(value).toString("base64url")
const now = Math.floor(Date.now() / 1000)

async function getAccessToken() {
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))
  const claims = b64url(
    JSON.stringify({
      iss: key.client_email,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: key.token_uri,
      iat: now,
      exp: now + 3600,
    })
  )
  const signer = crypto.createSign("RSA-SHA256")
  signer.update(`${header}.${claims}`)
  const assertion = `${header}.${claims}.${signer.sign(key.private_key, "base64url")}`

  const response = await fetch(key.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  })
  const body = await response.json()
  if (!response.ok) {
    throw new Error(`Token error ${response.status}: ${JSON.stringify(body)}`)
  }
  return body.access_token
}

async function gscFetch(token, pathname, init = {}) {
  const response = await fetch(`https://searchconsole.googleapis.com${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  })
  const body = await response.json().catch(() => ({}))
  return { response, body }
}

function isoDate(date) {
  return date.toISOString().slice(0, 10)
}

function daysAgo(days) {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() - days)
  return date
}

function pct(value) {
  return `${(value * 100).toFixed(2)}%`
}

async function main() {
  const token = await getAccessToken()

  const sites = await gscFetch(token, "/webmasters/v3/sites")
  if (!sites.response.ok) {
    throw new Error(`Sites error ${sites.response.status}: ${JSON.stringify(sites.body)}`)
  }
  const siteList = (sites.body.siteEntry || []).map((entry) => entry.siteUrl)
  console.log("Sites visible to service account:", siteList)

  if (!siteList.includes(SITE)) {
    throw new Error(
      `Service account cannot see ${SITE}. Add ${key.client_email} as a Restricted user in Search Console.`
    )
  }

  // GSC data has a 2-3 day lag; use a complete window.
  const endDate = isoDate(daysAgo(3))
  const startDate = isoDate(daysAgo(3 + DAYS - 1))
  const sitePath = encodeURIComponent(SITE)

  async function query(dimensions, rowLimit = 25) {
    const { response, body } = await gscFetch(
      token,
      `/webmasters/v3/sites/${sitePath}/searchAnalytics/query`,
      {
        method: "POST",
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions,
          rowLimit,
          dataState: "final",
        }),
      }
    )
    if (!response.ok) {
      throw new Error(`Query ${dimensions.join("+") || "total"} failed ${response.status}: ${JSON.stringify(body)}`)
    }
    return body.rows || []
  }

  const inspectUrls = [
    "https://bqzn.top/",
    "https://bqzn.top/exchanges",
    "https://bqzn.top/compare/binance-vs-okx",
    "https://bqzn.top/exchange-ranking",
    "https://bqzn.top/articles/binance-registration-guide",
    "https://bqzn.top/articles/exchange-fee-comparison",
    "https://bqzn.top/articles/top-10-exchanges-comparison-2026",
    "https://bqzn.top/tools",
  ]

  const [totals, byQuery, byPage, byDate, sitemapsRes] = await Promise.all([
    query([], 1),
    query(["query"], 20),
    query(["page"], 20),
    query(["date"], DAYS + 2),
    gscFetch(token, `/webmasters/v3/sites/${sitePath}/sitemaps`),
  ])

  const urlInspection = []
  for (const url of inspectUrls) {
    const { response, body } = await gscFetch(
      token,
      "/v1/urlInspection/index:inspect",
      {
        method: "POST",
        body: JSON.stringify({
          inspectionUrl: url,
          siteUrl: SITE,
          languageCode: "zh-CN",
        }),
      }
    )
    const result = body?.inspectionResult?.indexStatusResult
    urlInspection.push({
      url,
      ok: response.ok,
      error: response.ok ? null : body?.error?.message || `HTTP ${response.status}`,
      verdict: result?.verdict ?? null,
      coverageState: result?.coverageState ?? null,
      indexingState: result?.indexingState ?? null,
      robotsTxtState: result?.robotsTxtState ?? null,
      pageFetchState: result?.pageFetchState ?? null,
      lastCrawlTime: result?.lastCrawlTime ?? null,
      googleCanonical: result?.googleCanonical ?? null,
      userCanonical: result?.userCanonical ?? null,
    })
  }

  const total = totals[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 }
  const report = {
    site: SITE,
    generatedAt: new Date().toISOString(),
    period: { startDate, endDate },
    totals: {
      clicks: total.clicks,
      impressions: total.impressions,
      ctr: total.ctr,
      position: total.position,
    },
    topQueries: byQuery.map((row) => ({
      query: row.keys[0],
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
    })),
    topPages: byPage.map((row) => ({
      page: row.keys[0],
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
    })),
    byDate: byDate.map((row) => ({
      date: row.keys[0],
      clicks: row.clicks,
      impressions: row.impressions,
    })),
    urlInspection,
    sitemaps: sitemapsRes.response.ok
      ? (sitemapsRes.body.sitemap || []).map((item) => ({
          path: item.path,
          lastSubmitted: item.lastSubmitted,
          lastDownloaded: item.lastDownloaded,
          isPending: item.isPending,
          isSitemapsIndex: item.isSitemapsIndex,
          errors: item.errors,
          warnings: item.warnings,
          contents: item.contents,
        }))
      : [],
  }

  fs.mkdirSync(OUT_DIR, { recursive: true })
  const stamp = new Date().toISOString().slice(0, 10)
  fs.writeFileSync(path.join(OUT_DIR, "gsc-latest.json"), JSON.stringify(report, null, 2))
  fs.writeFileSync(path.join(OUT_DIR, `gsc-${stamp}.json`), JSON.stringify(report, null, 2))

  const lines = [
    `# GSC report — ${SITE}`,
    "",
    `Period: ${startDate} → ${endDate} (${DAYS} days)`,
    "",
    `- Clicks: **${total.clicks}**`,
    `- Impressions: **${total.impressions}**`,
    `- CTR: **${pct(total.ctr)}**`,
    `- Average position: **${total.position.toFixed(1)}**`,
    "",
    "## Top queries",
    "",
    "| Query | Clicks | Impressions | CTR | Position |",
    "|---|---:|---:|---:|---:|",
    ...report.topQueries.slice(0, 10).map(
      (row) => `| ${row.query} | ${row.clicks} | ${row.impressions} | ${pct(row.ctr)} | ${row.position.toFixed(1)} |`
    ),
    "",
    "## Top pages",
    "",
    "| Page | Clicks | Impressions | CTR | Position |",
    "|---|---:|---:|---:|---:|",
    ...report.topPages.slice(0, 10).map(
      (row) => `| ${row.page} | ${row.clicks} | ${row.impressions} | ${pct(row.ctr)} | ${row.position.toFixed(1)} |`
    ),
    "",
    "## URL inspection",
    "",
    "| URL | Verdict | Coverage | Last crawl |",
    "|---|---|---|---|",
    ...report.urlInspection.map(
      (row) =>
        `| ${row.url} | ${row.ok ? row.verdict ?? "-" : `ERROR: ${row.error}`} | ${row.coverageState ?? "-"} | ${row.lastCrawlTime ?? "-"} |`
    ),
    "",
    "## Sitemaps",
    "",
    report.sitemaps.length === 0
      ? "No sitemap visible to this service account yet."
      : [
          "| Sitemap | Submitted | Downloaded | Pending | Errors | Warnings |",
          "|---|---|---|---|---:|---:|",
          ...report.sitemaps.map(
            (item) =>
              `| ${item.path} | ${item.lastSubmitted || "-"} | ${item.lastDownloaded || "-"} | ${item.isPending ? "yes" : "no"} | ${item.errors || 0} | ${item.warnings || 0} |`
          ),
        ].join("\n"),
    "",
  ]
  const summary = lines.join("\n")
  console.log(summary)
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary)
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
