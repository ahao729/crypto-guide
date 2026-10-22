import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { after } from "next/server"
import type { Metadata } from "next"
import {
  getExchangeOfficialUrl,
  isExchangePartner,
} from "@/lib/affiliates"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

interface GoPageProps {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ src?: string; placement?: string }>
}

function cleanAttribution(value: string | undefined) {
  return value?.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 50) || null
}

export default async function GoPage({ params, searchParams }: GoPageProps) {
  const { id } = await params
  const { src, placement } = searchParams ? await searchParams : {}
  const source = cleanAttribution(src)
  const clickPlacement = cleanAttribution(placement)
  const headersList = await headers()

  // Accept both the database id and the slug. Slugs make the outbound link
  // readable (/go/binance) and let us swap ids without breaking old links.
  const exchange = await prisma.exchange.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
    },
  })

  if (!exchange) {
    redirect("/exchanges")
  }

  // Safety net: catalog exchanges must never receive an affiliate redirect,
  // even if a stale/placeholder referral URL is still stored in the database.
  if (!isExchangePartner(exchange.slug)) {
    redirect(getExchangeOfficialUrl(exchange.slug) ?? "/exchanges")
  }

  if (!exchange.referralUrl) {
    redirect(getExchangeOfficialUrl(exchange.slug) ?? "/exchanges")
  }

  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    null
  const userAgent = headersList.get("user-agent") || null
  const referer = headersList.get("referer") || null
  const referralUrl = exchange.referralUrl
  const exchangeId = exchange.id

  // Record the click after the redirect has been sent. Waiting for these
  // writes before redirecting added 1-2s of latency to every affiliate click.
  after(async () => {
    try {
      await prisma.$transaction([
        prisma.clickLog.create({
          data: {
            targetId: exchangeId,
            targetType: "exchange",
            ip,
            userAgent,
            referer,
            source,
            placement: clickPlacement,
          },
        }),
        prisma.exchange.update({
          where: { id: exchangeId },
          data: { clickCount: { increment: 1 } },
        }),
      ])
    } catch (error) {
      console.error("Failed to record affiliate click:", error)
    }
  })

  redirect(referralUrl)
}
