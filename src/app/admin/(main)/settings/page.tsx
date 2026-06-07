"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"

interface SiteSetting {
  key: string
  value: string
  label: string
  type: "text" | "textarea" | "image" | "json"
  section: string
}

const DEFAULT_SETTINGS: SiteSetting[] = [
  // 基本设置
  { key: "site_name", value: "", label: "站点名称", type: "text", section: "basic" },
  { key: "site_description", value: "", label: "站点描述", type: "textarea", section: "basic" },
  { key: "logo_url", value: "", label: "Logo URL", type: "image", section: "basic" },
  { key: "favicon_url", value: "", label: "Favicon URL", type: "image", section: "basic" },
  { key: "footer_text", value: "", label: "页脚文本", type: "textarea", section: "basic" },
  { key: "contact_email", value: "", label: "联系邮箱", type: "text", section: "basic" },
  { key: "beian", value: "", label: "备案号", type: "text", section: "basic" },
  { key: "google_analytics_id", value: "", label: "Google Analytics ID", type: "text", section: "basic" },

  // 首页统计
  { key: "stat_exchanges", value: "15", label: "交易所数量 (显示如 15+)", type: "text", section: "stats" },
  { key: "stat_articles", value: "50", label: "文章数量 (显示如 50+)", type: "text", section: "stats" },
  { key: "stat_users", value: "10000", label: "用户数量 (显示如 10,000+)", type: "text", section: "stats" },

  // 社群信息
  { key: "community_members", value: "5000", label: "社群成员数 (显示如 5,000+)", type: "text", section: "community" },
  { key: "community_platforms_count", value: "3", label: "交流平台数", type: "text", section: "community" },
  { key: "community_active_label", value: "每日", label: "活跃度标签", type: "text", section: "community" },
  { key: "community_free_label", value: "免费", label: "费用标签", type: "text", section: "community" },

  // 交流平台 (JSON)
  { key: "community_platforms", value: "", label: "平台列表 (JSON)", type: "json", section: "platforms" },
]

const SECTION_TITLES: Record<string, string> = {
  basic: "基本设置",
  stats: "首页统计",
  community: "社群信息",
  platforms: "交流平台",
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSetting[]>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    apiClient.get<Record<string, string>>("/api/site-settings")
      .then((savedSettings) => {
        if (savedSettings && Object.keys(savedSettings).length > 0) {
          setSettings((prev) =>
            prev.map((s) => ({
              ...s,
              value: savedSettings[s.key] || "",
            }))
          )
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value } : s))
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // 批量写入所有设置
      const payload: Record<string, string> = {}
      for (const setting of settings) {
        payload[setting.key] = setting.value
      }
      await apiClient.put("/api/site-settings", payload)
      alert("保存成功")
    } catch (err) {
      alert(err instanceof Error ? err.message : "保存失败")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="py-8 text-center text-muted-foreground">加载中...</div>

  // Group settings by section
  const grouped = settings.reduce<Record<string, SiteSetting[]>>((acc, s) => {
    if (!acc[s.section]) acc[s.section] = []
    acc[s.section].push(s)
    return acc
  }, {})

  const sectionOrder = ["basic", "stats", "community", "platforms"]

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">站点设置</h1>
        <Button onClick={handleSave} disabled={saving}>{saving ? "保存中..." : "保存所有设置"}</Button>
      </div>

      {sectionOrder.map((sectionKey) => {
        const sectionSettings = grouped[sectionKey]
        if (!sectionSettings) return null

        return (
          <Card key={sectionKey} className="mb-6">
            <CardHeader><CardTitle>{SECTION_TITLES[sectionKey]}</CardTitle></CardHeader>
            <CardContent className=
              {sectionKey === "platforms"
                ? "grid grid-cols-1 gap-4"
                : "grid grid-cols-1 gap-4 md:grid-cols-2"
              }
            >
              {sectionSettings.map((setting) => (
                <div key={setting.key} className="space-y-2">
                  <Label>{setting.label}</Label>

                  {setting.type === "textarea" && (
                    <Textarea
                      rows={3}
                      value={setting.value}
                      onChange={(e) => updateSetting(setting.key, e.target.value)}
                    />
                  )}

                  {setting.type === "json" && (
                    <div className="space-y-1">
                      <Textarea
                        rows={8}
                        className="font-mono text-xs"
                        value={setting.value}
                        onChange={(e) => updateSetting(setting.key, e.target.value)}
                        placeholder={JSON.stringify([
                          {
                            name: "Telegram 群",
                            description: "最活跃的币圈交流群...",
                            members: "3,000+ 群友",
                            href: "https://t.me/your_group",
                            color: "bg-sky-500/10 text-sky-500",
                          },
                        ], null, 2)}
                      />
                      <p className="text-xs text-muted-foreground">
                        每个平台包含: name, description, members, href, color (颜色参考: bg-sky-500/10 text-sky-500 / bg-indigo-500/10 text-indigo-500 / bg-green-500/10 text-green-500)
                      </p>
                    </div>
                  )}

                  {setting.type === "image" && (
                    <div className="flex gap-2">
                      <Input
                        value={setting.value}
                        onChange={(e) => updateSetting(setting.key, e.target.value)}
                      />
                      {setting.value && (
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded border">
                          <Image src={setting.value} alt={`${setting.key} 预览`} width={40} height={40} className="h-full w-full object-cover" unoptimized />
                        </div>
                      )}
                    </div>
                  )}

                  {setting.type === "text" && (
                    <Input
                      value={setting.value}
                      onChange={(e) => updateSetting(setting.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
