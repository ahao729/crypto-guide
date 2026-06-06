"use client"

import { useState } from "react"
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
  Grid3X3,
  DollarSign,
  Percent,
  BarChart3,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
} from "lucide-react"

// ── Types ──

interface GridResult {
  gridCount: number
  priceMin: number
  priceMax: number
  gridSpacing: number
  gridSpacingPercent: number
  investmentPerGrid: number
  totalInvestment: number
  profitPerGrid: number
  totalProfitPerCycle: number
  annualizedReturn: number
  feeCost: number
  netProfitPerCycle: number
}

// ── Component ──

export default function GridCalculatorPage() {
  const [priceMin, setPriceMin] = useState("40000")
  const [priceMax, setPriceMax] = useState("60000")
  const [gridCount, setGridCount] = useState("10")
  const [totalInvestment, setTotalInvestment] = useState("10000")
  const [feeRate, setFeeRate] = useState("0.05")
  const [result, setResult] = useState<GridResult | null>(null)
  const [error, setError] = useState("")

  const calculate = () => {
    setError("")

    const minP = parseFloat(priceMin)
    const maxP = parseFloat(priceMax)
    const grids = parseInt(gridCount)
    const invest = parseFloat(totalInvestment)
    const fee = parseFloat(feeRate) / 100

    if (
      isNaN(minP) || isNaN(maxP) || isNaN(grids) || isNaN(invest) || isNaN(fee) ||
      minP <= 0 || maxP <= 0 || minP >= maxP ||
      grids < 2 || grids > 200 ||
      invest <= 0
    ) {
      setError("请输入有效数值：价格区间(下限 < 上限)、网格数(2-200)、投资金额 > 0")
      return
    }

    const spacing = (maxP - minP) / grids
    const spacingPercent = (spacing / ((minP + maxP) / 2)) * 100
    const investPerGrid = invest / grids

    // Profit per grid: buy at lower price, sell at next grid higher
    // For each grid, profit = spacing * (investment / price_at_grid)
    // Simplified: profit per grid ≈ (spacing / avg_price) * investPerGrid
    const avgPrice = (minP + maxP) / 2
    const profitPerGrid = (spacing / avgPrice) * investPerGrid

    // Total profit for one full cycle (buy all grids, sell all grids)
    const totalProfit = profitPerGrid * grids

    // Fee cost (buy + sell for each grid)
    const feeCost = invest * fee * 2 // open + close

    const netProfit = totalProfit - feeCost

    // Estimate annualized return based on assumed full cycles per month
    // 在震荡行情中，网格完整跑完一轮(从最低到最高再到最低)通常需要数月
    // 保守假设每月完成约 0.5 个完整周期，即每 2 个月完成一轮
    // 避免使用过于激进的假设导致年化收益率被严重夸大
    const monthlyCycles = 0.5
    const annualizedReturn = ((netProfit * monthlyCycles * 12) / invest) * 100

    setResult({
      gridCount: grids,
      priceMin: minP,
      priceMax: maxP,
      gridSpacing: spacing,
      gridSpacingPercent: spacingPercent,
      investmentPerGrid: investPerGrid,
      totalInvestment: invest,
      profitPerGrid,
      totalProfitPerCycle: totalProfit,
      annualizedReturn,
      feeCost,
      netProfitPerCycle: netProfit,
    })
  }

  const formatCurrency = (val: number) =>
    val.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg shadow-sky-500/20">
              <Grid3X3 className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              网格交易计算器
            </h1>
            <p className="mt-2 text-muted-foreground">
              计算网格交易策略的预期收益、每格利润和资金利用率
            </p>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Inputs */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">网格参数</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Price Range */}
              <div>
                <Label>价格区间 (USDT)</Label>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  <div>
                    <Input
                      type="number"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      placeholder="最低价"
                    />
                    <p className="mt-0.5 text-[11px] text-muted-foreground">下限</p>
                  </div>
                  <div>
                    <Input
                      type="number"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      placeholder="最高价"
                    />
                    <p className="mt-0.5 text-[11px] text-muted-foreground">上限</p>
                  </div>
                </div>
              </div>

              {/* Grid Count */}
              <div>
                <Label htmlFor="gridCount">网格数量</Label>
                <Select value={gridCount} onValueChange={setGridCount}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 3, 5, 8, 10, 15, 20, 25, 30, 50, 100].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} 格
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Total Investment */}
              <div>
                <Label htmlFor="totalInvestment">总投资金额 (USDT)</Label>
                <Input
                  id="totalInvestment"
                  type="number"
                  value={totalInvestment}
                  onChange={(e) => setTotalInvestment(e.target.value)}
                  placeholder="10000"
                />
              </div>

              {/* Fee Rate */}
              <div>
                <Label htmlFor="feeRate">手续费率 (%)</Label>
                <Input
                  id="feeRate"
                  type="number"
                  value={feeRate}
                  onChange={(e) => setFeeRate(e.target.value)}
                  placeholder="0.05"
                  step="0.005"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <Button
                className="w-full bg-gradient-gold text-white shadow-md shadow-gold/20"
                size="lg"
                onClick={calculate}
              >
                开始计算
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-base">收益分析</CardTitle>
            </CardHeader>
            <CardContent>
              {!result ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-sm text-muted-foreground">
                  <Grid3X3 className="mb-3 h-12 w-12 text-muted-foreground/30" />
                  <p>输入参数后点击{'\u201C'}开始计算{'\u201D'}</p>
                  <p className="mt-1 text-xs">查看网格交易策略的预期收益</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-border/60 p-3">
                      <p className="text-xs text-muted-foreground">每格利润</p>
                      <p className="mt-1 text-lg font-bold text-green-600">
                        ${formatCurrency(result.profitPerGrid)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border/60 p-3">
                      <p className="text-xs text-muted-foreground">单周期总利润</p>
                      <p className="mt-1 text-lg font-bold text-green-600">
                        ${formatCurrency(result.totalProfitPerCycle)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border/60 p-3">
                      <p className="text-xs text-muted-foreground">扣除手续费</p>
                      <p className="mt-1 text-lg font-bold text-foreground">
                        ${formatCurrency(result.netProfitPerCycle)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border/60 p-3">
                      <p className="text-xs text-muted-foreground">网格间距</p>
                      <p className="mt-1 text-lg font-bold text-foreground">
                        ${formatCurrency(result.gridSpacing)}
                        <span className="ml-1 text-sm font-normal text-muted-foreground">
                          ({result.gridSpacingPercent.toFixed(2)}%)
                        </span>
                      </p>
                    </div>
                    <div className="rounded-lg border border-border/60 p-3">
                      <p className="text-xs text-muted-foreground">每格投入</p>
                      <p className="mt-1 text-lg font-bold text-foreground">
                        ${formatCurrency(result.investmentPerGrid)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border/60 p-3">
                      <p className="text-xs text-muted-foreground">预估年化</p>
                      <p
                        className={`mt-1 text-lg font-bold ${
                          result.annualizedReturn > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {result.annualizedReturn.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Grid Visualization */}
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="mb-3 text-sm font-medium">网格分布</p>
                    <div className="space-y-1">
                      {Array.from({ length: Math.min(result.gridCount, 20) }).map(
                        (_, i) => {
                          const price =
                            result.priceMin +
                            (result.priceMax - result.priceMin) *
                              (i / Math.min(result.gridCount, 20))
                          const isUpperHalf = i >= Math.min(result.gridCount, 20) / 2
                          return (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-xs"
                            >
                              <span className="w-12 text-right font-mono text-muted-foreground">
                                ${formatCurrency(price)}
                              </span>
                              <div className="flex-1">
                                <div
                                  className={`h-5 rounded ${
                                    isUpperHalf
                                      ? "bg-green-100 dark:bg-green-950/30"
                                      : "bg-red-100 dark:bg-red-950/30"
                                  }`}
                                  style={{
                                    width: `${((i + 1) / Math.min(result.gridCount, 20)) * 100}%`,
                                  }}
                                />
                              </div>
                              <span className="w-16 text-right text-muted-foreground">
                                {isUpperHalf ? "卖出区" : "买入区"}
                              </span>
                            </div>
                          )
                        }
                      )}
                      {result.gridCount > 20 && (
                        <p className="pt-1 text-center text-[11px] text-muted-foreground">
                          ... 共 {result.gridCount} 格，仅展示前 20 格
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>
                          <strong>收益估算说明：</strong>以上年化收益为估算值，假设每月完成约 3 个完整买卖周期。
                          实际收益取决于市场波动幅度和频率。震荡行情中网格策略表现最佳，单边行情可能产生亏损。
                        </p>
                        <p>
                          <strong>手续费：</strong>单周期买卖合计手续费约 ${formatCurrency(result.feeCost)}。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "网格交易计算器",
            description: "计算网格交易策略的预期收益、每格利润、资金利用率和预估年化收益率",
            url: "https://cryptoguide.com/tools/grid-calculator",
            applicationCategory: "FinanceApplication",
            operatingSystem: "All",
          }),
        }}
      />
    </div>
  )
}
