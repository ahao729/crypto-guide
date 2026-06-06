export default function PrivacyLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-muted" />
            <div className="mx-auto mt-4 h-12 w-56 rounded-lg bg-muted sm:h-14" />
            <div className="mx-auto mt-4 h-5 w-40 rounded bg-muted" />
            <div className="mx-auto mt-2 h-4 w-60 rounded bg-muted" />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <div className="h-32 rounded-xl bg-muted" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-6">
              <div className="h-12 w-12 shrink-0 rounded-lg bg-muted" />
              <div className="flex-1 space-y-3">
                <div className="h-6 w-32 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-5/6 rounded bg-muted" />
                <div className="h-4 w-4/6 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
