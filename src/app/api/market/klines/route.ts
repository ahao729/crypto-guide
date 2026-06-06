import { NextResponse } from "next/server"
import { fetchKlines, type KlineInterval } from "@/lib/market-api"
import { marketCache } from "@/lib/cache"

/**
 * GET /api/market/klines?symbol=BTCUSDT&interval=1h&limit=100
 *
 * Proxies Binance klines/candlestick data server-side
 * to avoid CORS issues from the browser.
 *
 * Cached for 30s (TTL) in memory.
 * Pass ?_refresh=1 to bypass cache on demand.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol") ?? "BTCUSDT"
  const interval = (searchParams.get("interval") ?? "1h") as KlineInterval
  const limit = Math.min(Number(searchParams.get("limit")) || 100, 500)
  const forceRefresh = searchParams.get("_refresh") === "1"

  const cacheKey = `klines:${symbol}:${interval}:${limit}`

  // ── Cache lookup ──
  if (!forceRefresh) {
    const cached = marketCache.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }
  }

  // ── Fetch fresh data ──
  try {
    const data = await fetchKlines(symbol, interval, limit, forceRefresh)

    // Use 5s TTL so auto-polling picks up fresh data quickly
    marketCache.set(cacheKey, data, 5_000)

    return NextResponse.json(data)
  } catch (err) {
    console.error("Market klines API error:", err)
    return NextResponse.json(
      { error: `Failed to fetch klines for ${symbol}` },
      { status: 502 }
    )
  }
}
