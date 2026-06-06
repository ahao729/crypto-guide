"use client"

import { useState, useMemo, useEffect } from "react"
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
import { ArrowLeftRight, RefreshCw, AlertTriangle } from "lucide-react"

// ── Exchange Rates fallback ──

interface RateMap {
  [from: string]: { [to: string]: number }
}

const rates: RateMap = {
  BTC: { USD: 67500, EUR: 62500, CNY: 488000, JPY: 10200000, KRW: 92500000, GBP: 53500, AUD: 103000, BRL: 340000, ETH: 18.5, USDT: 67500, BNB: 120, SOL: 480 },
  ETH: { USD: 3650, EUR: 3380, CNY: 26380, JPY: 551000, KRW: 5000000, GBP: 2890, AUD: 5570, BRL: 18400, BTC: 0.054, USDT: 3650, BNB: 6.5, SOL: 26 },
  USDT: { USD: 1, EUR: 0.93, CNY: 7.23, JPY: 151, KRW: 1370, GBP: 0.79, AUD: 1.53, BRL: 5.04, BTC: 0.0000148, ETH: 0.000274, BNB: 0.00178, SOL: 0.0071 },
  BNB: { USD: 562, EUR: 520, CNY: 4060, JPY: 84800, KRW: 770000, GBP: 445, AUD: 858, BRL: 2830, BTC: 0.00833, ETH: 0.154, USDT: 562, SOL: 4 },
  SOL: { USD: 141, EUR: 130, CNY: 1020, JPY: 21300, KRW: 193000, GBP: 112, AUD: 215, BRL: 710, BTC: 0.00209, ETH: 0.0385, USDT: 141, BNB: 0.25 },
  XRP: { USD: 0.52, EUR: 0.48, CNY: 3.76, JPY: 78.5, KRW: 712, GBP: 0.41, AUD: 0.79, BRL: 2.62, BTC: 0.0000077, ETH: 0.000142, USDT: 0.52 },
  DOGE: { USD: 0.125, EUR: 0.116, CNY: 0.904, JPY: 18.9, KRW: 171, GBP: 0.099, AUD: 0.191, BRL: 0.63, BTC: 0.00000185, ETH: 0.0000342, USDT: 0.125 },
  ADA: { USD: 0.38, EUR: 0.35, CNY: 2.75, JPY: 57.4, KRW: 520, GBP: 0.30, AUD: 0.58, BRL: 1.92, BTC: 0.00000563, ETH: 0.000104, USDT: 0.38 },
}

const currencyNames: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  USDT: "Tether",
  BNB: "BNB",
  SOL: "Solana",
  XRP: "XRP",
  DOGE: "Dogecoin",
  ADA: "Cardano",
  USD: "美元",
  EUR: "欧元",
  CNY: "人民币",
  JPY: "日元",
  KRW: "韩元",
  GBP: "英镑",
  AUD: "澳元",
  BRL: "巴西雷亚尔",
}

const cryptoCurrencies = ["BTC", "ETH", "USDT", "BNB", "SOL", "XRP", "DOGE", "ADA"]
const fiatCurrencies = ["USD", "EUR", "CNY", "JPY", "KRW", "GBP", "AUD", "BRL"]

// ── Component ──

export default function ConverterPage() {
  const [amount, setAmount] = useState("1")
  const [fromCurrency, setFromCurrency] = useState("BTC")
  const [toCurrency, setToCurrency] = useState("USD")
  const [liveRates, setLiveRates] = useState<RateMap | null>(null)
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString())
  const [ratesLoading, setRatesLoading] = useState(true)
  const [ratesError, setRatesError] = useState("")

  useEffect(() => {
    let ignore = false

    async function loadRates() {
      setRatesLoading(true)
      setRatesError("")
      try {
        const res = await fetch("/api/market/rates")
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error || `HTTP ${res.status}`)
        }
        const data: { rates: RateMap; updatedAt: string } = await res.json()
        if (!ignore) {
          setLiveRates(data.rates)
          setLastUpdated(data.updatedAt)
        }
      } catch (err) {
        if (!ignore) {
          setRatesError(err instanceof Error ? err.message : "实时汇率加载失败")
        }
      } finally {
        if (!ignore) {
          setRatesLoading(false)
        }
      }
    }

    loadRates()
    return () => {
      ignore = true
    }
  }, [])

  const activeRates = liveRates ?? rates

  // Compute result (支持双向换算：crypto→crypto、crypto→fiat、fiat→crypto、fiat→fiat)
  const result = useMemo(() => {
    const amt = parseFloat(amount)
    if (isNaN(amt) || amt <= 0) return null

    const fromRates = activeRates[fromCurrency]
    if (fromRates && fromRates[toCurrency] !== undefined) {
      const rate = fromRates[toCurrency]
      return { rate, converted: amt * rate, fromCurrency, toCurrency }
    }

    const toRates = activeRates[toCurrency]
    if (toRates && toRates[fromCurrency] !== undefined) {
      const rate = 1 / toRates[fromCurrency]
      return { rate, converted: amt * rate, fromCurrency, toCurrency }
    }

    // Fallback path for fiat/crypto pairs: use USDT as a USD proxy.
    const usdtRates = activeRates["USDT"]
    if (usdtRates) {
      const usdValueOfFrom = fromRates?.USD
        ? fromRates.USD
        : usdtRates[fromCurrency] !== undefined
          ? 1 / usdtRates[fromCurrency]
          : undefined
      const toUnitsPerUsd = toRates?.USD
        ? 1 / toRates.USD
        : usdtRates[toCurrency] !== undefined
          ? usdtRates[toCurrency]
          : undefined

      if (usdValueOfFrom !== undefined && toUnitsPerUsd !== undefined) {
        const rate = usdValueOfFrom * toUnitsPerUsd
        return { rate, converted: amt * rate, fromCurrency, toCurrency }
      }
    }

    return null
  }, [activeRates, amount, fromCurrency, toCurrency])

  const swapCurrencies = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-amber-500 shadow-lg shadow-gold/20">
              <ArrowLeftRight className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              币种汇率转换
            </h1>
            <p className="mt-2 text-muted-foreground">
              加密货币与法币实时汇率转换，支持主流币种和全球主要法币
            </p>
          </div>
        </div>
      </section>

      {/* Converter */}
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">汇率转换</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Amount */}
            <div>
              <Label htmlFor="amount">金额</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1"
                className="mt-1.5 text-lg"
              />
            </div>

            {/* From / To */}
            <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
              <div>
                <Label>从</Label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                      加密货币
                    </div>
                    {cryptoCurrencies.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c} - {currencyNames[c]}
                      </SelectItem>
                    ))}
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                      法币
                    </div>
                    {fiatCurrencies.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c} - {currencyNames[c]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0 rounded-full"
                onClick={swapCurrencies}
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>

              <div>
                <Label>到</Label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                      加密货币
                    </div>
                    {cryptoCurrencies.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c} - {currencyNames[c]}
                      </SelectItem>
                    ))}
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                      法币
                    </div>
                    {fiatCurrencies.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c} - {currencyNames[c]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Result */}
            {result ? (
              <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-950/20">
                <p className="text-sm text-muted-foreground">
                  {amount} {result.fromCurrency} =
                </p>
                <p className="mt-1 text-3xl font-bold text-green-600 dark:text-green-400">
                  {result.converted.toLocaleString("zh-CN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 8,
                  })}{" "}
                  {result.toCurrency}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  汇率: 1 {result.fromCurrency} = {result.rate} {result.toCurrency}
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-border/60 p-6 text-center text-muted-foreground">
                请输入有效金额
              </div>
            )}

            {/* Last Updated */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>数据仅供参考，实际汇率以交易所为准</span>
              <span className="flex items-center gap-1">
                <RefreshCw className={`h-3 w-3 ${ratesLoading ? "animate-spin" : ""}`} />
                {liveRates ? `实时数据 · ${new Date(lastUpdated).toLocaleTimeString("zh-CN", { hour12: false })}` : "备用数据"}
              </span>
            </div>
            {ratesError && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-muted-foreground">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <span>实时汇率暂不可用，当前展示备用数据。</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rate Table */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">主流币种汇率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-3 py-2 text-left font-medium">币种</th>
                    <th className="px-3 py-2 text-right font-medium">USD</th>
                    <th className="px-3 py-2 text-right font-medium">CNY</th>
                    <th className="px-3 py-2 text-right font-medium">EUR</th>
                    <th className="px-3 py-2 text-right font-medium">JPY</th>
                  </tr>
                </thead>
                <tbody>
                  {cryptoCurrencies.map((c, i) => (
                    <tr key={c} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                      <td className="px-3 py-2 font-medium">
                        {c}
                        <span className="ml-1 text-xs text-muted-foreground">
                          {currencyNames[c]}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        {activeRates[c]?.USD?.toLocaleString("zh-CN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {activeRates[c]?.CNY?.toLocaleString("zh-CN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {activeRates[c]?.EUR?.toLocaleString("zh-CN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {activeRates[c]?.JPY?.toLocaleString("zh-CN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
