import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

interface GoPageProps {
  params: Promise<{ id: string }>
}

export default async function GoPage({ params }: GoPageProps) {
  const { id } = await params
  const headersList = await headers()

  // Find exchange by ID
  const exchange = await prisma.exchange.findUnique({
    where: { id },
  })

  if (!exchange || !exchange.referralUrl) {
    // Redirect to exchanges page if not found
    redirect("/exchanges")
  }

  // Record the click
  try {
    await prisma.clickLog.create({
      data: {
        targetId: exchange.id,
        targetType: "exchange",
        ip: headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || null,
        userAgent: headersList.get("user-agent") || null,
        referer: headersList.get("referer") || null,
      },
    })

    // Increment click count
    await prisma.exchange.update({
      where: { id: exchange.id },
      data: { clickCount: { increment: 1 } },
    })
  } catch {
    // Silently fail - don't block the redirect
  }

  // Redirect to the referral URL
  redirect(exchange.referralUrl)
}
