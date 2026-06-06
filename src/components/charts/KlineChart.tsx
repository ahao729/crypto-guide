"use client"

import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ReferenceLine,
} from "recharts"

// ── Types ──

export interface KlinePoint {
  time: string
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  isUp: boolean
}

export interface EnrichedKlinePoint extends KlinePoint {
  ma5: number | null
  ma10: number | null
  ma20: number | null
  bbUpper: number | null
  bbLower: number | null
}

export type YDomain = [number, number]

// ── Helpers ──

export const formatPrice = (p: number) => {
  if (p >= 1000) return `$${(p / 1000).toFixed(2)}k`
  if (p >= 1) return `$${p.toFixed(2)}`
  return `$${p.toFixed(4)}`
}

// ── CandleShape ──

interface CandleShapeProps {
  x?: number
  y?: number
  width?: number
  height?: number
  payload?: EnrichedKlinePoint
  yDomain: YDomain
}

export function CandleShape({ x = 0, y = 0, width = 0, height = 0, payload, yDomain }: CandleShapeProps) {
  if (!payload) return null
  const { open, close, high, low } = payload
  const isUp = close >= open
  const color = isUp ? "#22c55e" : "#ef4444"

  const [minY, maxY] = yDomain
  const valueRange = maxY - minY
  if (valueRange <= 0) return null

  const bottomY = y + height
  const valueSpan = close - minY
  if (valueSpan <= 0) return null
  const pixelsPerUnit = height / valueSpan

  const highY = bottomY - (high - minY) * pixelsPerUnit
  const lowY = bottomY - (low - minY) * pixelsPerUnit
  const openY = bottomY - (open - minY) * pixelsPerUnit
  const closeY = bottomY - (close - minY) * pixelsPerUnit

  const bodyTop = Math.min(openY, closeY)
  const bodyBottom = Math.max(openY, closeY)
  const cw = Math.max(width * 0.7, 1)
  const cx = x + width / 2

  return (
    <g>
      <line x1={cx} y1={highY} x2={cx} y2={lowY} stroke={color} strokeWidth={1.5} />
      <rect
        x={cx - cw / 2}
        y={bodyTop}
        width={cw}
        height={Math.max(bodyBottom - bodyTop, 1)}
        rx={1}
        fill={color}
      />
    </g>
  )
}

// ── Tooltip ──

function KlineTooltip({ active, payload }: { active?: boolean; payload?: { payload: EnrichedKlinePoint }[] }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload as EnrichedKlinePoint | undefined
  if (!d) return null
  return (
    <div className="rounded-lg border bg-popover p-3 text-xs shadow-md">
      <p className="mb-1 font-medium">{d.time}</p>
      <p>
        开: <span className="font-mono">{formatPrice(d.open)}</span>
      </p>
      <p>
        高: <span className="font-mono">{formatPrice(d.high)}</span>
      </p>
      <p>
        低: <span className="font-mono">{formatPrice(d.low)}</span>
      </p>
      <p>
        收: <span className="font-mono">{formatPrice(d.close)}</span>
      </p>
      <p>
        量: <span className="font-mono">{d.volume.toLocaleString()}</span>
      </p>
      <p className={d.isUp ? "text-green-500" : "text-red-500"}>
        {d.isUp ? "▲" : "▼"}
        {(((d.close - d.open) / d.open) * 100).toFixed(2)}%
      </p>
    </div>
  )
}

// ── Indicator Lines ──

function IndicatorLines({ indicator }: { indicator: string }) {
  switch (indicator) {
    case "ma5":
      return (
        <Line
          type="monotone"
          dataKey="ma5"
          stroke="#f59e0b"
          strokeWidth={1.5}
          dot={false}
          name="MA5"
          connectNulls
        />
      )
    case "ma10":
      return (
        <Line
          type="monotone"
          dataKey="ma10"
          stroke="#3b82f6"
          strokeWidth={1.5}
          dot={false}
          name="MA10"
          connectNulls
        />
      )
    case "ma20":
      return (
        <Line
          type="monotone"
          dataKey="ma20"
          stroke="#ef4444"
          strokeWidth={1.5}
          dot={false}
          name="MA20"
          connectNulls
        />
      )
    case "boll":
      return (
        <>
          <Line
            type="monotone"
            dataKey="bbUpper"
            stroke="#8b5cf6"
            strokeWidth={1}
            dot={false}
            name="上轨"
            connectNulls
            strokeDasharray="4 2"
          />
          <Line
            type="monotone"
            dataKey="ma20"
            stroke="#8b5cf6"
            strokeWidth={1.5}
            dot={false}
            name="中轨"
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="bbLower"
            stroke="#8b5cf6"
            strokeWidth={1}
            dot={false}
            name="下轨"
            connectNulls
            strokeDasharray="4 2"
          />
        </>
      )
    default:
      return null
  }
}

// ── Price Chart ──

interface KlinePriceChartProps {
  data: EnrichedKlinePoint[]
  yDomain: YDomain
  indicator: string
  currentPrice: number | null
}

export function KlinePriceChart({ data, yDomain, indicator, currentPrice }: KlinePriceChartProps) {
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11 }}
            stroke="hsl(var(--muted-foreground))"
            interval="preserveStartEnd"
            minTickGap={50}
          />
          <YAxis
            domain={yDomain}
            tick={{ fontSize: 11 }}
            stroke="hsl(var(--muted-foreground))"
            tickFormatter={(v) => formatPrice(v)}
            width={80}
          />
          <Tooltip content={<KlineTooltip />} />
          <Bar
            dataKey="close"
            shape={(props) => <CandleShape {...props} yDomain={yDomain} />}
            isAnimationActive={false}
          />
          <IndicatorLines indicator={indicator} />
          {currentPrice != null && (
            <ReferenceLine
              y={currentPrice}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="6 3"
              strokeWidth={1.5}
              label={{
                value: formatPrice(currentPrice),
                position: "right",
                fill: "hsl(var(--muted-foreground))",
                fontSize: 11,
              }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Volume Chart ──

interface KlineVolumeChartProps {
  data: KlinePoint[]
}

export function KlineVolumeChart({ data }: KlineVolumeChartProps) {
  return (
    <div className="h-[120px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10 }}
            stroke="hsl(var(--muted-foreground))"
            interval="preserveStartEnd"
            minTickGap={50}
          />
          <YAxis
            tick={{ fontSize: 10 }}
            stroke="hsl(var(--muted-foreground))"
            tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`)}
            width={60}
          />
          <Bar dataKey="volume" fill="#d97706" opacity={0.3} name="成交量" isAnimationActive={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Combined Chart ──

interface KlineChartProps {
  data: EnrichedKlinePoint[]
  yDomain: YDomain
  indicator: string
  currentPrice: number | null
  showVolume?: boolean
}

export function KlineChart({ data, yDomain, indicator, currentPrice, showVolume = true }: KlineChartProps) {
  return (
    <>
      <KlinePriceChart data={data} yDomain={yDomain} indicator={indicator} currentPrice={currentPrice} />
      {showVolume && (
        <div className="mt-4">
          <p className="mb-2 text-xs text-muted-foreground">成交量</p>
          <KlineVolumeChart data={data} />
        </div>
      )}
    </>
  )
}

// ── Skeleton ──

export function KlineChartSkeleton() {
  return (
    <div className="space-y-6">
      {/* Price chart skeleton */}
      <div className="h-[400px] animate-pulse rounded-xl border bg-muted/30 p-4">
        <div className="mb-6 flex items-end justify-between">
          <div className="h-4 w-24 rounded bg-muted-foreground/20" />
          <div className="h-4 w-20 rounded bg-muted-foreground/20" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-muted-foreground/10" />
          <div className="h-3 w-full rounded bg-muted-foreground/10" />
          <div className="h-3 w-3/4 rounded bg-muted-foreground/10" />
          <div className="h-3 w-5/6 rounded bg-muted-foreground/10" />
          <div className="h-3 w-full rounded bg-muted-foreground/10" />
          <div className="h-3 w-2/3 rounded bg-muted-foreground/10" />
        </div>
      </div>
      {/* Volume chart skeleton */}
      <div className="h-[120px] animate-pulse rounded-xl border bg-muted/30 p-4">
        <div className="flex h-full items-end gap-1">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-muted-foreground/10"
              style={{ height: `${20 + ((i * 7 + 13) % 100) * 0.6}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
