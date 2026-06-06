export default function FAQLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/[0.08] via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            {/* Title */}
            <div className="mx-auto mb-4 h-12 w-64 rounded-lg bg-muted sm:h-14" />
            {/* Subtitle */}
            <div className="mx-auto h-5 w-96 max-w-full rounded bg-muted" />
          </div>

          {/* Stats */}
          <div className="mt-10 flex justify-center gap-8">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-1 h-8 w-16 rounded bg-muted" />
                <div className="mx-auto h-3 w-16 rounded bg-muted" />
              </div>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative mx-auto mt-8 max-w-xl">
            <div className="h-11 w-full rounded-lg bg-muted" />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-10">
          {Array.from({ length: 3 }).map((_, sectionIdx) => (
            <div key={sectionIdx}>
              {/* Category title */}
              <div className="mb-4 h-6 w-32 rounded bg-muted" />
              {/* Accordion items */}
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="rounded-xl border border-border/40 bg-card"
                  >
                    <div className="flex items-center justify-between p-5">
                      <div className="h-5 w-3/4 rounded bg-muted" />
                      <div className="h-4 w-4 rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-4 h-10 w-10 rounded-full bg-muted" />
          <div className="mx-auto mb-2 h-7 w-36 rounded bg-muted" />
          <div className="mx-auto mb-6 h-5 w-72 rounded bg-muted" />
          <div className="mx-auto h-11 w-28 rounded-lg bg-muted" />
        </div>
      </section>
    </div>
  )
}
