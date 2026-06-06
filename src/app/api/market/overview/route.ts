import { NextResponse } from "next/server"
import {
  fetchGlobalData,
  fetchSimplePrice,
  fetchFearGreed,
} from "@/lib/market-api"
import { marketCache } from "@/lib/cache"

const CACHE_KEY = "overview"

/**
 * GET /api/market/overview
 *
 * Proxies CoinGecko + alternative.me data server-side
 * to avoid CORS issues from the browser.
 *
 * Cached for 30s (TTL) in memory.
 * Pass ?_refresh=1 to bypass cache on demand.
 */
export async function GET(request: Request) {
  const forceRefresh =
    new URL(request.url).searchParams.get("_refresh") === "1"

  // ── Cache lookup ──
  if (!forceRefresh) {
    const cached = marketCache.get(CACHE_KEY)
    if (cached) {
      return NextResponse.json(cached)
    }
  }

  // ── Fetch fresh data ──
  try {
    const [global, price, fearGreedData] = await Promise.all([
      fetchGlobalData(),
      fetchSimplePrice(["bitcoin", "ethereum"]),
      fetchFearGreed(),
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

    // Cache before returning
    marketCache.set(CACHE_KEY, overview)

    return NextResponse.json(overview)
  } catch (err) {
    console.error("Market overview API error:", err)
    return NextResponse.json(
      { error: "Failed to fetch market overview" },
      { status: 502 }
    )
  }
}
