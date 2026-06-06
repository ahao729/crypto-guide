export default function ExchangeDetailLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Back link */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="h-4 w-32 rounded bg-muted" />
      </div>

      {/* Hero / Header Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/[0.08] via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            {/* Left: Logo + Name */}
            <div className="flex-1">
              <div className="flex items-start gap-6">
                <div className="h-20 w-20 shrink-0 rounded-2xl bg-muted" />
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-44 rounded bg-muted" />
                    <div className="h-6 w-16 rounded-full bg-muted" />
                  </div>
                  <div className="h-5 w-3/4 rounded bg-muted" />
                  <div className="flex flex-wrap gap-2">
                    <div className="h-6 w-20 rounded-full bg-muted" />
                    <div className="h-6 w-24 rounded-full bg-muted" />
                    <div className="h-6 w-16 rounded-full bg-muted" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Rating + CTA */}
            <div className="flex shrink-0 flex-col items-center gap-4 rounded-xl border border-border/40 bg-card p-6 lg:items-end">
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="h-4 w-28 rounded bg-muted" />
              <div className="h-12 w-44 rounded-lg bg-muted" />
              <div className="h-3 w-36 rounded bg-muted" />
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-10 lg:col-span-2">
            {/* Overview */}
            <section className="space-y-4">
              <div className="h-7 w-28 rounded bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
              </div>
            </section>

            {/* Features */}
            <section className="space-y-4">
              <div className="h-7 w-32 rounded bg-muted" />
              <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-border/40 p-4">
                    <div className="h-5 w-5 rounded bg-muted" />
                    <div className="h-4 flex-1 rounded bg-muted" />
                  </div>
                ))}
              </div>
            </section>

            {/* Coins */}
            <section className="space-y-4">
              <div className="h-7 w-24 rounded bg-muted" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-8 w-20 rounded-full bg-muted" />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-xl border border-border/40 bg-card p-6">
              <div className="space-y-4">
                <div className="h-6 w-24 rounded bg-muted" />
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="h-4 w-20 rounded bg-muted" />
                      <div className="h-4 w-16 rounded bg-muted" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border/40 bg-card p-6">
              <div className="space-y-4">
                <div className="h-6 w-28 rounded bg-muted" />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted" />
                      <div className="flex-1 space-y-1">
                        <div className="h-4 w-24 rounded bg-muted" />
                        <div className="h-3 w-16 rounded bg-muted" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
