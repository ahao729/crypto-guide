import { NextResponse } from "next/server"
import { fetchConversionRates } from "@/lib/market-api"
import { marketCache } from "@/lib/cache"

const CACHE_KEY = "conversion-rates"

/**
 * GET /api/market/rates
 *
 * Returns live conversion rates for major crypto and fiat currencies.
 * Cached briefly to keep the converter responsive without hammering providers.
 */
export async function GET(request: Request) {
  const forceRefresh =
    new URL(request.url).searchParams.get("_refresh") === "1"

  if (!forceRefresh) {
    const cached = marketCache.get(CACHE_KEY)
    if (cached) {
      return NextResponse.json(cached)
    }
  }

  try {
    const rates = await fetchConversionRates()
    const payload = {
      rates,
      updatedAt: new Date().toISOString(),
      source: "CryptoCompare",
    }

    marketCache.set(CACHE_KEY, payload, 30_000)
    return NextResponse.json(payload)
  } catch (err) {
    console.error("Market rates API error:", err)
    return NextResponse.json(
      { error: "Failed to fetch conversion rates" },
      { status: 502 }
    )
  }
}
