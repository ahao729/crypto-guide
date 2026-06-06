"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"
import type { TagType } from "@/types"
import { generateSlug } from "@/lib/utils"

export default function AdminTagsPage() {
  const [tags, setTags] = useState<TagType[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")

  const fetchTags = async () => {
    setLoading(true)
    try {
      const data = await apiClient.get<TagType[]>("/api/tags")
      setTags(data)
    } catch (err) {
      console.error("Failed to fetch tags:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTags() }, [])

  const handleCreate = async () => {
    if (!newName.trim()) return
    try {
      await apiClient.post("/api/tags", { name: newName.trim(), slug: generateSlug(newName) })
      setNewName("")
      fetchTags()
    } catch (err) {
      alert(err instanceof Error ? err.message : "创建失败")
    }
  }

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return
    try {
      await apiClient.put(`/api/tags/${id}`, { name: editName.trim(), slug: generateSlug(editName) })
      setEditingId(null)
      setEditName("")
      fetchTags()
    } catch (err) {
      alert(err instanceof Error ? err.message : "更新失败")
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`确定删除标签"${name}"吗？`)) return
    try {
      await apiClient.delete(`/api/tags/${id}`)
      fetchTags()
    } catch (err) {
      alert(err instanceof Error ? err.message : "删除失败")
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">标签管理</h1>
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle>新建标签</CardTitle></CardHeader>
        <CardContent className="flex items-end gap-4">
          <div className="flex-1 space-y-2">
            <Label>标签名称</Label>
            <Input
              placeholder="输入标签名称"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>
          <Button onClick={handleCreate} disabled={!newName.trim()}>添加</Button>
        </CardContent>
      </Card>

      {loading ? (
        <div className="py-8 text-center text-muted-foreground">加载中...</div>
      ) : tags.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">暂无标签</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">名称</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">关联文章数</th>
                <th className="px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {tags.map((tag) => (
                editingId === tag.id ? (
                  <tr key={tag.id} className="border-t bg-muted/20">
                    <td className="px-4 py-3">
                      <Input value={editName} onChange={(e) => setEditName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleUpdate(tag.id)} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{generateSlug(editName || tag.name)}</td>
                    <td className="px-4 py-3">{tag._count?.articles ?? 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleUpdate(tag.id)} disabled={!editName.trim()}>保存</Button>
                        <Button size="sm" variant="outline" onClick={() => { setEditingId(null); setEditName("") }}>取消</Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={tag.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{tag.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{tag.slug}</td>
                    <td className="px-4 py-3">{tag._count?.articles ?? 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setEditingId(tag.id); setEditName(tag.name) }}>编辑</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(tag.id, tag.name)}>删除</Button>
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
