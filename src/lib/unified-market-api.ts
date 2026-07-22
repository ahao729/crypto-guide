/**
 * Unified Market Data API
 * 
 * 多数据源统一接口，支持：
 * 1. Binance 镜像 (data-api.binance.vision) - 无需 API 密钥
 * 2. Gate.io (api.gateio.ws) - 无需 API 密钥
 * 
 * 特性：自动重试、降级、速率限制感知
 */

// ─── Types ────────────────────────────────────────────────────────────

export interface KlineData {
  time: number        // Unix timestamp in milliseconds
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export type KlineInterval = 
  | '1m' | '3m' | '5m' | '15m' | '30m'   // 分钟级
  | '1h' | '2h' | '4h' | '6h' | '12h'    // 小时级
  | '1d' | '3d' | '1w' | '1M'             // 日/周/月级

export interface DataSourceConfig {
  name: string
  enabled: boolean
  priority: number  // 越小越优先
}

// ─── Configuration ────────────────────────────────────────────────────

const DATA_SOURCES: DataSourceConfig[] = [
  { name: 'binance-mirror', enabled: true, priority: 1 },
  { name: 'gateio', enabled: true, priority: 2 },
]

const REQUEST_TIMEOUT = 10000  // 10 秒
const MAX_RETRIES = 2

// ─── Interval Mapping ─────────────────────────────────────────────────

/**
 * 将通用 interval 映射到各数据源的格式
 */
function mapInterval(
  interval: KlineInterval, 
  source: 'binance' | 'gateio'
): string {
  const mapping: Record<KlineInterval, Record<'binance' | 'gateio', string>> = {
    '1m':  { binance: '1m',  gateio: '1m' },
    '3m':  { binance: '3m',  gateio: '3m' },
    '5m':  { binance: '5m',  gateio: '5m' },
    '15m': { binance: '15m', gateio: '15m' },
    '30m': { binance: '30m', gateio: '30m' },
    '1h':  { binance: '1h',  gateio: '1h' },
    '2h':  { binance: '2h',  gateio: '2h' },
    '4h':  { binance: '4h',  gateio: '4h' },
    '6h':  { binance: '6h',  gateio: '6h' },
    '12h': { binance: '12h', gateio: '12h' },
    '1d':  { binance: '1d',  gateio: '1d' },
    '3d':  { binance: '3d',  gateio: '3d' },
    '1w':  { binance: '1w',  gateio: '1w' },
    '1M':  { binance: '1M',  gateio: '1M' },
  }
  return mapping[interval][source]
}

/**
 * 标准化交易对符号
 * "BTCUSDT" -> "BTC", "BTC-USDT" -> "BTC"
 */
function normalizeSymbol(symbol: string): string {
  const trimmed = symbol.trim().toUpperCase()
  // 移除常见后缀
  if (trimmed.endsWith('USDT')) return trimmed.slice(0, -4)
  if (trimmed.endsWith('USD')) return trimmed.slice(0, -3)
  if (trimmed.includes('-')) return trimmed.split('-')[0]
  return trimmed
}

// ─── Binance Mirror API ───────────────────────────────────────────────

async function fetchFromBinanceMirror(
  symbol: string,
  interval: KlineInterval,
  limit: number = 100
): Promise<KlineData[]> {
  const binanceSymbol = symbol.toUpperCase()
  const binanceInterval = mapInterval(interval, 'binance')
  
  const url = new URL('https://data-api.binance.vision/api/v3/klines')
  url.searchParams.set('symbol', binanceSymbol)
  url.searchParams.set('interval', binanceInterval)
  url.searchParams.set('limit', String(Math.min(limit, 1000)))

  const response = await fetch(url.toString(), {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
  })

  if (!response.ok) {
    throw new Error(`Binance Mirror API error: ${response.status}`)
  }

  const data = await response.json()
  
  // Binance 格式: [openTime, open, high, low, close, volume, closeTime, ...]
  return data.map((item: any[]) => ({
    time: item[0],
    open: parseFloat(item[1]),
    high: parseFloat(item[2]),
    low: parseFloat(item[3]),
    close: parseFloat(item[4]),
    volume: parseFloat(item[5]),
  }))
}

// ─── Gate.io API ──────────────────────────────────────────────────────

async function fetchFromGateIO(
  symbol: string,
  interval: KlineInterval,
  limit: number = 100
): Promise<KlineData[]> {
  const normalized = normalizeSymbol(symbol)
  const pair = `${normalized}_USDT`
  const gateioInterval = mapInterval(interval, 'gateio')
  
  const url = new URL('https://api.gateio.ws/api/v4/spot/candlesticks')
  url.searchParams.set('currency_pair', pair)
  url.searchParams.set('interval', gateioInterval)
  url.searchParams.set('limit', String(Math.min(limit, 1000)))

  const response = await fetch(url.toString(), {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
  })

  if (!response.ok) {
    throw new Error(`Gate.io API error: ${response.status}`)
  }

  const data = await response.json()
  
  // Gate.io 格式: [timestamp, volume, close, highest, lowest, open, isWindowClosed]
  return data.map((item: any) => ({
    time: parseInt(item[0]) * 1000,  // 秒转毫秒
    open: parseFloat(item[5]),
    high: parseFloat(item[3]),
    low: parseFloat(item[4]),
    close: parseFloat(item[2]),
    volume: parseFloat(item[1]),
  }))
}

// ─── Data Fetcher with Fallback ───────────────────────────────────────

async function fetchWithFallback(
  symbol: string,
  interval: KlineInterval,
  limit: number
): Promise<{ data: KlineData[], source: string }> {
  const sources = DATA_SOURCES.filter(s => s.enabled).sort((a, b) => a.priority - b.priority)
  
  let lastError: Error | null = null

  for (const source of sources) {
    try {
      let data: KlineData[]
      
      switch (source.name) {
        case 'binance-mirror':
          data = await fetchFromBinanceMirror(symbol, interval, limit)
          break
        case 'gateio':
          data = await fetchFromGateIO(symbol, interval, limit)
          break
        default:
          continue
      }

      if (data && data.length > 0) {
        return { data, source: source.name }
      }
    } catch (error) {
      lastError = error as Error
      console.warn(`[MarketAPI] ${source.name} failed:`, error)
      continue
    }
  }

  throw lastError || new Error('All data sources failed')
}

// ─── Public API ───────────────────────────────────────────────────────

/**
 * 获取 K 线数据
 * @param symbol 交易对，如 "BTCUSDT", "ETH-USDT", "BTC"
 * @param interval 时间间隔
 * @param limit 返回数量 (默认 100，最大 1000)
 * @returns K 线数据数组
 */
export async function getKlines(
  symbol: string,
  interval: KlineInterval = '1h',
  limit: number = 100
): Promise<KlineData[]> {
  const { data, source } = await fetchWithFallback(symbol, interval, limit)
  console.log(`[MarketAPI] Fetched ${data.length} klines from ${source}`)
  return data
}

/**
 * 获取当前价格
 */
export async function getCurrentPrice(symbol: string): Promise<number> {
  const klines = await getKlines(symbol, '1m', 1)
  if (klines.length === 0) {
    throw new Error('No price data available')
  }
  return klines[klines.length - 1].close
}

/**
 * 获取多个交易对的当前价格
 */
export async function getMultiplePrices(
  symbols: string[]
): Promise<Record<string, number>> {
  const results: Record<string, number> = {}
  
  // 并发请求
  const promises = symbols.map(async (symbol) => {
    try {
      const price = await getCurrentPrice(symbol)
      results[symbol] = price
    } catch (error) {
      console.warn(`Failed to fetch price for ${symbol}:`, error)
    }
  })
  
  await Promise.allSettled(promises)
  return results
}

/**
 * 获取支持的交易对列表
 */
export async function getSupportedSymbols(): Promise<string[]> {
  try {
    const response = await fetch('https://api.gateio.ws/api/v4/spot/currency_pairs', {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    })
    const data = await response.json()
    return data
      .filter((pair: any) => pair.quote === 'USDT' && pair.trade_status === 'tradable')
      .map((pair: any) => pair.base)
      .slice(0, 100)  // 限制返回数量
  } catch (error) {
    console.warn('Failed to fetch symbols:', error)
    return ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'DOGE', 'ADA', 'AVAX', 'DOT', 'MATIC']
  }
}

// ─── Utility Functions ────────────────────────────────────────────────

/**
 * 格式化价格显示
 */
export function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } else if (price >= 1) {
    return price.toFixed(2)
  } else {
    return price.toFixed(4)
  }
}

/**
 * 格式化成交量显示
 */
export function formatVolume(volume: number): string {
  if (volume >= 1e9) {
    return `$${(volume / 1e9).toFixed(2)}B`
  } else if (volume >= 1e6) {
    return `$${(volume / 1e6).toFixed(2)}M`
  } else if (volume >= 1e3) {
    return `$${(volume / 1e3).toFixed(2)}K`
  }
  return `$${volume.toFixed(2)}`
}
