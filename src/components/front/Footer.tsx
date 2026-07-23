import Link from "next/link"
import { Send } from "lucide-react"
import { siteConfig, footerLinks, socialLinks } from "@/lib/constants"
import { SiteLogo } from "./SiteLogo"

function SocialIcon({ icon }: { icon: string }) {
  if (icon === "telegram") {
    return <Send className="h-4 w-4" />
  }

  if (icon === "substack") {
    return (
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path fill="#FF6719" d="M5 4h14v2.25H5V4Z" />
        <path fill="#FF6719" d="M5 8.35h14v2.25H5V8.35Z" />
        <path fill="#FF6719" d="M5 12.7h14v8.3l-7-4.05L5 21v-8.3Z" />
      </svg>
    )
  }

  return <span className="text-sm font-bold leading-none">X</span>
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Top section: logo + description + link groups */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <SiteLogo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
            <div className="mt-4 flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  title={link.label}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-gold/10 hover:text-gold"
                >
                  <SocialIcon icon={link.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border/40 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link href="/about#privacy" className="hover:text-gold">
              隐私政策
            </Link>
            <Link href="/about#terms" className="hover:text-gold">
              服务条款
            </Link>
            <a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-gold">
              联系我们
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
