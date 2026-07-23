"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  BarChart3,
  Lightbulb,
  ArrowRight,
} from "lucide-react"

// ── Types ──

interface CalcResult {
  breakeven: number
  maxProfit: number
  maxLoss: number
  pnlAtExpiry: number
  premiumTotal: number
  notionalValue: number
}

// ── Component ──

export default function OptionsCalculatorPage() {
  const [optionType, setOptionType] = useState("call")
  const [direction, setDirection] = useState("buy")
  const [underlying, setUnderlying] = useState("50000")
  const [strike, setStrike] = useState("52000")
  const [premium, setPremium] = useState("2000")
  const [quantity, setQuantity] = useState("1")
  const [multiplier, setMultiplier] = useState("1")
  const [result, setResult] = useState<CalcResult | null>(null)
  const [error, setError] = useState("")

  const calculate = () => {
    setError("")

    const S = parseFloat(underlying)
    const K = parseFloat(strike)
    const P = parseFloat(premium)
    const Q = parseFloat(quantity)
    const M = parseFloat(multiplier)

    if (
      isNaN(S) || isNaN(K) || isNaN(P) || isNaN(Q) || isNaN(M) ||
      S <= 0 || K <= 0 || P <= 0 || Q <= 0 || M <= 0
    ) {
      setError("请输入有效的正数数值")
      return
    }

    const premiumTotal = P * Q * M
    const isCall = optionType === "call"
    const isBuy = direction === "buy"

    let breakeven: number
    let maxProfit: number
    let maxLoss: number
    let pnlAtExpiry: number

    if (isCall) {
      if (isBuy) {
        // Long Call
        breakeven = K + P
        maxProfit = Infinity
        maxLoss = premiumTotal
        pnlAtExpiry = Math.max(0, S - K) * Q * M - premiumTotal
      } else {
        // Short Call
        breakeven = K + P
        maxProfit = premiumTotal
        maxLoss = Infinity
        pnlAtExpiry = -Math.max(0, S - K) * Q * M + premiumTotal
      }
    } else {
      if (isBuy) {
        // Long Put
        breakeven = K - P
        maxProfit = (K - P) * Q * M
        maxLoss = premiumTotal
        pnlAtExpiry = Math.max(0, K - S) * Q * M - premiumTotal
      } else {
        // Short Put
        breakeven = K - P
        maxProfit = premiumTotal
        maxLoss = (K - P) * Q * M
        pnlAtExpiry = -Math.max(0, K - S) * Q * M + premiumTotal
      }
    }

    setResult({
      breakeven,
      maxProfit,
      maxLoss,
      pnlAtExpiry,
      premiumTotal,
      notionalValue: K * Q * M,
    })
  }

  // ── Chart data ──

  const chartData = useMemo(() => {
    if (!result) return null
    const S = parseFloat(underlying)
    const K = parseFloat(strike)
    const P = parseFloat(premium)
    const Q = parseFloat(quantity)
    const M = parseFloat(multiplier)
    const isCall = optionType === "call"
    const isBuy = direction === "buy"

    // Generate price range: ±50% around strike or underlying (whichever is centered)
    const center = Math.max(K, S)
    const range = center * 0.5
    const minPx = Math.max(0, center - range)
    const maxPx = center + range
    const steps = 40
    const stepSize = (maxPx - minPx) / steps

    const points: { price: number; pnl: number }[] = []
    for (let i = 0; i <= steps; i++) {
      const price = minPx + i * stepSize
      let pnl: number
      if (isCall) {
        if (isBuy) {
          pnl = Math.max(0, price - K) * Q * M - P * Q * M
        } else {
          pnl = -Math.max(0, price - K) * Q * M + P * Q * M
        }
      } else {
        if (isBuy) {
          pnl = Math.max(0, K - price) * Q * M - P * Q * M
        } else {
          pnl = -Math.max(0, K - price) * Q * M + P * Q * M
        }
      }
      points.push({ price, pnl })
    }
    return { points, minPx, maxPx, breakeven: result.breakeven }
  }, [result, underlying, strike, premium, quantity, multiplier, optionType, direction])

  // ── SVG chart dimensions ──

  const chartWidth = 700
  const chartHeight = 280
  const padding = { top: 20, right: 20, bottom: 40, left: 60 }
  const plotW = chartWidth - padding.left - padding.right
  const plotH = chartHeight - padding.top - padding.bottom

  const toSvgCoords = (price: number, pnl: number) => {
    if (!chartData) return { x: 0, y: 0 }
    const { minPx, maxPx, points } = chartData
    const allPnl = points.map((p) => p.pnl)
    const minPnl = Math.min(...allPnl, 0)
    const maxPnl = Math.max(...allPnl, 1)
    const pnlRange = maxPnl - minPnl || 1
    const x = padding.left + ((price - minPx) / (maxPx - minPx)) * plotW
    const y = padding.top + plotH - ((pnl - minPnl) / pnlRange) * plotH
    return { x, y }
  }

  const pathD = chartData
    ? chartData.points
        .map((p, i) => {
          const { x, y } = toSvgCoords(p.price, p.pnl)
          return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`
        })
        .join(" ")
    : ""

  const zeroLineY = chartData
    ? toSvgCoords(chartData.minPx, 0).y
    : padding.top + plotH / 2

  const breakevenX = chartData ? toSvgCoords(chartData.breakeven, 0).x : 0

  const formatPrice = (v: number) => {
    if (v >= 1000) return "$" + v.toLocaleString("en-US", { maximumFractionDigits: 0 })
    return "$" + v.toFixed(2)
  }

  const formatPnl = (v: number) => {
    const prefix = v >= 0 ? "+" : "-"
    const abs = Math.abs(v)
    if (abs >= 1000)
      return prefix + "$" + abs.toLocaleString("en-US", { maximumFractionDigits: 0 })
    return prefix + "$" + abs.toFixed(2)
  }

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/[0.08] via-transparent to-transparent" />
        <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-gold/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg shadow-purple-500/20">
              <BarChart3 className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              期权收益
              <span className="text-gradient-gold ml-2">计算器</span>
            </h1>
            <p className="mt-3 text-base text-muted-foreground">
              计算期权交易的盈亏平衡点、最大收益、最大亏损和到期盈亏，辅助制定期权交易策略
            </p>
          </div>
        </div>
      </section>

      {/* ── Calculator ── */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* ── Inputs ── */}
          <Card className="lg:col-span-2 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">参数设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Option Type */}
              <div className="space-y-2">
                <Label>期权类型</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={optionType === "call" ? "default" : "outline"}
                    className={
                      optionType === "call"
                        ? "flex-1 bg-emerald-600 hover:bg-emerald-700"
                        : "flex-1"
                    }
                    onClick={() => setOptionType("call")}
                  >
                    <TrendingUp className="mr-1.5 h-4 w-4" />
                    看涨期权 Call
                  </Button>
                  <Button
                    type="button"
                    variant={optionType === "put" ? "default" : "outline"}
                    className={
                      optionType === "put"
                        ? "flex-1 bg-rose-600 hover:bg-rose-700"
                        : "flex-1"
                    }
                    onClick={() => setOptionType("put")}
                  >
                    <TrendingDown className="mr-1.5 h-4 w-4" />
                    看跌期权 Put
                  </Button>
                </div>
              </div>

              {/* Direction */}
              <div className="space-y-2">
                <Label>交易方向</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={direction === "buy" ? "default" : "outline"}
                    className={
                      direction === "buy"
                        ? "flex-1 bg-emerald-600 hover:bg-emerald-700"
                        : "flex-1"
                    }
                    onClick={() => setDirection("buy")}
                  >
                    买入
                  </Button>
                  <Button
                    type="button"
                    variant={direction === "sell" ? "default" : "outline"}
                    className={
                      direction === "sell"
                        ? "flex-1 bg-rose-600 hover:bg-rose-700"
                        : "flex-1"
                    }
                    onClick={() => setDirection("sell")}
                  >
                    卖出
                  </Button>
                </div>
              </div>

              {/* Underlying Price */}
              <div className="space-y-2">
                <Label htmlFor="underlying">标的资产价格</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="underlying"
                    type="number"
                    inputMode="decimal"
                    value={underlying}
                    onChange={(e) => setUnderlying(e.target.value)}
                    className="pl-9"
                    placeholder="例如 50000"
                  />
                </div>
              </div>

              {/* Strike Price */}
              <div className="space-y-2">
                <Label htmlFor="strike">行权价</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="strike"
                    type="number"
                    inputMode="decimal"
                    value={strike}
                    onChange={(e) => setStrike(e.target.value)}
                    className="pl-9"
                    placeholder="例如 52000"
                  />
                </div>
              </div>

              {/* Premium */}
              <div className="space-y-2">
                <Label htmlFor="premium">权利金（每单位）</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="premium"
                    type="number"
                    inputMode="decimal"
                    value={premium}
                    onChange={(e) => setPremium(e.target.value)}
                    className="pl-9"
                    placeholder="例如 2000"
                  />
                </div>
              </div>

              {/* Quantity & Multiplier */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">合约数量</Label>
                  <Input
                    id="quantity"
                    type="number"
                    inputMode="decimal"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="multiplier">合约乘数</Label>
                  <Input
                    id="multiplier"
                    type="number"
                    inputMode="decimal"
                    value={multiplier}
                    onChange={(e) => setMultiplier(e.target.value)}
                    placeholder="1"
                  />
                </div>
              </div>

              {/* Calculate Button */}
              <Button
                onClick={calculate}
                className="w-full bg-gradient-gold text-white shadow-md shadow-gold/20 hover:opacity-90"
                size="lg"
              >
                计算收益
              </Button>

              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Results ── */}
          <div className="lg:col-span-3 space-y-6">
            {result ? (
              <>
                {/* Result Cards */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <Card className="border-border/50">
                    <CardHeader className="pb-2 pt-4">
                      <CardTitle className="text-xs font-medium text-muted-foreground">
                        盈亏平衡点
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-bold">
                        {formatPrice(result.breakeven)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50">
                    <CardHeader className="pb-2 pt-4">
                      <CardTitle className="text-xs font-medium text-muted-foreground">
                        最大收益
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p
                        className={`text-xl font-bold ${
                          result.maxProfit === Infinity
                            ? "text-emerald-500"
                            : result.maxProfit > 0
                              ? "text-emerald-500"
                              : "text-muted-foreground"
                        }`}
                      >
                        {result.maxProfit === Infinity
                          ? "无限"
                          : formatPnl(result.maxProfit)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50">
                    <CardHeader className="pb-2 pt-4">
                      <CardTitle className="text-xs font-medium text-muted-foreground">
                        最大亏损
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p
                        className={`text-xl font-bold ${
                          result.maxLoss === Infinity
                            ? "text-rose-500"
                            : "text-rose-500"
                        }`}
                      >
                        {result.maxLoss === Infinity
                          ? "无限"
                          : formatPnl(-result.maxLoss)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50">
                    <CardHeader className="pb-2 pt-4">
                      <CardTitle className="text-xs font-medium text-muted-foreground">
                        当前到期盈亏
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p
                        className={`text-xl font-bold ${
                          result.pnlAtExpiry >= 0
                            ? "text-emerald-500"
                            : "text-rose-500"
                        }`}
                      >
                        {formatPnl(result.pnlAtExpiry)}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Detail Cards */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="border-border/50">
                    <CardHeader className="pb-2 pt-4">
                      <CardTitle className="text-xs font-medium text-muted-foreground">
                        权利金总额
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-bold">
                        {formatPrice(result.premiumTotal)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50">
                    <CardHeader className="pb-2 pt-4">
                      <CardTitle className="text-xs font-medium text-muted-foreground">
                        名义本金
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-bold">
                        {formatPrice(result.notionalValue)}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* ── P&L Chart ── */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BarChart3 className="h-4 w-4 text-gold" />
                      到期盈亏曲线
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <svg
                      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                      className="w-full h-auto max-h-[320px]"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      {/* Grid lines */}
                      {[0.25, 0.5, 0.75].map((frac) => {
                        const y = padding.top + plotH * (1 - frac)
                        return (
                          <g key={frac}>
                            <line
                              x1={padding.left}
                              y1={y}
                              x2={padding.left + plotW}
                              y2={y}
                              stroke="currentColor"
                              strokeOpacity={0.1}
                              strokeDasharray="4 4"
                            />
                            <text
                              x={padding.left - 8}
                              y={y + 4}
                              textAnchor="end"
                              className="fill-muted-foreground text-[10px]"
                            >
                              {formatPnl(
                                (() => {
                                  if (!chartData) return 0
                                  const allPnl = chartData.points.map(
                                    (p) => p.pnl
                                  )
                                  const minPnl = Math.min(...allPnl, 0)
                                  const maxPnl = Math.max(...allPnl, 1)
                                  const pnlRange = maxPnl - minPnl || 1
                                  return minPnl + pnlRange * frac
                                })()
                              )}
                            </text>
                          </g>
                        )
                      })}

                      {/* Zero line */}
                      <line
                        x1={padding.left}
                        y1={zeroLineY}
                        x2={padding.left + plotW}
                        y2={zeroLineY}
                        stroke="currentColor"
                        strokeOpacity={0.3}
                        strokeWidth={1}
                      />

                      {/* Breakeven line */}
                      <line
                        x1={breakevenX}
                        y1={padding.top}
                        x2={breakevenX}
                        y2={padding.top + plotH}
                        stroke="currentColor"
                        strokeOpacity={0.2}
                        strokeDasharray="6 3"
                        strokeWidth={1}
                      />
                      <text
                        x={breakevenX}
                        y={padding.top + plotH + 16}
                        textAnchor="middle"
                        className="fill-muted-foreground text-[10px]"
                      >
                        BE
                      </text>

                      {/* P&L Curve */}
                      <path
                        d={pathD}
                        fill="none"
                        className="stroke-gold"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Current price marker */}
                      {(() => {
                        const S = parseFloat(underlying)
                        const pnl = result.pnlAtExpiry
                        const { x, y } = toSvgCoords(S, pnl)
                        return (
                          <g>
                            <circle
                              cx={x}
                              cy={y}
                              r={5}
                              className={
                                pnl >= 0
                                  ? "fill-emerald-500"
                                  : "fill-rose-500"
                              }
                              stroke="white"
                              strokeWidth={2}
                            />
                            <text
                              x={x + 8}
                              y={y - 8}
                              className={`text-[11px] font-medium ${
                                pnl >= 0
                                  ? "fill-emerald-500"
                                  : "fill-rose-500"
                              }`}
                            >
                              {formatPnl(pnl)}
                            </text>
                          </g>
                        )
                      })()}

                      {/* X-axis labels */}
                      {chartData &&
                        [0, 0.25, 0.5, 0.75, 1].map((frac) => {
                          const px =
                            chartData.minPx +
                            (chartData.maxPx - chartData.minPx) * frac
                          const x = padding.left + frac * plotW
                          return (
                            <text
                              key={frac}
                              x={x}
                              y={chartHeight - 8}
                              textAnchor="middle"
                              className="fill-muted-foreground text-[10px]"
                            >
                              {formatPrice(px)}
                            </text>
                          )
                        })}

                      {/* Axis labels */}
                      <text
                        x={chartWidth / 2}
                        y={chartHeight - 2}
                        textAnchor="middle"
                        className="fill-muted-foreground text-[11px]"
                      >
                        到期时标的资产价格
                      </text>
                      <text
                        x={12}
                        y={chartHeight / 2}
                        textAnchor="middle"
                        transform={`rotate(-90, 12, ${chartHeight / 2})`}
                        className="fill-muted-foreground text-[11px]"
                      >
                        盈亏 P&L
                      </text>
                    </svg>
                  </CardContent>
                </Card>

                {/* ── Strategy Note ── */}
                <Card className="border-gold/20 bg-gold/[0.03]">
                  <CardContent className="flex items-start gap-3 pt-5">
                    <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">
                        {optionType === "call" && direction === "buy" && "买入看涨期权策略说明"}
                        {optionType === "call" && direction === "sell" && "卖出看涨期权策略说明"}
                        {optionType === "put" && direction === "buy" && "买入看跌期权策略说明"}
                        {optionType === "put" && direction === "sell" && "卖出看跌期权策略说明"}
                      </p>
                      <p>
                        {optionType === "call" && direction === "buy" && "预期标的资产价格将大幅上涨时使用。收益无限，亏损有限。当价格超过盈亏平衡点（行权价 + 权利金）时开始盈利。"}
                        {optionType === "call" && direction === "sell" && "预期标的资产价格将持平或下跌时使用。收益有限（收取的权利金），亏损无限。适合在预期价格不会突破行权价时收取权利金。"}
                        {optionType === "put" && direction === "buy" && "预期标的资产价格将大幅下跌时使用。收益有限（价格跌至零时最大），亏损有限。当价格低于盈亏平衡点（行权价 - 权利金）时开始盈利。"}
                        {optionType === "put" && direction === "sell" && "预期标的资产价格将持平或上涨时使用。收益有限（收取的权利金），亏损有限。适合在预期价格不会跌破行权价时收取权利金。"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              /* ── Empty State ── */
              <Card className="flex flex-col items-center justify-center border-dashed border-border/50 py-16 text-center">
                <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground/30" />
                <p className="text-lg font-medium">设置参数并点击{'\u201C'}计算收益{'\u201D'}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  查看期权策略的到期盈亏分析
                </p>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
