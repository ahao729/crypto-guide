"use client"

import { useState, useEffect, useSyncExternalStore } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { SiteLogo } from "./SiteLogo"
import { Button } from "@/components/ui/button"
import { ChevronDown, Search } from "lucide-react"

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileGroup, setMobileGroup] = useState<"content" | "community" | null>(null)
  const [openMenu, setOpenMenu] = useState<"content" | "community" | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const mounted = useHydrated()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()

  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close menus when pathname changes
  useEffect(() => {
    setMobileOpen(false)
    setMobileGroup(null)
    setOpenMenu(null)
  }, [pathname])

  // Cmd/Ctrl+K opens search, or focuses the search field when already there.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        if (pathname === "/search") {
          document.getElementById("q")?.focus()
        } else {
          router.push("/search")
        }
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [pathname, router])

  const closeMobile = () => setMobileOpen(false)

  const contentMenu = [
    { label: "美股与 ETF", href: "/stocks", description: "开户、bStocks 与 ETF 入门" },
    { label: "热门赛道", href: "/trends", description: "Meme、NFT、RWA、Web3、AI" },
    { label: "基础设施", href: "/ecosystem", description: "钱包、跨链桥、预言机目录" },
    { label: "AI 工具与实战", href: "/ai", description: "搜索、Agent 与研究工作流" },
  ]

  const communityMenu = [
    { label: "常见问题", href: "/faq", description: "新手常见问题与风险提示" },
    { label: "资源下载", href: "/resources", description: "工具、模板与学习资料" },
    { label: "加入社群", href: "/about", description: "Telegram、X 与 Substack" },
    { label: "联系我们", href: "/contact", description: "纠错、合作与隐私请求" },
  ]

  const isPathActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)
  const contentActive = contentMenu.some((item) => isPathActive(item.href))
  const communityActive = communityMenu.some((item) => isPathActive(item.href))

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/40 bg-background/80 shadow-sm backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <SiteLogo />

        {/* Desktop navigation: 6 top-level items, grouped content/community menus */}
        <nav className="hidden md:flex md:items-center md:gap-1">
          {[
            { label: "首页", href: "/" },
            { label: "交易所", href: "/exchanges" },
            { label: "文章", href: "/articles" },
            { label: "工具", href: "/tools" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isPathActive(item.href)
                  ? "bg-gold/10 text-gold-dark"
                  : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}

          <div
            className="relative"
            onMouseEnter={() => setOpenMenu("content")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === "content" ? null : "content")}
              aria-expanded={openMenu === "content"}
              aria-haspopup="true"
              className={cn(
                "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                contentActive
                  ? "bg-gold/10 text-gold-dark"
                  : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
              )}
            >
              内容
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {openMenu === "content" && (
              <div className="absolute left-0 top-full z-50 w-72 pt-2">
                <div className="rounded-xl border border-border/60 bg-background/95 p-2 shadow-xl backdrop-blur-xl">
                  {contentMenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpenMenu(null)}
                      className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-muted"
                    >
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {item.description}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div
            className="relative"
            onMouseEnter={() => setOpenMenu("community")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === "community" ? null : "community")}
              aria-expanded={openMenu === "community"}
              aria-haspopup="true"
              className={cn(
                "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                communityActive
                  ? "bg-gold/10 text-gold-dark"
                  : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
              )}
            >
              社群
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {openMenu === "community" && (
              <div className="absolute right-0 top-full z-50 w-72 pt-2">
                <div className="rounded-xl border border-border/60 bg-background/95 p-2 shadow-xl backdrop-blur-xl">
                  {communityMenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpenMenu(null)}
                      className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-muted"
                    >
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {item.description}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Desktop theme toggle + CTA */}
        <div className="hidden md:flex md:items-center md:gap-2">
          <Link
            href="/search"
            aria-label="搜索（⌘K）"
            aria-keyshortcuts="Meta+K Control+K"
            title="搜索（⌘K）"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </Link>
          {/* Theme toggle */}
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground"
            aria-label={mounted && theme === "dark" ? "切换到亮色模式" : "切换到暗色模式"}
          >
            {mounted && theme === "dark" ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <Button
            size="sm"
            className="bg-gradient-gold text-white shadow-md shadow-gold/20 hover:shadow-lg hover:shadow-gold/30"
            asChild
          >
            <Link href="/exchange-ranking">开始探索</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
          aria-expanded={mobileOpen}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-accent/10">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-border/40 border-t bg-background/95 backdrop-blur-xl transition-all duration-300 md:hidden",
          mobileOpen ? "max-h-[calc(100vh-4rem)] overflow-y-auto" : "max-h-0 overflow-hidden"
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4">
          {[
            { label: "首页", href: "/" },
            { label: "交易所", href: "/exchanges" },
            { label: "文章", href: "/articles" },
            { label: "工具", href: "/tools" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobile}
              className={cn(
                "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isPathActive(item.href)
                  ? "bg-gold/10 text-gold-dark"
                  : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}

          {[
            { id: "content" as const, label: "内容", items: contentMenu },
            { id: "community" as const, label: "社群", items: communityMenu },
          ].map((group) => {
            const open = mobileGroup === group.id
            return (
              <div key={group.id}>
                <button
                  type="button"
                  onClick={() => setMobileGroup(open ? null : group.id)}
                  aria-expanded={open}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    open
                      ? "bg-gold/10 text-gold-dark"
                      : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                  )}
                >
                  {group.label}
                  <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
                </button>
                {open && (
                  <div className="ml-2 border-l border-border/50 pl-2">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          setMobileGroup(null)
                          closeMobile()
                        }}
                        className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          <Link
            href="/search"
            onClick={closeMobile}
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground"
          >
            <Search className="h-4 w-4" /> 搜索
          </Link>

          {/* Mobile theme toggle */}
          <div className="mt-1 flex items-center justify-between px-3 py-2">
            <span className="text-sm text-muted-foreground">
              {mounted && theme === "dark" ? "暗色模式" : "亮色模式"}
            </span>
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground"
              aria-label={mounted && theme === "dark" ? "切换到亮色模式" : "切换到暗色模式"}
            >
              {mounted && theme === "dark" ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
          <div className="px-3">
            <Button
              size="sm"
              className="w-full bg-gradient-gold text-white shadow-md"
              asChild
            >
              <Link href="/exchange-ranking">开始探索</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
