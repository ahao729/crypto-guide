/**
 * Market Data API Service
 *
 * Real market data from CoinGecko (free) + Binance (public).
 * Features: auto-retry, rate-limit awareness, browser-friendly CORS.
 *
 * CoinGecko rate limit: 10-30 calls/min (no key) / 50 calls/min (free key)
 * Binance rate limit: 1200 req/min (public endpoints, IP-based)
 */

// ─── Types ────────────────────────────────────────────────────────────

export interface CoinGeckoSimplePrice {
  [coinId: string]: {
    usd?: number
    usd_market_cap?: number
    usd_24h_vol?: number
    usd_24h_change?: number
    cny?: number
  }
}

export interface CoinMarketItem {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  price_change_percentage_24h: number
  circulating_supply: number
  ath: number
  ath_change_percentage: number
}

export interface GlobalData {
  data: {
    active_cryptocurrencies: number
    total_market_cap: { usd: number }
    total_volume: { usd: number }
    btc_dominance: number
    eth_dominance: number
    market_cap_change_percentage_24h_usd: number
  }
}

export interface FearGreedData {
  name: string
  data: Array<{
    value: string
    value_classification: string
    timestamp: string
    time_until_update: string
  }>
}

/** Binance Kline API returns arrays, not objects.
 *  Index: [0]openTime [1]open [2]high [3]low [4]close [5]volume [6]closeTime
 *         [7]quoteVol [8]trades [9]takerBaseVol [10]takerQuoteVol [11]ignore
 */
type BinanceKlineArray = [
  number,   // 0 openTime
  string,   // 1 open
  string,   // 2 high
  string,   // 3 low
  string,   // 4 close
  string,   // 5 volume
  number,   // 6 closeTime
  string,   // 7 quoteAssetVolume
  number,   // 8 numberOfTrades
  string,   // 9 takerBuyBaseVol
  string,   // 10 takerBuyQuoteVol
  string,   // 11 ignore
]

export interface KlineItem {
  time: number
  dateLabel: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface Ticker24hr {
  symbol: string
  lastPrice: string
  priceChange: string
  priceChangePercent: string
  highPrice: string
  lowPrice: string
  volume: string
  quoteVolume: string
}

export interface MarketOverview {
  btcPrice: number
  btcChange24h: number
  ethPrice: number
  ethChange24h: number
  btcDominance: number
  fearGreedIndex: number
  fearGreedLabel: string
  totalMarketCap: number
  totalVolume24h: number
  activeCoins: number
}

export interface ConversionRateMap {
  [from: string]: { [to: string]: number }
}

export interface CoinDetailResult {
  id: string
  symbol: string
  name: string
  image?: {
    large?: string
    small?: string
  }
  description?: {
    en?: string
  }
  links?: {
    homepage?: string[]
    twitter_screen_name?: string
    telegram_channel_identifier?: string
    blockchain_site?: string[]
    subreddit_url?: string
    repos_url?: {
      github?: string[]
    }
  }
  market_data?: {
    current_price?: { usd?: number }
    market_cap?: { usd?: number }
    market_cap_rank?: number
    total_volume?: { usd?: number }
    price_change_percentage_24h?: number
    price_change_percentage_7d?: number
    price_change_percentage_30d?: number
    circulating_supply?: number
    total_supply?: number | null
    max_supply?: number | null
    ath?: { usd?: number }
    ath_change_percentage?: { usd?: number }
    ath_date?: { usd?: string }
    high_24h?: { usd?: number }
    low_24h?: { usd?: number }
  }
  last_updated?: string
  is_fallback?: boolean
}

type CryptoCompareRawQuote = {
  PRICE?: number
  OPEN24HOUR?: number
  CHANGEPCT24HOUR?: number
  HIGH24HOUR?: number
  LOW24HOUR?: number
  VOLUME24HOUR?: number
  VOLUME24HOURTO?: number
  TOTALVOLUME24HTO?: number
  MKTCAP?: number
  CIRCULATINGSUPPLY?: number
  SUPPLY?: number
  IMAGEURL?: string
  LASTUPDATE?: number
}

type CryptoCompareFullResponse = {
  RAW?: Record<string, Record<string, CryptoCompareRawQuote>>
}

type CryptoCompareHistoryResponse = {
  Response?: string
  Message?: string
  Data?: {
    Data?: Array<{
      time: number
      high: number
      low: number
      open: number
      close: number
      volumefrom?: number
      volumeto?: number
    }>
  }
}

type CryptoCompareTopResponse = {
  Data?: Array<{
    CoinInfo?: {
      Name?: string
      FullName?: string
      ImageUrl?: string
      MaxSupply?: number
    }
    RAW?: Record<string, CryptoCompareRawQuote>
  }>
  MetaData?: { Count?: number }
}

// ─── Helpers ──────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const USD_FIAT_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.93,
  CNY: 7.23,
  JPY: 151,
  KRW: 1370,
  GBP: 0.79,
  AUD: 1.53,
  BRL: 5.04,
}

/** Binance pair: BTCUSDT, ETHUSDT, etc. */
function toBinancePair(symbol: string): string {
  return `${normalizeMarketSymbol(symbol)}USDT`
}

/** Format kline open time into a short label */
function formatKlineTime(t: number, interval: string): string {
  const d = new Date(t)
  if (interval.endsWith("m") || interval.endsWith("h")) {
    // show date + hour:min for minute/hour intervals
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const dd = String(d.getDate()).padStart(2, "0")
    const hh = String(d.getHours()).padStart(2, "0")
    const mi = String(d.getMinutes()).padStart(2, "0")
    return `${mm}-${dd} ${hh}:${mi}`
  }
  // daily -> date only
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${mm}-${dd}`
}

// ─── CoinGecko API ────────────────────────────────────────────────────

const CG_BASE = "https://api.coingecko.com/api/v3"
const CRYPTOCOMPARE_BASE = "https://min-api.cryptocompare.com/data"

async function cgFetch<T>(
  path: string,
  retries = 2,
  timeoutMs = 15_000
): Promise<T> {
  const apiKey = process.env.COINGECKO_API_KEY
  const separator = path.includes("?") ? "&" : "?"
  const url = apiKey
    ? `${CG_BASE}${path}${separator}x_cg_demo_api_key=${apiKey}`
    : `${CG_BASE}${path}`

  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetchWithTimeout(url, {
        headers: { Accept: "application/json" },
      }, timeoutMs)
      if (res.status === 429) {
        const wait = Math.min(2000 * (i + 1), 10_000)
        await sleep(wait)
        continue
      }
      if (!res.ok) {
        const body = await res.text().catch(() => "")
        throw new Error(`CoinGecko ${res.status}: ${res.statusText} — ${body.slice(0, 200)}`)
      }
      return (await res.json()) as T
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        throw new Error(`CoinGecko timeout after ${timeoutMs / 1000}s: ${path}`)
      }
      if (i === retries) throw err
      await sleep(1000 * (i + 1))
    }
  }
  throw new Error("CoinGecko request failed after retries")
}

/** CoinGecko internal: fetch simple price (used by CoinGecko fallback paths) */
async function fetchCoinGeckoSimplePrice(
  coinIds: string[]
): Promise<CoinGeckoSimplePrice> {
  return cgFetch<CoinGeckoSimplePrice>(
    `/simple/price?ids=${coinIds.join(",")}&vs_currencies=usd,cny&include_24hr_change=true&include_24hr_vol=true`
  )
}

/**
 * CoinGecko ID → Binance symbol mapping (top coins only).
 * Falls back to lowercase coinId + "usdt" if not found.
 */
const CG_ID_TO_BINANCE_SYMBOL: Record<string, string> = {
  bitcoin: "BTCUSDT",
  ethereum: "ETHUSDT",
  solana: "SOLUSDT",
  binancecoin: "BNBUSDT",
  tether: "USDTUSDT",
  usdc: "USDCUSDT",
  ripple: "XRPUSDT",
  cardano: "ADAUSDT",
  dogecoin: "DOGEUSDT",
  polkadot: "DOTUSDT",
  "avalanche-2": "AVAXUSDT",
  "matic-network": "MATICUSDT",
  "shiba-inu": "SHIBUSDT",
  tron: "TRXUSDT",
  cosmos: "ATOMUSDT",
  chainlink: "LINKUSDT",
  uniswap: "UNIUSDT",
  litecoin: "LTCUSDT",
  "bitcoin-cash": "BCHUSDT",
  near: "NEARUSDT",
  optimism: "OPUSDT",
  arbitrum: "ARBUSDT",
  "sui-network": "SUIUSDT",
  aptos: "APTUSDT",
  filecoin: "FILUSDT",
  "internet-computer": "ICPUSDT",
  monero: "XMRUSDT",
  eos: "EOSUSDT",
  fantom: "FTMUSDT",
  algorand: "ALGOUSDT",
  decentraland: "MANAUSDT",
  "the-sandbox": "SANDUSDT",
  "axie-infinity": "AXSUSDT",
  flow: "FLOWUSDT",
  chiliz: "CHZUSDT",
  "mina-protocol": "MINAUSDT",
  kusama: "KSMUSDT",
  "yearn-finance": "YFIUSDT",
  maker: "MKRUSDT",
  compound: "COMPUSDT",
  synthetix: "SNXUSDT",
  "curve-dao-token": "CRVUSDT",
}

function toBinanceSymbolFromCgId(coinId: string): string {
  return CG_ID_TO_BINANCE_SYMBOL[coinId] ?? `${coinId.toUpperCase()}USDT`
}

/** Helper: reverse symbol → CG ID for fallback lookups */
const BINANCE_SYMBOL_TO_CG_ID: Record<string, string> = {}
for (const [cgId, binanceSymbol] of Object.entries(CG_ID_TO_BINANCE_SYMBOL)) {
  BINANCE_SYMBOL_TO_CG_ID[binanceSymbol] = cgId
}

/**
 * Fetch simple price for 1+ coin IDs.
 * Primary: CoinGecko → Fallback: Binance 24hr ticker.
 */
export async function fetchSimplePrice(
  coinIds: string[]
): Promise<CoinGeckoSimplePrice> {
  const canUseCryptoCompare = coinIds.every((coinId) => toCryptoCompareSymbol(coinId))

  // 1) For supported popular coins, use the reachable real-time source first.
  if (canUseCryptoCompare) {
    try {
      return await fetchCryptoCompareSimplePrice(coinIds)
    } catch (ccErr) {
      const ccMsg = ccErr instanceof Error ? ccErr.message : String(ccErr)
      console.warn(
        `[market-api] CryptoCompare simple price failed, falling back to CoinGecko: ${ccMsg}`
      )
    }
  }

  // 2) Try CoinGecko
  try {
    return await fetchCoinGeckoSimplePrice(coinIds)
  } catch (cgErr) {
    const cgMsg = cgErr instanceof Error ? cgErr.message : String(cgErr)
    console.warn(
      `[market-api] CoinGecko simple price failed, falling back to Binance: ${cgMsg}`
    )
  }

  // 3) Fallback: Binance 24hr ticker for each coin
  const result: CoinGeckoSimplePrice = {}
  const promises = coinIds.map(async (coinId) => {
    const symbol = toBinanceSymbolFromCgId(coinId)
    try {
      const ticker = await binanceFetch<Ticker24hr>(`/ticker/24hr?symbol=${symbol}`)
      const lastPrice = parseFloat(ticker.lastPrice)
      const change = parseFloat(ticker.priceChangePercent)
      const quoteVol = parseFloat(ticker.quoteVolume)
      result[coinId] = {
        usd: lastPrice,
        usd_24h_change: change,
        usd_24h_vol: quoteVol,
      }
    } catch (binErr) {
      console.warn(`[market-api] Binance fallback also failed for ${coinId}: ${binErr instanceof Error ? binErr.message : String(binErr)}`)
      // Leave missing entry as undefined
    }
  })
  await Promise.all(promises)

  return result
}

/** CoinGecko internal: fetch top coins by market cap */
async function fetchCoinGeckoTopCoins(
  limit = 50
): Promise<CoinMarketItem[]> {
  return cgFetch<CoinMarketItem[]>(
    `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
  )
}

/**
 * Fetch top coins by market cap (with Binance fallback).
 * Primary: CoinGecko → Fallback: Binance 24hr ticker sorted by quoteVolume.
 */
export async function fetchTopCoins(
  limit = 50
): Promise<CoinMarketItem[]> {
  // 1) Try CryptoCompare first; it is reachable in this environment.
  try {
    return await fetchCryptoCompareTopCoins(limit)
  } catch (ccErr) {
    const ccMsg = ccErr instanceof Error ? ccErr.message : String(ccErr)
    console.warn(
      `[market-api] CryptoCompare top coins failed, falling back to CoinGecko: ${ccMsg}`
    )
  }

  // 2) Try CoinGecko
  try {
    return await fetchCoinGeckoTopCoins(limit)
  } catch (cgErr) {
    const cgMsg = cgErr instanceof Error ? cgErr.message : String(cgErr)
    console.warn(
      `[market-api] CoinGecko top coins failed, falling back to Binance: ${cgMsg}`
    )
  }

  // 3) Fallback: Binance 24hr ticker, filter USDT pairs, sort by quoteVolume
  const allTickers = await binanceFetch<Ticker24hr[]>("/ticker/24hr")
  const usdtTickers = allTickers
    .filter(
      (t: Ticker24hr) =>
        t.symbol.endsWith("USDT") &&
        !t.symbol.includes("UP") &&
        !t.symbol.includes("DOWN") &&
        !t.symbol.includes("BULL") &&
        !t.symbol.includes("BEAR")
    )
    .sort((a: Ticker24hr, b: Ticker24hr) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
    .slice(0, limit)

  return usdtTickers.map((t: Ticker24hr, i: number) => {
    const binanceSymbol = t.symbol
    const baseSymbol = binanceSymbol.replace("USDT", "")
    const cgId =
      BINANCE_SYMBOL_TO_CG_ID[binanceSymbol] ?? baseSymbol.toLowerCase()

    return {
      id: cgId,
      symbol: baseSymbol.toLowerCase(),
      name: baseSymbol,
      image: "",
      current_price: parseFloat(t.lastPrice),
      market_cap: 0,
      market_cap_rank: i + 1,
      total_volume: parseFloat(t.quoteVolume),
      price_change_percentage_24h: parseFloat(t.priceChangePercent),
      circulating_supply: 0,
      ath: 0,
      ath_change_percentage: 0,
    }
  })
}

/** CoinGecko internal: fetch global market data */
async function fetchCoinGeckoGlobalData(): Promise<GlobalData> {
  return cgFetch<GlobalData>("/global")
}

/**
 * Fetch global market data (with Binance estimation fallback).
 * Primary: CoinGecko → Fallback: Binance 24hr ticker estimation.
 */
export async function fetchGlobalData(): Promise<GlobalData> {
  // 1) Try CryptoCompare top market-cap data first.
  try {
    return await fetchCryptoCompareGlobalData()
  } catch (ccErr) {
    const ccMsg = ccErr instanceof Error ? ccErr.message : String(ccErr)
    console.warn(
      `[market-api] CryptoCompare global data failed, falling back to CoinGecko: ${ccMsg}`
    )
  }

  // 2) Try CoinGecko
  try {
    return await fetchCoinGeckoGlobalData()
  } catch (cgErr) {
    const cgMsg = cgErr instanceof Error ? cgErr.message : String(cgErr)
    console.warn(
      `[market-api] CoinGecko global data failed, falling back to Binance estimation: ${cgMsg}`
    )
  }

  // 3) Fallback: estimate global metrics from Binance 24hr ticker
  const allTickers = await binanceFetch<Ticker24hr[]>("/ticker/24hr")
  const usdtTickers = allTickers.filter(
    (t: Ticker24hr) =>
      t.symbol.endsWith("USDT") &&
      !t.symbol.includes("UP") &&
      !t.symbol.includes("DOWN") &&
      !t.symbol.includes("BULL") &&
      !t.symbol.includes("BEAR")
  )

  const btcTicker = usdtTickers.find((t: Ticker24hr) => t.symbol === "BTCUSDT")
  const btcPrice = btcTicker ? parseFloat(btcTicker.lastPrice) : 0
  const totalVol = usdtTickers.reduce(
    (sum: number, t: Ticker24hr) => sum + parseFloat(t.quoteVolume),
    0
  )

  // Estimate total market cap from BTC price × approximate supply ÷ estimated BTC dominance
  const estimatedBtcDominance = 0.55
  const btcCirculatingSupply = 19_800_000

  return {
    data: {
      active_cryptocurrencies: usdtTickers.length,
      total_market_cap: {
        usd: btcPrice > 0 ? btcPrice * btcCirculatingSupply / estimatedBtcDominance : 0,
      },
      total_volume: {
        usd: totalVol,
      },
      btc_dominance: estimatedBtcDominance * 100,
      eth_dominance: 0,
      market_cap_change_percentage_24h_usd: btcTicker
        ? parseFloat(btcTicker.priceChangePercent)
        : 0,
    },
  }
}

/** Fetch fear & greed index from alternative.me */
export async function fetchFearGreed(): Promise<FearGreedData> {
  for (let i = 0; i <= 2; i++) {
    try {
      const res = await fetchWithTimeout("https://api.alternative.me/fng/?limit=1", {
        headers: { Accept: "application/json" },
      }, 8_000)
      if (!res.ok) {
        throw new Error(`FearGreed ${res.status}: ${res.statusText}`)
      }
      return (await res.json()) as FearGreedData
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        throw new Error("FearGreed timeout after 8s")
      }
      if (i === 2) throw err
      await sleep(1000 * (i + 1))
    }
  }
  throw new Error("FearGreed request failed after retries")
}

/** Fetch single coin detail (used by coin-info page) */
export async function fetchCoinDetail(coinId: string): Promise<CoinDetailResult> {
  const normalizedCoinId = coinId.trim().toLowerCase()
  const hasLocalFallback = Boolean(getFallbackCoinMetadata(normalizedCoinId))

  // 1) For popular local coins, use the reachable real-time source first.
  if (hasLocalFallback) {
    try {
      return await fetchCryptoCompareCoinDetail(normalizedCoinId)
    } catch (ccErr) {
      const ccMsg = ccErr instanceof Error ? ccErr.message : String(ccErr)
      console.warn(
        `[market-api] CryptoCompare coin detail failed, falling back to CoinGecko: ${ccMsg}`
      )
    }
  }

  // 2) Try CoinGecko for full metadata or unsupported local fallback coins.
  try {
    return await cgFetch<CoinDetailResult>(
      `/coins/${normalizedCoinId}?localization=false&tickers=false&community_data=false&developer_data=false`,
      hasLocalFallback ? 0 : 1,
      hasLocalFallback ? 3_000 : 8_000
    )
  } catch (cgErr) {
    const cgMsg = cgErr instanceof Error ? cgErr.message : String(cgErr)
    console.warn(
      `[market-api] CoinGecko coin detail failed, falling back to CryptoCompare: ${cgMsg}`
    )
  }

  // 3) Fallback: CryptoCompare quote + local metadata for supported local coins.
  if (!hasLocalFallback) {
    console.warn(
      `[market-api] No local CryptoCompare fallback metadata for ${normalizedCoinId}`
    )
  } else {
    try {
      return await fetchCryptoCompareCoinDetail(normalizedCoinId)
    } catch (ccErr) {
      const ccMsg = ccErr instanceof Error ? ccErr.message : String(ccErr)
      console.warn(
        `[market-api] CryptoCompare coin detail fallback failed, falling back to Binance: ${ccMsg}`
      )
    }
  }

  // 4) Fallback: Binance 24hr ticker for minimal market data
  try {
    const symbol = CG_ID_TO_BINANCE_SYMBOL[normalizedCoinId] ?? `${normalizedCoinId.toUpperCase()}USDT`
    const ticker = await binanceFetch<Ticker24hr>(
      `/ticker/24hr?symbol=${symbol}`,
      hasLocalFallback ? 2_000 : 5_000
    )
    const lastPrice = parseFloat(ticker.lastPrice)
    const change = parseFloat(ticker.priceChangePercent)
    const high = parseFloat(ticker.highPrice)
    const low = parseFloat(ticker.lowPrice)
    const quoteVolume = parseFloat(ticker.quoteVolume)
    const fallback = getFallbackCoinMetadata(normalizedCoinId)
    const supply = fallback?.circulatingSupply ?? 0

    return buildCoinDetailFallback(normalizedCoinId, {
      currentPrice: lastPrice,
      marketCap: lastPrice * supply,
      totalVolume: quoteVolume,
      priceChange24h: change,
      high24h: high,
      low24h: low,
      liveMarketData: true,
      symbol: ticker.symbol.replace("USDT", "").toLowerCase(),
    })
  } catch (binanceErr) {
    const binanceMsg = binanceErr instanceof Error ? binanceErr.message : String(binanceErr)
    console.warn(
      `[market-api] Binance coin detail fallback failed, using local fallback: ${binanceMsg}`
    )
  }

  // 5) Last-resort local fallback for popular coins.
  // This keeps the tool usable when public market APIs are blocked or rate-limited.
  return buildCoinDetailFallback(normalizedCoinId)
}

async function fetchCryptoCompareCoinDetail(coinId: string) {
  const quote = await fetchCryptoCompareQuote(coinId)
  const fallback = getFallbackCoinMetadata(coinId)
  const supply = quote.CIRCULATINGSUPPLY ?? quote.SUPPLY ?? fallback?.circulatingSupply ?? 0
  const marketCap =
    quote.MKTCAP ??
    (quote.PRICE && supply ? quote.PRICE * supply : 0)

  return buildCoinDetailFallback(coinId, {
    currentPrice: quote.PRICE ?? 0,
    marketCap,
    totalVolume: quote.TOTALVOLUME24HTO ?? quote.VOLUME24HOURTO ?? 0,
    priceChange24h: quote.CHANGEPCT24HOUR ?? 0,
    high24h: quote.HIGH24HOUR ?? 0,
    low24h: quote.LOW24HOUR ?? 0,
    circulatingSupply: supply,
    imageUrl: quote.IMAGEURL
      ? `https://www.cryptocompare.com${quote.IMAGEURL}`
      : undefined,
    lastUpdated: quote.LASTUPDATE
      ? new Date(quote.LASTUPDATE * 1000).toISOString()
      : undefined,
    liveMarketData: true,
  })
}

function toCryptoCompareSymbol(coinId: string): string | null {
  return getFallbackCoinMetadata(coinId)?.symbol.toUpperCase() ?? null
}

function normalizeMarketSymbol(symbol: string): string {
  const trimmed = symbol.trim().toUpperCase()
  if (trimmed === "USDT" || trimmed === "USD") return trimmed
  if (trimmed.endsWith("USDT")) return trimmed.slice(0, -4)
  if (trimmed.endsWith("USD")) return trimmed.slice(0, -3)
  return trimmed
}

function toCryptoCompareSymbolFromMarketSymbol(symbol: string): string {
  return normalizeMarketSymbol(symbol)
}

async function fetchCryptoCompareFullQuotesBySymbols(
  symbols: string[],
  targetSymbols: string[] = ["USD"]
): Promise<CryptoCompareFullResponse> {
  const uniqueSymbols = Array.from(new Set(symbols.map((s) => s.toUpperCase())))
  const uniqueTargets = Array.from(new Set(targetSymbols.map((s) => s.toUpperCase())))
  if (uniqueSymbols.length === 0) {
    return { RAW: {} }
  }

  const url =
    `${CRYPTOCOMPARE_BASE}/pricemultifull?fsyms=${encodeURIComponent(uniqueSymbols.join(","))}` +
    `&tsyms=${encodeURIComponent(uniqueTargets.join(","))}`
  const res = await fetchWithTimeout(url, {
    headers: { Accept: "application/json" },
  }, 5_000)

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`CryptoCompare ${res.status}: ${res.statusText} — ${body.slice(0, 200)}`)
  }

  return (await res.json()) as CryptoCompareFullResponse
}

async function fetchCryptoCompareSimplePrice(
  coinIds: string[]
): Promise<CoinGeckoSimplePrice> {
  const symbolPairs = coinIds.map((coinId) => ({
    coinId,
    symbol: toCryptoCompareSymbol(coinId),
  }))
  if (symbolPairs.some((item) => !item.symbol)) {
    throw new Error("Unsupported CryptoCompare coin ID in simple price request")
  }

  const quotes = await fetchCryptoCompareFullQuotesBySymbols(
    symbolPairs.map((item) => item.symbol as string),
    ["USD", "CNY"]
  )

  const result: CoinGeckoSimplePrice = {}
  for (const item of symbolPairs) {
    const quote = quotes.RAW?.[item.symbol as string]
    result[item.coinId] = {
      usd: quote?.USD?.PRICE,
      usd_market_cap: quote?.USD?.MKTCAP,
      usd_24h_vol: quote?.USD?.TOTALVOLUME24HTO ?? quote?.USD?.VOLUME24HOURTO,
      usd_24h_change: quote?.USD?.CHANGEPCT24HOUR,
      cny: quote?.CNY?.PRICE,
    }
  }

  return result
}

async function fetchCryptoCompareTopCoins(limit = 50): Promise<CoinMarketItem[]> {
  const requestLimit = Math.min(Math.max(limit * 3, limit), 100)
  const url = `${CRYPTOCOMPARE_BASE}/top/mktcapfull?limit=${requestLimit}&tsym=USD`
  const res = await fetchWithTimeout(url, {
    headers: { Accept: "application/json" },
  }, 8_000)

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`CryptoCompare ${res.status}: ${res.statusText} — ${body.slice(0, 200)}`)
  }

  const data = (await res.json()) as CryptoCompareTopResponse
  const rows = data.Data ?? []
  if (rows.length === 0) {
    throw new Error("CryptoCompare returned no top coin data")
  }

  return rows
    .filter((row) => {
      const quote = row.RAW?.USD
      return Boolean(quote?.PRICE && quote.PRICE > 0 && quote.MKTCAP && quote.MKTCAP > 0)
    })
    .slice(0, limit)
    .map((row, i) => {
    const symbol = row.CoinInfo?.Name?.toUpperCase() ?? ""
    const quote = row.RAW?.USD ?? {}
    const price = quote.PRICE ?? 0
    const image = row.CoinInfo?.ImageUrl
      ? `https://www.cryptocompare.com${row.CoinInfo.ImageUrl}`
      : ""

    return {
      id: toCoinGeckoId(symbol),
      symbol: symbol.toLowerCase(),
      name: row.CoinInfo?.FullName ?? symbol,
      image,
      current_price: price,
      market_cap: quote.MKTCAP ?? 0,
      market_cap_rank: i + 1,
      total_volume: quote.TOTALVOLUME24HTO ?? quote.VOLUME24HOURTO ?? 0,
      price_change_percentage_24h: quote.CHANGEPCT24HOUR ?? 0,
      circulating_supply: quote.CIRCULATINGSUPPLY ?? quote.SUPPLY ?? 0,
      ath: 0,
      ath_change_percentage: 0,
    }
  })
}

async function fetchCryptoCompareGlobalData(): Promise<GlobalData> {
  const limit = 100
  const url = `${CRYPTOCOMPARE_BASE}/top/mktcapfull?limit=${limit}&tsym=USD`
  const res = await fetchWithTimeout(url, {
    headers: { Accept: "application/json" },
  }, 8_000)

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`CryptoCompare ${res.status}: ${res.statusText} — ${body.slice(0, 200)}`)
  }

  const data = (await res.json()) as CryptoCompareTopResponse
  const rows = data.Data ?? []
  if (rows.length === 0) {
    throw new Error("CryptoCompare returned no global market data")
  }

  let totalMarketCap = 0
  let totalVolume = 0
  let btcMarketCap = 0
  let ethMarketCap = 0
  let btcChange24h = 0

  for (const row of rows) {
    const symbol = row.CoinInfo?.Name?.toUpperCase()
    const quote = row.RAW?.USD
    if (!quote) continue

    const marketCap = quote.MKTCAP ?? 0
    totalMarketCap += marketCap
    totalVolume += quote.TOTALVOLUME24HTO ?? quote.VOLUME24HOURTO ?? 0

    if (symbol === "BTC") {
      btcMarketCap = marketCap
      btcChange24h = quote.CHANGEPCT24HOUR ?? 0
    }
    if (symbol === "ETH") {
      ethMarketCap = marketCap
    }
  }

  return {
    data: {
      active_cryptocurrencies: data.MetaData?.Count ?? rows.length,
      total_market_cap: { usd: totalMarketCap },
      total_volume: { usd: totalVolume },
      btc_dominance: totalMarketCap > 0 ? (btcMarketCap / totalMarketCap) * 100 : 0,
      eth_dominance: totalMarketCap > 0 ? (ethMarketCap / totalMarketCap) * 100 : 0,
      market_cap_change_percentage_24h_usd: btcChange24h,
    },
  }
}

async function fetchCryptoCompareQuote(
  coinId: string
): Promise<CryptoCompareRawQuote> {
  const symbol = toCryptoCompareSymbol(coinId)
  if (!symbol) {
    throw new Error(`No CryptoCompare symbol mapping for ${coinId}`)
  }

  const url = `${CRYPTOCOMPARE_BASE}/pricemultifull?fsyms=${encodeURIComponent(symbol)}&tsyms=USD`
  const res = await fetchWithTimeout(url, {
    headers: { Accept: "application/json" },
  }, 5_000)

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`CryptoCompare ${res.status}: ${res.statusText} — ${body.slice(0, 200)}`)
  }

  const data = (await res.json()) as CryptoCompareFullResponse
  const quote = data.RAW?.[symbol]?.USD
  if (!quote || !quote.PRICE) {
    throw new Error(`CryptoCompare returned no USD quote for ${symbol}`)
  }
  return quote
}

async function fetchCryptoCompareQuoteBySymbol(
  symbol: string
): Promise<CryptoCompareRawQuote> {
  const normalized = toCryptoCompareSymbolFromMarketSymbol(symbol)
  const data = await fetchCryptoCompareFullQuotesBySymbols([normalized], ["USD"])
  const quote = data.RAW?.[normalized]?.USD
  if (!quote || !quote.PRICE) {
    throw new Error(`CryptoCompare returned no USD quote for ${normalized}`)
  }
  return quote
}

export async function fetchConversionRates(
  cryptoSymbols = ["BTC", "ETH", "USDT", "BNB", "SOL", "XRP", "DOGE", "ADA"],
  fiatSymbols = ["USD", "EUR", "CNY", "JPY", "KRW", "GBP", "AUD", "BRL"]
): Promise<ConversionRateMap> {
  const symbols = cryptoSymbols.map((symbol) => normalizeMarketSymbol(symbol))
  const targets = fiatSymbols.map((symbol) => symbol.toUpperCase())
  const quotedSymbols = symbols.filter((symbol) => symbol !== "USDT")
  const data = await fetchCryptoCompareFullQuotesBySymbols(quotedSymbols, ["USD"])
  const rates: ConversionRateMap = {}
  const usdPrices: Record<string, number> = {}

  for (const symbol of symbols) {
    const quoteByTarget = data.RAW?.[symbol]
    const usdPrice = symbol === "USDT" ? 1 : quoteByTarget?.USD?.PRICE
    if (!usdPrice) continue

    usdPrices[symbol] = usdPrice
    rates[symbol] = {}
    for (const target of targets) {
      const fiatRate = USD_FIAT_RATES[target]
      if (typeof fiatRate === "number" && Number.isFinite(fiatRate)) {
        rates[symbol][target] = usdPrice * fiatRate
      }
    }
  }

  for (const from of symbols) {
    if (!rates[from] || !usdPrices[from]) continue
    for (const to of symbols) {
      if (from === to || !usdPrices[to]) continue
      rates[from][to] = usdPrices[from] / usdPrices[to]
    }
  }

  if (Object.keys(rates).length === 0) {
    throw new Error("CryptoCompare returned no conversion rates")
  }

  return rates
}

type LocalCoinMetadata = {
  id: string
  symbol: string
  name: string
  description: string
  homepage: string
  explorer: string
  twitter: string
  github: string
  marketCapRank: number
  circulatingSupply: number
  totalSupply: number | null
  maxSupply: number | null
}

type LocalCoinMarketPatch = {
  currentPrice?: number
  marketCap?: number
  totalVolume?: number
  priceChange24h?: number
  high24h?: number
  low24h?: number
  circulatingSupply?: number
  imageUrl?: string
  lastUpdated?: string
  liveMarketData?: boolean
  symbol?: string
}

const LOCAL_COIN_DETAILS: Record<string, LocalCoinMetadata> = {
  bitcoin: {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    description:
      "Bitcoin 是第一个去中心化加密货币网络，主要用于价值储存和点对点转账。",
    homepage: "https://bitcoin.org",
    explorer: "https://mempool.space",
    twitter: "bitcoin",
    github: "https://github.com/bitcoin/bitcoin",
    marketCapRank: 1,
    circulatingSupply: 19_800_000,
    totalSupply: 21_000_000,
    maxSupply: 21_000_000,
  },
  ethereum: {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    description:
      "Ethereum 是支持智能合约和去中心化应用的区块链网络，也是 DeFi、NFT 和链上应用的重要基础设施。",
    homepage: "https://ethereum.org",
    explorer: "https://etherscan.io",
    twitter: "ethereum",
    github: "https://github.com/ethereum",
    marketCapRank: 2,
    circulatingSupply: 120_000_000,
    totalSupply: null,
    maxSupply: null,
  },
  solana: {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    description:
      "Solana 是高吞吐量公链，常用于链上交易、钱包、DeFi 和消费级加密应用。",
    homepage: "https://solana.com",
    explorer: "https://solscan.io",
    twitter: "solana",
    github: "https://github.com/solana-labs",
    marketCapRank: 6,
    circulatingSupply: 470_000_000,
    totalSupply: null,
    maxSupply: null,
  },
  binancecoin: {
    id: "binancecoin",
    symbol: "bnb",
    name: "BNB",
    description:
      "BNB 是 BNB Chain 生态和币安相关产品中广泛使用的资产，可用于链上手续费、生态应用和部分平台权益。",
    homepage: "https://www.bnbchain.org",
    explorer: "https://bscscan.com",
    twitter: "BNBCHAIN",
    github: "https://github.com/bnb-chain",
    marketCapRank: 4,
    circulatingSupply: 145_000_000,
    totalSupply: 145_000_000,
    maxSupply: 200_000_000,
  },
  tether: {
    id: "tether",
    symbol: "usdt",
    name: "Tether",
    description:
      "USDT 是以美元计价的稳定币，常用于交易所计价、转账和链上结算。",
    homepage: "https://tether.to",
    explorer: "https://etherscan.io/token/0xdac17f958d2ee523a2206206994597c13d831ec7",
    twitter: "Tether_to",
    github: "",
    marketCapRank: 3,
    circulatingSupply: 0,
    totalSupply: null,
    maxSupply: null,
  },
  ripple: {
    id: "ripple",
    symbol: "xrp",
    name: "XRP",
    description:
      "XRP 是 XRP Ledger 的原生资产，常被用于快速转账和支付结算场景。",
    homepage: "https://xrpl.org",
    explorer: "https://livenet.xrpl.org",
    twitter: "Ripple",
    github: "https://github.com/XRPLF",
    marketCapRank: 5,
    circulatingSupply: 0,
    totalSupply: null,
    maxSupply: 100_000_000_000,
  },
  cardano: {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    description:
      "Cardano 是采用权益证明机制的公链，关注可扩展性、治理和长期协议演进。",
    homepage: "https://cardano.org",
    explorer: "https://cardanoscan.io",
    twitter: "Cardano",
    github: "https://github.com/input-output-hk",
    marketCapRank: 10,
    circulatingSupply: 0,
    totalSupply: null,
    maxSupply: 45_000_000_000,
  },
  dogecoin: {
    id: "dogecoin",
    symbol: "doge",
    name: "Dogecoin",
    description:
      "Dogecoin 是早期加密货币之一，具备活跃社区和较高市场关注度。",
    homepage: "https://dogecoin.com",
    explorer: "https://dogechain.info",
    twitter: "dogecoin",
    github: "https://github.com/dogecoin/dogecoin",
    marketCapRank: 9,
    circulatingSupply: 0,
    totalSupply: null,
    maxSupply: null,
  },
  polkadot: {
    id: "polkadot",
    symbol: "dot",
    name: "Polkadot",
    description:
      "Polkadot 是跨链网络协议，目标是连接多条区块链并支持共享安全模型。",
    homepage: "https://polkadot.network",
    explorer: "https://polkadot.subscan.io",
    twitter: "Polkadot",
    github: "https://github.com/paritytech/polkadot-sdk",
    marketCapRank: 20,
    circulatingSupply: 0,
    totalSupply: null,
    maxSupply: null,
  },
  "avalanche-2": {
    id: "avalanche-2",
    symbol: "avax",
    name: "Avalanche",
    description:
      "Avalanche 是支持子网和智能合约的高性能区块链网络。",
    homepage: "https://www.avax.network",
    explorer: "https://snowtrace.io",
    twitter: "avax",
    github: "https://github.com/ava-labs",
    marketCapRank: 15,
    circulatingSupply: 0,
    totalSupply: null,
    maxSupply: 720_000_000,
  },
}

function getFallbackCoinMetadata(coinId: string): LocalCoinMetadata | null {
  return LOCAL_COIN_DETAILS[coinId] ?? null
}

function buildCoinDetailFallback(
  coinId: string,
  market: LocalCoinMarketPatch = {}
) {
  const fallback = getFallbackCoinMetadata(coinId)
  if (!fallback) {
    throw new Error(`No local fallback coin detail for ${coinId}`)
  }

  const currentPrice = market.currentPrice ?? 0
  const marketCap = market.marketCap ?? 0
  const totalVolume = market.totalVolume ?? 0
  const high24h = market.high24h ?? 0
  const low24h = market.low24h ?? 0
  const circulatingSupply = market.circulatingSupply ?? fallback.circulatingSupply

  return {
    id: fallback.id,
    symbol: market.symbol ?? fallback.symbol,
    name: fallback.name,
    image: { large: market.imageUrl ?? "", small: market.imageUrl ?? "" },
    description: { en: fallback.description },
    links: {
      homepage: [fallback.homepage],
      twitter_screen_name: fallback.twitter,
      telegram_channel_identifier: "",
      blockchain_site: [fallback.explorer],
      subreddit_url: "",
      repos_url: { github: fallback.github ? [fallback.github] : [] },
    },
    market_data: {
      current_price: { usd: currentPrice },
      market_cap: { usd: marketCap },
      market_cap_rank: fallback.marketCapRank,
      total_volume: { usd: totalVolume },
      price_change_percentage_24h: market.priceChange24h ?? 0,
      price_change_percentage_7d: 0,
      price_change_percentage_30d: 0,
      circulating_supply: circulatingSupply,
      total_supply: fallback.totalSupply,
      max_supply: fallback.maxSupply,
      ath: { usd: 0 },
      ath_change_percentage: { usd: 0 },
      ath_date: { usd: "" },
      high_24h: { usd: high24h },
      low_24h: { usd: low24h },
    },
    last_updated: market.lastUpdated ?? new Date().toISOString(),
    is_fallback: !market.liveMarketData,
  }
}

// ─── CoinGecko OHLC / Klines fallback ─────────────────────────────────

/** Map common symbols to CoinGecko coin IDs (lowercase slug). */
const SYMBOL_TO_CG_ID: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  BNB: "binancecoin",
  USDT: "tether",
  USDC: "usdc",
  XRP: "ripple",
  ADA: "cardano",
  DOGE: "dogecoin",
  DOT: "polkadot",
  AVAX: "avalanche-2",
  MATIC: "matic-network",
  SHIB: "shiba-inu",
  TRX: "tron",
  ATOM: "cosmos",
  LINK: "chainlink",
  UNI: "uniswap",
  LTC: "litecoin",
  BCH: "bitcoin-cash",
  NEAR: "near",
  OP: "optimism",
  ARB: "arbitrum",
  SUI: "sui-network",
  APT: "aptos",
  FIL: "filecoin",
  ICP: "internet-computer",
  XMR: "monero",
  EOS: "eos",
  THETA: "theta-token",
  FTM: "fantom",
  CRO: "crypto-com-chain",
  VET: "vechain",
  ALGO: "algorand",
  MANA: "decentraland",
  SAND: "the-sandbox",
  AXS: "axie-infinity",
  FLOW: "flow",
  CHZ: "chiliz",
  MINA: "mina-protocol",
  KSM: "kusama",
  YFI: "yearn-finance",
  MKR: "maker",
  COMP: "compound",
  SNX: "synthetix",
  CRV: "curve-dao-token",
  BAL: "balancer",
  ZRX: "0x",
  ENJ: "enjincoin",
  BAT: "basic-attention-token",
}

function toCoinGeckoId(symbol: string): string {
  return SYMBOL_TO_CG_ID[symbol.toUpperCase()] ?? symbol.toLowerCase()
}

/** CoinGecko OHLC endpoint returns [timestamp_ms, open, high, low, close] */
type CoinGeckoOhlcArray = [number, number, number, number, number]

/**
 * In-memory cache for CoinGecko OHLC results.
 * Prevents repeated timeouts when the DCA index route retries or
 * multiple users request the same symbol within a short window.
 */
const cgOhlcCache = new Map<string, { data: KlineItem[]; expiresAt: number }>()
const CG_OHLC_CACHE_TTL = 120_000 // 2 minutes

/**
 * Fetch klines from CoinGecko OHLC endpoint.
 * Free tier supports daily OHLC — only "1d" interval is supported.
 * Does NOT include volume data (free CoinGecko OHLC omits volume).
 *
 * Uses a longer timeout (20s) than other CG calls because free-tier
 * CoinGecko can be slow, and this is already a fallback path.
 */
async function fetchCoinGeckoKlines(
  symbol: string,
  interval: KlineInterval = "1d",
  limit = 250,
  forceRefresh = false
): Promise<KlineItem[]> {
  if (interval !== "1d") {
    throw new Error(
      `CoinGecko fallback only supports '1d' interval, got '${interval}'`
    )
  }

  const cacheKey = `cg-ohlc:${symbol.toUpperCase()}:${limit}`
  if (forceRefresh) {
    cgOhlcCache.delete(cacheKey)
  }
  const cached = cgOhlcCache.get(cacheKey)
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data
  }

  const coinId = toCoinGeckoId(symbol)
  // Use ~limit days — no need to fetch 365 candles when we need 250.
  // CoinGecko returns up to `days` daily OHLC candles at this endpoint.
  const days = Math.min(Math.max(limit, 200), 365)
  const raw = await cgFetch<CoinGeckoOhlcArray[]>(
    `/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`,
    2,       // retries
    20_000   // 20s — CoinGecko free API can be slow, be generous on fallback
  )
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error(`CoinGecko returned no OHLC data for ${coinId}`)
  }
  // CoinGecko orders oldest-first; take the last `limit` items
  const sliced = raw.slice(-limit)
  const result = sliced.map((k) => ({
    time: k[0],
    dateLabel: formatKlineTime(k[0], interval),
    open: k[1],
    high: k[2],
    low: k[3],
    close: k[4],
    volume: 0, // volume not included in free OHLC
  }))

  // Cache for subsequent requests
  cgOhlcCache.set(cacheKey, {
    data: result,
    expiresAt: Date.now() + CG_OHLC_CACHE_TTL,
  })

  return result
}

// ─── Binance API ──────────────────────────────────────────────────────

const BINANCE_BASE = "https://api.binance.com/api/v3"

/** Fetch with timeout and structured error */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 10_000
): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    return res
  } finally {
    clearTimeout(timer)
  }
}

async function binanceFetch<T>(path: string, timeoutMs = 10_000): Promise<T> {
  for (let i = 0; i <= 1; i++) {
    try {
      const res = await fetchWithTimeout(`${BINANCE_BASE}${path}`, {}, timeoutMs)
      if (!res.ok) {
        const body = await res.text().catch(() => "")
        throw new Error(`Binance ${res.status}: ${res.statusText} — ${body.slice(0, 200)}`)
      }
      return (await res.json()) as T
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        throw new Error(`Binance timeout after ${timeoutMs / 1000}s: ${path}`)
      }
      if (i === 1) throw err
      await sleep(1000 * (i + 1))
    }
  }
  throw new Error("Binance request failed after retries")
}

/** Interval options: 1m, 5m, 15m, 30m, 1h, 4h, 1d, 1w, 1M */
export type KlineInterval =
  | "1m" | "5m" | "15m" | "30m"
  | "1h" | "4h"
  | "1d" | "1w" | "1M"

async function fetchCryptoCompareKlines(
  symbol: string,
  interval: KlineInterval,
  limit: number
): Promise<KlineItem[]> {
  const normalized = toCryptoCompareSymbolFromMarketSymbol(symbol)
  let endpoint: "histominute" | "histohour" | "histoday"
  let aggregate = 1

  switch (interval) {
    case "1m":
      endpoint = "histominute"
      break
    case "5m":
      endpoint = "histominute"
      aggregate = 5
      break
    case "15m":
      endpoint = "histominute"
      aggregate = 15
      break
    case "30m":
      endpoint = "histominute"
      aggregate = 30
      break
    case "1h":
      endpoint = "histohour"
      break
    case "4h":
      endpoint = "histohour"
      aggregate = 4
      break
    case "1d":
      endpoint = "histoday"
      break
    default:
      throw new Error(`CryptoCompare does not support interval '${interval}'`)
  }

  const url =
    `${CRYPTOCOMPARE_BASE}/v2/${endpoint}?fsym=${encodeURIComponent(normalized)}` +
    `&tsym=USD&limit=${limit}&aggregate=${aggregate}`
  const res = await fetchWithTimeout(url, {
    headers: { Accept: "application/json" },
  }, 8_000)

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`CryptoCompare ${res.status}: ${res.statusText} — ${body.slice(0, 200)}`)
  }

  const data = (await res.json()) as CryptoCompareHistoryResponse
  const rows = data.Data?.Data ?? []
  if (data.Response === "Error" || rows.length === 0) {
    throw new Error(data.Message || `CryptoCompare returned no klines for ${normalized}`)
  }

  return rows.slice(-limit).map((k) => ({
    time: k.time * 1000,
    dateLabel: formatKlineTime(k.time * 1000, interval),
    open: k.open,
    high: k.high,
    low: k.low,
    close: k.close,
    volume: k.volumefrom ?? 0,
  }))
}

/** Fetch kline/candlestick data from Binance (with CoinGecko fallback) */
export async function fetchKlines(
  symbol: string,
  interval: KlineInterval = "1d",
  limit = 50,
  forceRefresh = false
): Promise<KlineItem[]> {
  // 1) Use CryptoCompare first for supported historical candles.
  try {
    return await fetchCryptoCompareKlines(symbol, interval, limit)
  } catch (ccErr) {
    const ccMsg = ccErr instanceof Error ? ccErr.message : String(ccErr)
    console.warn(
      `[market-api] CryptoCompare klines failed for ${symbol}/${interval}, ` +
      `falling back to Binance: ${ccMsg}`
    )
  }

  // 2) Try Binance
  try {
    const pair = toBinancePair(symbol)
    const raw = await binanceFetch<BinanceKlineArray[]>(
      `/klines?symbol=${pair}&interval=${interval}&limit=${limit}`
    )
    return raw.map((k) => ({
      time: k[0],
      dateLabel: formatKlineTime(k[0], interval),
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5]),
    }))
  } catch (binanceErr) {
    // 3) Fall back to CoinGecko (only for 1d interval)
    if (interval === "1d") {
      const binanceMsg = binanceErr instanceof Error ? binanceErr.message : String(binanceErr)
      console.warn(
        `[market-api] Binance klines failed for ${symbol}/${interval}, ` +
        `falling back to CoinGecko: ${binanceMsg}`
      )
      return fetchCoinGeckoKlines(symbol, interval, limit, forceRefresh)
    }
    // Non-1d intervals can't use CoinGecko — rethrow original error
    throw binanceErr
  }
}

/** Fetch 24hr ticker for a symbol (with CoinGecko fallback) */
export async function fetchTicker24hr(symbol: string): Promise<Ticker24hr> {
  // Validate symbol
  if (!symbol || typeof symbol !== "string" || !symbol.trim()) {
    throw new Error(`Invalid symbol: "${symbol}"`)
  }
  const trimmed = symbol.trim().toUpperCase()

  // 1) Try CryptoCompare first.
  try {
    const quote = await fetchCryptoCompareQuoteBySymbol(trimmed)
    const lastPrice = quote.PRICE ?? 0
    const open = quote.OPEN24HOUR ?? 0
    const priceChange = open > 0 ? lastPrice - open : 0

    return {
      symbol: `${normalizeMarketSymbol(trimmed)}USDT`,
      lastPrice: String(lastPrice),
      priceChange: String(priceChange),
      priceChangePercent: String(quote.CHANGEPCT24HOUR ?? 0),
      highPrice: String(quote.HIGH24HOUR ?? 0),
      lowPrice: String(quote.LOW24HOUR ?? 0),
      volume: String(quote.VOLUME24HOUR ?? 0),
      quoteVolume: String(quote.TOTALVOLUME24HTO ?? quote.VOLUME24HOURTO ?? 0),
    }
  } catch (ccErr) {
    const ccMsg = ccErr instanceof Error ? ccErr.message : String(ccErr)
    console.warn(
      `[market-api] CryptoCompare ticker failed for ${trimmed}, falling back to Binance: ${ccMsg}`
    )
  }

  // 2) Try Binance
  try {
    const pair = toBinancePair(trimmed)
    return await binanceFetch<Ticker24hr>(`/ticker/24hr?symbol=${pair}`)
  } catch (binanceErr) {
    // 3) Fall back to CoinGecko simple price API
    const binanceMsg = binanceErr instanceof Error ? binanceErr.message : String(binanceErr)
    console.warn(
      `[market-api] Binance ticker failed for ${trimmed}, falling back to CoinGecko: ${binanceMsg}`
    )
    return fetchCoinGeckoTicker(trimmed)
  }
}

/** Fallback: fetch 24hr ticker from CoinGecko simple price API */
async function fetchCoinGeckoTicker(symbol: string): Promise<Ticker24hr> {
  const coinId = toCoinGeckoId(symbol)
  const priceData = await fetchCoinGeckoSimplePrice([coinId])
  const coin = priceData[coinId]
  if (!coin || coin.usd == null) {
    throw new Error(
      `No data from CoinGecko for ${symbol} (coinId: ${coinId})`
    )
  }

  const lastPrice = coin.usd
  const changePercent = coin.usd_24h_change ?? 0
  const quoteVolume = coin.usd_24h_vol ?? 0
  // Approximate base volume from quote volume (24h usd vol) / price
  const volume = quoteVolume > 0 ? quoteVolume / lastPrice : 0

  return {
    symbol: `${symbol}USDT`,
    lastPrice: String(lastPrice),
    priceChange: "0",
    priceChangePercent: String(changePercent),
    highPrice: "0",
    lowPrice: "0",
    volume: String(volume),
    quoteVolume: String(quoteVolume),
  }
}

/** Fetch exchange info (to get list of trading pairs) */
export async function fetchExchangeInfo() {
  return binanceFetch<Record<string, unknown>>("/exchangeInfo")
}

// ─── Composite helpers ────────────────────────────────────────────────

/**
 * Get a full market overview (page-level data).
 * Aggregates data from CoinGecko + Binance.
 */
export async function fetchMarketOverview(): Promise<MarketOverview> {
  const [global, price, fearGreedData] = await Promise.all([
    fetchGlobalData(),
    fetchSimplePrice(["bitcoin", "ethereum"]),
    fetchFearGreed(),
  ])

  const btc = price.bitcoin
  const eth = price.ethereum
  const fearItem = fearGreedData.data?.[0]

  return {
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
}
