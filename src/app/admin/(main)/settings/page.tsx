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
  type: "text" | "textarea" | "image"
}

const DEFAULT_SETTINGS: SiteSetting[] = [
  { key: "site_name", value: "", label: "站点名称", type: "text" },
  { key: "site_description", value: "", label: "站点描述", type: "textarea" },
  { key: "logo_url", value: "", label: "Logo URL", type: "image" },
  { key: "favicon_url", value: "", label: "Favicon URL", type: "image" },
  { key: "footer_text", value: "", label: "页脚文本", type: "textarea" },
  { key: "contact_email", value: "", label: "联系邮箱", type: "text" },
  { key: "beian", value: "", label: "备案号", type: "text" },
  { key: "google_analytics_id", value: "", label: "Google Analytics ID", type: "text" },
]

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

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">站点设置</h1>
        <Button onClick={handleSave} disabled={saving}>{saving ? "保存中..." : "保存所有设置"}</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>基本设置</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {settings.map((setting) => (
            <div key={setting.key} className="space-y-2">
              <Label>{setting.label}</Label>
              {setting.type === "textarea" ? (
                <Textarea
                  rows={3}
                  value={setting.value}
                  onChange={(e) => updateSetting(setting.key, e.target.value)}
                />
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={setting.value}
                    onChange={(e) => updateSetting(setting.key, e.target.value)}
                  />
                  {setting.type === "image" && setting.value && (
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded border">
                        <Image src={setting.value} alt={`${setting.key} 预览`} width={40} height={40} className="h-full w-full object-cover" unoptimized />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
