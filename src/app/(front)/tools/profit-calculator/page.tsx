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
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Percent,
  BarChart3,
  Lightbulb,
} from "lucide-react"

// ── Types ──

interface CalcResult {
  pnl: number
  pnlPercent: number
  liquidationPrice: number
  totalFee: number
  roi: number
}

// ── Component ──

export default function ProfitCalculatorPage() {
  const [entryPrice, setEntryPrice] = useState("50000")
  const [exitPrice, setExitPrice] = useState("55000")
  const [quantity, setQuantity] = useState("0.1")
  const [leverage, setLeverage] = useState("10")
  const [direction, setDirection] = useState("long")
  const [feeRate, setFeeRate] = useState("0.05")
  const [result, setResult] = useState<CalcResult | null>(null)
  const [error, setError] = useState("")

  const calculate = () => {
    setError("")

    const entry = parseFloat(entryPrice)
    const exit = parseFloat(exitPrice)
    const qty = parseFloat(quantity)
    const lev = parseFloat(leverage)
    const fee = parseFloat(feeRate) / 100

    if (
      isNaN(entry) ||
      isNaN(exit) ||
      isNaN(qty) ||
      isNaN(lev) ||
      isNaN(fee) ||
      entry <= 0 ||
      qty <= 0 ||
      lev <= 0 ||
      lev > 125
    ) {
      setError("请输入有效的数值（杠杆 1-125 倍）")
      return
    }

    const notional = entry * qty // 名义价值
    const margin = notional / lev // 保证金
    const openFee = notional * fee
    const closeFee = exit * qty * fee
    const totalFee = openFee + closeFee

    const pnl = direction === "long"
      ? (exit - entry) * qty
      : (entry - exit) * qty
    const netPnl = pnl - totalFee
    const netPnlPercent = (netPnl / margin) * 100
    const grossPnlPercent = (pnl / margin) * 100
    const liquidationPrice = direction === "long"
      ? entry * (1 - 1 / lev)
      : entry * (1 + 1 / lev)

    setResult({
      pnl: netPnl,
      pnlPercent: netPnlPercent,
      liquidationPrice,
      totalFee,
      roi: grossPnlPercent,
    })
  }

  const isPositive = (result?.pnl ?? 0) >= 0

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-amber-500 shadow-lg shadow-gold/20">
              <BarChart3 className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              合约收益计算器
            </h1>
            <p className="mt-2 text-muted-foreground">
              计算合约交易的预期收益、亏损和强平价格
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
              <CardTitle className="text-base">交易参数</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Direction */}
              <div>
                <Label>交易方向</Label>
                <div className="mt-1.5 flex gap-2">
                  <Button
                    type="button"
                    variant={direction === "long" ? "default" : "outline"}
                    className={
                      direction === "long"
                        ? "flex-1 bg-green-600 hover:bg-green-700"
                        : "flex-1"
                    }
                    onClick={() => setDirection("long")}
                  >
                    <TrendingUp className="mr-1 h-4 w-4" />
                    做多
                  </Button>
                  <Button
                    type="button"
                    variant={direction === "short" ? "default" : "outline"}
                    className={
                      direction === "short"
                        ? "flex-1 bg-red-600 hover:bg-red-700"
                        : "flex-1"
                    }
                    onClick={() => setDirection("short")}
                  >
                    <TrendingDown className="mr-1 h-4 w-4" />
                    做空
                  </Button>
                </div>
              </div>

              {/* Entry Price */}
              <div>
                <Label htmlFor="entryPrice">开仓价格 (USDT)</Label>
                <Input
                  id="entryPrice"
                  type="number"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  placeholder="50000"
                />
              </div>

              {/* Exit Price */}
              <div>
                <Label htmlFor="exitPrice">平仓价格 (USDT)</Label>
                <Input
                  id="exitPrice"
                  type="number"
                  value={exitPrice}
                  onChange={(e) => setExitPrice(e.target.value)}
                  placeholder="55000"
                />
              </div>

              {/* Quantity */}
              <div>
                <Label htmlFor="quantity">数量 (BTC)</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0.1"
                  step="0.01"
                />
              </div>

              {/* Leverage */}
              <div>
                <Label htmlFor="leverage">杠杆倍数</Label>
                <Select value={leverage} onValueChange={setLeverage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 5, 10, 20, 25, 50, 75, 100, 125].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}x
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  step="0.01"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  主流交易所 maker/taker 通常在 0.02%-0.06%
                </p>
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
              <CardTitle className="text-base">计算结果</CardTitle>
            </CardHeader>
            <CardContent>
              {result !== null ? (
                <div className="space-y-6">
                  {/* Main PnL */}
                  <div
                    className={`rounded-xl border-2 p-6 text-center ${
                      isPositive
                        ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
                        : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
                    }`}
                  >
                    <p className="text-sm text-muted-foreground">净盈亏</p>
                    <p
                      className={`mt-1 text-3xl font-bold ${
                        isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {result.pnl.toFixed(2)} USDT
                    </p>
                    <p
                      className={`mt-1 text-lg font-semibold ${
                        isPositive ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {result.pnlPercent.toFixed(2)}%
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border border-border/60 p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        毛收益率 (未扣手续费)
                      </div>
                      <p
                        className={`mt-1 text-xl font-bold ${
                          result.roi >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {result.roi >= 0 ? "+" : ""}
                        {result.roi.toFixed(2)}%
                      </p>
                    </div>
                    <div className="rounded-lg border border-border/60 p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <AlertTriangle className="h-4 w-4" />
                        强平价格
                      </div>
                      <p className="mt-1 text-xl font-bold">
                        {result.liquidationPrice.toFixed(2)}{" "}
                        <span className="text-sm font-normal text-muted-foreground">
                          USDT
                        </span>
                      </p>
                    </div>
                    <div className="rounded-lg border border-border/60 p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Percent className="h-4 w-4" />
                        总手续费
                      </div>
                      <p className="mt-1 text-xl font-bold">
                        {result.totalFee.toFixed(4)}{" "}
                        <span className="text-sm font-normal text-muted-foreground">
                          USDT
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="rounded-lg border border-border/60">
                    <table className="w-full text-sm">
                      <tbody>
                        {[
                          ["名义价值", `${(parseFloat(entryPrice) * parseFloat(quantity)).toFixed(2)} USDT`],
                          ["保证金", `${(parseFloat(entryPrice) * parseFloat(quantity) / parseFloat(leverage)).toFixed(2)} USDT`],
                          ["开仓手续费", `${(parseFloat(entryPrice) * parseFloat(quantity) * parseFloat(feeRate) / 100).toFixed(4)} USDT`],
                          ["平仓手续费", `${(parseFloat(exitPrice) * parseFloat(quantity) * parseFloat(feeRate) / 100).toFixed(4)} USDT`],
                          ["杠杆倍数", `${leverage}x`],
                          ["方向", direction === "long" ? "做多" : "做空"],
                        ].map(([label, value], i) => (
                          <tr
                            key={label}
                            className={i % 2 === 0 ? "bg-muted/30" : ""}
                          >
                            <td className="px-4 py-2.5 text-muted-foreground">
                              {label}
                            </td>
                            <td className="px-4 py-2.5 text-right font-medium">
                              {value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                  <BarChart3 className="mb-3 h-12 w-12 opacity-30" />
                  <p>输入左侧参数后点击「开始计算」</p>
                  <p className="text-sm">查看合约交易的预期收益与风险数据</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Knowledge Tip */}
      <section className="border-t border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold"><Lightbulb className="mr-1.5 inline-block h-5 w-5 text-amber-500" />使用提示</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            合约交易具有高杠杆特性，收益放大的同时风险也相应增加。请合理设置杠杆倍数，始终将风险控制放在首位。本计算结果仅供参考，实际交易可能因滑点、资金费率等因素产生差异。
          </p>
        </div>
      </section>
    </div>
  )
}
