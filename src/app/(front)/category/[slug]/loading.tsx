export default function CategoryLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/[0.08] via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Back link */}
          <div className="h-4 w-28 rounded bg-muted" />
          <div className="mt-6">
            {/* Badge */}
            <div className="mb-4 h-6 w-20 rounded-full bg-muted" />
            {/* Title */}
            <div className="h-10 w-72 rounded bg-muted sm:h-12 sm:w-96" />
            {/* Description */}
            <div className="mt-4 h-5 w-96 max-w-full rounded bg-muted" />
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mb-6 flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-muted" />
          <div className="h-6 w-24 rounded bg-muted" />
        </div>

        {/* Card Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-border/40 bg-card"
            >
              {/* Card image area */}
              <div className="aspect-[16/9] bg-muted" />
              {/* Card body */}
              <div className="space-y-3 p-5">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-muted" />
                  <div className="h-5 flex-1 rounded bg-muted" />
                </div>
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <div className="h-6 w-14 rounded-full bg-muted" />
                  <div className="h-6 w-20 rounded-full bg-muted" />
                </div>
                {/* Rating + CTA */}
                <div className="flex items-center justify-between pt-2">
                  <div className="h-4 w-24 rounded bg-muted" />
                  <div className="h-9 w-24 rounded-lg bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
