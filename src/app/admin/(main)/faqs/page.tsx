"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiClient } from "@/lib/api-client"

interface FAQItem {
  id: string
  question: string
  answer: string
  sortOrder: number
  category: string | null
  published: boolean
  createdAt?: string
  updatedAt?: string
}

const FAQ_CATEGORIES = ["通用", "注册", "交易", "安全", "提现", "充值", "其他"]

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [form, setForm] = useState({ question: "", answer: "", sortOrder: 0, category: "", published: true })

  const filteredFaqs = useMemo(() => {
    if (categoryFilter === "all") return faqs
    return faqs.filter(faq => faq.category === categoryFilter)
  }, [faqs, categoryFilter])

  const fetchFaqs = async () => {
    setLoading(true)
    try {
      const data = await apiClient.get<FAQItem[]>("/api/faqs?published=all")
      setFaqs(data)
    } catch (err) {
      console.error("Failed to fetch FAQs:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchFaqs() }, [])

  const resetForm = () => setForm({ question: "", answer: "", sortOrder: 0, category: "", published: true })

  const handleCreate = async () => {
    if (!form.question || !form.answer) return alert("问题和答案不能为空")
    try {
      await apiClient.post("/api/faqs", form)
      resetForm()
      setShowNew(false)
      fetchFaqs()
    } catch (err) {
      alert(err instanceof Error ? err.message : "创建失败")
    }
  }

  const handleUpdate = async (id: string) => {
    if (!form.question || !form.answer) return alert("问题和答案不能为空")
    try {
      await apiClient.put(`/api/faqs/${id}`, form)
      setEditingId(null)
      resetForm()
      fetchFaqs()
    } catch (err) {
      alert(err instanceof Error ? err.message : "更新失败")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除这条 FAQ 吗？")) return
    try {
      await apiClient.delete(`/api/faqs/${id}`)
      fetchFaqs()
    } catch (err) {
      alert(err instanceof Error ? err.message : "删除失败")
    }
  }

  const startEdit = (faq: FAQItem) => {
    setEditingId(faq.id)
    setForm({ question: faq.question, answer: faq.answer, sortOrder: faq.sortOrder, category: faq.category || "", published: faq.published })
    setShowNew(false)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">常见问题 (FAQ) 管理</h1>
        <Button onClick={() => { setShowNew(!showNew); setEditingId(null); resetForm() }}>
          {showNew ? "取消" : "新建 FAQ"}
        </Button>
      </div>

      {/* 分类筛选栏 */}
      <div className="mb-4 flex items-center gap-2">
        <Label className="shrink-0 text-sm font-medium">分类筛选</Label>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="全部分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部分类</SelectItem>
            {FAQ_CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">
          {categoryFilter === "all"
            ? `共 ${faqs.length} 条`
            : `分类 "${categoryFilter}" ${filteredFaqs.length} 条`}
        </span>
      </div>

      {showNew && (
        <Card className="mb-6">
          <CardHeader><CardTitle>新建 FAQ</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>问题 *</Label>
              <Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>答案 *</Label>
              <Textarea rows={5} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>分类</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {FAQ_CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>排序权重</Label>
                <Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="h-4 w-4" />
                  <span className="text-sm">已发布</span>
                </label>
              </div>
            </div>
            <Button onClick={handleCreate}>创建</Button>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="py-8 text-center text-muted-foreground">加载中...</div>
      ) : filteredFaqs.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          {categoryFilter === "all" ? "暂无 FAQ" : `暂无 "${categoryFilter}" 分类的 FAQ`}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((faq) => (
            editingId === faq.id ? (
              <Card key={faq.id}>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label>问题 *</Label>
                    <Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>答案 *</Label>
                    <Textarea rows={5} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>分类</Label>
                      <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择分类" />
                        </SelectTrigger>
                        <SelectContent>
                          {FAQ_CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>排序权重</Label>
                      <Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div className="flex items-end pb-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="h-4 w-4" />
                        <span className="text-sm">已发布</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleUpdate(faq.id)}>保存</Button>
                    <Button variant="outline" onClick={() => { setEditingId(null); resetForm() }}>取消</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card key={faq.id} className="cursor-pointer transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{faq.question}</CardTitle>
                      {faq.category && (
                        <span className="text-xs text-muted-foreground">分类: {faq.category}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${faq.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {faq.published ? "已发布" : "草稿"}
                      </span>
                      <span className="text-xs text-muted-foreground">排序: {faq.sortOrder}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => startEdit(faq)}>编辑</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(faq.id)}>删除</Button>
                  </div>
                </CardContent>
              </Card>
            )
          ))}
        </div>
      )}
    </div>
  )
}
