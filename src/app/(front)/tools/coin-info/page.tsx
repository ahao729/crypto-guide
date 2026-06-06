"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search, List, Globe, ExternalLink, TrendingUp, TrendingDown,
  AlertTriangle, Layers, Clock, DollarSign, Activity,
  Loader2, RefreshCw, MessageCircle, ArrowUpDown,
} from "lucide-react"

// ── Symbol → CoinGecko ID mapping ──

const SYMBOL_TO_ID: Record<string, string> = {
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
  FTM: "fantom",
  CRO: "crypto-com-chain",
  VET: "vechain",
  ALGO: "algorand",
  MANA: "decentraland",
  SAND: "the-sandbox",
  AXS: "axie-infinity",
}

const POPULAR_COINS = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "SOL", name: "Solana" },
  { symbol: "BNB", name: "BNB" },
  { symbol: "ADA", name: "Cardano" },
  { symbol: "DOGE", name: "Dogecoin" },
  { symbol: "XRP", name: "XRP" },
  { symbol: "DOT", name: "Polkadot" },
  { symbol: "AVAX", name: "Avalanche" },
]

// ── Types ──

interface MarketData {
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  price_change_percentage_24h: number
  price_change_percentage_7d: number
  price_change_percentage_30d: number
  circulating_supply: number
  total_supply: number
  max_supply: number | null
  ath: number
  ath_change_percentage: number
  ath_date: string
  high_24h: number
  low_24h: number
}

interface CoinLinks {
  homepage: string
  twitter: string
  telegram: string
  explorer: string
  reddit: string
  github: string
}

interface CoinDetail {
  id: string
  symbol: string
  name: string
  image: string
  description: string
  links: CoinLinks
  market_data: MarketData
  last_updated: string
  is_fallback?: boolean
}

// ── Helpers ──

function formatLargeNum(n: number): string {
  if (n >= 1e12) return (n / 1e12).toFixed(2) + "T"
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B"
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M"
  if (n >= 1e3) return (n / 1e3).toFixed(2) + "K"
  return n.toFixed(2)
}

function formatSupply(n: number): string {
  return n.toLocaleString("zh-CN", { maximumFractionDigits: 0 })
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
}

function resolveCoinId(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return ""
  const upper = trimmed.toUpperCase()
  return SYMBOL_TO_ID[upper] || trimmed.toLowerCase()
}

function formatTimeAgo(isoString: string): string {
  if (!isoString) return ""
  const ms = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(ms / 60000)
  if (minutes < 1) return "刚刚"
  if (minutes < 60) return `${minutes} 分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} 小时前`
  const days = Math.floor(hours / 24)
  return `${days} 天前`
}

// ── Component ──

export default function CoinInfoPage() {
  const [searchInput, setSearchInput] = useState("")
  const [activeCoinId, setActiveCoinId] = useState("bitcoin")
  const [coin, setCoin] = useState<CoinDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch coin detail
  const fetchCoin = useCallback(async (coinId: string) => {
    if (!coinId) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/market/coin-detail?coinId=${encodeURIComponent(coinId)}`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `请求失败 (${res.status})`)
      }
      const data: CoinDetail = await res.json()
      setCoin(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "获取数据失败，请检查币种 ID 是否正确")
      setCoin(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load — fetch inside effect to avoid cascading setState concern
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await fetch("/api/market/coin-detail?coinId=bitcoin")
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error || `请求失败 (${res.status})`)
        }
        const data: CoinDetail = await res.json()
        if (!cancelled) setCoin(data)
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "获取数据失败，请检查币种 ID 是否正确")
          setCoin(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  // Handle search submit
  const handleSearch = useCallback(() => {
    const resolved = resolveCoinId(searchInput)
    if (!resolved) {
      setError("请输入币种 ID 或符号（如 bitcoin, BTC, ethereum, SOL）")
      return
    }
    setActiveCoinId(resolved)
    fetchCoin(resolved)
  }, [searchInput, fetchCoin])

  // Handle quick-select coin
  const handleQuickSelect = useCallback(
    (symbol: string) => {
      const id = SYMBOL_TO_ID[symbol] || symbol.toLowerCase()
      setSearchInput(symbol)
      setActiveCoinId(id)
      fetchCoin(id)
    },
    [fetchCoin]
  )

  // Handle Enter key
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSearch()
    },
    [handleSearch]
  )

  const m = coin?.market_data
  const hasLiveMarketData = Boolean(coin && m && !coin.is_fallback && m.current_price > 0)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-lime-500 to-green-600 shadow-lg shadow-lime-500/20">
              <List className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              币种信息查询
            </h1>
            <p className="mt-2 text-muted-foreground">
              输入币种 ID 或符号，查询加密货币的实时市场数据、项目介绍和相关链接
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* ── Sidebar ── */}
          <Card className="lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="text-base">搜索币种</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    placeholder="BTC / bitcoin / ethereum…"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pl-9"
                  />
                </div>
                <Button onClick={handleSearch} disabled={loading} size="sm">
                  查询
                </Button>
              </div>

              {/* Quick access */}
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  快速选择
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_COINS.map((c) => (
                    <button
                      key={c.symbol}
                      onClick={() => handleQuickSelect(c.symbol)}
                      className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                        activeCoinId === SYMBOL_TO_ID[c.symbol]
                          ? "bg-gradient-gold text-white"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {c.symbol}
                    </button>
                  ))}
                </div>
              </div>

              {/* Usage hint */}
              <div className="rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground">
                <p className="mb-1 font-medium text-foreground">💡 查询提示</p>
                <p>支持 CoinGecko 上收录的任意币种。</p>
                <p className="mt-1">
                  可直接输入币种符号（如 <code className="rounded bg-muted px-1">BTC</code>、
                  <code className="rounded bg-muted px-1">ETH</code>）或
                  CoinGecko ID（如 <code className="rounded bg-muted px-1">bitcoin</code>、
                  <code className="rounded bg-muted px-1">ethereum</code>）。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Detail Panel ── */}
          <div className="lg:col-span-3 space-y-6">
            {/* Loading state */}
            {loading && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-gold" />
                  <p className="mt-4 text-sm text-muted-foreground">正在获取数据…</p>
                </CardContent>
              </Card>
            )}

            {/* Error state */}
            {!loading && error && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                  <p className="mt-4 text-sm font-medium text-destructive">{error}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    请检查币种 ID 是否正确，或稍后重试
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => fetchCoin(activeCoinId)}
                  >
                    <RefreshCw className="mr-1 h-4 w-4" />
                    重试
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Empty / initial state */}
            {!loading && !error && !coin && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Search className="h-8 w-8 text-muted-foreground/50" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    输入币种 ID 或符号开始查询
                  </p>
                </CardContent>
              </Card>
            )}

            {/* ── Coin Detail ── */}
            {!loading && coin && m && (
              <>
                {coin.is_fallback && (
                  <Card className="border-amber-500/30 bg-amber-500/5">
                    <CardContent className="flex gap-3 p-4 text-sm">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                      <div>
                        <p className="font-medium text-foreground">实时行情源暂不可用</p>
                        <p className="mt-1 text-muted-foreground">
                          当前网络无法连接实时行情源，以下先展示本地基础资料。
                          恢复连接后点击刷新即可加载实时价格、市值和涨跌幅。
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Header */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {coin.image && (
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="h-12 w-12 rounded-full"
                          />
                        )}
                        <div>
                          <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold">{coin.name}</h2>
                            <Badge variant="outline" className="text-sm font-mono">
                              {coin.symbol.toUpperCase()}
                            </Badge>
                            {m.market_cap_rank > 0 && (
                              <Badge className="bg-gold/20 text-gold hover:bg-gold/30 border-0">
                                #{m.market_cap_rank}
                              </Badge>
                            )}
                          </div>
                          {hasLiveMarketData ? (
                            <div className="mt-2 flex items-center gap-3">
                              <span className="text-3xl font-bold">
                                ${m.current_price.toLocaleString(undefined, {
                                  minimumFractionDigits: m.current_price < 1 ? 4 : 2,
                                  maximumFractionDigits: m.current_price < 1 ? 6 : 2,
                                })}
                              </span>
                              <span
                                className={`flex items-center gap-1 text-sm font-medium ${
                                  m.price_change_percentage_24h >= 0
                                    ? "text-green-500"
                                    : "text-red-500"
                                }`}
                              >
                                {m.price_change_percentage_24h >= 0 ? (
                                  <TrendingUp className="h-4 w-4" />
                                ) : (
                                  <TrendingDown className="h-4 w-4" />
                                )}
                                {m.price_change_percentage_24h >= 0 ? "+" : ""}
                                {m.price_change_percentage_24h.toFixed(2)}%
                              </span>
                              <span className="text-xs text-muted-foreground">24h</span>
                            </div>
                          ) : (
                            <p className="mt-2 text-sm text-muted-foreground">
                              实时价格、市值和涨跌幅暂不可用
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        {coin.links.homepage && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={coin.links.homepage} target="_blank" rel="noopener noreferrer">
                              <Globe className="mr-1 h-4 w-4" />
                              官网
                            </a>
                          </Button>
                        )}
                        {coin.links.explorer && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={coin.links.explorer} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-1 h-4 w-4" />
                              浏览器
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Info Grid */}
                {hasLiveMarketData ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Market Cap */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        市值
                      </div>
                      <p className="mt-1 text-lg font-bold">${formatLargeNum(m.market_cap)}</p>
                      <p className="text-xs text-muted-foreground">
                        排名 #{m.market_cap_rank}
                      </p>
                    </CardContent>
                  </Card>

                  {/* 24h Volume */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Activity className="h-4 w-4" />
                        24h 交易量
                      </div>
                      <p className="mt-1 text-lg font-bold">${formatLargeNum(m.total_volume)}</p>
                      <p className="text-xs text-muted-foreground">
                        量市值比{" "}
                        {m.market_cap > 0
                          ? ((m.total_volume / m.market_cap) * 100).toFixed(1)
                          : "—"}
                        %
                      </p>
                    </CardContent>
                  </Card>

                  {/* 24h High / Low */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ArrowUpDown className="h-4 w-4" />
                        24h 最高 / 最低
                      </div>
                      <p className="mt-1 text-lg font-bold">
                        <span className="text-green-500">${m.high_24h.toLocaleString()}</span>
                        <span className="mx-1 text-muted-foreground">/</span>
                        <span className="text-red-500">${m.low_24h.toLocaleString()}</span>
                      </p>
                    </CardContent>
                  </Card>

                  {/* 24h / 7d / 30d Change */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        涨跌幅
                      </div>
                      <div className="mt-1 space-y-1">
                        {[
                          { label: "24h", val: m.price_change_percentage_24h },
                          { label: "7d", val: m.price_change_percentage_7d },
                          { label: "30d", val: m.price_change_percentage_30d },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{item.label}</span>
                            <span
                              className={
                                item.val >= 0 ? "text-green-500" : "text-red-500"
                              }
                            >
                              {item.val >= 0 ? "+" : ""}
                              {item.val.toFixed(2)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* ATH */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        历史最高价 (ATH)
                      </div>
                      <p className="mt-1 text-lg font-bold">
                        ${m.ath.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {m.ath_date
                          ? new Date(m.ath_date).toLocaleDateString("zh-CN")
                          : "—"}
                        {m.ath_change_percentage !== 0 && (
                          <span
                            className={`ml-2 ${
                              m.ath_change_percentage >= 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {m.ath_change_percentage >= 0 ? "+" : ""}
                            {m.ath_change_percentage.toFixed(1)}%
                          </span>
                        )}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Supply */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Layers className="h-4 w-4" />
                        供应量
                      </div>
                      <p className="mt-1 text-lg font-bold">
                        {formatSupply(m.circulating_supply)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        流通 / 总供应{" "}
                        {m.total_supply > 0
                          ? `${((m.circulating_supply / m.total_supply) * 100).toFixed(1)}%`
                          : "—"}
                        {m.max_supply && (
                          <span>
                            {" · 最大 "}
                            {formatSupply(m.max_supply)}
                          </span>
                        )}
                      </p>
                    </CardContent>
                  </Card>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        数据状态
                      </div>
                      <p className="mt-1 text-sm font-medium">
                        已加载 {coin.name} 基础资料，等待行情源恢复。
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Description */}
                {coin.description && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">项目简介</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {stripHtml(coin.description)}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Links */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">相关链接</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {coin.links.homepage && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={coin.links.homepage} target="_blank" rel="noopener noreferrer">
                            <Globe className="mr-1 h-4 w-4" />
                            官方网站
                          </a>
                        </Button>
                      )}
                      {coin.links.explorer && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={coin.links.explorer} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-1 h-4 w-4" />
                            区块浏览器
                          </a>
                        </Button>
                      )}
                      {coin.links.twitter && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={`https://twitter.com/${coin.links.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <svg className="mr-1 h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                            X / Twitter
                          </a>
                        </Button>
                      )}
                      {coin.links.telegram && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={`https://t.me/${coin.links.telegram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageCircle className="mr-1 h-4 w-4" />
                            Telegram
                          </a>
                        </Button>
                      )}
                      {coin.links.github && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={coin.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <svg className="mr-1 h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                            GitHub
                          </a>
                        </Button>
                      )}
                      {coin.links.reddit && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={`https://reddit.com/r/${coin.links.reddit}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageCircle className="mr-1 h-4 w-4" />
                            Reddit
                          </a>
                        </Button>
                      )}
                    </div>

                    {/* Last updated */}
                    <p className="mt-4 text-xs text-muted-foreground">
                      {coin.is_fallback ? "基础资料生成于" : "数据更新于"} {formatTimeAgo(coin.last_updated)}
                      <Button
                        variant="link"
                        size="sm"
                        className="ml-2 h-auto p-0 text-xs"
                        onClick={() => fetchCoin(activeCoinId)}
                      >
                        <RefreshCw className="mr-1 h-3 w-3" />
                        刷新
                      </Button>
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "币种信息查询",
            description:
              "查询任意加密货币的基本信息、市值排名、发行总量、实时价格和市场数据",
            url: "https://cryptoguide.com/tools/coin-info",
            applicationCategory: "FinanceApplication",
            operatingSystem: "All",
          }),
        }}
      />
    </div>
  )
}
