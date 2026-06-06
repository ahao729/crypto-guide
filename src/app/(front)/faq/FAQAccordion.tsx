"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface FAQItem {
  id: string
  question: string
  answer: string
}

interface FAQAccordionProps {
  items: FAQItem[]
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="divide-y divide-border/40 rounded-xl border border-border/60">
      {items.map((item) => {
        const isOpen = openId === item.id
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-muted/30"
            >
              <span className="font-medium">{item.question}</span>
              <ChevronDown
                size={16}
                className={cn(
                  "shrink-0 text-muted-foreground transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                isOpen ? "max-h-[1000px]" : "max-h-0"
              )}
            >
              <div className="border-t border-border/40 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
