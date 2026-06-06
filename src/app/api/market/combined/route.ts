import { NextResponse } from "next/server"
import {
  fetchGlobalData,
  fetchSimplePrice,
  fetchFearGreed,
  fetchTopCoins,
} from "@/lib/market-api"
import { marketCache } from "@/lib/cache"

const CACHE_KEY_OVERVIEW = "overview"
const CACHE_KEY_COINS = "coins:10"

/**
 * GET /api/market/combined?limit=10
 *
 * Merges /api/market/overview and /api/market/coins into a single response
 * so the frontend only needs one request.
 *
 * Cached for 30s (TTL) in memory.
 * Pass ?_refresh=1 to bypass cache on demand.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = Math.min(Number(searchParams.get("limit")) || 10, 100)
  const forceRefresh = searchParams.get("_refresh") === "1"

  const cacheKeyCoins = `coins:${limit}`

  // ── Cache lookup ──
  if (!forceRefresh) {
    const [cachedOverview, cachedCoins] = await Promise.all([
      marketCache.get(CACHE_KEY_OVERVIEW),
      marketCache.get(cacheKeyCoins),
    ])
    if (cachedOverview && cachedCoins) {
      return NextResponse.json({ overview: cachedOverview, coins: cachedCoins })
    }
  }

  // ── Fetch fresh data ──
  try {
    const [global, price, fearGreedData, coins] = await Promise.all([
      fetchGlobalData(),
      fetchSimplePrice(["bitcoin", "ethereum"]),
      fetchFearGreed(),
      fetchTopCoins(limit),
    ])

    const btc = price.bitcoin
    const eth = price.ethereum
    const fearItem = fearGreedData.data?.[0]

    const overview = {
      btcPrice: btc?.usd ?? 0,
      btcChange24h: btc?.usd_24h_change ?? 0,
      ethPrice: eth?.usd ?? 0,
      ethChange24h: eth?.usd_24h_change ?? 0,
      btcDominance: global.data.btc_dominance,
      fearGreedIndex: fearItem ? parseInt(fearItem.value) : 50,
      fearGreedLabel: fearItem?.value_classification ?? "中性",
      totalMarketCap: global.data.total_market_cap.usd,
      totalVolume24h: global.data.total_volume.usd,
      activeCoins: global.data.active_cryptocurrencies,
    }

    // Cache both separately so individual routes also benefit
    marketCache.set(CACHE_KEY_OVERVIEW, overview)
    marketCache.set(cacheKeyCoins, coins)

    return NextResponse.json({ overview, coins })
  } catch (err) {
    console.error("Market combined API error:", err)
    return NextResponse.json(
      { error: "Failed to fetch market data" },
      { status: 502 }
    )
  }
}
