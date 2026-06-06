"use client"

import { useState, useMemo } from "react"
import { Search, HelpCircle, MessageCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FAQAccordion } from "./FAQAccordion"

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string | null
  sortOrder: number
}

interface FAQClientProps {
  grouped: Record<string, FAQItem[]>
  totalFAQs: number
}

export function FAQClient({ grouped, totalFAQs }: FAQClientProps) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    if (!query.trim()) return grouped

    const q = query.trim().toLowerCase()
    const result: Record<string, FAQItem[]> = {}

    for (const [category, items] of Object.entries(grouped)) {
      const matched = items.filter(
        (item) =>
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q)
      )
      if (matched.length > 0) {
        result[category] = matched
      }
    }

    return result
  }, [query, grouped])

  const hasResults = Object.keys(filtered).length > 0

  return (
    <>
      {/* Search */}
      <div className="relative mx-auto mt-8 max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="搜索常见问题..."
          className="pl-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={totalFAQs === 0}
        />
      </div>

      {/* FAQ Content */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {totalFAQs === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 py-24">
            <HelpCircle className="h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 text-lg font-medium text-muted-foreground">暂无常见问题</h3>
            <p className="mt-1 text-sm text-muted-foreground/60">常见问题正在整理中，请稍后再来</p>
          </div>
        ) : !hasResults ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 py-24">
            <Search className="h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 text-lg font-medium text-muted-foreground">未找到相关问题</h3>
            <p className="mt-1 text-sm text-muted-foreground/60">
              试试换个关键词搜索
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setQuery("")}
            >
              清除搜索
            </Button>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(filtered).map(([category, items]) => (
              <div key={category}>
                <h2 className="mb-4 text-xl font-semibold">{category}</h2>
                <FAQAccordion items={items} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Still have questions */}
      {(!query.trim() || hasResults) && (
        <section className="border-t border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <MessageCircle className="mx-auto h-10 w-10 text-gold/60" />
            <h2 className="mt-4 text-2xl font-bold">还有问题？</h2>
            <p className="mt-2 text-muted-foreground">
              没找到您想要的答案？请联系我们的客服团队
            </p>
            <Button className="mt-6 bg-gradient-gold text-white shadow-md shadow-gold/20">
              联系客服
            </Button>
          </div>
        </section>
      )}
    </>
  )
}
