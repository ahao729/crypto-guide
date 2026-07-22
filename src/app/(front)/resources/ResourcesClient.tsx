"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Download,
  ExternalLink,
  FileText,
  BookOpen,
  Wrench,
  Link2,
  Star,
  Eye,
  Filter,
  Grid3X3,
  List,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ── Types ──

interface Resource {
  id: string
  title: string
  description: string | null
  content: string | null
  category: string
  type: string
  fileUrl: string | null
  fileSize: string | null
  externalUrl: string | null
  icon: string | null
  tags: string | null
  downloadCount: number
  sortOrder: number
  published: boolean
  createdAt: Date
  updatedAt: Date
}

interface ResourcesClientProps {
  categoryGroups: Record<string, Resource[]>
  totalDownloads: number
  totalCount: number
}

// ── Category Config ──

const categoryConfig: Record<
  string,
  { label: string; icon: React.ElementType; color: string }
> = {
  newbie: {
    label: "新手入门",
    icon: BookOpen,
    color: "text-blue-500",
  },
  template: {
    label: "模板表格",
    icon: FileText,
    color: "text-emerald-500",
  },
  tool: {
    label: "实用工具",
    icon: Wrench,
    color: "text-purple-500",
  },
  link: {
    label: "优秀资源",
    icon: Link2,
    color: "text-orange-500",
  },
}

// ── Helpers ──

function formatFileSize(size: string | null): string {
  if (!size) return ""
  return size
}

function getTags(tags: string | null): string[] {
  if (!tags) return []
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
}

// ── Component ──

export function ResourcesClient({
  categoryGroups,
  totalDownloads,
  totalCount,
}: ResourcesClientProps) {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"default" | "downloads" | "newest">(
    "default"
  )

  const categoryKeys = Object.keys(categoryGroups)

  const allResources = useMemo(() => {
    const flat: Resource[] = []
    for (const key of categoryKeys) {
      flat.push(...categoryGroups[key])
    }
    return flat
  }, [categoryGroups, categoryKeys])

  const filteredResources = useMemo(() => {
    let resources =
      activeCategory === "all" ? allResources : categoryGroups[activeCategory] || []

    // Search
    if (search) {
      const q = search.toLowerCase()
      resources = resources.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q)) ||
          (r.tags && r.tags.toLowerCase().includes(q))
      )
    }

    // Sort
    if (sortBy === "downloads") {
      resources = [...resources].sort((a, b) => b.downloadCount - a.downloadCount)
    } else if (sortBy === "newest") {
      resources = [...resources].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    }

    return resources
  }, [activeCategory, search, allResources, categoryGroups, sortBy])

  const handleDownload = async (resource: Resource) => {
    if (resource.type === "external" && resource.externalUrl) {
      window.open(resource.externalUrl, "_blank", "noopener,noreferrer")
      return
    }

    if (resource.type === "page" && resource.id) {
      window.open(`/resources/${resource.id}`, "_blank")
      return
    }

    if (resource.fileUrl) {
      // Track download
      try {
        await fetch(`/api/resources/${resource.id}/download`, { method: "POST" })
      } catch {
        // silent
      }
      window.open(resource.fileUrl, "_blank")
      return
    }

    alert("暂无可下载文件")
  }

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/[0.08] via-transparent to-transparent" />
        <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-gold/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-gold-dark shadow-lg shadow-gold/20">
              <Download className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              资源
              <span className="text-gradient-gold ml-2">下载</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              新手教程、模板表格、实用工具、精选资源——免费下载助您快速入门加密世界
            </p>

            {/* Stats */}
            <div className="mt-8 flex items-center justify-center gap-8 text-sm">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-gold">{totalCount}</span>
                <span className="text-muted-foreground">精选资源</span>
              </div>
              <div className="h-8 w-px bg-border/60" />
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-gold">{totalDownloads.toLocaleString()}</span>
                <span className="text-muted-foreground">累计下载</span>
              </div>
              <div className="h-8 w-px bg-border/60" />
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-gold">{categoryKeys.length}</span>
                <span className="text-muted-foreground">资源分类</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filters ── */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索资源名称、描述或标签…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Sort */}
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">默认排序</SelectItem>
                <SelectItem value="downloads">下载最多</SelectItem>
                <SelectItem value="newest">最新发布</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-border/60 p-0.5">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Tabs ── */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              activeCategory === "all"
                ? "bg-gradient-gold text-white shadow-md shadow-gold/20"
                : "bg-muted/50 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            全部
            <span className="ml-0.5 text-xs opacity-70">{totalCount}</span>
          </button>
          {categoryKeys.map((key) => {
            const cfg = categoryConfig[key] || { label: key, icon: FileText, color: "text-gray-500" }
            const Icon = cfg.icon
            const count = (categoryGroups[key] || []).length
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  activeCategory === key
                    ? "bg-gradient-gold text-white shadow-md shadow-gold/20"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {cfg.label}
                <span className="ml-0.5 text-xs opacity-70">{count}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Resource List ── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {filteredResources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-full bg-muted/50 p-4">
              <Search className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">暂无匹配的资源</p>
            <p className="mt-1 text-sm text-muted-foreground/70">尝试更换搜索关键词或切换分类</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onDownload={handleDownload}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredResources.map((resource) => (
              <ResourceListItem
                key={resource.id}
                resource={resource}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">有好的资源推荐？</h2>
          <p className="mt-2 text-muted-foreground">
            如果您发现了优质的加密货币学习资源，欢迎分享给我们
          </p>
          <a
            href="mailto:hello@bqzn.top"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-gradient-gold px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-gold/20 transition-opacity hover:opacity-90"
          >
            推荐资源
          </a>
        </div>
      </section>
    </div>
  )
}

// ── Card Subcomponents ──

function ResourceCard({
  resource,
  onDownload,
}: {
  resource: Resource
  onDownload: (r: Resource) => void
}) {
  const cfg = categoryConfig[resource.category] || {
    label: resource.category,
    icon: FileText,
    color: "text-gray-500",
  }
  const Icon = cfg.icon
  const tags = getTags(resource.tags)

  return (
    <Card className="group relative flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gold/10 to-gold/5">
            <Icon className={`h-5 w-5 ${cfg.color}`} />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="line-clamp-2 text-base leading-snug">
              {resource.title}
            </CardTitle>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {cfg.label}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {resource.type === "file"
                  ? "文件下载"
                  : resource.type === "external"
                    ? "外部链接"
                    : "在线查看"}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        {resource.description && (
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {resource.description}
          </p>
        )}
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-md bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t border-border/40 bg-muted/20 px-4 py-3">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {resource.downloadCount.toLocaleString()}
            </span>
            {resource.fileSize && (
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {formatFileSize(resource.fileSize)}
              </span>
            )}
          </div>
          <Button
            size="sm"
            className="h-8 bg-gradient-to-r from-gold to-gold-dark text-white shadow-sm shadow-gold/20 hover:opacity-90"
            onClick={() => onDownload(resource)}
          >
            {resource.type === "external" ? (
              <>
                <ExternalLink className="mr-1 h-3.5 w-3.5" />
                访问
              </>
            ) : resource.type === "page" ? (
              <>
                <Eye className="mr-1 h-3.5 w-3.5" />
                查看
              </>
            ) : (
              <>
                <Download className="mr-1 h-3.5 w-3.5" />
                下载
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

function ResourceListItem({
  resource,
  onDownload,
}: {
  resource: Resource
  onDownload: (r: Resource) => void
}) {
  const cfg = categoryConfig[resource.category] || {
    label: resource.category,
    icon: FileText,
    color: "text-gray-500",
  }
  const Icon = cfg.icon
  const tags = getTags(resource.tags)

  return (
    <Card className="group flex items-center overflow-hidden transition-shadow hover:shadow-md">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center border-r border-border/40 bg-gradient-to-br from-gold/10 to-gold/5">
        <Icon className={`h-6 w-6 ${cfg.color}`} />
      </div>

      <div className="min-w-0 flex-1 px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold">{resource.title}</h3>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {cfg.label}
          </Badge>
        </div>
        {resource.description && (
          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
            {resource.description}
          </p>
        )}
        {tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-md bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
            {tags.length > 4 && (
              <span className="text-[10px] text-muted-foreground/60">
                +{tags.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 px-4">
        <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
          <Download className="h-3 w-3" />
          {resource.downloadCount.toLocaleString()}
        </span>
        {resource.fileSize && (
          <span className="hidden text-xs text-muted-foreground sm:block">
            {formatFileSize(resource.fileSize)}
          </span>
        )}
        <Button
          size="sm"
          className="h-8 bg-gradient-to-r from-gold to-gold-dark text-white shadow-sm shadow-gold/20 hover:opacity-90"
          onClick={() => onDownload(resource)}
        >
          {resource.type === "external" ? (
            <>
              <ExternalLink className="mr-1 h-3.5 w-3.5" />
              <span className="hidden sm:inline">访问</span>
            </>
          ) : resource.type === "page" ? (
            <>
              <Eye className="mr-1 h-3.5 w-3.5" />
              <span className="hidden sm:inline">查看</span>
            </>
          ) : (
            <>
              <Download className="mr-1 h-3.5 w-3.5" />
              <span className="hidden sm:inline">下载</span>
            </>
          )}
        </Button>
      </div>
    </Card>
  )
}
