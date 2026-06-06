"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertCircle, Info, ChevronRight, Lightbulb } from "lucide-react"
import { KlinePatternsChart, KlinePatternsChartSkeleton, type KlineData } from "@/components/charts/KlinePatternsChart"
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
]

const INTERVALS = [
  { label: "1 小时", value: "1h" },
  { label: "4 小时", value: "4h" },
  { label: "1 天", value: "1d" },
  { label: "1 周", value: "1w" },
] as const

type PatternType =
  | "doji"
  | "hammer"
  | "shooting-star"
  | "engulfing-bull"
  | "engulfing-bear"
  | "morning-star"
  | "evening-star"
  | "three-white-soldiers"
  | "three-black-crows"
  | "harami-bull"
  | "harami-bear"
  | "piercing"
  | "dark-cloud"

interface PatternInfo {
  type: PatternType
  name: string
  description: string
  signal: "buy" | "sell" | "neutral"
  strength: "strong" | "moderate" | "weak"
}

const PATTERN_CATALOG: Record<PatternType, PatternInfo> = {
  doji: {
    type: "doji",
    name: "十字星",
    description: "开盘价与收盘价几乎相同，表示市场犹豫不决，可能发生趋势反转。",
    signal: "neutral",
    strength: "weak",
  },
  hammer: {
    type: "hammer",
    name: "锤子线",
    description: "下影线较长，实体较小（位于上端）。出现在下跌趋势中，预示可能反转上涨。",
    signal: "buy",
    strength: "moderate",
  },
  "shooting-star": {
    type: "shooting-star",
    name: "射击之星",
    description: "上影线较长，实体较小（位于下端）。出现在上涨趋势中，预示可能反转下跌。",
    signal: "sell",
    strength: "moderate",
  },
  "engulfing-bull": {
    type: "engulfing-bull",
    name: "看涨吞没",
    description: "当前阳线实体完全吞没前一根阴线实体。强烈的看涨反转信号。",
    signal: "buy",
    strength: "strong",
  },
  "engulfing-bear": {
    type: "engulfing-bear",
    name: "看跌吞没",
    description: "当前阴线实体完全吞没前一根阳线实体。强烈的看跌反转信号。",
    signal: "sell",
    strength: "strong",
  },
  "morning-star": {
    type: "morning-star",
    name: "晨星",
    description: "三根K线组成：长阴、小实体、长阳。底部反转形态，预示上涨。",
    signal: "buy",
    strength: "strong",
  },
  "evening-star": {
    type: "evening-star",
    name: "暮星",
    description: "三根K线组成：长阳、小实体、长阴。顶部反转形态，预示下跌。",
    signal: "sell",
    strength: "strong",
  },
  "three-white-soldiers": {
    type: "three-white-soldiers",
    name: "三白兵",
    description: "连续三根阳线，每根收盘价依次抬高。强烈的看涨持续/反转信号。",
    signal: "buy",
    strength: "moderate",
  },
  "three-black-crows": {
    type: "three-black-crows",
    name: "三只乌鸦",
    description: "连续三根阴线，每根收盘价依次降低。强烈的看跌持续/反转信号。",
    signal: "sell",
    strength: "moderate",
  },
  "harami-bull": {
    type: "harami-bull",
    name: "看涨孕线",
    description: "大阴线后跟一个小阳线（实体完全在前阴线内部）。趋势可能反转向上。",
    signal: "buy",
    strength: "weak",
  },
  "harami-bear": {
    type: "harami-bear",
    name: "看跌孕线",
    description: "大阳线后跟一个小阴线（实体完全在前阳线内部）。趋势可能反转向下。",
    signal: "sell",
    strength: "weak",
  },
  piercing: {
    type: "piercing",
    name: "刺透形态",
    description: "阴线后阳线开盘低于前低，收盘在前阴线实体的中部以上。看涨反转。",
    signal: "buy",
    strength: "moderate",
  },
  "dark-cloud": {
    type: "dark-cloud",
    name: "乌云盖顶",
    description: "阳线后阴线开盘高于前高，收盘在前阳线实体的中部以下。看跌反转。",
    signal: "sell",
    strength: "moderate",
  },
}

// ── Pattern Detection ──

interface DetectedPattern {
  type: PatternType
  index: number
  signal: "buy" | "sell" | "neutral"
  strength: "strong" | "moderate" | "weak"
}

function isDoji(c: KlineData): boolean {
  const body = Math.abs(c.close - c.open)
  const range = c.high - c.low
  return range > 0 && body / range < 0.1
}

function isHammer(c: KlineData): boolean {
  const body = Math.abs(c.close - c.open)
  const lowerShadow = Math.min(c.open, c.close) - c.low
  const upperShadow = c.high - Math.max(c.open, c.close)
  return lowerShadow >= 2 * body && upperShadow <= 0.3 * body
}

function isShootingStar(c: KlineData): boolean {
  const body = Math.abs(c.close - c.open)
  const lowerShadow = Math.min(c.open, c.close) - c.low
  const upperShadow = c.high - Math.max(c.open, c.close)
  return upperShadow >= 2 * body && lowerShadow <= 0.3 * body
}

function isBullishEngulfing(prev: KlineData, curr: KlineData): boolean {
  return !prev.isUp && curr.isUp && curr.open <= prev.close && curr.close >= prev.open
}

function isBearishEngulfing(prev: KlineData, curr: KlineData): boolean {
  return prev.isUp && !curr.isUp && curr.open >= prev.close && curr.close <= prev.open
}

function isMorningStar(prev2: KlineData, prev1: KlineData, curr: KlineData): boolean {
  return (
    !prev2.isUp &&
    curr.isUp &&
    Math.abs(prev1.close - prev1.open) / (prev1.high - prev1.low || 1) < 0.15 &&
    curr.close > (prev2.open + prev2.close) / 2
  )
}

function isEveningStar(prev2: KlineData, prev1: KlineData, curr: KlineData): boolean {
  return (
    prev2.isUp &&
    !curr.isUp &&
    Math.abs(prev1.close - prev1.open) / (prev1.high - prev1.low || 1) < 0.15 &&
    curr.close < (prev2.open + prev2.close) / 2
  )
}

function isThreeWhiteSoldiers(p1: KlineData, p2: KlineData, p3: KlineData): boolean {
  return p1.isUp && p2.isUp && p3.isUp && p2.close > p1.close && p3.close > p2.close
}

function isThreeBlackCrows(p1: KlineData, p2: KlineData, p3: KlineData): boolean {
  return !p1.isUp && !p2.isUp && !p3.isUp && p2.close < p1.close && p3.close < p2.close
}

function isBullishHarami(prev: KlineData, curr: KlineData): boolean {
  return !prev.isUp && curr.isUp && curr.open >= prev.open && curr.close <= prev.close
}

function isBearishHarami(prev: KlineData, curr: KlineData): boolean {
  return prev.isUp && !curr.isUp && curr.open <= prev.open && curr.close >= prev.close
}

function isPiercing(prev: KlineData, curr: KlineData): boolean {
  if (prev.isUp || !curr.isUp) return false
  const midPrev = (prev.open + prev.close) / 2
  return curr.open < prev.low && curr.close > midPrev
}

function isDarkCloud(prev: KlineData, curr: KlineData): boolean {
  if (!prev.isUp || curr.isUp) return false
  const midPrev = (prev.open + prev.close) / 2
  return curr.open > prev.high && curr.close < midPrev
}

function detectPatterns(data: KlineData[]): DetectedPattern[] {
  const patterns: DetectedPattern[] = []

  for (let i = 0; i < data.length; i++) {
    // 1-candle patterns
    if (isDoji(data[i])) {
      patterns.push({ type: "doji", index: i, signal: "neutral", strength: "weak" })
    }
    if (isHammer(data[i])) {
      patterns.push({ type: "hammer", index: i, signal: "buy", strength: "moderate" })
    }
    if (isShootingStar(data[i])) {
      patterns.push({ type: "shooting-star", index: i, signal: "sell", strength: "moderate" })
    }

    // 2-candle patterns
    if (i >= 1) {
      if (isBullishEngulfing(data[i - 1], data[i])) {
        patterns.push({ type: "engulfing-bull", index: i, signal: "buy", strength: "strong" })
      }
      if (isBearishEngulfing(data[i - 1], data[i])) {
        patterns.push({ type: "engulfing-bear", index: i, signal: "sell", strength: "strong" })
      }
      if (isBullishHarami(data[i - 1], data[i])) {
        patterns.push({ type: "harami-bull", index: i, signal: "buy", strength: "weak" })
      }
      if (isBearishHarami(data[i - 1], data[i])) {
        patterns.push({ type: "harami-bear", index: i, signal: "sell", strength: "weak" })
      }
      if (isPiercing(data[i - 1], data[i])) {
        patterns.push({ type: "piercing", index: i, signal: "buy", strength: "moderate" })
      }
      if (isDarkCloud(data[i - 1], data[i])) {
        patterns.push({ type: "dark-cloud", index: i, signal: "sell", strength: "moderate" })
      }
    }

    // 3-candle patterns
    if (i >= 2) {
      if (isMorningStar(data[i - 2], data[i - 1], data[i])) {
        patterns.push({ type: "morning-star", index: i, signal: "buy", strength: "strong" })
      }
      if (isEveningStar(data[i - 2], data[i - 1], data[i])) {
        patterns.push({ type: "evening-star", index: i, signal: "sell", strength: "strong" })
      }
      if (isThreeWhiteSoldiers(data[i - 2], data[i - 1], data[i])) {
        patterns.push({ type: "three-white-soldiers", index: i, signal: "buy", strength: "moderate" })
      }
      if (isThreeBlackCrows(data[i - 2], data[i - 1], data[i])) {
        patterns.push({ type: "three-black-crows", index: i, signal: "sell", strength: "moderate" })
      }
    }
  }

  return patterns
}

// ── YDomain ──

function computeYDomain(data: KlineData[]): [number, number] {
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

// ── Component ──

export default function KlinePatternsPage() {
  const [symbol, setSymbol] = useState("BTC")
  const [interval, setIntervalVal] = useState<"1h" | "4h" | "1d" | "1w">("1d")
  const [data, setData] = useState<KlineItem[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredPattern, setHoveredPattern] = useState<DetectedPattern | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const fetchData = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true)
    setError(null)

    try {
      const res = await fetch(
        `/api/market/klines?symbol=${symbol}&interval=${interval}&limit=60&_=${Date.now()}`
      )
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? `K线数据 HTTP ${res.status}`)
      }
      const klines: KlineItem[] = await res.json()
      setData(klines)
    } catch (err) {
      setError(err instanceof Error ? err.message : "数据加载失败")
    } finally {
      setLoading(false)
    }
  }, [symbol, interval])

  useEffect(() => {
    fetchData(true)
  }, [fetchData])

  useEffect(() => {
    if (error) return
    const id = globalThis.setInterval(() => fetchData(false), 120_000)
    return () => globalThis.clearInterval(id)
  }, [fetchData, error])

  // Prepare chart data
  const chartData: KlineData[] = useMemo(
    () =>
      data
        ? data.map((d) => ({
            time: d.dateLabel,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
            volume: d.volume,
            isUp: d.close >= d.open,
          }))
        : [],
    [data]
  )

  const yDomain = useMemo(() => computeYDomain(chartData), [chartData])
  const patterns = useMemo(() => detectPatterns(chartData), [chartData])

  // Group patterns by signal for summary
  const buyPatterns = useMemo(() => patterns.filter((p) => p.signal === "buy"), [patterns])
  const sellPatterns = useMemo(() => patterns.filter((p) => p.signal === "sell"), [patterns])
  const neutralPatterns = useMemo(() => patterns.filter((p) => p.signal === "neutral"), [patterns])

  const handlePatternHover = (p: DetectedPattern | null) => {
    setHoveredPattern(p)
    setHoveredIndex(p?.index ?? null)
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">K线形态识别</h1>
          <p className="text-muted-foreground text-sm mt-1">
            自动识别 K 线组合形态，辅助判断市场趋势反转信号
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

      {/* ── Symbol & Interval ── */}
      <div className="flex flex-wrap gap-4">
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

      {/* ── Summary Cards ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
              <Lightbulb className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">看涨信号</p>
              <p className="text-xl font-bold text-green-500">{buyPatterns.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
              <Lightbulb className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">看跌信号</p>
              <p className="text-xl font-bold text-red-500">{sellPatterns.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10">
              <Info className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">中性信号</p>
              <p className="text-xl font-bold text-yellow-500">{neutralPatterns.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Chart ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {SYMBOLS.find((s) => s.value === symbol)?.label} —{" "}
            {INTERVALS.find((iv) => iv.value === interval)?.label} K线形态
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && !data && <KlinePatternsChartSkeleton />}

          {error && !data && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertCircle className="mb-3 h-8 w-8 text-destructive" />
              <p className="font-medium text-destructive">{error}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => fetchData(true)}>
                重试
              </Button>
            </div>
          )}

          {chartData.length > 0 && (
            <KlinePatternsChart data={chartData} yDomain={yDomain} hoveredIndex={hoveredIndex} />
          )}
        </CardContent>
      </Card>

      {/* ── Detected Patterns List ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">识别到的形态</CardTitle>
        </CardHeader>
        <CardContent>
          {patterns.length === 0 ? (
            <p className="text-sm text-muted-foreground">当前周期未识别到明显形态。</p>
          ) : (
            <div className="space-y-1">
              {patterns.map((p, idx) => {
                const info = PATTERN_CATALOG[p.type]
                const isHovered = hoveredPattern?.index === p.index && hoveredPattern?.type === p.type
                return (
                  <button
                    key={`${p.type}-${p.index}-${idx}`}
                    onMouseEnter={() => handlePatternHover(p)}
                    onMouseLeave={() => handlePatternHover(null)}
                    className={`flex w-full items-center gap-3 rounded-lg border px-4 py-2.5 text-left transition-all ${
                      isHovered
                        ? "border-gold/40 bg-gold/5 shadow-sm"
                        : "border-border/40 hover:border-border/80 hover:bg-muted/30"
                    }`}
                  >
                    {/* Signal badge */}
                    <span
                      className={`inline-flex h-6 w-16 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                        p.signal === "buy"
                          ? "bg-green-500/10 text-green-500"
                          : p.signal === "sell"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {p.signal === "buy" ? "看涨" : p.signal === "sell" ? "看跌" : "中性"}
                    </span>

                    {/* Name & Strength */}
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium">{info.name}</span>
                      <span
                        className={`ml-2 text-[11px] ${
                          p.strength === "strong"
                            ? "text-rose-500"
                            : p.strength === "moderate"
                              ? "text-amber-500"
                              : "text-muted-foreground"
                        }`}
                      >
                        {p.strength === "strong" ? "强" : p.strength === "moderate" ? "中" : "弱"}
                      </span>
                    </div>

                    {/* Position */}
                    <span className="text-[11px] text-muted-foreground shrink-0">
                      第 {p.index + 1} 根
                    </span>

                    <ChevronRight
                      className={`h-4 w-4 transition-all ${
                        isHovered ? "translate-x-0.5 text-gold-dark dark:text-gold-light" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Hovered Pattern Detail ── */}
      {hoveredPattern && (
        <Card className="border-gold/30 bg-gold/[0.02]">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4 text-gold-dark dark:text-gold-light" />
              {PATTERN_CATALOG[hoveredPattern.type].name} 详解
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {PATTERN_CATALOG[hoveredPattern.type].description}
            </p>
            <div className="flex gap-4 text-sm">
              <div>
                <span className="text-xs text-muted-foreground">信号方向</span>
                <p
                  className={`font-semibold ${
                    hoveredPattern.signal === "buy"
                      ? "text-green-500"
                      : hoveredPattern.signal === "sell"
                        ? "text-red-500"
                        : "text-yellow-500"
                  }`}
                >
                  {hoveredPattern.signal === "buy"
                    ? "看涨"
                    : hoveredPattern.signal === "sell"
                      ? "看跌"
                      : "中性"}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">信号强度</span>
                <p className="font-semibold">
                  {hoveredPattern.strength === "strong"
                    ? "强"
                    : hoveredPattern.strength === "moderate"
                      ? "中等"
                      : "弱"}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">位置</span>
                <p className="font-semibold">第 {hoveredPattern.index + 1} 根K线</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Pattern Catalog ── */}
      <details className="group">
        <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          查看所有形态说明
        </summary>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.values(PATTERN_CATALOG).map((info) => (
            <div key={info.type} className="rounded-lg border border-border/60 p-3 space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    info.signal === "buy"
                      ? "bg-green-500"
                      : info.signal === "sell"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                  }`}
                />
                <span className="text-sm font-medium">{info.name}</span>
                <span
                  className={`text-[10px] ${
                    info.strength === "strong"
                      ? "text-rose-500"
                      : info.strength === "moderate"
                        ? "text-amber-500"
                        : "text-muted-foreground"
                  }`}
                >
                  {info.strength === "strong" ? "强信号" : info.strength === "moderate" ? "中信号" : "弱信号"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{info.description}</p>
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}
