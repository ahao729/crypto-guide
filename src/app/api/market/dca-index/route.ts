import { NextResponse } from "next/server"
import { fetchKlines } from "@/lib/market-api"
import { marketCache } from "@/lib/cache"

/**
 * GET /api/market/dca-index?symbol=BTC
 *
 * Calculates the "九神定投指数" (DCA Index):
 *   index = (currentPrice / SMA-200) × 100
 *
 * Zone classification:
 *   ≤ 40    → 黄金坑 (golden-pit)
 *   ≤ 70    → 白银坑 (silver-pit)
 *   ≤ 100   → 定投区 (dca-zone)
 *   ≤ 130   → 观望区 (watch-zone)
 *   > 130   → 危险区 (danger-zone)
 *
 * Cached for 30s in memory.
 * Pass ?_refresh=1 to bypass cache on demand.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol") ?? "BTC"
  const forceRefresh = searchParams.get("_refresh") === "1"

  // Normalise symbol for cache key
  const raw = symbol.toUpperCase().replace(/USDT$/, "")
  const cacheKey = `dca-index:${raw}`

  // ── Cache lookup ──
  if (!forceRefresh) {
    const cached = marketCache.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }
  }

  // ── Fetch fresh data ──
  try {
    // Fetch 250 daily candles so we have enough for the 200-day SMA
    const klines = await fetchKlines(raw, "1d", 250, forceRefresh)

    if (klines.length < 200) {
      return NextResponse.json(
        { error: `Not enough data: got ${klines.length} days, need at least 200` },
        { status: 502 }
      )
    }

    // Use the most recent 200 closes
    const closes = klines.slice(-200).map((k) => k.close)
    const currentPrice = closes[closes.length - 1]
    const sma200 = closes.reduce((sum, p) => sum + p, 0) / closes.length
    const index = parseFloat(((currentPrice / sma200) * 100).toFixed(2))

    // ── Zone classification ──
    let zone: string
    if (index <= 40) {
      zone = "golden-pit"
    } else if (index <= 70) {
      zone = "silver-pit"
    } else if (index <= 100) {
      zone = "dca-zone"
    } else if (index <= 130) {
      zone = "watch-zone"
    } else {
      zone = "danger-zone"
    }

    const result = {
      symbol: raw,
      currentPrice,
      sma200: parseFloat(sma200.toFixed(2)),
      index,
      zone,
      updatedAt: klines[klines.length - 1].time,
    }

    marketCache.set(cacheKey, result, 30_000)

    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("DCA index API error:", message)
    return NextResponse.json(
      { error: `Failed to calculate DCA index for ${raw}: ${message}` },
      { status: 502 }
    )
  }
}
