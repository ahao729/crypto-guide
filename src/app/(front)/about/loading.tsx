export default function AboutLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/[0.08] via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 h-12 w-56 rounded-lg bg-muted sm:h-14" />
            <div className="mx-auto h-5 w-80 max-w-full rounded bg-muted" />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: text */}
          <div className="space-y-4">
            <div className="h-9 w-44 rounded bg-muted" />
            <div className="space-y-2">
              <div className="h-5 w-full rounded bg-muted" />
              <div className="h-5 w-full rounded bg-muted" />
              <div className="h-5 w-5/6 rounded bg-muted" />
              <div className="h-5 w-full rounded bg-muted" />
              <div className="h-5 w-4/5 rounded bg-muted" />
            </div>
            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="h-11 w-36 rounded-lg bg-muted" />
              <div className="h-11 w-32 rounded-lg bg-muted" />
            </div>
          </div>

          {/* Right: stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-border/60 bg-card p-6 text-center"
              >
                <div className="mx-auto mb-1 h-8 w-20 rounded bg-muted" />
                <div className="mx-auto h-4 w-16 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto h-px max-w-7xl bg-border/40" />

      {/* Values Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto mb-2 h-8 w-40 rounded bg-muted" />
          <div className="mx-auto h-5 w-64 rounded bg-muted" />
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border/60 bg-card p-6"
            >
              <div className="h-12 w-12 rounded-lg bg-muted" />
              <div className="mt-4 h-5 w-24 rounded bg-muted" />
              <div className="mt-2 space-y-1">
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto h-px max-w-7xl bg-border/40" />

      {/* Milestones Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto mb-2 h-8 w-40 rounded bg-muted" />
          <div className="mx-auto h-5 w-56 rounded bg-muted" />
        </div>
        <div className="relative mt-10">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-muted" />
          <div className="space-y-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center sm:flex-row sm:items-start"
              >
                <div className={`flex-1 ${i % 2 === 0 ? "sm:text-right sm:pr-8" : "sm:order-last sm:pl-8"}`}>
                  <div className="mx-auto mb-2 h-5 w-24 rounded bg-muted sm:mx-0 sm:inline-block" />
                  <div className="mx-auto h-5 w-48 rounded bg-muted sm:mx-0 sm:inline-block" />
                  <div className="mx-auto mt-2 h-4 w-36 rounded bg-muted sm:mx-0" />
                </div>
                {/* Timeline dot */}
                <div className="z-10 mx-4 hidden h-4 w-4 shrink-0 rounded-full bg-muted sm:block" />
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="border-t border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-2 h-8 w-40 rounded bg-muted" />
            <div className="mx-auto h-5 w-72 rounded bg-muted" />
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto h-24 w-24 rounded-full bg-muted" />
                <div className="mx-auto mt-4 h-5 w-20 rounded bg-muted" />
                <div className="mx-auto mt-1 h-4 w-16 rounded bg-muted" />
                <div className="mx-auto mt-3 h-8 w-24 rounded-lg bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
