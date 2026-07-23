"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Info, TrendingUp, TrendingDown, Minus } from "lucide-react"
import Link from "next/link"

// ── Types ──

interface DcaIndexData {
  symbol: string
  currentPrice: number
  sma200: number
  index: number
  zone: string
  updatedAt: number
}

interface ZoneInfo {
  key: string
  label: string
  range: string
  description: string
  color: string // Tailwind bg / border class
  textColor: string
  hex: string // Valid CSS color for inline styles
}

const ZONES: ZoneInfo[] = [
  {
    key: "golden-pit",
    label: "黄金坑",
    range: "≤ 40",
    description: "极度低估，历史性买入机会。适合大额加仓。",
    color: "bg-red-500",
    textColor: "text-red-500",
    hex: "#ef4444",
  },
  {
    key: "silver-pit",
    label: "白银坑",
    range: "40 ~ 70",
    description: "显著低估，适合持续加大定投额度。",
    color: "bg-orange-500",
    textColor: "text-orange-500",
    hex: "#f97316",
  },
  {
    key: "dca-zone",
    label: "定投区",
    range: "70 ~ 100",
    description: "估值合理，按计划正常定投。",
    color: "bg-emerald-500",
    textColor: "text-emerald-500",
    hex: "#10b981",
  },
  {
    key: "watch-zone",
    label: "观望区",
    range: "100 ~ 130",
    description: "估值偏高，暂停定投或开始分批减仓。",
    color: "bg-yellow-500",
    textColor: "text-yellow-500",
    hex: "#eab308",
  },
  {
    key: "danger-zone",
    label: "危险区",
    range: "> 130",
    description: "严重高估，市场过热，建议大幅减仓。",
    color: "bg-purple-600",
    textColor: "text-purple-600",
    hex: "#9333ea",
  },
]

const ZONE_MAP = new Map(ZONES.map((z) => [z.key, z]))

// ── Helpers ──

/** Format a number with compact notation */
function formatPrice(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${n.toFixed(2)}`
}

function formatTimestamp(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleString("zh-CN", { hour12: false })
}

// ── Component ──

export default function DcaIndexPage() {
  const [data, setData] = useState<DcaIndexData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchIndex = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/market/dca-index?symbol=BTC&_=" + Date.now())
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? `HTTP ${res.status}`)
      }
      const json: DcaIndexData = await res.json()
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : "数据加载失败")
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Initial load ──
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/market/dca-index?symbol=BTC&_=" + Date.now())
        if (!res.ok) {
          const body = await res.json().catch(() => null)
          throw new Error(body?.error ?? `HTTP ${res.status}`)
        }
        const json: DcaIndexData = await res.json()
        if (!cancelled) setData(json)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "数据加载失败")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  // ── Auto refresh every 60s ──
  useEffect(() => {
    if (error) return // don't poll on error
    const id = setInterval(() => fetchIndex(false), 60_000)
    return () => clearInterval(id)
  }, [fetchIndex, error])

  // ── Zone ──
  const zoneInfo = data ? ZONE_MAP.get(data.zone) : null

  // ── Progress bar: map index (0-200) to percentage ──
  const progressPct = data ? Math.min(Math.max((data.index / 200) * 100, 0), 100) : 0
  const progressColor = zoneInfo?.color ?? "bg-muted-foreground"

  // ── Index direction indicator ──
  // We'll show a simple "vs SMA-200" delta
  const diffPct = data ? ((data.index - 100) / 100) * 100 : 0

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">九神定投指数</h1>
          <p className="text-muted-foreground text-sm mt-1">
            基于 BTC 价格与 200 日均线的比值，判断市场估值水平
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchIndex(true)}
          disabled={loading}
        >
          <RefreshCw className={`mr-1 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          刷新
        </Button>
      </div>

      {/* ── Main Index Card ── */}
      <Card className="overflow-hidden">
        {loading && !data && (
          <div className="flex items-center justify-center py-24">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && !data && (
          <CardContent className="py-12">
            <div className="text-center space-y-3">
              <Info className="mx-auto h-10 w-10 text-destructive" />
              <p className="text-destructive font-medium">{error}</p>
              <Button variant="outline" size="sm" onClick={() => fetchIndex(true)}>
                重试
              </Button>
            </div>
          </CardContent>
        )}

        {data && (
          <>
            {/* Zone color bar */}
            <div className={`h-2 ${progressColor}`} />

            <CardContent className="space-y-6 pt-6">
              {/* Big index number */}
              <div className="text-center">
                <span className="text-6xl font-extrabold tracking-tight">
                  {data.index.toFixed(1)}
                </span>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${
                      zoneInfo
                        ? zoneInfo.textColor + " bg-" + zoneInfo.color.replace("bg-", "") + "/10"
                        : "text-muted-foreground bg-muted"
                    }`}
                  >
                    {diffPct > 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : diffPct < 0 ? (
                      <TrendingDown className="h-4 w-4" />
                    ) : (
                      <Minus className="h-4 w-4" />
                    )}
                    {zoneInfo?.label ?? "未知"}
                    {diffPct > 0
                      ? `（高于 SMA-200 ${diffPct.toFixed(1)}%）`
                      : diffPct < 0
                        ? `（低于 SMA-200 ${Math.abs(diffPct).toFixed(1)}%）`
                        : ""}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>定投指数</span>
                  <span>200</span>
                </div>
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                  {/* Zone segments */}
                  <div className="absolute inset-0 flex">
                    <div className="h-full w-[20%] bg-red-500/20" />
                    <div className="h-full w-[15%] bg-orange-500/20" />
                    <div className="h-full w-[15%] bg-emerald-500/20" />
                    <div className="h-full w-[15%] bg-yellow-500/20" />
                    <div className="h-full flex-1 bg-purple-600/20" />
                  </div>
                  {/* Current value indicator */}
                  <div
                    className="absolute top-0 h-full rounded-full transition-all duration-500"
                    style={{
                      left: `${progressPct}%`,
                      width: "4px",
                      transform: "translateX(-2px)",
                      backgroundColor: zoneInfo?.hex || "currentColor",
                      boxShadow: `0 0 8px 2px ${zoneInfo?.hex || "currentColor"}`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>黄金坑</span>
                  <span>白银坑</span>
                  <span>定投区</span>
                  <span>观望区</span>
                  <span>危险区</span>
                </div>
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="rounded-lg border p-4">
                  <p className="text-xs text-muted-foreground mb-1">BTC 当前价格</p>
                  <p className="text-xl font-bold">{formatPrice(data.currentPrice)}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-xs text-muted-foreground mb-1">200 日均线 (SMA)</p>
                  <p className="text-xl font-bold">{formatPrice(data.sma200)}</p>
                </div>
              </div>

              {/* Updated time */}
              <p className="text-center text-xs text-muted-foreground">
                数据更新于 {formatTimestamp(data.updatedAt)}
              </p>
            </CardContent>
          </>
        )}
      </Card>

      {/* ── Zone Legend ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">指数区间说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ZONES.map((zone) => {
              const isActive = data?.zone === zone.key
              return (
                <div
                  key={zone.key}
                  className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                    isActive ? "border-foreground/30 bg-accent/30" : ""
                  }`}
                >
                  <div
                    className={`mt-1 h-3 w-3 shrink-0 rounded-full ${zone.color}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold text-sm ${zone.textColor}`}>
                        {zone.label}
                      </span>
                      <span className="text-xs text-muted-foreground">{zone.range}</span>
                      {isActive && (
                        <span className="text-[10px] rounded bg-foreground/10 px-1.5 py-0.5 font-medium">
                          当前
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {zone.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── Usage Guide ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>九神定投指数</strong> 是由微博用户{'\u201C'}九神{'\u201D'}提出的 BTC 定投辅助指标。
            计算公式为：<code className="rounded bg-muted px-1 py-0.5 text-xs">(当前价格 / 200日均线) × 100</code>。
          </p>
          <p>
            指数越低，表示 BTC 价格相对于长期均线越被低估，越适合买入；
            指数越高，表示市场越过热，越适合卖出或观望。
          </p>
          <p className="text-xs text-muted-foreground/70">
            数据来源：实时行情源每日 K 线，自动更新。本工具仅供参考，不构成投资建议。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
