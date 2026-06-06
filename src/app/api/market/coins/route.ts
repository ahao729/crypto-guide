import { NextResponse } from "next/server"
import { fetchTopCoins } from "@/lib/market-api"
import { marketCache } from "@/lib/cache"

/**
 * GET /api/market/coins?limit=10
 *
 * Proxies CoinGecko /coins/markets server-side
 * to avoid CORS issues from the browser.
 *
 * Cached for 30s (TTL) in memory.
 * Pass ?_refresh=1 to bypass cache on demand.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = Math.min(Number(searchParams.get("limit")) || 10, 100)
  const forceRefresh = searchParams.get("_refresh") === "1"

  const cacheKey = `coins:${limit}`

  // ── Cache lookup ──
  if (!forceRefresh) {
    const cached = marketCache.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }
  }

  // ── Fetch fresh data ──
  try {
    const coins = await fetchTopCoins(limit)

    marketCache.set(cacheKey, coins)

    return NextResponse.json(coins)
  } catch (err) {
    console.error("Market coins API error:", err)
    return NextResponse.json(
      { error: "Failed to fetch top coins" },
      { status: 502 }
    )
  }
}
