"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

// ── Types ──

export interface YearData {
  year: number
  invested: number
  value: number
  gain: number
}

// ── Helpers ──

function defaultFormatCurrency(val: number): string {
  if (val >= 1_000_000) return `¥${(val / 10_000).toFixed(2)}万`
  if (val >= 10_000) return `¥${(val / 10_000).toFixed(2)}万`
  return `¥${val.toFixed(2)}`
}

// ── Component ──

interface DcaChartProps {
  data: YearData[]
  formatCurrency?: (val: number) => string
}

export function DcaChart({ data, formatCurrency = defaultFormatCurrency }: DcaChartProps) {
  if (data.length === 0) return null

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d97706" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#d97706" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6b7280" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#6b7280" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
            tickFormatter={(v) => `第${v}年`}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
            tickFormatter={(v) => (v >= 10000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(0))}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(Number(value)), ""]}
            labelFormatter={(label) => `第 ${label} 年`}
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "13px",
            }}
          />
          <Area
            type="monotone"
            dataKey="invested"
            stroke="#6b7280"
            strokeWidth={1.5}
            fill="url(#investedGrad)"
            name="累计投入"
            strokeDasharray="4 3"
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#d97706"
            strokeWidth={2}
            fill="url(#valueGrad)"
            name="资产价值"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
