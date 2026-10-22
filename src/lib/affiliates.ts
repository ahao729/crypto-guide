/**
 * Affiliate links and the disclosure copy that must travel with them.
 *
 * Keep link definitions here (not scattered in pages) so we can swap IDs,
 * add tracking parameters, or remove a partner in one place. Any page that
 * renders one of these URLs must show `AFFILIATE_DISCLOSURE` nearby.
 */

export const TRADINGVIEW_AFFILIATE_URL =
  "https://cn.tradingview.com/?aff_id=1172955"

export const ONEKEY_AFFILIATE_URL = "https://onekey.so/r/BQZN1"
export const ONEKEY_INVITE_CODE = "BQZN1"

export const AFFILIATE_DISCLOSURE =
  "联盟链接：通过本站链接注册或购买，我们可能获得佣金，不影响你的价格。"

export const RISK_DISCLAIMER =
  "本文仅供信息参考，不构成投资建议。加密资产价格波动较大，请自行研究并承担风险。"

/**
 * Exchanges we currently have an affiliate agreement with.
 *
 * Only these slugs may ever receive an outbound affiliate click. Everything
 * else is treated as a catalog entry and linked to its official website, so a
 * stale/placeholder referral URL in the database can never leak traffic to a
 * third party.
 */
export const CORE_EXCHANGE_SLUGS = ["binance", "okx", "bybit"] as const
export const SECONDARY_EXCHANGE_SLUGS = ["gate-io", "aster", "bitget"] as const
export const PARTNER_EXCHANGE_SLUGS = [
  ...CORE_EXCHANGE_SLUGS,
  ...SECONDARY_EXCHANGE_SLUGS,
] as const

export type CoreExchangeSlug = (typeof CORE_EXCHANGE_SLUGS)[number]
export type SecondaryExchangeSlug = (typeof SECONDARY_EXCHANGE_SLUGS)[number]
export type PartnerExchangeSlug = (typeof PARTNER_EXCHANGE_SLUGS)[number]

export const CORE_EXCHANGE_META: Record<
  CoreExchangeSlug,
  { name: string; tagline: string; cta: string; code: string }
> = {
  binance: {
    name: "币安 Binance",
    tagline: "新手首选，深度与流动性最好",
    cta: "注册币安",
    code: "BQZN1",
  },
  okx: {
    name: "OKX",
    tagline: "Web3 钱包 + 低费率，适合进阶",
    cta: "注册 OKX",
    code: "ACDDQ6TW",
  },
  bybit: {
    name: "Bybit",
    tagline: "合约与跟单体验好",
    cta: "注册 Bybit",
    code: "BQZN1",
  },
}

export const SECONDARY_EXCHANGE_META: Record<
  SecondaryExchangeSlug,
  { name: string; tagline: string; cta: string; code: string }
> = {
  "gate-io": {
    name: "Gate.io",
    tagline: "币种多、上新快，适合找山寨与新币",
    cta: "注册 Gate.io",
    code: "VANGBG8NUQ",
  },
  aster: {
    name: "Aster",
    tagline: "链上永续与现货，连接钱包使用",
    cta: "访问 Aster",
    code: "1evT2I",
  },
  bitget: {
    name: "Bitget",
    tagline: "跟单与策略交易，适合复制交易",
    cta: "注册 Bitget",
    code: "X7QCEV4X",
  },
}

export function isExchangePartner(slug: string): boolean {
  return (PARTNER_EXCHANGE_SLUGS as readonly string[]).includes(slug)
}

/**
 * Official, non-affiliate destinations for catalog exchanges. Used when we do
 * not (yet) have a referral agreement, and as a safety net in /go.
 */
export const EXCHANGE_OFFICIAL_URLS: Record<string, string> = {
  binance: "https://www.binance.com/",
  okx: "https://www.okx.com/",
  bybit: "https://www.bybit.com/",
  bitget: "https://www.bitget.com/",
  "gate-io": "https://www.gate.io/",
  kucoin: "https://www.kucoin.com/",
  mexc: "https://www.mexc.com/",
  htx: "https://www.htx.com/",
  bingx: "https://bingx.com/",
  lbank: "https://www.lbank.com/",
  coinw: "https://www.coinw.com/",
  deepcoin: "https://www.deepcoin.com/",
  hyperliquid: "https://app.hyperliquid.xyz/trade",
  aster: "https://www.asterdex.com/",
}

export function getExchangeOfficialUrl(slug: string): string | null {
  return EXCHANGE_OFFICIAL_URLS[slug] ?? null
}

export interface ExchangeLinkTarget {
  href: string
  /** True when this is an external official website, not our /go redirect. */
  external: boolean
  /** True only for exchanges we earn a commission from. */
  affiliate: boolean
}

/**
 * Resolve where an exchange CTA should point.
 *
 * Partners go through /go/<slug> so clicks are tracked and the referral URL
 * lives in one place. Everyone else goes straight to their official site and
 * is rendered as a non-affiliate link by the caller.
 */
export function getExchangeLinkTarget(exchange: {
  slug: string
  referralUrl?: string | null
}): ExchangeLinkTarget | null {
  if (isExchangePartner(exchange.slug) && exchange.referralUrl) {
    return { href: `/go/${exchange.slug}`, external: false, affiliate: true }
  }

  const official = getExchangeOfficialUrl(exchange.slug)
  return official
    ? { href: official, external: true, affiliate: false }
    : null
}
