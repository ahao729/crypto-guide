import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { after } from "next/server"
import type { Metadata } from "next"
import { ONEKEY_AFFILIATE_URL } from "@/lib/affiliates"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

/**
 * Tracked outbound link for the OneKey hardware-wallet partnership.
 * Keeps the click log in the same place as exchange clicks, without adding a
 * client-side analytics dependency.
 */
export default async function OneKeyGoPage() {
  const headersList = await headers()

  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    null
  const userAgent = headersList.get("user-agent") || null
  const referer = headersList.get("referer") || null

  after(async () => {
    try {
      await prisma.clickLog.create({
        data: {
          targetId: "onekey",
          targetType: "partner",
          ip,
          userAgent,
          referer,
        },
      })
    } catch (error) {
      console.error("Failed to record OneKey click:", error)
    }
  })

  redirect(ONEKEY_AFFILIATE_URL)
}
