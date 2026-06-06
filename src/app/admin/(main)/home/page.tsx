"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"

interface HomeSection {
  id: string
  key: string
  title: string
  subtitle: string | null
  content: string | null
  sortOrder: number
  visible: boolean
}

const DEFAULT_SECTIONS: { key: string; title: string; description: string }[] = [
  { key: "hero", title: "Hero 区域", description: "首页顶部大横幅" },
  { key: "featured-exchanges", title: "推荐交易所", description: "展示推荐的交易所" },
  { key: "categories", title: "分类导航", description: "交易所分类展示" },
  { key: "popular-articles", title: "热门文章", description: "最新/热门文章列表" },
  { key: "cta", title: "CTA 区域", description: "底部号召性用语" },
]

export default function AdminHomePage() {
  const [sections, setSections] = useState<HomeSection[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    apiClient.get<HomeSection[]>("/api/home-sections")
      .then(setSections)
      .catch(() => {
        // Initialize defaults if no sections exist
        setSections(DEFAULT_SECTIONS.map((s, i) => ({
          id: s.key,
          key: s.key,
          title: s.title,
          subtitle: s.description,
          content: "",
          sortOrder: i,
          visible: true,
        })))
      })
      .finally(() => setLoading(false))
  }, [])

  const updateSection = (key: string, field: string, value: unknown) => {
    setSections((prev) =>
      prev.map((s) => (s.key === key ? { ...s, [field]: value } : s))
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      for (const section of sections) {
        await apiClient.put(`/api/home-sections/${section.id || section.key}`, section)
      }
      alert("保存成功")
    } catch (err) {
      alert(err instanceof Error ? err.message : "保存失败")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="py-8 text-center text-muted-foreground">加载中...</div>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">首页板块管理</h1>
        <Button onClick={handleSave} disabled={saving}>{saving ? "保存中..." : "保存所有修改"}</Button>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.key}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{section.title}</CardTitle>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={section.visible}
                    onChange={(e) => updateSection(section.key, "visible", e.target.checked)}
                    className="h-4 w-4"
                  />
                  显示
                </label>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>标题</Label>
                <Input
                  value={section.title}
                  onChange={(e) => updateSection(section.key, "title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>副标题</Label>
                <Input
                  value={section.subtitle || ""}
                  onChange={(e) => updateSection(section.key, "subtitle", e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>内容 (JSON 或 Markdown)</Label>
                <Textarea
                  rows={3}
                  value={section.content || ""}
                  onChange={(e) => updateSection(section.key, "content", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
