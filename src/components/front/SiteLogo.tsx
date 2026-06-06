import Link from "next/link"
import { siteConfig } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface SiteLogoProps {
  showText?: boolean
  className?: string
  iconOnly?: boolean
  link?: boolean
}

export function SiteLogo({
  showText = true,
  className,
  iconOnly = false,
  link = true,
}: SiteLogoProps) {
  const content = (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Logo icon - abstract BTC/hexagon shape */}
      <div className="relative flex h-8 w-8 items-center justify-center">
        <div className="absolute inset-0 rotate-45 rounded-lg bg-gradient-gold" />
        <span className="relative text-sm font-bold text-white">B</span>
      </div>

      {!iconOnly && showText && (
        <span className="text-xl font-bold tracking-tight">
          <span className="text-gradient-gold">{siteConfig.shortName}</span>
        </span>
      )}
    </div>
  )

  if (link) {
    return <Link href="/">{content}</Link>
  }

  return content
}
