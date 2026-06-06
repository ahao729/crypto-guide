"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiClient } from "@/lib/api-client"
import type { ArticleType, CategoryType } from "@/types"
import { formatDateShort } from "@/lib/utils"

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<ArticleType[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [total, setTotal] = useState(0)

  const fetchArticles = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (selectedCategory) params.set("categoryId", selectedCategory)
      params.set("all", "true")
      const data = await apiClient.get<{ articles: ArticleType[]; total: number }>(`/api/articles?${params.toString()}`)
      setArticles(data.articles)
      setTotal(data.total)
    } catch (err) {
      console.error("Failed to fetch articles:", err)
    } finally {
      setLoading(false)
    }
  }, [search, selectedCategory])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  useEffect(() => {
    apiClient.get<CategoryType[]>("/api/categories?type=article")
      .then(setCategories)
      .catch(console.error)
  }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`确定删除文章"${title}"吗？此操作不可恢复。`)) return
    try {
      await apiClient.delete(`/api/articles/${id}`)
      setArticles((prev) => prev.filter((a) => a.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : "删除失败")
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <Link href="/admin/articles/new">
          <Button>新建文章</Button>
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input
          placeholder="搜索文章标题..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={selectedCategory || "all"} onValueChange={(val) => setSelectedCategory(val === "all" ? "" : val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="全部分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部分类</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          共 <strong>{total}</strong> 篇文章
        </span>
      </div>

      {loading ? (
        <div className="py-8 text-center text-muted-foreground">加载中...</div>
      ) : articles.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">暂无文章数据</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">标题</th>
                <th className="px-4 py-3 font-medium">分类</th>
                <th className="px-4 py-3 font-medium">状态</th>
                <th className="px-4 py-3 font-medium">作者</th>
                <th className="px-4 py-3 font-medium">发布时间</th>
                <th className="px-4 py-3 font-medium">点击数</th>
                <th className="px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-t hover:bg-muted/30">
                  <td className="max-w-xs truncate px-4 py-3 font-medium">{article.title}</td>
                  <td className="px-4 py-3">{article.category?.name || "-"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={article.published ? "default" : "secondary"}>
                      {article.published ? "已发布" : "草稿"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">{article.author || "-"}</td>
                  <td className="px-4 py-3">
                    {article.publishedAt ? formatDateShort(article.publishedAt) : "-"}
                  </td>
                  <td className="px-4 py-3">{article.clickCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/articles/${article.id}`}>
                        <Button variant="outline" size="sm">编辑</Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(article.id, article.title)}
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
