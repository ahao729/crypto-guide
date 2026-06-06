"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"
import type { ExchangeType, CategoryType } from "@/types"
import { generateSlug } from "@/lib/utils"

export default function EditExchangePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
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

  useEffect(() => {
    Promise.all([
      apiClient.get<ExchangeType>(`/api/exchanges/${id}`),
      apiClient.get<CategoryType[]>("/api/categories?type=exchange"),
    ]).then(([exchange, cats]) => {
      setForm({
        name: exchange.name,
        slug: exchange.slug,
        logo: exchange.logo || "",
        description: exchange.description || "",
        content: exchange.content || "",
        rating: exchange.rating,
        referralUrl: exchange.referralUrl || "",
        inviteCode: exchange.inviteCode || "",
        feeRate: exchange.feeRate || "",
        spotFee: exchange.spotFee || "",
        futuresFee: exchange.futuresFee || "",
        features: exchange.features || "",
        supportedCoins: exchange.supportedCoins || "",
        regulation: exchange.regulation || "",
        status: exchange.status,
        sortOrder: exchange.sortOrder,
        isFeatured: exchange.isFeatured,
        isPopular: exchange.isPopular,
        categoryId: exchange.categoryId || "",
      })
      setCategories(cats)
      setFetching(false)
    }).catch((err) => {
      alert(err instanceof Error ? err.message : "加载失败")
      router.push("/admin/exchanges")
    })
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await apiClient.put(`/api/exchanges/${id}`, form)
      router.push("/admin/exchanges")
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : "保存失败")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="py-8 text-center text-muted-foreground">加载中...</div>

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">编辑交易所</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>基本信息</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>名称 *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Slug *</Label>
              <div className="flex gap-2">
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
                <Button type="button" variant="outline" size="sm" onClick={() => setForm({ ...form, slug: generateSlug(form.name) })}>自动</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Logo URL</Label>
              <Input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} />
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
              <Label>评分 (0-5)</Label>
              <Input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 0 })} />
            </div>
            <div className="space-y-2">
              <Label>排序权重</Label>
              <Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="space-y-2">
              <Label>状态</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">启用</SelectItem>
                  <SelectItem value="inactive">禁用</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>推荐链接</Label>
              <Input value={form.referralUrl} onChange={(e) => setForm({ ...form, referralUrl: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>邀请码</Label>
              <Input value={form.inviteCode} onChange={(e) => setForm({ ...form, inviteCode: e.target.value })} placeholder="如：DUXIN" />
            </div>
            <div className="space-y-2">
              <Label>费率说明</Label>
              <Input value={form.feeRate} onChange={(e) => setForm({ ...form, feeRate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>现货费率</Label>
              <Input value={form.spotFee} onChange={(e) => setForm({ ...form, spotFee: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>合约费率</Label>
              <Input value={form.futuresFee} onChange={(e) => setForm({ ...form, futuresFee: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>支持币种</Label>
              <Input value={form.supportedCoins} onChange={(e) => setForm({ ...form, supportedCoins: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>监管信息</Label>
              <Input value={form.regulation} onChange={(e) => setForm({ ...form, regulation: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>特点</Label>
              <Input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>详细内容</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>简介</Label>
              <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="mt-4 space-y-2">
              <Label>详细介绍 (Markdown)</Label>
              <Textarea rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
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
          <Button type="submit" disabled={loading}>{loading ? "保存中..." : "保存修改"}</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/exchanges")}>取消</Button>
        </div>
      </form>
    </div>
  )
}
