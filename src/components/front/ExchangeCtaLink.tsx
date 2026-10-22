import Link from "next/link"
import type { ReactNode } from "react"
import { getExchangeLinkTarget } from "@/lib/affiliates"

interface ExchangeCtaLinkProps {
  exchange: { slug: string; referralUrl?: string | null }
  className?: string
  children: ReactNode
}

/**
 * Renders a partner exchange CTA through /go (tracked, affiliate) and a
 * catalog exchange CTA straight to its official site (untracked, non-affiliate).
 */
export function ExchangeCtaLink({
  exchange,
  className,
  children,
}: ExchangeCtaLinkProps) {
  const target = getExchangeLinkTarget(exchange)
  if (!target) return null

  if (target.external) {
    return (
      <a
        href={target.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    )
  }

  return (
    <Link
      href={target.href}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className={className}
    >
      {children}
    </Link>
  )
}
