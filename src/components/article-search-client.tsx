"use client"

import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useCallback } from "react"

export function ArticleSearchClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentQ = searchParams?.get("q") ?? ""
  const [value, setValue] = useState(currentQ)

  // Sync value when URL changes (e.g. browser back/forward)
  useEffect(() => {
    setValue(currentQ)
  }, [currentQ])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const trimmed = value.trim()
      const params = new URLSearchParams()

      // Preserve existing category/tag params
      const category = searchParams?.get("category")
      const tag = searchParams?.get("tag")
      if (category) params.set("category", category)
      if (tag) params.set("tag", tag)
      if (trimmed) params.set("q", trimmed)

      const qs = params.toString()
      router.push(qs ? `/articles?${qs}` : "/articles")
    },
    [value, router, searchParams]
  )

  const handleClear = useCallback(() => {
    setValue("")
    const params = new URLSearchParams()
    const category = searchParams?.get("category")
    const tag = searchParams?.get("tag")
    if (category) params.set("category", category)
    if (tag) params.set("tag", tag)
    const qs = params.toString()
    router.push(qs ? `/articles?${qs}` : "/articles")
  }, [router, searchParams])

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold">搜索文章</h3>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索文章标题…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="border-border/60 bg-background pl-9 pr-8 text-sm focus-visible:ring-gold/30"
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
