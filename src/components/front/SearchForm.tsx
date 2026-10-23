"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { ArrowRight, Search } from "lucide-react"

interface SuggestionData {
  query: string
  articles: {
    slug: string
    title: string
    excerpt: string | null
    category: { name: string } | null
  }[]
  exchanges: { slug: string; name: string; rating: number }[]
  brands: { slug: string; category: string; name: string; tagline: string }[]
}

export function SearchForm({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter()
  const [value, setValue] = useState(initialQuery)
  const [data, setData] = useState<SuggestionData | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!initialQuery) inputRef.current?.focus()
  }, [initialQuery])

  useEffect(() => {
    const q = value.trim()
    if (q.length < 2) {
      setData(null)
      setOpen(false)
      setLoading(false)
      return
    }

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error("Search failed")
        const result = (await response.json()) as SuggestionData
        setData(result)
        setOpen(true)
      } catch (error) {
        if ((error as Error).name !== "AbortError") setData(null)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 220)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [value])

  const goToResults = (q = value) => {
    const query = q.trim()
    if (!query) return
    setOpen(false)
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  const hasResults =
    !!data &&
    (data.articles.length > 0 || data.exchanges.length > 0 || data.brands.length > 0)

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        goToResults()
      }}
      role="search"
      className="relative mt-6"
    >
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            id="q"
            name="q"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onFocus={() => {
              if (data && value.trim().length >= 2) setOpen(true)
            }}
            onBlur={() => {
              closeTimer.current = setTimeout(() => setOpen(false), 160)
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") setOpen(false)
            }}
            placeholder="例如：币安注册、Meme、LayerZero、RWA"
            autoComplete="off"
            role="combobox"
            aria-expanded={open}
            aria-controls="search-suggestions"
            aria-autocomplete="list"
            className="h-11 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm outline-none transition-colors focus:border-gold/50"
          />
        </div>
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-gold px-5 text-sm font-semibold text-white shadow-sm"
        >
          搜索
        </button>
      </div>

      {open && (
        <div
          id="search-suggestions"
          className="absolute left-0 right-0 top-full z-40 mt-2 max-h-[70vh] overflow-y-auto rounded-xl border border-border/60 bg-background/95 p-2 shadow-xl backdrop-blur-xl"
          onMouseDown={() => {
            if (closeTimer.current) clearTimeout(closeTimer.current)
          }}
        >
          {loading && !data ? (
            <p className="px-3 py-4 text-sm text-muted-foreground">搜索中…</p>
          ) : !hasResults ? (
            <p className="px-3 py-4 text-sm text-muted-foreground">
              没有匹配结果，按回车搜索全部内容。
            </p>
          ) : (
            <>
              {data.articles.length > 0 && (
                <div className="mb-1">
                  <p className="px-3 py-1.5 text-[10px] font-medium tracking-wider text-muted-foreground">
                    文章
                  </p>
                  {data.articles.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/articles/${article.slug}`}
                      className="block rounded-lg px-3 py-2 hover:bg-muted"
                    >
                      <div className="text-sm font-medium">{article.title}</div>
                      {article.category && (
                        <div className="mt-0.5 text-[11px] text-muted-foreground">
                          {article.category.name}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              )}

              {data.exchanges.length > 0 && (
                <div className="mb-1">
                  <p className="px-3 py-1.5 text-[10px] font-medium tracking-wider text-muted-foreground">
                    交易所
                  </p>
                  {data.exchanges.map((exchange) => (
                    <Link
                      key={exchange.slug}
                      href={`/exchanges/${exchange.slug}`}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-muted"
                    >
                      <span>{exchange.name}</span>
                      <span className="text-xs text-gold">{exchange.rating.toFixed(1)}</span>
                    </Link>
                  ))}
                </div>
              )}

              {data.brands.length > 0 && (
                <div className="mb-1">
                  <p className="px-3 py-1.5 text-[10px] font-medium tracking-wider text-muted-foreground">
                    基础设施
                  </p>
                  {data.brands.map((brand) => (
                    <Link
                      key={`${brand.category}-${brand.slug}`}
                      href={`/ecosystem/${brand.category}/${brand.slug}`}
                      className="block rounded-lg px-3 py-2 hover:bg-muted"
                    >
                      <div className="text-sm font-medium">{brand.name}</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">
                        {brand.tagline}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => goToResults()}
                className="flex w-full items-center justify-between rounded-lg border-t border-border/40 px-3 py-2.5 text-xs font-medium text-gold hover:bg-muted"
              >
                查看全部结果
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      )}
    </form>
  )
}
