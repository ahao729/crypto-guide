"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Check, X } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import type { ExchangeType } from "@/types"

export default function AdminExchangesPage() {
  const [exchanges, setExchanges] = useState<ExchangeType[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchExchanges = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      params.set("status", "all")
      const data = await apiClient.get<ExchangeType[]>(`/api/exchanges?${params.toString()}`)
      setExchanges(data)
    } catch (err) {
      console.error("Failed to fetch exchanges:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExchanges()
  }, [search])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`确定删除交易所"${name}"吗？此操作不可恢复。`)) return
    try {
      await apiClient.delete(`/api/exchanges/${id}`)
      setExchanges((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : "删除失败")
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">交易所管理</h1>
        <Link href="/admin/exchanges/new">
          <Button>新建交易所</Button>
        </Link>
      </div>

      <div className="mb-4">
        <Input
          placeholder="搜索交易所名称..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {loading ? (
        <div className="py-8 text-center text-muted-foreground">加载中...</div>
      ) : exchanges.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">暂无交易所数据</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">名称</th>
                <th className="px-4 py-3 font-medium">分类</th>
                <th className="px-4 py-3 font-medium">评分</th>
                <th className="px-4 py-3 font-medium">状态</th>
                <th className="px-4 py-3 font-medium">点击数</th>
                <th className="px-4 py-3 font-medium">推荐</th>
                <th className="px-4 py-3 font-medium">热门</th>
                <th className="px-4 py-3 font-medium">排序</th>
                <th className="px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {exchanges.map((exchange) => (
                <tr key={exchange.id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {exchange.logo && (
                        <Image src={exchange.logo} alt={`${exchange.name} Logo`} width={24} height={24} className="h-6 w-6 rounded-full object-cover" unoptimized />
                      )}
                      <span className="font-medium">{exchange.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{exchange.category?.name || "-"}</td>
                  <td className="px-4 py-3">{exchange.rating}</td>
                  <td className="px-4 py-3">
                    <Badge variant={exchange.status === "active" ? "default" : "secondary"}>
                      {exchange.status === "active" ? "启用" : "禁用"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">{exchange.clickCount}</td>
                  <td className="px-4 py-3">
                      {exchange.isFeatured ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                    </td>
                  <td className="px-4 py-3">
                      {exchange.isPopular ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                    </td>
                  <td className="px-4 py-3">{exchange.sortOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/exchanges/${exchange.id}`}>
                        <Button variant="outline" size="sm">编辑</Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(exchange.id, exchange.name)}
                      >
                        删除
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
