"use client"

import { useState, useCallback } from "react"

interface ArticleContentProps {
  html: string
}

const articleVisualStyles = `
  .article-content figure {
    margin: 2em 0 2.35em;
    padding: 0.85rem 1.5rem;
    border: 1px solid color-mix(in oklch, var(--gold) 18%, var(--border));
    border-radius: var(--radius-xl);
    background:
      linear-gradient(180deg, color-mix(in oklch, var(--gold) 7%, transparent), transparent 44%),
      var(--card);
    box-shadow: 0 18px 46px rgba(15, 23, 42, 0.07);
  }

  .article-content figure img {
    width: 100%;
    max-height: 600px;
    object-fit: contain;
    margin: 0 auto;
    border-radius: var(--radius-lg);
    box-shadow: none;
  }

  .article-content figcaption {
    margin: 0.85rem auto 0;
    max-width: 42rem;
    text-align: center;
    color: color-mix(in oklch, var(--foreground) 72%, var(--muted-foreground));
    font-size: 0.92rem;
    line-height: 1.6;
  }
`

export default function ArticleContent({ html }: ArticleContentProps) {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null)

  const handleCopyCode = useCallback(async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCodeIndex(index)
      setTimeout(() => setCopiedCodeIndex(null), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement("textarea")
      textarea.value = code
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopiedCodeIndex(index)
      setTimeout(() => setCopiedCodeIndex(null), 2000)
    }
  }, [])

  // Wrap tables in scrollable containers
  const wrapTables = useCallback((node: HTMLDivElement) => {
    const tables = node.querySelectorAll<HTMLTableElement>(
      ".article-content table"
    )
    tables.forEach((table) => {
      // Skip if already wrapped
      if (table.closest(".table-wrapper")) return

      const wrapper = document.createElement("div")
      wrapper.className = "table-wrapper"
      table.parentNode?.insertBefore(wrapper, table)
      wrapper.appendChild(table)
    })
  }, [])

  // Inject copy buttons into code blocks via ref-based DOM callback
  const handleContentRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return

      // Wrap tables first
      wrapTables(node)

      const preElements = node.querySelectorAll<HTMLPreElement>(
        ".article-content pre"
      )
      preElements.forEach((pre, index) => {
        // Skip if already processed
        if (pre.dataset.processed) return
        pre.dataset.processed = "true"

        // Create wrapper
        const wrapper = document.createElement("div")
        wrapper.className = "code-block-wrapper"
        pre.parentNode?.insertBefore(wrapper, pre)
        wrapper.appendChild(pre)

        // Extract language if present in class
        const codeEl = pre.querySelector("code")
        let language = ""
        if (codeEl) {
          const langMatch = Array.from(codeEl.classList)
            .find((c) => c.startsWith("language-") || c.startsWith("lang-"))
          if (langMatch) {
            language = langMatch.replace(/^language-|^lang-/, "")
          }
        }

        // Create header
        const header = document.createElement("div")
        header.className = "code-header"
        header.innerHTML = `
          <span>${language || "code"}</span>
          <button class="copy-button" data-index="${index}" type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            ${copiedCodeIndex === index ? "已复制" : "复制"}
          </button>
        `

        pre.parentNode?.insertBefore(header, pre)

        // Bind copy button
        const btn = header.querySelector(".copy-button") as HTMLButtonElement
        btn?.addEventListener("click", () => {
          const code = pre.textContent || ""
          handleCopyCode(code, index)
        })
      })

      // Update button states when copiedCodeIndex changes
      preElements.forEach((pre) => {
        const header = pre.parentElement?.querySelector(".code-header") as HTMLElement
        if (!header) return
        const btn = header.querySelector(".copy-button") as HTMLButtonElement
        if (!btn) return
        const idx = parseInt(btn.dataset.index || "-1")
        if (idx === copiedCodeIndex) {
          btn.classList.add("copied")
          btn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            已复制
          `
        } else {
          btn.classList.remove("copied")
          btn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            复制
          `
        }
      })
    },
    [copiedCodeIndex, handleCopyCode]
  )

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: articleVisualStyles }} />
      <div
        ref={handleContentRef}
        className="article-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  )
}
