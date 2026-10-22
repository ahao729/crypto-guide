import Link from "next/link"
import { ArrowUpRight, Wallet } from "lucide-react"
import {
  AFFILIATE_DISCLOSURE,
  ONEKEY_INVITE_CODE,
} from "@/lib/affiliates"

/**
 * Contextual hardware-wallet card for security/tool pages. Same pattern as
 * TradingViewCTA: a real, relevant partner rather than a site-wide banner.
 */
export function OneKeyCTA() {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-gold" />
            <h3 className="text-base font-semibold">硬件钱包：OneKey</h3>
            <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-medium text-gold-dark">
              邀请码 {ONEKEY_INVITE_CODE}
            </span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            长期持有或大额资产，建议把私钥放到硬件钱包；交易所只放交易用的资金。
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {AFFILIATE_DISCLOSURE}
          </p>
        </div>

        <Link
          href="/go/onekey?src=tools&placement=tools-card"
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          了解 OneKey
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}
