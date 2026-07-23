import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { siteConfig } from "@/lib/constants"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, ExternalLink, BookOpen, FileText, Wrench, Link2 } from "lucide-react"
import { ResourceActions } from "./ResourceActions"

export const revalidate = 3600 // 1 hour

const categoryConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  newbie: { label: "新手入门", icon: BookOpen, color: "text-blue-500" },
  template: { label: "模板表格", icon: FileText, color: "text-emerald-500" },
  tool: { label: "实用工具", icon: Wrench, color: "text-purple-500" },
  link: { label: "优秀资源", icon: Link2, color: "text-orange-500" },
}

export async function generateStaticParams() {
  const resources = await prisma.resource.findMany({ select: { slug: true } })
  return resources.map((r) => ({ slug: r.slug }))
}

interface ResourcePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ResourcePageProps): Promise<Metadata> {
  const { slug } = await params
  const resource = await prisma.resource.findUnique({
    where: { slug },
    select: { title: true, description: true },
  })

  if (!resource) return { title: "资源未找到" }

  return {
    title: `${resource.title} | ${siteConfig.shortName}`,
    description: resource.description?.slice(0, 160) || `${resource.title} - 加密货币学习资源`,
    openGraph: {
      title: resource.title,
      description: resource.description || undefined,
      url: `${siteConfig.url}/resources/${slug}`,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: resource.title,
      description: resource.description || undefined,
    },
    alternates: {
      canonical: `${siteConfig.url}/resources/${slug}`,
    },
  }
}

function getTags(tags: string | null): string[] {
  if (!tags) return []
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
}

export default async function ResourceDetailPage({ params }: ResourcePageProps) {
  const { slug } = await params

  const resource = await prisma.resource.findUnique({
    where: { slug },
  })

  if (!resource || !resource.published) {
    notFound()
  }

  const cfg = categoryConfig[resource.category] || {
    label: resource.category,
    icon: FileText,
    color: "text-gray-500",
  }
  const Icon = cfg.icon
  const tags = getTags(resource.tags)

  // 递增浏览量
  await prisma.resource.update({
    where: { id: resource.id },
    data: { downloadCount: { increment: 1 } },
  })

  return (
    <div className="min-h-screen">
      {/* 返回导航 */}
      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          返回资源列表
        </Link>
      </div>

      {/* 资源头部 */}
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold/15 to-gold/5">
            <Icon className={`h-7 w-7 ${cfg.color}`} />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {resource.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{cfg.label}</Badge>
              <Badge variant="outline">
                {resource.type === "file"
                  ? "文件下载"
                  : resource.type === "external"
                    ? "外部链接"
                    : "在线查看"}
              </Badge>
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Download className="h-3.5 w-3.5" />
                {resource.downloadCount.toLocaleString()} 次查看
              </span>
              {resource.fileSize && <span>文件大小：{resource.fileSize}</span>}
              <span>更新于 {formatDate(resource.updatedAt)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 资源描述 */}
      {resource.description && (
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-border/40 bg-muted/20 p-6">
            <p className="text-muted-foreground leading-relaxed">{resource.description}</p>
          </div>
        </section>
      )}

      {/* 资源内容 */}
      {resource.content && (
        <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div
            className="prose prose-neutral dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(resource.content) }}
          />
        </section>
      )}

      {/* 操作按钮 */}
      <ResourceActions
        resourceId={resource.id}
        resourceSlug={resource.slug}
        type={resource.type}
        externalUrl={resource.externalUrl}
        fileUrl={resource.fileUrl}
        fileSize={resource.fileSize}
      />
    </div>
  )
}

/** 简易 Markdown → HTML 渲染 */
function renderMarkdown(md: string): string {
  let html = md
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="rounded-lg bg-muted p-4 overflow-x-auto text-sm"><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="rounded bg-muted px-1.5 py-0.5 text-sm">$1</code>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-8 mb-4 pb-2 border-b border-border/40">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-gold hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gold/40 pl-4 italic text-muted-foreground">$1</blockquote>')
    .replace(/\n\n/g, '</p><p class="mt-4 leading-relaxed">')
    .replace(/\n/g, '<br />')

  return `<p class="leading-relaxed">${html}</p>`
}
