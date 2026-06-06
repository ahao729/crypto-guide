"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api-client"
import type { CategoryType } from "@/types"
import { generateSlug } from "@/lib/utils"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: "", slug: "", description: "", type: "exchange", sortOrder: 0 })
  const [showNew, setShowNew] = useState(false)

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const data = await apiClient.get<CategoryType[]>("/api/categories")
      setCategories(data)
    } catch (err) {
      console.error("Failed to fetch categories:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCategories() }, [])

  const resetForm = () => setForm({ name: "", slug: "", description: "", type: "exchange", sortOrder: 0 })

  const handleCreate = async () => {
    if (!form.name || !form.slug) return alert("名称和 Slug 不能为空")
    try {
      await apiClient.post("/api/categories", { ...form, slug: form.slug || generateSlug(form.name) })
      resetForm()
      setShowNew(false)
      fetchCategories()
    } catch (err) {
      alert(err instanceof Error ? err.message : "创建失败")
    }
  }

  const handleUpdate = async (id: string) => {
    if (!form.name || !form.slug) return alert("名称和 Slug 不能为空")
    try {
      await apiClient.put(`/api/categories/${id}`, form)
      setEditingId(null)
      resetForm()
      fetchCategories()
    } catch (err) {
      alert(err instanceof Error ? err.message : "更新失败")
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`确定删除分类"${name}"吗？`)) return
    try {
      await apiClient.delete(`/api/categories/${id}`)
      fetchCategories()
    } catch (err) {
      alert(err instanceof Error ? err.message : "删除失败")
    }
  }

  const startEdit = (cat: CategoryType) => {
    setEditingId(cat.id)
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || "", type: cat.type, sortOrder: cat.sortOrder })
    setShowNew(false)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">分类管理</h1>
        <Button onClick={() => { setShowNew(!showNew); setEditingId(null); resetForm() }}>
          {showNew ? "取消" : "新建分类"}
        </Button>
      </div>

      {/* New Category Form */}
      {showNew && (
        <Card className="mb-6">
          <CardHeader><CardTitle>新建分类</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>名称 *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>类型</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="exchange">交易所</SelectItem>
                  <SelectItem value="article">文章</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>排序权重</Label>
              <Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>描述</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Button onClick={handleCreate}>创建</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="py-8 text-center text-muted-foreground">加载中...</div>
      ) : categories.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">暂无分类</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">名称</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">类型</th>
                <th className="px-4 py-3 font-medium">排序</th>
                <th className="px-4 py-3 font-medium">描述</th>
                <th className="px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                editingId === cat.id ? (
                  <tr key={cat.id} className="border-t bg-muted/20">
                    <td className="px-4 py-3">
                      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </td>
                    <td className="px-4 py-3">
                      <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                    </td>
                    <td className="px-4 py-3">
                      <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                        <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="exchange">交易所</SelectItem>
                          <SelectItem value="article">文章</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3">
                      <Input type="number" className="w-20" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} />
                    </td>
                    <td className="px-4 py-3">
                      <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleUpdate(cat.id)}>保存</Button>
                        <Button size="sm" variant="outline" onClick={() => { setEditingId(null); resetForm() }}>取消</Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={cat.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{cat.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{cat.slug}</td>
                    <td className="px-4 py-3">
                      <Badge variant={cat.type === "exchange" ? "default" : "secondary"}>
                        {cat.type === "exchange" ? "交易所" : "文章"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{cat.sortOrder}</td>
                    <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">{cat.description || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => startEdit(cat)}>编辑</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(cat.id, cat.name)}>删除</Button>
                      </div>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
