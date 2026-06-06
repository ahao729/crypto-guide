import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "页面未找到",
  description: "您访问的页面不存在或已被移除。",
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background via-gold/[0.02] to-background px-4">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-gold/[0.03] blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-gold/[0.03] blur-3xl" />
      </div>

      <div className="relative text-center">
        {/* 404 Code */}
        <div className="mb-4">
          <span className="bg-gradient-to-r from-gold to-gold/60 bg-clip-text text-[8rem] font-black leading-none text-transparent sm:text-[10rem]">
            404
          </span>
        </div>

        {/* Divider */}
        <div className="mx-auto mb-6 h-px w-24 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        {/* Message */}
        <h1 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
          页面未找到
        </h1>
        <p className="mx-auto mb-8 max-w-md text-muted-foreground">
          抱歉，您访问的页面不存在或已被移除。
          <br />
          请检查网址是否正确，或返回首页继续浏览。
        </p>

        {/* Actions */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-gold px-6 text-sm font-medium text-white shadow-lg shadow-gold/20 transition-all hover:bg-gold/90 hover:shadow-gold/30 active:scale-[0.98]"
          >
            返回首页
          </Link>
          <Link
            href="/exchanges"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-border/60 bg-card px-6 text-sm font-medium text-foreground transition-all hover:bg-accent active:scale-[0.98]"
          >
            浏览交易所
          </Link>
        </div>
      </div>
    </div>
  )
}
