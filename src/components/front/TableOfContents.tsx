"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import type { TocEntry } from "@/lib/article-utils"

interface TableOfContentsProps {
  headings: TocEntry[]
}

const SCROLL_OFFSET = 80 // matches scroll-margin-top: 5rem on headings

function scrollToHeading(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET
  window.scrollTo({ top, behavior: "smooth" })
  window.history.pushState(null, "", `#${id}`)
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    )

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[]

    for (const el of elements) {
      observer.observe(el)
    }

    return () => {
      for (const el of elements) {
        observer.unobserve(el)
      }
    }
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav className="toc-nav">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        目录
      </h3>
      <ul className="space-y-1.5">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToHeading(h.id)
              }}
              className={cn(
                "toc-link block py-1 text-sm transition-colors hover:text-gold",
                h.level === 3 && "pl-4",
                activeId === h.id
                  ? "text-gold font-medium active"
                  : "text-muted-foreground"
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
