import Link from "next/link"
import { ArrowRight, Send, Sparkles } from "lucide-react"
import { substackUrl, socialLinks } from "@/lib/constants"

export function AiSubscribeCTA({ compact = false }: { compact?: boolean }) {
  const telegram = socialLinks.find((link) => link.label === "Telegram")

  return (
    <section
      className={`not-prose rounded-2xl border border-border/60 bg-gradient-to-br from-gold/[0.06] to-card p-5 ${
        compact ? "my-6" : "my-8"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-1 text-[11px] font-medium text-gold-dark">
          <Sparkles className="h-3 w-3" />
          AI 工具与实战
        </span>
        <span className="text-[11px] text-muted-foreground">
          不追新闻，只做能直接用的内容
        </span>
      </div>
      <h2 className="mt-3 text-lg font-bold">想看更多 AI 工具和工作流？</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        新文章会先发在 Telegram 和 Substack；也可以直接回到 AI 栏目看已整理的内容。
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href="/ai"
          className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-4 text-xs font-semibold transition-colors hover:bg-muted"
        >
          进入 AI 栏目 <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Link>
        {telegram && (
          <a
            href={telegram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-4 text-xs font-semibold transition-colors hover:bg-muted"
          >
            <Send className="mr-1.5 h-3.5 w-3.5" /> Telegram
          </a>
        )}
        <a
          href={substackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-4 text-xs font-semibold transition-colors hover:bg-muted"
        >
          Substack
        </a>
      </div>
    </section>
  )
}
