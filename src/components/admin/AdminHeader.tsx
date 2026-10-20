"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/admin": "仪表盘",
  "/admin/exchanges": "交易所管理",
  "/admin/articles": "文章管理",
  "/admin/categories": "分类管理",
  "/admin/tags": "标签管理",
  "/admin/faqs": "FAQ 管理",
  "/admin/clicks": "点击记录",
  "/admin/home": "首页板块",
  "/admin/settings": "站点设置",
};

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  // Find the best matching title
  let title = "管理后台";
  const sorted = Object.keys(pageTitles).sort((a, b) => b.length - a.length);
  for (const key of sorted) {
    if (pathname.startsWith(key)) {
      title = pageTitles[key];
      break;
    }
  }

  // Show sub-path for creation/edit pages
  let subtitle = "";
  if (pathname.includes("/new")) subtitle = "新建";
  else if (pathname.match(/\/\d+$/)) subtitle = "编辑";

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <h1 className="text-lg font-semibold">
        {title}
        {subtitle && (
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            / {subtitle}
          </span>
        )}
      </h1>

      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
      >
        <LogOut className="h-4 w-4" />
        {loggingOut ? "退出中..." : "退出登录"}
      </button>
    </header>
  );
}
