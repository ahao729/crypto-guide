"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"
import type { CategoryType } from "@/types"
import { generateSlug } from "@/lib/utils"

export default function NewExchangePage() {
  const router = useRouter()
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    slug: "",
    logo: "",
    description: "",
    content: "",
    rating: 0,
    referralUrl: "",
    inviteCode: "",
    feeRate: "",
    spotFee: "",
    futuresFee: "",
    features: "",
    supportedCoins: "",
    regulation: "",
    status: "active",
    sortOrder: 0,
    isFeatured: false,
    isPopular: false,
    categoryId: "",
  })
  const [autoSlug, setAutoSlug] = useState(true)

  useEffect(() => {
    apiClient.get<CategoryType[]>("/api/categories?type=exchange").then(setCategories).catch(console.error)
  }, [])

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: autoSlug ? generateSlug(name) : prev.slug,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await apiClient.post("/api/exchanges", form)
      router.push("/admin/exchanges")
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : "创建失败")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">新建交易所</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>基本信息</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">名称 *</Label>
              <Input id="name" value={form.name} onChange={(e) => handleNameChange(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <div className="flex gap-2">
                <Input id="slug" value={form.slug} onChange={(e) => { setForm({ ...form, slug: e.target.value }); setAutoSlug(false) }} required />
                <Button type="button" variant="outline" size="sm" onClick={() => { setForm({ ...form, slug: generateSlug(form.name) }); setAutoSlug(true) }}>自动</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input id="logo" value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">分类</Label>
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
              <Label htmlFor="rating">评分 (0-5)</Label>
              <Input id="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 0 })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">排序权重</Label>
              <Input id="sortOrder" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">状态</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">启用</SelectItem>
                  <SelectItem value="inactive">禁用</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="referralUrl">推荐链接</Label>
              <Input id="referralUrl" value={form.referralUrl} onChange={(e) => setForm({ ...form, referralUrl: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inviteCode">邀请码</Label>
              <Input id="inviteCode" value={form.inviteCode} onChange={(e) => setForm({ ...form, inviteCode: e.target.value })} placeholder="如：DUXIN" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feeRate">费率说明</Label>
              <Input id="feeRate" value={form.feeRate} onChange={(e) => setForm({ ...form, feeRate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="spotFee">现货费率</Label>
              <Input id="spotFee" value={form.spotFee} onChange={(e) => setForm({ ...form, spotFee: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="futuresFee">合约费率</Label>
              <Input id="futuresFee" value={form.futuresFee} onChange={(e) => setForm({ ...form, futuresFee: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportedCoins">支持币种</Label>
              <Input id="supportedCoins" value={form.supportedCoins} onChange={(e) => setForm({ ...form, supportedCoins: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regulation">监管信息</Label>
              <Input id="regulation" value={form.regulation} onChange={(e) => setForm({ ...form, regulation: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="features">特点 (用逗号分隔)</Label>
              <Input id="features" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>详细内容</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="description">简介</Label>
              <Textarea id="description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="content">详细介绍 (Markdown)</Label>
              <Textarea id="content" rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>标记</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox id="isFeatured" checked={form.isFeatured} onCheckedChange={(v) => setForm({ ...form, isFeatured: v === true })} />
                <Label htmlFor="isFeatured">推荐交易所</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="isPopular" checked={form.isPopular} onCheckedChange={(v) => setForm({ ...form, isPopular: v === true })} />
                <Label htmlFor="isPopular">热门交易所</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>{loading ? "创建中..." : "创建交易所"}</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/exchanges")}>取消</Button>
        </div>
      </form>
    </div>
  )
}
