"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Check, X } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import type { ResourceType } from "@/types"

const categoryLabels: Record<string, string> = {
  newbie: "新手入门",
  template: "模板工具",
  tool: "在线工具",
  link: "友情链接",
}

const typeLabels: Record<string, string> = {
  file: "文件",
  external: "外部链接",
  page: "长文",
}

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<ResourceType[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchResources = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      // Admin: show all regardless of published status
      params.set("published", "all")
      const data = await apiClient.get<ResourceType[]>(`/api/resources?${params.toString()}`)
      setResources(data)
    } catch (err) {
      console.error("Failed to fetch resources:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResources()
  }, [search])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`确定删除资源"${title}"吗？此操作不可恢复。`)) return
    try {
      await apiClient.delete(`/api/resources/${id}`)
      setResources((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : "删除失败")
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">资源管理</h1>
        <Link href="/admin/resources/new">
          <Button>新建资源</Button>
        </Link>
      </div>

      <div className="mb-4">
        <Input
          placeholder="搜索资源标题..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {loading ? (
        <div className="py-8 text-center text-muted-foreground">加载中...</div>
      ) : resources.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">暂无资源数据</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">标题</th>
                <th className="px-4 py-3 font-medium">分类</th>
                <th className="px-4 py-3 font-medium">类型</th>
                <th className="px-4 py-3 font-medium">下载数</th>
                <th className="px-4 py-3 font-medium">排序</th>
                <th className="px-4 py-3 font-medium">发布</th>
                <th className="px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => (
                <tr key={resource.id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <span className="font-medium">{resource.title}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{categoryLabels[resource.category] || resource.category}</Badge>
                  </td>
                  <td className="px-4 py-3">{typeLabels[resource.type] || resource.type}</td>
                  <td className="px-4 py-3">{resource.downloadCount}</td>
                  <td className="px-4 py-3">{resource.sortOrder}</td>
                  <td className="px-4 py-3">
                    {resource.published ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/resources/${resource.id}`}>
                        <Button variant="outline" size="sm">编辑</Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(resource.id, resource.title)}
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
