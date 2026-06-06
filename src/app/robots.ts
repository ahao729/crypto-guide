import { siteConfig } from "@/lib/constants"
import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/exchanges", "/exchanges/", "/articles", "/articles/", "/faq", "/about", "/tools"],
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
