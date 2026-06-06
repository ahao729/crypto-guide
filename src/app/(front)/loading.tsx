export default function FrontLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/[0.08] via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 h-12 w-48 rounded-lg bg-muted" />
            <div className="mx-auto mb-4 h-6 w-96 max-w-full rounded bg-muted" />
            <div className="mx-auto h-4 w-72 max-w-full rounded bg-muted" />
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-16 sm:px-6 lg:px-8">
        {/* Section 1 */}
        <div className="space-y-6">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border/40 bg-card p-6">
                <div className="mb-4 h-12 w-12 rounded-lg bg-muted" />
                <div className="mb-3 h-5 w-3/4 rounded bg-muted" />
                <div className="mb-2 h-4 w-full rounded bg-muted" />
                <div className="h-4 w-2/3 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>

        {/* Section 2 */}
        <div className="space-y-6">
          <div className="h-8 w-56 rounded bg-muted" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-border/40">
                <div className="aspect-[16/9] bg-muted" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-16 rounded bg-muted" />
                  <div className="h-5 w-full rounded bg-muted" />
                  <div className="h-4 w-3/4 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
