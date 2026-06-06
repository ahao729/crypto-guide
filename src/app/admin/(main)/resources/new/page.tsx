"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"

export default function NewResourcePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "newbie",
    type: "file",
    fileUrl: "",
    fileSize: "",
    externalUrl: "",
    icon: "",
    tags: "",
    sortOrder: 0,
    published: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await apiClient.post("/api/resources", form)
      router.push("/admin/resources")
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : "创建失败")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">新建资源</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>基本信息</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">标题 *</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">排序权重</Label>
              <Input id="sortOrder" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">分类</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newbie">新手入门</SelectItem>
                  <SelectItem value="template">模板工具</SelectItem>
                  <SelectItem value="tool">在线工具</SelectItem>
                  <SelectItem value="link">友情链接</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">类型</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="file">文件</SelectItem>
                  <SelectItem value="external">外部链接</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fileUrl">文件 URL</Label>
              <Input id="fileUrl" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fileSize">文件大小</Label>
              <Input id="fileSize" value={form.fileSize} onChange={(e) => setForm({ ...form, fileSize: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="externalUrl">外部链接</Label>
              <Input id="externalUrl" value={form.externalUrl} onChange={(e) => setForm({ ...form, externalUrl: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">图标</Label>
              <Input id="icon" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">标签 (用逗号分隔)</Label>
              <Input id="tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            </div>
            <div className="flex items-center gap-2 pt-8">
              <input
                id="published"
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="published">发布</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>详细内容</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="description">简介</Label>
              <Textarea id="description" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "创建中..." : "创建"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/resources")}>
            取消
          </Button>
        </div>
      </form>
    </div>
  )
}
