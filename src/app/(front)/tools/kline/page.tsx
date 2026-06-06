"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RefreshCw, AlertCircle, TrendingUp, BarChart3 } from "lucide-react"
import { KlineChart, KlineChartSkeleton, type EnrichedKlinePoint } from "@/components/charts/KlineChart"
import type { KlineItem } from "@/lib/market-api"

// ── Constants ──

const SYMBOLS = [
  { label: "BTC/USDT", value: "BTC" },
  { label: "ETH/USDT", value: "ETH" },
  { label: "SOL/USDT", value: "SOL" },
  { label: "BNB/USDT", value: "BNB" },
  { label: "XRP/USDT", value: "XRP" },
  { label: "ADA/USDT", value: "ADA" },
  { label: "DOGE/USDT", value: "DOGE" },
  { label: "AVAX/USDT", value: "AVAX" },
]

const INTERVALS = [
  { label: "1 小时", value: "1h" },
  { label: "4 小时", value: "4h" },
  { label: "1 天", value: "1d" },
  { label: "1 周", value: "1w" },
]

const INDICATORS = [
  { label: "MA5", value: "ma5" },
  { label: "MA10", value: "ma10" },
  { label: "MA20", value: "ma20" },
  { label: "BOLL", value: "boll" },
] as const

const DEFAULT_LIMIT = 100

// ── Enrichment helpers ──

function computeSMA(values: number[], period: number): (number | null)[] {
  const result: (number | null)[] = []
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      result.push(null)
    } else {
      let sum = 0
      for (let j = i - period + 1; j <= i; j++) {
        sum += values[j]
      }
      result.push(sum / period)
    }
  }
  return result
}

function computeBB(
  values: number[],
  period: number,
  multiplier: number
): { upper: (number | null)[]; middle: (number | null)[]; lower: (number | null)[] } {
  const middle = computeSMA(values, period)
  const upper: (number | null)[] = []
  const lower: (number | null)[] = []
  for (let i = 0; i < values.length; i++) {
    if (middle[i] === null) {
      upper.push(null)
      lower.push(null)
    } else {
      // Compute standard deviation
      let sumSq = 0
      const start = i - period + 1
      for (let j = start; j <= i; j++) {
        sumSq += (values[j] - middle[i]!) ** 2
      }
      const stdDev = Math.sqrt(sumSq / period)
      upper.push(middle[i]! + multiplier * stdDev)
      lower.push(middle[i]! - multiplier * stdDev)
    }
  }
  return { upper, middle, lower }
}

function enrichKlineData(items: KlineItem[]): EnrichedKlinePoint[] {
  const closes = items.map((d) => d.close)
  const ma5 = computeSMA(closes, 5)
  const ma10 = computeSMA(closes, 10)
  const ma20 = computeSMA(closes, 20)
  const bb = computeBB(closes, 20, 2)

  return items.map((d, i) => ({
    time: d.dateLabel,
    timestamp: d.time,
    open: d.open,
    high: d.high,
    low: d.low,
    close: d.close,
    volume: d.volume,
    isUp: d.close >= d.open,
    ma5: ma5[i],
    ma10: ma10[i],
    ma20: ma20[i],
    bbUpper: bb.upper[i],
    bbLower: bb.lower[i],
  }))
}

function computeYDomain(data: EnrichedKlinePoint[]): [number, number] {
  if (!data.length) return [0, 0]
  let min = Infinity
  let max = -Infinity
  for (const d of data) {
    if (d.low < min) min = d.low
    if (d.high > max) max = d.high
  }
  const padding = (max - min) * 0.05 || max * 0.01 || 1
  return [min - padding, max + padding]
}

// ── Formatting ──

function formatPrice(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(2)}K`
  if (n >= 1) return `$${n.toFixed(2)}`
  return `$${n.toFixed(6)}`
}

function formatPercent(n: number): string {
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`
}

// ── Component ──

export default function KlinePage() {
  const [symbol, setSymbol] = useState("BTC")
  const [interval, setIntervalVal] = useState("1d")
  const [activeIndicator, setActiveIndicator] = useState("ma10")
  const [data, setData] = useState<KlineItem[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [priceChange, setPriceChange] = useState<number | null>(null)

  const fetchData = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true)
    setError(null)

    try {
      const [klinesRes, tickerRes] = await Promise.all([
        fetch(`/api/market/klines?symbol=${symbol}&interval=${interval}&limit=${DEFAULT_LIMIT}&_=${Date.now()}`),
        fetch(`/api/market/ticker?symbol=${symbol}&_=${Date.now()}`),
      ])

      if (!klinesRes.ok) {
        const body = await klinesRes.json().catch(() => null)
        throw new Error(body?.error ?? `K线数据 HTTP ${klinesRes.status}`)
      }

      const klines: KlineItem[] = await klinesRes.json()
      setData(klines)

      if (tickerRes.ok) {
        const ticker = await tickerRes.json()
        setCurrentPrice(Number(ticker.lastPrice))
        setPriceChange(Number(ticker.priceChangePercent))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "数据加载失败")
    } finally {
      setLoading(false)
    }
  }, [symbol, interval])

  // ── Initial load ──
  useEffect(() => {
    fetchData(true)
  }, [fetchData])

  // ── Auto refresh every 120s ──
  useEffect(() => {
    if (error) return
    const id = globalThis.setInterval(() => fetchData(false), 120_000)
    return () => globalThis.clearInterval(id)
  }, [fetchData, error])

  // ── Enriched data ──
  const enriched = useMemo(() => (data ? enrichKlineData(data) : []), [data])
  const yDomain = useMemo(() => computeYDomain(enriched), [enriched])

  // ── Latest ohlc ──
  const latest = enriched.length > 0 ? enriched[enriched.length - 1] : null

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">K线走势分析</h1>
          <p className="text-muted-foreground text-sm mt-1">
            查看实时 K 线图、技术指标和成交量变化
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchData(true)}
          disabled={loading}
        >
          <RefreshCw className={`mr-1 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          刷新
        </Button>
      </div>

      {/* ── Symbol & Interval Selector ── */}
      <div className="flex flex-wrap gap-4">
        {/* Symbol */}
        <div className="flex flex-wrap gap-1.5">
          <span className="mr-1 flex items-center text-xs text-muted-foreground font-medium">
            币对
          </span>
          {SYMBOLS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSymbol(s.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                symbol === s.value
                  ? "bg-gold text-white shadow-sm shadow-gold/20"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Interval */}
        <div className="flex flex-wrap gap-1.5">
          <span className="mr-1 flex items-center text-xs text-muted-foreground font-medium">
            周期
          </span>
          {INTERVALS.map((iv) => (
            <button
              key={iv.value}
              onClick={() => setIntervalVal(iv.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                interval === iv.value
                  ? "bg-gold text-white shadow-sm shadow-gold/20"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {iv.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Price Summary ── */}
      {currentPrice != null && (
        <div className="flex flex-wrap items-end gap-6">
          <div>
            <p className="text-xs text-muted-foreground">最新价格</p>
            <p className="text-2xl font-bold tracking-tight">{formatPrice(currentPrice)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">24h 涨跌</p>
            <p className={`text-lg font-semibold ${priceChange != null && priceChange >= 0 ? "text-green-500" : "text-red-500"}`}>
              {priceChange != null ? formatPercent(priceChange) : "--"}
            </p>
          </div>
          {latest && (
            <>
              <div>
                <p className="text-xs text-muted-foreground">开盘</p>
                <p className="font-mono text-sm">{formatPrice(latest.open)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">最高</p>
                <p className="font-mono text-sm">{formatPrice(latest.high)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">最低</p>
                <p className="font-mono text-sm">{formatPrice(latest.low)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">收盘</p>
                <p className="font-mono text-sm">{formatPrice(latest.close)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">成交量</p>
                <p className="font-mono text-sm">{latest.volume.toLocaleString()}</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Chart ── */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              {SYMBOLS.find((s) => s.value === symbol)?.label} —{" "}
              {INTERVALS.find((iv) => iv.value === interval)?.label}
            </CardTitle>
            {/* Indicator Toggle */}
            <div className="flex gap-1">
              {INDICATORS.map((ind) => (
                <button
                  key={ind.value}
                  onClick={() => setActiveIndicator(ind.value)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                    activeIndicator === ind.value
                      ? "bg-gold/15 text-gold-dark dark:text-gold-light"
                      : "text-muted-foreground hover:bg-muted/60"
                  }`}
                >
                  {ind.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading && !data && <KlineChartSkeleton />}

          {error && !data && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertCircle className="mb-3 h-8 w-8 text-destructive" />
              <p className="font-medium text-destructive">{error}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => fetchData(true)}>
                重试
              </Button>
            </div>
          )}

          {enriched.length > 0 && (
            <KlineChart
              data={enriched}
              yDomain={yDomain}
              indicator={activeIndicator}
              currentPrice={currentPrice}
              showVolume
            />
          )}
        </CardContent>
      </Card>

      {/* ── Indicators Legend ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">技术指标说明</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1 rounded-lg border border-border/60 p-3">
            <div className="flex items-center gap-2">
              <span className="inline-block h-0.5 w-6 rounded bg-amber-500" />
              <span className="text-sm font-medium">MA5</span>
            </div>
            <p className="text-xs text-muted-foreground">
              5 周期移动平均线，反映短期价格趋势。价格在 MA5 上方表示短期强势。
            </p>
          </div>
          <div className="space-y-1 rounded-lg border border-border/60 p-3">
            <div className="flex items-center gap-2">
              <span className="inline-block h-0.5 w-6 rounded bg-blue-500" />
              <span className="text-sm font-medium">MA10</span>
            </div>
            <p className="text-xs text-muted-foreground">
              10 周期移动平均线，反映中期价格趋势。MA5 上穿 MA10 为金叉信号。
            </p>
          </div>
          <div className="space-y-1 rounded-lg border border-border/60 p-3">
            <div className="flex items-center gap-2">
              <span className="inline-block h-0.5 w-6 rounded bg-red-500" />
              <span className="text-sm font-medium">MA20</span>
            </div>
            <p className="text-xs text-muted-foreground">
              20 周期移动平均线，反映长期趋势走向。是 Bollinger Bands 中轨。
            </p>
          </div>
          <div className="space-y-1 rounded-lg border border-border/60 p-3">
            <div className="flex items-center gap-2">
              <span className="inline-block h-0.5 w-6 rounded border border-dashed border-violet-500 bg-transparent" />
              <span className="text-sm font-medium">Bollinger Bands</span>
            </div>
            <p className="text-xs text-muted-foreground">
              布林带（20, 2）：上/下轨为价格±2倍标准差。带宽扩大表示波动加剧，价格触及下轨为超卖信号。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
