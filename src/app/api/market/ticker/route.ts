import { NextResponse } from "next/server"
import { fetchTicker24hr } from "@/lib/market-api"
import { marketCache } from "@/lib/cache"

/**
 * GET /api/market/ticker?symbol=BTCUSDT
 *
 * Proxies Binance 24hr ticker price change data server-side
 * to avoid CORS issues from the browser.
 *
 * Cached for 30s (TTL) in memory.
 * Pass ?_refresh=1 to bypass cache on demand.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol") ?? "BTCUSDT"
  const forceRefresh = searchParams.get("_refresh") === "1"

  const cacheKey = `ticker:${symbol}`

  // ── Cache lookup ──
  if (!forceRefresh) {
    const cached = marketCache.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }
  }

  // ── Fetch fresh data ──
  try {
    const data = await fetchTicker24hr(symbol)

    marketCache.set(cacheKey, data)

    return NextResponse.json(data)
  } catch (err) {
    console.error("Market ticker API error:", err)
    return NextResponse.json(
      { error: `Failed to fetch ticker for ${symbol}` },
      { status: 502 }
    )
  }
}
