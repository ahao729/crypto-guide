import Link from "next/link"
import { Send } from "lucide-react"
import { siteConfig, footerLinks, socialLinks } from "@/lib/constants"
import { SiteLogo } from "./SiteLogo"

function SocialIcon({ icon }: { icon: string }) {
  if (icon === "telegram") {
    return <Send className="h-4 w-4" />
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
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-gold">
              隐私政策
            </Link>
            <Link href="/terms" className="hover:text-gold">
              服务条款
            </Link>
            <Link href="/disclosure" className="hover:text-gold">
              联盟披露/风险提示
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
