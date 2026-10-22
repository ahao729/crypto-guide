import Link from "next/link"
import { ArrowUpRight, ShieldCheck, Wallet } from "lucide-react"
import {
  AFFILIATE_DISCLOSURE,
  CORE_EXCHANGE_META,
  ONEKEY_INVITE_CODE,
  SECONDARY_EXCHANGE_META,
  type CoreExchangeSlug,
  type SecondaryExchangeSlug,
} from "@/lib/affiliates"

interface PartnerCTAProps {
  title: string
  categorySlug?: string | null
  /** "top" is compact; "bottom" adds a little more context. */
  placement?: "top" | "inline" | "bottom"
}

type CtaKind = "wallet" | "contract" | "dex" | "copy" | "exchange"

function pickKind(title: string, categorySlug?: string | null) {
  // Tags are intentionally excluded from the main decision: a generic tag such
  // as "安全" should not turn a tax article into a hardware-wallet CTA.
  const core = `${title} ${categorySlug ?? ""}`.toLowerCase()

  // DEX first: a title can contain "永续" without being a CEX contract page.
  if (/dex|去中心化|链上|hyperliquid|aster/.test(core)) {
    return "dex" as const
  }

  // Copy-trading pages should point at the copy-trading partner.
  if (/跟单|copy.?trading/.test(core)) {
    return "copy" as const
  }

  // Fee-comparison pages should default to exchanges, not trading bots.
  if (/手续费|费率|交易成本/.test(core)) {
    return "exchange" as const
  }

  // Onboarding pages should default to exchanges, even if one of their tags
  // happens to contain "安全".
  if (/注册|开户|入金|充值|邀请码|新手/.test(core)) {
    return "exchange" as const
  }
  if (/钱包|私钥|助记词|防盗|冷钱包|wallet|security|安全/.test(core)) {
    return "wallet" as const
  }
  if (/合约|网格|套利|永续|策略|futures|grid/.test(core)) {
    return "contract" as const
  }
  return "exchange" as const
}

const copy: Record<CtaKind, { heading: string; sub: string }> = {
  wallet: {
    heading: "先保管好私钥，再开始交易",
    sub: "硬件钱包适合长期持有；交易所适合先完成第一笔买卖。按自己的阶段选。",
  },
  contract: {
    heading: "合约和跟单，先选顺手的平台",
    sub: "新手先用低杠杆熟悉规则；跟单前先看历史回撤，不只看收益。",
  },
  dex: {
    heading: "链上交易，先准备好钱包",
    sub: "DEX 不代保管资产；连接钱包前核对域名，先用小额测试。",
  },
  copy: {
    heading: "跟单之前，先选对平台",
    sub: "先看交易员的历史回撤和跟单费率，不要只看收益榜；跟单也会亏钱。",
  },
  exchange: {
    heading: "开始之前，先选好交易所",
    sub: "第一次注册优先看流动性、费率和出入金体验；别只看邀请码。",
  },
}

function ExchangeCard({
  slug,
  placement,
}: {
  slug: CoreExchangeSlug
  placement: string
}) {
  const meta = CORE_EXCHANGE_META[slug]

  return (
    <div className="rounded-xl border border-border/60 bg-background/70 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold">{meta.name}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            {meta.tagline}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-medium text-gold-dark">
          邀请码 {meta.code}
        </span>
      </div>
      <Link
        href={`/go/${slug}?src=article&placement=${placement}`}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="mt-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-gold px-3 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110"
      >
        {meta.cta}
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}

function SecondaryExchangeCard({
  slug,
  placement,
}: {
  slug: SecondaryExchangeSlug
  placement: string
}) {
  const meta = SECONDARY_EXCHANGE_META[slug]

  return (
    <div className="rounded-xl border border-border/60 bg-background/70 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold">{meta.name}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            {meta.tagline}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-medium text-gold-dark">
          邀请码 {meta.code}
        </span>
      </div>
      <Link
        href={`/go/${slug}?src=article&placement=${placement}`}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="mt-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-gold px-3 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110"
      >
        {meta.cta}
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}

function OneKeyCard({ placement }: { placement: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/70 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2">
          <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <div>
            <p className="font-semibold">OneKey 硬件钱包</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              私钥自己保管，支持多链；适合长期持有和大额资产。
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-medium text-gold-dark">
          邀请码 {ONEKEY_INVITE_CODE}
        </span>
      </div>
      <Link
        href={`/go/onekey?src=article&placement=${placement}`}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="mt-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-gold px-3 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110"
      >
        购买 OneKey
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}

export function PartnerCTA({
  title,
  categorySlug,
  placement = "top",
}: PartnerCTAProps) {
  const kind = pickKind(title, categorySlug)
  const heading = copy[kind].heading
  const sub = copy[kind].sub

  const body =
    kind === "wallet" ? (
      <>
        <OneKeyCard placement={placement} />
        <ExchangeCard slug="binance" placement={placement} />
      </>
    ) : kind === "copy" ? (
      <>
        <SecondaryExchangeCard slug="bitget" placement={placement} />
        <ExchangeCard slug="bybit" placement={placement} />
      </>
    ) : kind === "contract" ? (
      <>
        <ExchangeCard slug="bybit" placement={placement} />
        <ExchangeCard slug="binance" placement={placement} />
      </>
    ) : kind === "dex" ? (
      <>
        <SecondaryExchangeCard slug="aster" placement={placement} />
        <OneKeyCard placement={placement} />
      </>
    ) : (
      <>
        <ExchangeCard slug="binance" placement={placement} />
        <ExchangeCard slug="okx" placement={placement} />
      </>
    )

  return (
    <section className="not-prose my-8 rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/[0.06] to-card p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-1 text-[11px] font-medium text-gold-dark">
          <ShieldCheck className="h-3 w-3" />
          合作推荐 · 含联盟链接
        </span>
        <span className="text-[11px] text-muted-foreground">
          通过本站链接注册或购买，我们可能获得佣金
        </span>
      </div>

      <h3 className="mt-3 text-lg font-semibold">{heading}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{sub}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">{body}</div>

      {placement === "bottom" && (
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          还没决定？先看{" "}
          <Link href="/exchanges" className="underline hover:text-gold">
            交易所对比
          </Link>
          {kind === "exchange" && (
            <>
              {" "}
              或{" "}
              <Link
                href="/compare/binance-vs-okx"
                className="underline hover:text-gold"
              >
                币安 vs OKX 对比
              </Link>
            </>
          )}{" "}
          或{" "}
          <Link href="/faq" className="underline hover:text-gold">
            常见问题
          </Link>
          ，再决定要不要注册。
        </p>
      )}

      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
        {AFFILIATE_DISCLOSURE}
      </p>
    </section>
  )
}
