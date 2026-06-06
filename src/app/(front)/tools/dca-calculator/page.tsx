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
import { PiggyBank, TrendingUp, Wallet, Target, AlertTriangle, Lightbulb } from "lucide-react"
import { DcaChart } from "@/components/DcaChart"

// ── Types ──

interface YearData {
  year: number
  invested: number
  value: number
  gain: number
}

interface CalcResult {
  totalInvested: number
  finalValue: number
  totalGain: number
  roi: number
  yearlyData: YearData[]
}

// ── Component ──

export default function DcaCalculatorPage() {
  const [initialAmount, setInitialAmount] = useState("1000")
  const [monthlyAmount, setMonthlyAmount] = useState("500")
  const [years, setYears] = useState("5")
  const [annualReturn, setAnnualReturn] = useState("10")
  const [result, setResult] = useState<CalcResult | null>(null)
  const [error, setError] = useState("")

  const calculate = () => {
    setError("")

    const initial = parseFloat(initialAmount)
    const monthly = parseFloat(monthlyAmount)
    const yearsNum = parseFloat(years)
    const annualRate = parseFloat(annualReturn) / 100

    if (
      isNaN(initial) ||
      isNaN(monthly) ||
      isNaN(yearsNum) ||
      isNaN(annualRate) ||
      initial < 0 ||
      monthly <= 0 ||
      yearsNum <= 0 ||
      yearsNum > 50
    ) {
      setError("请输入有效数值（投资期限不超过 50 年）")
      return
    }

    // 月化收益率 = (1 + 年化)^(1/12) - 1，使用复利公式而非简单的年化/12
    const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1
    const totalMonths = Math.round(yearsNum * 12)

    let value = initial
    const yearlyData: YearData[] = []
    let totalInvested = initial

    for (let m = 1; m <= totalMonths; m++) {
      // Add monthly investment
      value += monthly
      totalInvested += monthly
      // Apply monthly return
      value *= 1 + monthlyRate

      // Record yearly data
      if (m % 12 === 0 || m === totalMonths) {
        const year = Math.ceil(m / 12)
        yearlyData.push({
          year,
          invested: Math.round(totalInvested * 100) / 100,
          value: Math.round(value * 100) / 100,
          gain: Math.round((value - totalInvested) * 100) / 100,
        })
      }
    }

    const finalValue = Math.round(value * 100) / 100
    const totalGain = Math.round((finalValue - totalInvested) * 100) / 100
    const roi = Math.round(((finalValue - totalInvested) / totalInvested) * 10000) / 100

    setResult({
      totalInvested: Math.round(totalInvested * 100) / 100,
      finalValue,
      totalGain,
      roi,
      yearlyData,
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
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-amber-500 shadow-lg shadow-gold/20">
              <PiggyBank className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              定投计算器
            </h1>
            <p className="mt-2 text-muted-foreground">
              模拟定期定额投资策略的长期收益，比较不同定投策略的效果
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
              <CardTitle className="text-base">定投参数</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Initial Amount */}
              <div>
                <Label htmlFor="initialAmount">初始投资金额 (USDT)</Label>
                <Input
                  id="initialAmount"
                  type="number"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(e.target.value)}
                  placeholder="1000"
                />
              </div>

              {/* Monthly Amount */}
              <div>
                <Label htmlFor="monthlyAmount">每月定投金额 (USDT)</Label>
                <Input
                  id="monthlyAmount"
                  type="number"
                  value={monthlyAmount}
                  onChange={(e) => setMonthlyAmount(e.target.value)}
                  placeholder="500"
                />
              </div>

              {/* Duration */}
              <div>
                <Label htmlFor="years">投资期限 (年)</Label>
                <Select value={years} onValueChange={setYears}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 5, 7, 10, 15, 20, 30].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} 年
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Annual Return */}
              <div>
                <Label htmlFor="annualReturn">预期年化收益率 (%)</Label>
                <Input
                  id="annualReturn"
                  type="number"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(e.target.value)}
                  placeholder="10"
                  step="0.5"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  BTC 长期定投历史年化约 10%-30%
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
              <CardTitle className="text-base">定投结果</CardTitle>
            </CardHeader>
            <CardContent>
              {result !== null ? (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="grid gap-4 sm:grid-cols-4">
                    <div className="rounded-lg border border-border/60 p-4 text-center">
                      <p className="text-xs text-muted-foreground">总投入</p>
                      <p className="mt-1 text-lg font-bold">
                        {formatCurrency(result.totalInvested)}
                      </p>
                      <p className="text-xs text-muted-foreground">USDT</p>
                    </div>
                    <div className="rounded-lg border border-border/60 p-4 text-center">
                      <p className="text-xs text-muted-foreground">最终价值</p>
                      <p className="mt-1 text-lg font-bold text-emerald-600">
                        {formatCurrency(result.finalValue)}
                      </p>
                      <p className="text-xs text-muted-foreground">USDT</p>
                    </div>
                    <div className="rounded-lg border border-border/60 p-4 text-center">
                      <p className="text-xs text-muted-foreground">总收益</p>
                      <p className="mt-1 text-lg font-bold text-emerald-600">
                        +{formatCurrency(result.totalGain)}
                      </p>
                      <p className="text-xs text-muted-foreground">USDT</p>
                    </div>
                    <div className="rounded-lg border border-border/60 p-4 text-center">
                      <p className="text-xs text-muted-foreground">总回报率</p>
                      <p className="mt-1 text-lg font-bold text-emerald-600">
                        +{result.roi}%
                      </p>
                      <p className="text-xs text-muted-foreground">ROI</p>
                    </div>
                  </div>

                  {/* Chart */}
                  <DcaChart data={result.yearlyData} />

                  {/* Yearly Breakdown Table */}
                  <div className="rounded-lg border border-border/60">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="px-4 py-2.5 text-left font-medium">年份</th>
                            <th className="px-4 py-2.5 text-right font-medium">累计投入</th>
                            <th className="px-4 py-2.5 text-right font-medium">资产价值</th>
                            <th className="px-4 py-2.5 text-right font-medium">收益</th>
                            <th className="px-4 py-2.5 text-right font-medium">收益率</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.yearlyData.map((row, i) => {
                            const gainPercent =
                              row.invested > 0
                                ? ((row.gain / row.invested) * 100).toFixed(1)
                                : "0.0"
                            return (
                              <tr
                                key={row.year}
                                className={
                                  i % 2 === 0 ? "" : "bg-muted/20"
                                }
                              >
                                <td className="px-4 py-2.5 font-medium">
                                  第 {row.year} 年
                                </td>
                                <td className="px-4 py-2.5 text-right">
                                  {formatCurrency(row.invested)}
                                </td>
                                <td className="px-4 py-2.5 text-right font-medium text-emerald-600">
                                  {formatCurrency(row.value)}
                                </td>
                                <td className="px-4 py-2.5 text-right text-emerald-600">
                                  +{formatCurrency(row.gain)}
                                </td>
                                <td className="px-4 py-2.5 text-right text-emerald-600">
                                  +{gainPercent}%
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                  <TrendingUp className="mb-3 h-12 w-12 opacity-30" />
                  <p>输入左侧参数后点击「开始计算」</p>
                  <p className="text-sm">查看定投策略的长期收益模拟</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Knowledge Tip */}
      <section className="border-t border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold"><Lightbulb className="mr-1.5 inline-block h-5 w-5 text-amber-500" />定投小贴士</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            定投策略的核心是「摊平成本、长期持有」。历史数据表明，在波动较大的加密货币市场中，
            定期定额投资可以有效降低择时风险。建议选择 BTC、ETH 等主流币种进行长期定投。
            本计算结果仅供参考，实际收益可能因市场波动而有所不同。
          </p>
        </div>
      </section>
    </div>
  )
}
