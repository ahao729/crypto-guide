export default function ToolsLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/[0.08] via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 h-12 w-56 rounded-lg bg-muted sm:h-14" />
            <div className="mx-auto h-5 w-96 max-w-full rounded bg-muted" />
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Tools Categories */}
        {Array.from({ length: 3 }).map((_, catIdx) => (
          <div key={catIdx} className="mb-12">
            {/* Category title */}
            <div className="mb-6 h-6 w-28 rounded bg-muted" />
            {/* Tool cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 2 }).map((_, toolIdx) => (
                <div
                  key={toolIdx}
                  className="flex flex-col rounded-xl border border-border/60 bg-card p-6"
                >
                  {/* Icon */}
                  <div className="h-12 w-12 rounded-lg bg-muted" />
                  {/* Title */}
                  <div className="mt-4 h-5 w-3/4 rounded bg-muted" />
                  {/* Description */}
                  <div className="mt-2 flex-1 space-y-1">
                    <div className="h-4 w-full rounded bg-muted" />
                    <div className="h-4 w-5/6 rounded bg-muted" />
                  </div>
                  {/* CTA */}
                  <div className="mt-4 h-4 w-20 rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-2 h-7 w-40 rounded bg-muted" />
          <div className="mx-auto mb-6 h-5 w-72 rounded bg-muted" />
          <div className="mx-auto h-11 w-28 rounded-lg bg-muted" />
        </div>
      </section>
    </div>
  )
}
