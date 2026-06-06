export default function ExchangesLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/[0.08] via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 h-10 w-64 rounded-lg bg-muted" />
            <div className="mx-auto mb-8 h-5 w-96 max-w-full rounded bg-muted" />
            {/* Stats */}
            <div className="flex justify-center gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="text-center">
                  <div className="mx-auto mb-1 h-7 w-16 rounded bg-muted" />
                  <div className="mx-auto h-3 w-20 rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filter / Category Bar */}
      <div className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="h-9 w-24 rounded-full bg-muted" />
          <div className="h-9 w-28 rounded-full bg-muted" />
          <div className="h-9 w-20 rounded-full bg-muted" />
          <div className="h-9 w-32 rounded-full bg-muted" />
          <div className="ml-auto h-9 w-36 rounded-lg bg-muted" />
        </div>
      </div>

      {/* Exchange Grid */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mb-8 h-8 w-40 rounded bg-muted" />

        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-xl border border-border/40 bg-card p-6 sm:flex-row sm:items-center"
            >
              {/* Logo */}
              <div className="h-16 w-16 shrink-0 rounded-xl bg-muted" />
              {/* Info */}
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-32 rounded bg-muted" />
                  <div className="h-5 w-16 rounded-full bg-muted" />
                </div>
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 w-14 rounded-full bg-muted" />
                  <div className="h-6 w-20 rounded-full bg-muted" />
                  <div className="h-6 w-16 rounded-full bg-muted" />
                </div>
              </div>
              {/* Rating + CTA */}
              <div className="flex shrink-0 flex-col items-end gap-2">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-10 w-28 rounded-lg bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
