"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, TrendingUp, Calculator, Percent, RefreshCw, Grid3X3, List, ArrowRight, BarChart3, Activity, BarChart4 } from "lucide-react"

// ── Tool Data ──

interface ToolItem {
  title: string
  description: string
  href: string
  icon: React.ElementType
  category: string
  color: string
  popular?: boolean
  new?: boolean
}

const categories = [
  { value: "all", label: "全部" },
  { value: "calculator", label: "计算器" },
  { value: "converter", label: "转换工具" },
  { value: "reference", label: "参考工具" },
] as const

const tools: ToolItem[] = [
  {
    title: "合约收益计算器",
    description: "计算做多/做空盈亏、强平价格、收益率和手续费，支持杠杆和仓位自定义",
    href: "/tools/profit-calculator",
    icon: TrendingUp,
    category: "calculator",
    color: "from-emerald-500 to-green-600",
    popular: true,
  },
  {
    title: "DCA 定投计算器",
    description: "模拟定期定额投资策略的历史收益，对比一次性投资与定投的效果差异",
    href: "/tools/dca-calculator",
    icon: Calculator,
    category: "calculator",
    color: "from-blue-500 to-indigo-600",
    popular: true,
  },
  {
    title: "货币汇率转换",
    description: "支持 BTC、ETH、USDT 等主流加密货币与美元、人民币、欧元等法币实时换算",
    href: "/tools/converter",
    icon: RefreshCw,
    category: "converter",
    color: "from-purple-500 to-violet-600",
    popular: true,
  },
  {
    title: "手续费对比",
    description: "对比 Binance、OKX、Bybit 等主流交易所的现货、合约和杠杆手续费费率",
    href: "/tools/fee-comparison",
    icon: Percent,
    category: "reference",
    color: "from-rose-500 to-pink-600",
    new: true,
    popular: true,
  },
  {
    title: "九神定投指数",
    description: "基于 BTC 价格与 200 日均线比值的市场估值指标，帮助判断定投买入/卖出时机",
    href: "/tools/dca-index",
    icon: Activity,
    category: "reference",
    color: "from-orange-500 to-red-600",
    new: true,
    popular: true,
  },
  {
    title: "网格交易计算器",
    description: "计算网格交易策略的预期收益、每格利润和总资金利用率",
    href: "/tools/grid-calculator",
    icon: Grid3X3,
    category: "calculator",
    color: "from-sky-500 to-blue-600",
  },
  {
    title: "币种信息查询",
    description: "查询任意加密货币的基本信息、市值排名、发行总量、白皮书链接等",
    href: "/tools/coin-info",
    icon: List,
    category: "reference",
    color: "from-lime-500 to-green-600",
  },
  {
    title: "期权收益计算器",
    description: "计算期权盈亏平衡点、最大收益与亏损，支持看涨/看跌期权策略分析",
    href: "/tools/options-calculator",
    icon: BarChart3,
    category: "calculator",
    color: "from-purple-500 to-violet-600",
    new: true,
    popular: true,
  },
  {
    title: "K线走势分析",
    description: "查看实时 K 线图、技术指标（MA/布林带）和成交量变化，支持多币种多周期切换",
    href: "/tools/kline",
    icon: BarChart3,
    category: "reference",
    color: "from-amber-500 to-yellow-600",
    new: true,
    popular: true,
  },
  {
    title: "K线形态识别",
    description: "自动识别十字星、吞没、晨星暮星等 13 种经典 K 线组合形态，辅助判断趋势反转信号",
    href: "/tools/kline-patterns",
    icon: BarChart4,
    category: "reference",
    color: "from-violet-500 to-purple-600",
    new: true,
    popular: true,
  },
]

// ── Color helpers ──

const colorMap: Record<string, string> = {
  "from-emerald-500 to-green-600": "dark:from-emerald-500/20 dark:to-green-500/10",
  "from-blue-500 to-indigo-600": "dark:from-blue-500/20 dark:to-indigo-500/10",
  "from-purple-500 to-violet-600": "dark:from-purple-500/20 dark:to-violet-500/10",
  "from-gold to-amber-600": "dark:from-gold/20 dark:to-amber-500/10",
  "from-rose-500 to-pink-600": "dark:from-rose-500/20 dark:to-pink-500/10",
  "from-orange-500 to-red-600": "dark:from-orange-500/20 dark:to-red-500/10",
  "from-sky-500 to-blue-600": "dark:from-sky-500/20 dark:to-blue-500/10",
  "from-lime-500 to-green-600": "dark:from-lime-500/20 dark:to-green-500/10",
  "from-amber-500 to-yellow-600": "dark:from-amber-500/20 dark:to-yellow-500/10",
  "from-violet-500 to-purple-600": "dark:from-violet-500/20 dark:to-purple-500/10",
}

// ── Component ──

export function ToolsPageClient() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filtered = useMemo(() => {
    return tools.filter((t) => {
      const matchSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
      const matchCategory = activeCategory === "all" || t.category === activeCategory
      return matchSearch && matchCategory
    })
  }, [search, activeCategory])

  return (
    <>
      {/* ── Search & Filters ── */}
      <section className="mx-auto max-w-7xl px-4 pb-2 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索工具…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-border/60 p-0.5">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── Category Pills ── */}
      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const count =
              cat.value === "all"
                ? tools.length
                : tools.filter((t) => t.category === cat.value).length
            const isActive = activeCategory === cat.value
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gradient-gold text-white shadow-md shadow-gold/20"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {cat.label}
                <span
                  className={`inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[11px] ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-muted-foreground/10 text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Results Count ── */}
      <section className="mx-auto max-w-7xl px-4 pb-2 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          共 {filtered.length} 个工具
          {search && (
            <span>
              （搜索 &ldquo;{search}&rdquo;）
            </span>
          )}
        </p>
      </section>

      {/* ── Tool Grid / List ── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <p className="text-lg font-medium">未找到匹配的工具</p>
            <p className="mt-1 text-sm text-muted-foreground">
              试试其他关键词或分类
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearch("")
                setActiveCategory("all")
              }}
            >
              清除筛选条件
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tool) => {
              const darkBg = colorMap[tool.color] || ""
              return (
                <Link key={tool.href} href={tool.href} className="group">
                  <Card className="h-full overflow-hidden border-border/60 transition-all hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5">
                    <CardContent className="p-0">
                      <div
                        className={`relative bg-gradient-to-br ${tool.color} p-5 ${darkBg}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 shadow-sm backdrop-blur-sm">
                            <tool.icon className="h-5.5 w-5.5 text-white" />
                          </div>
                          <div className="flex gap-1.5">
                            {tool.popular && (
                              <span className="inline-flex items-center rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                                热门
                              </span>
                            )}
                            {tool.new && (
                              <span className="inline-flex items-center rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-4">
                          <h3 className="text-base font-semibold text-white drop-shadow-sm">
                            {tool.title}
                          </h3>
                          <p className="mt-1 text-xs text-white/80">
                            {tool.description}
                          </p>
                        </div>
                        {/* Decorative corner gradient */}
                        <div className="pointer-events-none absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-white/5 blur-xl" />
                      </div>
                      <div className="flex items-center justify-between px-5 py-3.5">
                        <span className="text-xs text-muted-foreground">
                          {categories.find((c) => c.value === tool.category)?.label}
                        </span>
                        <ArrowRight className="h-4 w-4 text-gold-dark dark:text-gold-light transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
             {filtered.map((tool) => {
              return (
                <Link key={tool.href} href={tool.href} className="group block">
                  <Card className="overflow-hidden border-border/60 transition-all hover:border-gold/40 hover:shadow-md">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tool.color} shadow-sm`}
                      >
                        <tool.icon className="h-5.5 w-5.5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium truncate">{tool.title}</h3>
                          {tool.new && (
                            <span className="inline-flex items-center rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-medium text-gold-dark dark:text-gold-light">
                              New
                            </span>
                          )}
                          {tool.popular && (
                            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                              热门
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground truncate">
                          {tool.description}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {categories.find((c) => c.value === tool.category)?.label}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-gold-dark dark:group-hover:text-gold-light" />
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
