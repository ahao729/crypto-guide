export default function ArticleDetailLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <div className="pt-8">
          <div className="h-4 w-32 rounded bg-muted" />
        </div>

        <div className="py-8">
          {/* Article Header */}
          <header className="mx-auto max-w-3xl">
            <div className="h-6 w-20 rounded-full bg-muted" />
            <div className="mt-4 space-y-3">
              <div className="h-10 w-full rounded bg-muted" />
              <div className="h-10 w-4/5 rounded bg-muted" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-5 w-full rounded bg-muted" />
              <div className="h-5 w-3/4 rounded bg-muted" />
            </div>

            {/* Meta */}
            <div className="mt-6 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-muted" />
                <div className="h-4 w-20 rounded bg-muted" />
              </div>
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-4 w-20 rounded bg-muted" />
            </div>
          </header>

          {/* Cover Image */}
          <div className="mx-auto mt-8 max-w-4xl">
            <div className="aspect-[2/1] rounded-xl bg-muted" />
          </div>

          {/* Content + Sidebar */}
          <div className="mx-auto mt-12 max-w-6xl">
            <div className="flex flex-col-reverse gap-10 lg:flex-row">
              {/* Article Content */}
              <div className="min-w-0 flex-1 space-y-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    {i % 3 === 0 && <div className="h-7 w-48 rounded bg-muted" />}
                    <div className="space-y-2">
                      <div className="h-4 w-full rounded bg-muted" />
                      <div className="h-4 w-full rounded bg-muted" />
                      <div className="h-4 w-5/6 rounded bg-muted" />
                      <div className="h-4 w-4/5 rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Table of Contents */}
              <aside className="w-full shrink-0 lg:w-64">
                <div className="rounded-xl border border-border/40 bg-card p-5">
                  <div className="mb-4 h-5 w-28 rounded bg-muted" />
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-4 w-full rounded bg-muted" />
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>

          {/* Share & Navigation */}
          <div className="mx-auto mt-16 max-w-6xl">
            <div className="flex items-center justify-between border-t border-border/40 py-6">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded bg-muted" />
                <div className="h-4 w-20 rounded bg-muted" />
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-8 rounded-md bg-muted" />
                <div className="h-8 w-8 rounded-md bg-muted" />
                <div className="h-8 w-8 rounded-md bg-muted" />
              </div>
            </div>

            {/* Prev/Next */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border/40 p-5">
                <div className="h-3 w-16 rounded bg-muted" />
                <div className="mt-2 h-5 w-3/4 rounded bg-muted" />
              </div>
              <div className="rounded-xl border border-border/40 p-5">
                <div className="h-3 w-16 rounded bg-muted" />
                <div className="mt-2 h-5 w-3/4 rounded bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
