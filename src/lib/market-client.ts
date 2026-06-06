/**
 * Market Data Client API
 *
 * Thin wrappers that fetch market data through our local API routes
 * instead of calling CoinGecko directly. This avoids CORS restrictions
 * on browser-side requests to CoinGecko's free API.
 */
import {
  type MarketOverview,
  type CoinMarketItem,
  type KlineItem,
  type Ticker24hr,
} from "./market-api"

export interface MarketCombinedData {
  overview: MarketOverview
  coins: CoinMarketItem[]
}

/**
 * Fetch market overview from our local API proxy.
 */
export async function fetchMarketOverview(): Promise<MarketOverview> {
  const res = await fetch("/api/market/overview")
  if (!res.ok) {
    throw new Error(`Market overview API ${res.status}: ${res.statusText}`)
  }
  return res.json()
}

/**
 * Fetch klines (candlestick) data from our local API proxy.
 */
export async function fetchKlinesClient(
  symbol: string,
  interval: string,
  limit = 100,
  refresh?: boolean
): Promise<KlineItem[]> {
  let url = `/api/market/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
  if (refresh) url += "&_refresh=1"
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Market klines API ${res.status}: ${res.statusText}`)
  }
  return res.json()
}

/**
 * Fetch 24hr ticker data from our local API proxy.
 */
export async function fetchTicker24hrClient(
  symbol: string,
  refresh?: boolean
): Promise<Ticker24hr> {
  let url = `/api/market/ticker?symbol=${symbol}`
  if (refresh) url += "&_refresh=1"
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Market ticker API ${res.status}: ${res.statusText}`)
  }
  return res.json()
}

/**
 * Fetch both overview and top coins in a single request.
 * Preferred over calling fetchMarketOverview + fetchTopCoins separately.
 */
export async function fetchMarketCombined(
  limit = 10,
  refresh?: boolean
): Promise<MarketCombinedData> {
  let url = `/api/market/combined?limit=${limit}`
  if (refresh) url += "&_refresh=1"
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Market combined API ${res.status}: ${res.statusText}`)
  }
  return res.json()
}
