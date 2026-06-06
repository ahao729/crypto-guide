"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichTextEditor } from "@/components/editor/RichTextEditor"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"
import type { CategoryType, TagType } from "@/types"
import { generateSlug } from "@/lib/utils"

export default function NewArticlePage() {
  const router = useRouter()
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [tags, setTags] = useState<TagType[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    author: "",
    published: false,
    publishedAt: "",
    categoryId: "",
    tagIds: [] as string[],
  })
  const [autoSlug, setAutoSlug] = useState(true)

  useEffect(() => {
    Promise.all([
      apiClient.get<CategoryType[]>("/api/categories?type=article"),
      apiClient.get<TagType[]>("/api/tags"),
    ]).then(([cats, tgs]) => {
      setCategories(cats)
      setTags(tgs)
    }).catch(console.error)
  }, [])

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: autoSlug ? generateSlug(title) : prev.slug,
    }))
  }

  const toggleTag = (tagId: string) => {
    setForm((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await apiClient.post("/api/articles", {
        ...form,
        publishedAt: form.published && form.publishedAt ? new Date(form.publishedAt).toISOString() : form.published ? new Date().toISOString() : null,
      })
      router.push("/admin/articles")
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : "创建失败")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">新建文章</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>基本信息</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>标题 *</Label>
              <Input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Slug *</Label>
              <div className="flex gap-2">
                <Input value={form.slug} onChange={(e) => { setForm({ ...form, slug: e.target.value }); setAutoSlug(false) }} required />
                <Button type="button" variant="outline" size="sm" onClick={() => { setForm({ ...form, slug: generateSlug(form.title) }); setAutoSlug(true) }}>自动</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>分类</Label>
              <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                <SelectTrigger><SelectValue placeholder="选择分类" /></SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>作者</Label>
              <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>封面图片 URL</Label>
              <Input value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>发布时间</Label>
              <Input type="datetime-local" value={form.publishedAt} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="published" checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v === true })} />
              <Label htmlFor="published">立即发布</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>内容</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>摘要</Label>
              <Textarea rows={3} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>正文</Label>
              <RichTextEditor
                value={form.content}
                onChange={(html) => setForm({ ...form, content: html })}
                placeholder="开始撰写文章..."
                minHeight={450}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>标签</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Button
                  key={tag.id}
                  type="button"
                  variant={form.tagIds.includes(tag.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name}
                </Button>
              ))}
              {tags.length === 0 && <span className="text-sm text-muted-foreground">暂无标签，请先在标签管理中创建</span>}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>{loading ? "创建中..." : "创建文章"}</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/articles")}>取消</Button>
        </div>
      </form>
    </div>
  )
}
