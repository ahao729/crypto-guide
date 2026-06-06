import { NextResponse } from "next/server"
import { fetchCoinDetail } from "@/lib/market-api"
import { marketCache } from "@/lib/cache"

const CACHE_TTL = 30_000 // 30s

/**
 * GET /api/market/coin-detail?coinId=bitcoin
 *
 * Proxies CoinGecko /coins/{id} server-side to avoid CORS issues.
 * Returns static metadata (name, symbol, image, description, links) +
 * dynamic market data (price, change, volume, supply, ath, etc.).
 *
 * Cached for 30s in memory.
 * Pass ?_refresh=1 to bypass cache on demand.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const coinId = searchParams.get("coinId")
  const forceRefresh = searchParams.get("_refresh") === "1"

  if (!coinId) {
    return NextResponse.json(
      { error: "Missing required query param: coinId" },
      { status: 400 }
    )
  }

  const cacheKey = `coin-detail:${coinId}`

  // ── Cache lookup ──
  if (!forceRefresh) {
    const cached = marketCache.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }
  }

  // ── Fetch fresh data ──
  try {
    const data = await fetchCoinDetail(coinId)

    // Extract only what the frontend needs — reduce payload size
    const detail = {
      id: data.id,
      symbol: data.symbol,
      name: data.name,
      image: data.image?.large || data.image?.small || "",
      description: data.description?.en || "",
      links: {
        homepage: data.links?.homepage?.[0] || "",
        twitter: data.links?.twitter_screen_name || "",
        telegram: data.links?.telegram_channel_identifier || "",
        explorer: data.links?.blockchain_site?.[0] || "",
        reddit: data.links?.subreddit_url || "",
        github: data.links?.repos_url?.github?.[0] || "",
      },
      market_data: {
        current_price: data.market_data?.current_price?.usd ?? 0,
        market_cap: data.market_data?.market_cap?.usd ?? 0,
        market_cap_rank: data.market_data?.market_cap_rank ?? 0,
        total_volume: data.market_data?.total_volume?.usd ?? 0,
        price_change_percentage_24h:
          data.market_data?.price_change_percentage_24h ?? 0,
        price_change_percentage_7d:
          data.market_data?.price_change_percentage_7d ?? 0,
        price_change_percentage_30d:
          data.market_data?.price_change_percentage_30d ?? 0,
        circulating_supply: data.market_data?.circulating_supply ?? 0,
        total_supply: data.market_data?.total_supply ?? 0,
        max_supply: data.market_data?.max_supply ?? null,
        ath: data.market_data?.ath?.usd ?? 0,
        ath_change_percentage:
          data.market_data?.ath_change_percentage?.usd ?? 0,
        ath_date: data.market_data?.ath_date?.usd ?? "",
        high_24h: data.market_data?.high_24h?.usd ?? 0,
        low_24h: data.market_data?.low_24h?.usd ?? 0,
      },
      last_updated: data.last_updated,
      is_fallback: data.is_fallback ?? false,
    }

    marketCache.set(cacheKey, detail)

    return NextResponse.json(detail)
  } catch (err) {
    console.error("Coin detail API error:", err)
    return NextResponse.json(
      { error: "Failed to fetch coin detail" },
      { status: 502 }
    )
  }
}
