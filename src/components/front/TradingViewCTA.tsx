import Link from "next/link"
import { ExternalLink } from "lucide-react"
import {
  AFFILIATE_DISCLOSURE,
  TRADINGVIEW_AFFILIATE_URL,
} from "@/lib/affiliates"

/**
 * Contextual partner card. Rendered on chart/tool pages where TradingView is
 * genuinely relevant; it is not a generic site-wide banner.
 */
export function TradingViewCTA() {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-base font-semibold">专业图表：TradingView</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            多周期 K 线、技术指标、画线和自选列表。本站图表适合快速查看，复杂分析可以在
            TradingView 完成。
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {AFFILIATE_DISCLOSURE}
            <Link href="/disclosure" className="ml-1 underline hover:text-gold">
              了解详情
            </Link>
          </p>
        </div>

        <a
          href={TRADINGVIEW_AFFILIATE_URL}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          打开 TradingView
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  )
}
