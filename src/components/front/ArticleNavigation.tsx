import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ArticleNavItem {
  slug: string
  title: string
}

interface ArticleNavigationProps {
  prev: ArticleNavItem | null
  next: ArticleNavItem | null
}

export default function ArticleNavigation({ prev, next }: ArticleNavigationProps) {
  if (!prev && !next) return null

  return (
    <nav className="mt-12 border-t border-border/40 pt-8" aria-label="文章上下篇导航">
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Previous Article */}
        <div>
          {prev ? (
            <Link
              href={`/articles/${prev.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-border hover:shadow-md"
            >
              <div className="shrink-0 rounded-lg bg-gold/10 p-2 text-gold transition-colors group-hover:bg-gold/20">
                <ChevronLeft className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs text-muted-foreground">上一篇</span>
                <p className="truncate text-sm font-medium transition-colors group-hover:text-gold">
                  {prev.title}
                </p>
              </div>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}
        </div>

        {/* Next Article */}
        <div>
          {next ? (
            <Link
              href={`/articles/${next.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-border hover:shadow-md sm:flex-row-reverse sm:text-right"
            >
              <div className="shrink-0 rounded-lg bg-gold/10 p-2 text-gold transition-colors group-hover:bg-gold/20">
                <ChevronRight className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs text-muted-foreground">下一篇</span>
                <p className="truncate text-sm font-medium transition-colors group-hover:text-gold">
                  {next.title}
                </p>
              </div>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}
        </div>
      </div>
    </nav>
  )
}
