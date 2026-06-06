"use client"

import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// ── Types ──

export interface KlineData {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  isUp: boolean
}

export type YDomain = [number, number]

// ── CandleShape with Highlight ──

interface PatternCandleShapeProps {
  x?: number
  y?: number
  width?: number
  height?: number
  payload?: KlineData
  yDomain: YDomain
  hoveredIndex?: number | null
  /** Recharts injects the data-point index automatically */
  index?: number
}

export function PatternCandleShape({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  payload,
  yDomain,
  hoveredIndex,
  index,
}: PatternCandleShapeProps) {
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

  const isHighlighted = hoveredIndex != null && hoveredIndex === index

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
      {isHighlighted && (
        <>
          <rect
            x={cx - cw / 2 - 10}
            y={bodyTop - 10}
            width={cw + 20}
            height={Math.max(bodyBottom - bodyTop, 1) + 20}
            rx={6}
            fill="rgba(245, 158, 11, 0.12)"
            className="animate-pulse"
          />
          <rect
            x={cx - cw / 2 - 6}
            y={bodyTop - 6}
            width={cw + 12}
            height={Math.max(bodyBottom - bodyTop, 1) + 12}
            rx={4}
            fill="rgba(245, 158, 11, 0.2)"
          />
          <rect
            x={cx - cw / 2 - 4}
            y={bodyTop - 4}
            width={cw + 8}
            height={Math.max(bodyBottom - bodyTop, 1) + 8}
            rx={4}
            fill="none"
            stroke="#fbbf24"
            strokeWidth={3}
            strokeDasharray="5 3"
            className="animate-pulse"
          />
        </>
      )}
    </g>
  )
}

// ── Tooltip ──

function PatternTooltip({ active, payload }: { active?: boolean; payload?: { payload: KlineData }[] }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload as KlineData | undefined
  if (!d) return null
  return (
    <div className="rounded-lg border bg-popover p-3 text-xs shadow-md">
      <p className="mb-1 font-medium">{d.time}</p>
      <p>
        开: <span className="font-mono">${d.open.toLocaleString()}</span>
      </p>
      <p>
        高: <span className="font-mono">${d.high.toLocaleString()}</span>
      </p>
      <p>
        低: <span className="font-mono">${d.low.toLocaleString()}</span>
      </p>
      <p>
        收: <span className="font-mono">${d.close.toLocaleString()}</span>
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

// ── Chart ──

interface KlinePatternsChartProps {
  data: KlineData[]
  yDomain: YDomain
  hoveredIndex: number | null
}

export function KlinePatternsChart({ data, yDomain, hoveredIndex }: KlinePatternsChartProps) {
  return (
    <>
      {/* Candlestick Price Chart */}
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11 }}
              tickLine={false}
              stroke="hsl(var(--muted-foreground))"
              interval="preserveStartEnd"
            />
            <YAxis
              domain={yDomain}
              tick={{ fontSize: 11 }}
              tickLine={false}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
            />
            <Tooltip content={<PatternTooltip />} />
            <Bar
              dataKey="close"
              shape={(props) => (
                <PatternCandleShape {...props} yDomain={yDomain} hoveredIndex={hoveredIndex} />
              )}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Mini Chart */}
      <div className="mt-2 h-[80px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <XAxis dataKey="time" hide />
            <YAxis hide domain={[0, "auto"]} />
            <Bar dataKey="volume" fill="#d97706" opacity={0.3} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}

// ── Skeleton ──

export function KlinePatternsChartSkeleton() {
  return (
    <div className="space-y-2">
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
      {/* Volume mini skeleton */}
      <div className="h-[80px] animate-pulse rounded-xl border bg-muted/30 p-4">
        <div className="flex h-full items-end gap-1">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-muted-foreground/10"
              style={{ height: `${15 + ((i * 11 + 7) % 100) * 0.5}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
