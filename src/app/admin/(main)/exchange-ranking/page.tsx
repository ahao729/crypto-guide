"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { apiClient } from "@/lib/api-client"
import type { ExchangeType } from "@/types"

export default function ExchangeRankingPage() {
  const [exchanges, setExchanges] = useState<ExchangeType[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [savingId, setSavingId] = useState<string | null>(null)

  const fetchExchanges = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      params.set("status", "all")
      const data = await apiClient.get<ExchangeType[]>(
        `/api/exchanges?${params.toString()}`
      )
      setExchanges(data)
    } catch (err) {
      toast({ title: "获取交易所列表失败", variant: "destructive" })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    fetchExchanges()
  }, [fetchExchanges])

  // Debounced search
  const [searchInput, setSearchInput] = useState("")
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  const updateExchange = async (id: string, data: Partial<ExchangeType>) => {
    setSavingId(id)
    try {
      const updated = await apiClient.put<ExchangeType>(
        `/api/exchanges/${id}`,
        data
      )
      setExchanges((prev) =>
        prev.map((ex) => (ex.id === id ? updated : ex))
      )
      toast({ title: "排名已更新" })
    } catch (err: unknown) {
      toast({
        title: err instanceof Error ? err.message : "更新失败",
        variant: "destructive",
      })
    } finally {
      setSavingId(null)
    }
  }

  const moveUp = async (index: number) => {
    if (index === 0) return
    const newList = [...exchanges]
    const current = newList[index]
    const above = newList[index - 1]

    // Swap sortOrder
    const tempOrder = current.sortOrder
    current.sortOrder = above.sortOrder
    above.sortOrder = tempOrder

    // Swap positions
    newList[index] = above
    newList[index - 1] = current

    setExchanges(newList)

    // Serial persistence to avoid race conditions
    await updateExchange(current.id, { sortOrder: current.sortOrder })
    await updateExchange(above.id, { sortOrder: above.sortOrder })
  }

  const moveDown = async (index: number) => {
    if (index === exchanges.length - 1) return
    const newList = [...exchanges]
    const current = newList[index]
    const below = newList[index + 1]

    const tempOrder = current.sortOrder
    current.sortOrder = below.sortOrder
    below.sortOrder = tempOrder

    newList[index] = below
    newList[index + 1] = current

    setExchanges(newList)

    // Serial persistence to avoid race conditions
    await updateExchange(current.id, { sortOrder: current.sortOrder })
    await updateExchange(below.id, { sortOrder: below.sortOrder })
  }

  const toggleFeatured = (exchange: ExchangeType) => {
    updateExchange(exchange.id, { isFeatured: !exchange.isFeatured })
  }

  const togglePopular = (exchange: ExchangeType) => {
    updateExchange(exchange.id, { isPopular: !exchange.isPopular })
  }

  const handleSortOrderChange = (id: string, value: string) => {
    const num = parseInt(value, 10)
    if (isNaN(num)) return
    setExchanges((prev) =>
      prev.map((ex) =>
        ex.id === id ? { ...ex, sortOrder: num } : ex
      )
    )
  }

  const handleSortOrderSave = (id: string, sortOrder: number) => {
    updateExchange(id, { sortOrder })
  }

  const handleSortOrderKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.currentTarget.blur()
    }
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">
            交易所排名
          </h1>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-4 animate-pulse"
            >
              <div className="h-10 w-10 rounded bg-muted" />
              <div className="h-10 flex-1 rounded bg-muted" />
              <div className="h-10 w-24 rounded bg-muted" />
              <div className="h-10 w-16 rounded bg-muted" />
              <div className="h-10 w-16 rounded bg-muted" />
              <div className="h-10 w-16 rounded bg-muted" />
              <div className="h-10 w-20 rounded bg-muted" />
              <div className="h-10 w-24 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const statusVariant: Record<
    string,
    "default" | "secondary" | "destructive"
  > = {
    active: "default",
    inactive: "secondary",
    hidden: "destructive",
  }

  const statusLabel: Record<string, string> = {
    active: "启用",
    inactive: "停用",
    hidden: "隐藏",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          交易所排名
        </h1>
        <span className="text-sm text-muted-foreground">
          共 {exchanges.length} 个交易所
        </span>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <Input
            type="text"
            placeholder="搜索交易所..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Empty State */}
      {exchanges.length === 0 && (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <svg
            className="mx-auto w-12 h-12 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p className="mt-3 text-muted-foreground">
            {search
              ? "没有匹配的交易所，请尝试其他关键词"
              : "暂无交易所数据"}
          </p>
        </div>
      )}

      {/* Table */}
      {exchanges.length > 0 && (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-16">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    名称
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    分类
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    评分
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    点击数
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    推荐
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    热门
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    排名值
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider w-24">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {exchanges.map((exchange, index) => (
                  <tr
                    key={exchange.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* Index */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                      {index + 1}
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {exchange.logo && (
                          <img
                            src={exchange.logo}
                            alt={exchange.name}
                            className="w-8 h-8 rounded-full object-cover bg-muted"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {exchange.name}
                          </p>
                          {exchange.shortName && (
                            <p className="text-xs text-muted-foreground">
                              {exchange.shortName}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                      {exchange.category?.name || "-"}
                    </td>

                    {/* Rating */}
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span className="inline-flex items-center gap-1 text-sm text-foreground">
                        <svg
                          className="w-4 h-4 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {exchange.rating}
                      </span>
                    </td>

                    {/* Click Count */}
                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-muted-foreground">
                      {exchange.clickCount.toLocaleString()}
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <Badge
                        variant={
                          statusVariant[exchange.status] || "secondary"
                        }
                      >
                        {statusLabel[exchange.status] || exchange.status}
                      </Badge>
                    </td>

                    {/* Featured Toggle */}
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <Switch
                        checked={exchange.isFeatured}
                        onCheckedChange={() => toggleFeatured(exchange)}
                        disabled={savingId === exchange.id}
                      />
                    </td>

                    {/* Popular Toggle */}
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <Switch
                        checked={exchange.isPopular}
                        onCheckedChange={() => togglePopular(exchange)}
                        disabled={savingId === exchange.id}
                      />
                    </td>

                    {/* Sort Order Input */}
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <Input
                        type="number"
                        value={exchange.sortOrder}
                        onChange={(e) =>
                          handleSortOrderChange(
                            exchange.id,
                            e.target.value
                          )
                        }
                        onBlur={() =>
                          handleSortOrderSave(
                            exchange.id,
                            exchange.sortOrder
                          )
                        }
                        onKeyDown={handleSortOrderKeyDown}
                        className="w-20 h-8 text-center text-sm mx-auto"
                        min={0}
                      />
                    </td>

                    {/* Up/Down Actions */}
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveUp(index)}
                          disabled={index === 0 || savingId !== null}
                          className="h-8 w-8 p-0"
                          title="上移"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveDown(index)}
                          disabled={
                            index === exchanges.length - 1 ||
                            savingId !== null
                          }
                          className="h-8 w-8 p-0"
                          title="下移"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Usage Tips */}
      {exchanges.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-foreground mb-2">
            操作提示
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>
              <strong>上下移动</strong>
              ：点击 ↑/↓ 按钮调整交易所排名顺序，系统会自动交换排名值
            </li>
            <li>
              <strong>直接编辑</strong>
              ：点击{'\u201C'}排名值{'\u201D'}列的输入框，直接输入数字后回车或失焦即可保存
            </li>
            <li>
              <strong>推荐/热门</strong>
              ：切换开关控制交易所是否在首页展示推荐或热门标签
            </li>
            <li>
              <strong>排序规则</strong>
              ：排名值（sortOrder）越小的交易所排名越靠前
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
