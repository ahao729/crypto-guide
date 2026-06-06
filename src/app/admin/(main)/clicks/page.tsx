"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import { formatDateShort } from "@/lib/utils"

interface ClickLog {
  id: string
  targetId: string
  targetType: string
  ip?: string
  userAgent?: string
  referer?: string
  createdAt: string
  exchange?: { name: string }
  article?: { title: string }
}

interface ClickLogsResponse {
  logs: ClickLog[]
  total: number
  page: number
  pageSize: number
}

export default function AdminClicksPage() {
  const [data, setData] = useState<ClickLogsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [targetType, setTargetType] = useState("all")
  const [search, setSearch] = useState("")
  const pageSize = 20

  const fetchClicks = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("page", String(page))
      params.set("pageSize", String(pageSize))
      if (targetType !== "all") params.set("targetType", targetType)
      if (search) params.set("search", search)
      const result = await apiClient.get<ClickLogsResponse>(`/api/clicks?${params.toString()}`)
      setData(result)
    } catch (err) {
      console.error("Failed to fetch clicks:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClicks()
  }, [page, targetType])

  const handleSearch = () => {
    setPage(1)
    fetchClicks()
  }

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">点击记录</h1>
        <span className="text-sm text-muted-foreground">总记录: {data?.total ?? 0}</span>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <Select value={targetType} onValueChange={setTargetType}>
          <SelectTrigger className="w-36"><SelectValue placeholder="所有类型" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有类型</SelectItem>
            <SelectItem value="exchange">交易所</SelectItem>
            <SelectItem value="article">文章</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="搜索名称..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="max-w-xs"
        />
        <Button variant="secondary" size="sm" onClick={handleSearch}>搜索</Button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-muted-foreground">加载中...</div>
      ) : !data || data.logs.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">暂无点击记录</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-medium">类型</th>
                  <th className="px-4 py-3 font-medium">目标</th>
                  <th className="px-4 py-3 font-medium">IP</th>
                  <th className="px-4 py-3 font-medium">来源</th>
                  <th className="px-4 py-3 font-medium">时间</th>
                </tr>
              </thead>
              <tbody>
                {data.logs.map((log) => (
                  <tr key={log.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium">
                        {log.targetType === "exchange" ? "交易所" : log.targetType === "article" ? "文章" : log.targetType}
                      </span>
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 font-medium">
                      {log.exchange?.name || log.article?.title || log.targetId}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{log.ip || "-"}</td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-muted-foreground">{log.referer || "-"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDateShort(log.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              第 {data.page} / {totalPages} 页，共 {data.total} 条
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                上一页
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                下一页
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
