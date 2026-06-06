export default function ContactLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-muted" />
            <div className="mx-auto mt-4 h-12 w-48 rounded-lg bg-muted sm:h-14" />
            <div className="mx-auto mt-4 h-5 w-72 rounded bg-muted" />
          </div>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="space-y-5">
              <div className="h-7 w-28 rounded bg-muted" />
              <div className="h-5 w-56 rounded bg-muted" />
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="h-11 rounded-lg bg-muted" />
                <div className="h-11 rounded-lg bg-muted" />
              </div>
              <div className="h-11 rounded-lg bg-muted" />
              <div className="h-32 rounded-lg bg-muted" />
              <div className="h-11 w-full rounded-lg bg-muted" />
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border/60 bg-card p-6">
                <div className="h-6 w-6 rounded bg-muted" />
                <div className="mt-3 h-5 w-24 rounded bg-muted" />
                <div className="mt-1 h-4 w-40 rounded bg-muted" />
                <div className="mt-2 h-4 w-52 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
