import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, ExternalLink, ShieldAlert } from "lucide-react"
import { siteConfig } from "@/lib/constants"
import { AFFILIATE_DISCLOSURE } from "@/lib/affiliates"
import {
  brandsByCategory,
  ecosystemBrands,
  ecosystemCategories,
  getEcosystemBrand,
  type EcosystemCategory,
} from "@/lib/ecosystem"
import { BrandMark } from "@/components/front/BrandMark"

export const dynamicParams = false

export function generateStaticParams() {
  return ecosystemBrands.map((brand) => ({
    category: brand.category,
    slug: brand.slug,
  }))
}

function isCategory(value: string): value is EcosystemCategory {
  return value === "wallet" || value === "bridge" || value === "oracle"
}

interface BrandPageProps {
  params: Promise<{ category: string; slug: string }>
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { category, slug } = await params
  const brand = getEcosystemBrand(category, slug)
  if (!brand) return { title: "工具未找到" }

  const title = `${brand.name} 是什么？功能、支持链与风险`
  return {
    title,
    description: `${brand.tagline}。${brand.summary}`,
    alternates: { canonical: `${siteConfig.url}/ecosystem/${brand.category}/${brand.slug}` },
    openGraph: {
      title,
      description: `${brand.tagline}。${brand.summary}`,
      url: `${siteConfig.url}/ecosystem/${brand.category}/${brand.slug}`,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "article",
    },
  }
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { category, slug } = await params
  if (!isCategory(category)) notFound()
  const brand = getEcosystemBrand(category, slug)
  if (!brand) notFound()

  const meta = ecosystemCategories[brand.category]
  const related = brandsByCategory(brand.category)
    .filter((item) => item.slug !== brand.slug)
    .slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}/ecosystem/${brand.category}/${brand.slug}`,
    name: `${brand.name} 是什么？`,
    description: brand.summary,
    url: `${siteConfig.url}/ecosystem/${brand.category}/${brand.slug}`,
    inLanguage: siteConfig.locale,
    isPartOf: { "@id": siteConfig.url },
    about: {
      "@type": "Thing",
      name: brand.name,
      description: brand.tagline,
    },
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-gold">首页</Link>
          <span>/</span>
          <Link href="/ecosystem" className="hover:text-gold">基础设施</Link>
          <span>/</span>
          <Link href={`/ecosystem#${brand.category}`} className="hover:text-gold">
            {meta.plural}
          </Link>
          <span>/</span>
          <span className="text-foreground">{brand.name}</span>
        </nav>

        <header className="mt-8 rounded-3xl border border-border/60 bg-gradient-to-br from-gold/[0.07] via-card to-card p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="flex items-start gap-4">
              <BrandMark brand={brand} size="lg" />
              <div>
                <span className="text-xs font-medium text-gold">{meta.label}</span>
                <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                  {brand.name}
                </h1>
                <p className="mt-2 text-muted-foreground">{brand.tagline}</p>
              </div>
            </div>
            <a
              href={brand.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-semibold transition-colors hover:bg-muted"
            >
              官方网站 <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {brand.summary}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {brand.chains.map((chain) => (
              <span
                key={chain}
                className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground"
              >
                {chain}
              </span>
            ))}
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[340px_1fr] lg:items-start">
          <figure>
            {brand.screenshot.kind === "phone" ? (
              <div className="mx-auto w-[240px] rounded-[2rem] border-4 border-foreground/10 bg-black p-1.5 shadow-xl">
                <div className="relative aspect-[9/19] overflow-hidden rounded-[1.5rem] bg-muted">
                  <Image
                    src={brand.screenshot.src}
                    alt={brand.screenshot.alt}
                    fill
                    sizes="240px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            ) : (
              <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-sm">
                <Image
                  src={brand.screenshot.src}
                  alt={brand.screenshot.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 340px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <figcaption className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
              {brand.screenshot.caption}
              <br />
              <a
                href={brand.screenshot.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:underline"
              >
                来源：{brand.screenshot.sourceLabel} ↗
              </a>
            </figcaption>
          </figure>

          <div>
            <h2 className="text-xl font-bold">常见使用场景</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {brand.useCases.map((useCase) => (
                <div
                  key={useCase.title}
                  className="rounded-xl border border-border/60 bg-card p-4"
                >
                  <h3 className="text-sm font-semibold">{useCase.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {useCase.description}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
              截图仅作产品界面示意，实际界面、功能和地区支持可能已更新；请以官方页面为准。
            </p>
            {brand.category === "wallet" && (
              <Link
                href="/articles/wallet-security-visual-guide"
                className="mt-3 inline-flex items-center text-xs font-medium text-gold"
              >
                看钱包安全设置步骤图 <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            )}
            {brand.category === "bridge" && (
              <Link
                href="/articles/bridge-small-test-visual-guide"
                className="mt-3 inline-flex items-center text-xs font-medium text-gold"
              >
                看跨链桥小额测试步骤图 <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-border/60 bg-card p-6">
              <h2 className="text-xl font-bold">关键信息</h2>
              <dl className="mt-4 divide-y divide-border/40 text-sm">
                <div className="grid gap-1 py-3 sm:grid-cols-[120px_1fr]">
                  <dt className="text-muted-foreground">类型</dt>
                  <dd>{brand.type}</dd>
                </div>
                <div className="grid gap-1 py-3 sm:grid-cols-[120px_1fr]">
                  <dt className="text-muted-foreground">支持网络</dt>
                  <dd>{brand.chains.join("、")}</dd>
                </div>
                <div className="grid gap-1 py-3 sm:grid-cols-[120px_1fr]">
                  <dt className="text-muted-foreground">官方入口</dt>
                  <dd className="truncate">
                    <a
                      href={brand.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:underline"
                    >
                      {brand.officialUrl.replace("https://", "")}
                    </a>
                  </dd>
                </div>
                {brand.docsUrl && (
                  <div className="grid gap-1 py-3 sm:grid-cols-[120px_1fr]">
                    <dt className="text-muted-foreground">开发文档</dt>
                    <dd className="truncate">
                      <a
                        href={brand.docsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold hover:underline"
                      >
                        {brand.docsUrl.replace("https://", "")}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </section>

            <section className="rounded-2xl border border-border/60 bg-card p-6">
              <h2 className="text-xl font-bold">主要功能</h2>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                {brand.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-gold/25 bg-gold/[0.04] p-6">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-gold" />
                <h2 className="text-xl font-bold">风险与注意事项</h2>
              </div>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                {brand.risks.map((risk) => (
                  <li key={risk}>• {risk}</li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                本页只做信息整理，不是官方文档，也不构成投资建议；功能、费率和地区支持以官方页面为准。
              </p>
            </section>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <h2 className="text-base font-bold">先读入门文章</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                了解这一类工具怎么选、常见风险和操作顺序，再访问官网。
              </p>
              <Link
                href={`/articles/${brand.articleSlug}`}
                className="mt-3 inline-flex items-center text-sm font-medium text-gold"
              >
                阅读指南 <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-2xl border border-gold/25 bg-gold/[0.04] p-5">
              <h2 className="text-base font-bold">准备开始？</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                先通过币安准备 ETH/SOL 等 Gas 资产，再小额转到钱包或测试跨链。
              </p>
              <Link
                href="/go/binance?src=ecosystem&placement=brand"
                className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-lg bg-gradient-gold px-4 text-sm font-semibold text-white shadow-sm"
              >
                注册币安 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                {AFFILIATE_DISCLOSURE}
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <h2 className="text-base font-bold">同类工具</h2>
              <div className="mt-3 space-y-2">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/ecosystem/${item.category}/${item.slug}`}
                    className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    <span>{item.name}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-8">
          <Link
            href="/ecosystem"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> 返回基础设施地图
          </Link>
        </div>
      </div>
    </div>
  )
}
