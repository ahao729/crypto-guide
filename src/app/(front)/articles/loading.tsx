export default function ArticlesLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/[0.08] via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 h-10 w-56 rounded-lg bg-muted" />
            <div className="mx-auto h-5 w-80 max-w-full rounded bg-muted" />
          </div>
        </div>
      </section>

      {/* Category Sidebar + Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="order-2 lg:order-1">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div className="rounded-xl border border-border/60 bg-card p-4">
                <div className="mb-3 h-4 w-20 rounded bg-muted" />
                <div className="space-y-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-9 w-full rounded-lg bg-muted/50" />
                  ))}
                </div>
              </div>
              {/* Quick links */}
              <div className="rounded-xl border border-border/60 bg-card p-4">
                <div className="mb-3 h-4 w-16 rounded bg-muted" />
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-5 w-24 rounded bg-muted/50" />
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="order-1 lg:order-2">
            {/* Featured / Latest Article */}
            <div className="mb-8 overflow-hidden rounded-xl border border-border/60 bg-card">
              <div className="grid md:grid-cols-2">
                <div className="aspect-[16/10] bg-muted md:aspect-auto" />
                <div className="space-y-3 p-6 lg:p-8">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-12 rounded bg-muted" />
                    <div className="h-5 w-16 rounded bg-muted" />
                  </div>
                  <div className="h-7 w-full rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="pt-2">
                    <div className="h-3 w-32 rounded bg-muted" />
                  </div>
                </div>
              </div>
            </div>

            {/* Article Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border border-border/60 bg-card"
                >
                  <div className="aspect-[16/9] bg-muted" />
                  <div className="space-y-3 p-4">
                    <div className="h-4 w-20 rounded bg-muted" />
                    <div className="h-5 w-full rounded bg-muted" />
                    <div className="h-4 w-full rounded bg-muted" />
                    <div className="h-4 w-3/4 rounded bg-muted" />
                    <div className="pt-4">
                      <div className="h-3 w-24 rounded bg-muted" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
