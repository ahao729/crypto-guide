"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Percent,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

// ── Fee Data ──

interface FeeTier {
  volumeLabel: string
  maker: string
  taker: string
}

interface ExchangeFees {
  name: string
  website: string
  spot: { maker: string; taker: string }
  futures: { maker: string; taker: string }
  margin: { maker: string; taker: string }
  spotTiers?: FeeTier[]
  futuresTiers?: FeeTier[]
  note?: string
}

const exchanges: ExchangeFees[] = [
  {
    name: "Binance",
    website: "https://www.binance.com",
    spot: { maker: "0.10%", taker: "0.10%" },
    futures: { maker: "0.02%", taker: "0.04%" },
    margin: { maker: "0.10%", taker: "0.10%" },
    spotTiers: [
      { volumeLabel: "≥ 50 BTC", maker: "0.06%", taker: "0.08%" },
      { volumeLabel: "≥ 500 BTC", maker: "0.04%", taker: "0.06%" },
    ],
    futuresTiers: [
      { volumeLabel: "≥ 100 BTC", maker: "0.015%", taker: "0.030%" },
      { volumeLabel: "≥ 500 BTC", maker: "0.010%", taker: "0.020%" },
    ],
  },
  {
    name: "OKX",
    website: "https://www.okx.com",
    spot: { maker: "0.08%", taker: "0.10%" },
    futures: { maker: "0.02%", taker: "0.05%" },
    margin: { maker: "0.08%", taker: "0.10%" },
    note: "挂单返佣可用 OKB 抵扣",
  },
  {
    name: "Bybit",
    website: "https://www.bybit.com",
    spot: { maker: "0.10%", taker: "0.10%" },
    futures: { maker: "0.02%", taker: "0.055%" },
    margin: { maker: "0.10%", taker: "0.10%" },
  },
  {
    name: "HTX (Huobi)",
    website: "https://www.htx.com",
    spot: { maker: "0.20%", taker: "0.20%" },
    futures: { maker: "0.02%", taker: "0.06%" },
    margin: { maker: "0.20%", taker: "0.20%" },
    note: "HT 抵扣可享折扣",
  },
  {
    name: "Gate.io",
    website: "https://www.gate.io",
    spot: { maker: "0.10%", taker: "0.15%" },
    futures: { maker: "0.02%", taker: "0.05%" },
    margin: { maker: "0.10%", taker: "0.15%" },
  },
  {
    name: "MEXC",
    website: "https://www.mexc.com",
    spot: { maker: "0.10%", taker: "0.10%" },
    futures: { maker: "0.01%", taker: "0.03%" },
    margin: { maker: "0.10%", taker: "0.15%" },
    note: "期货 Maker 低至 0.01%",
  },
  {
    name: "KuCoin",
    website: "https://www.kucoin.com",
    spot: { maker: "0.10%", taker: "0.10%" },
    futures: { maker: "0.02%", taker: "0.06%" },
    margin: { maker: "0.10%", taker: "0.12%" },
    note: "KCS 抵扣享半价",
  },
  {
    name: "Bitget",
    website: "https://www.bitget.com",
    spot: { maker: "0.10%", taker: "0.10%" },
    futures: { maker: "0.02%", taker: "0.04%" },
    margin: { maker: "0.10%", taker: "0.10%" },
  },
]

type TradeType = "spot" | "futures" | "margin"

const tradeTypeLabels: Record<TradeType, string> = {
  spot: "现货",
  futures: "合约",
  margin: "杠杆",
}

// ── Helper: highlight best rate ──

function getRateValue(rate: string): number {
  return parseFloat(rate.replace("%", ""))
}

function isLowest(values: { name: string; rate: string }[], current: string): boolean {
  const currentVal = getRateValue(current)
  const minVal = Math.min(...values.map((v) => getRateValue(v.rate)))
  return currentVal === minVal
}

// ── Component ──

export default function FeeComparisonPage() {
  const [tradeType, setTradeType] = useState<TradeType>("futures")

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/[0.08] via-transparent to-transparent" />
        <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-gold-dark shadow-lg shadow-gold/20">
              <Percent className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              手续费
              <span className="text-gradient-gold ml-2">对比</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              对比主流交易所的现货、合约和杠杆手续费，帮您选择最划算的交易平台
            </p>
          </div>
        </div>
      </section>

      {/* ── Trade Type Selector ── */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          {(Object.entries(tradeTypeLabels) as [TradeType, string][]).map(
            ([key, label]) => (
              <Button
                key={key}
                variant={tradeType === key ? "default" : "outline"}
                onClick={() => setTradeType(key)}
                className={
                  tradeType === key
                    ? "bg-gradient-gold text-white shadow-md shadow-gold/20"
                    : ""
                }
              >
                {label}
              </Button>
            ),
          )}
        </div>

        {/* ── Fee Table ── */}
        <div className="overflow-hidden rounded-xl border border-border/60">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30">
                  <th className="px-4 py-4 text-left font-semibold">交易所</th>
                  <th className="px-4 py-4 text-right font-semibold">Maker</th>
                  <th className="px-4 py-4 text-right font-semibold">Taker</th>
                  <th className="px-4 py-4 text-right font-semibold">合计（双向）</th>
                  <th className="px-4 py-4 text-center font-semibold">备注</th>
                </tr>
              </thead>
              <tbody>
                {exchanges.map((ex, i) => {
                  const fees = ex[tradeType]
                  const makerVal = getRateValue(fees.maker)
                  const takerVal = getRateValue(fees.taker)
                  const total = (makerVal + takerVal).toFixed(3)

                  const allRates = exchanges.map((e) => ({
                    name: e.name,
                    rate: e[tradeType].maker,
                  }))
                  const makerLowest = isLowest(allRates, fees.maker)
                  const takerLowest = isLowest(
                    exchanges.map((e) => ({ name: e.name, rate: e[tradeType].taker })),
                    fees.taker,
                  )

                  return (
                    <tr
                      key={ex.name}
                      className={`border-b border-border/40 transition-colors hover:bg-muted/20 ${
                        i % 2 === 0 ? "bg-background" : "bg-muted/10"
                      }`}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{ex.name}</span>
                          <a
                            href={ex.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-gold-dark dark:hover:text-gold-light"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1 font-mono ${
                            makerLowest
                              ? "font-bold text-green-600 dark:text-green-400"
                              : ""
                          }`}
                        >
                          {fees.maker}
                          {makerLowest && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1 font-mono ${
                            takerLowest
                              ? "font-bold text-green-600 dark:text-green-400"
                              : ""
                          }`}
                        >
                          {fees.taker}
                          {takerLowest && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-muted-foreground">
                        {total}%
                      </td>
                      <td className="px-4 py-4 text-center">
                        {ex.note ? (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Info className="h-3 w-3" />
                            {ex.note}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Legend ── */}
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
            最低费率
          </span>
          <span>数据仅供参考，实际费率以交易所官网为准</span>
        </div>
      </section>

      {/* ── Tier Info ── */}
      {exchanges.some((e) => e.spotTiers || e.futuresTiers) && (
        <section className="border-t border-border/40 bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="mb-2 text-2xl font-bold">阶梯费率参考</h2>
            <p className="mb-8 text-sm text-muted-foreground">
              以下为部分交易所的 VIP 阶梯费率（以 Binance 为例），交易量越大费率越低
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Spot Tiers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BarChart3 className="h-4 w-4 text-gold-dark dark:text-gold-light" />
                    现货阶梯费率
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/40 text-muted-foreground">
                          <th className="pb-2 text-left font-medium">30日交易量</th>
                          <th className="pb-2 text-right font-medium">Maker</th>
                          <th className="pb-2 text-right font-medium">Taker</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exchanges[0].spotTiers?.map((tier, i) => (
                          <tr key={i} className="border-b border-border/20">
                            <td className="py-2">{tier.volumeLabel}</td>
                            <td className="py-2 text-right font-mono">{tier.maker}</td>
                            <td className="py-2 text-right font-mono">{tier.taker}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Futures Tiers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BarChart3 className="h-4 w-4 text-gold-dark dark:text-gold-light" />
                    合约阶梯费率
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/40 text-muted-foreground">
                          <th className="pb-2 text-left font-medium">30日交易量</th>
                          <th className="pb-2 text-right font-medium">Maker</th>
                          <th className="pb-2 text-right font-medium">Taker</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exchanges[0].futuresTiers?.map((tier, i) => (
                          <tr key={i} className="border-b border-border/20">
                            <td className="py-2">{tier.volumeLabel}</td>
                            <td className="py-2 text-right font-mono">{tier.maker}</td>
                            <td className="py-2 text-right font-mono">{tier.taker}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              💡 使用平台通证（如 BNB、OKB、KCS）支付手续费可额外享受折扣，最高可省 50%。
            </p>
          </div>
        </section>
      )}

      {/* ── Tips ── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="border-gold/20 bg-gradient-to-br from-gold/[0.03] to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-gold-dark dark:text-gold-light" />
              手续费优化建议
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>
                  <strong>高频交易首选合约</strong> — 合约的 Maker 费率远低于现货，
                  适合高频做市或挂单策略。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>
                  <strong>使用平台币抵扣</strong> — 大部分交易所支持使用平台通证（BNB、OKB、KCS）
                  支付手续费，可享受额外折扣。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>
                  <strong>提升 VIP 等级</strong> — 增加 30 日交易量或持仓量即可升级 VIP，
                  享受更低的阶梯费率。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>
                  <strong>挂单 vs 吃单</strong> — 尽量使用限价挂单（Maker），而非市价吃单（Taker），
                  可节省约 50%-70% 的手续费。
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">想了解更多交易所？</h2>
          <p className="mt-2 text-muted-foreground">
            查看完整交易所导航，快速访问各大交易平台
          </p>
          <Link href="/exchanges">
            <Button className="mt-6 bg-gradient-gold text-white shadow-md shadow-gold/20">
              交易所导航
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
