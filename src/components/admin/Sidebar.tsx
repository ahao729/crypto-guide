"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Trophy,
  FileText,
  FolderOpen,
  Tags,
  Image,
  HelpCircle,
  Link as LinkIcon,
  Home,
  Settings,
  Book,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ReactNode> = {
  dashboard: <LayoutDashboard className="h-4 w-4" />,
  exchanges: <Building2 className="h-4 w-4" />,
  ranking: <Trophy className="h-4 w-4" />,
  articles: <FileText className="h-4 w-4" />,
  categories: <FolderOpen className="h-4 w-4" />,
  tags: <Tags className="h-4 w-4" />,
  media: <Image className="h-4 w-4" />,
  faqs: <HelpCircle className="h-4 w-4" />,
  resources: <Book className="h-4 w-4" />,
  clicks: <LinkIcon className="h-4 w-4" />,
  home: <Home className="h-4 w-4" />,
  settings: <Settings className="h-4 w-4" />,
};

const navItems = [
  { href: "/admin", label: "仪表盘", iconKey: "dashboard" },
  { href: "/admin/exchanges", label: "交易所管理", iconKey: "exchanges" },
  { href: "/admin/exchange-ranking", label: "交易所排名", iconKey: "ranking" },
  { href: "/admin/articles", label: "文章管理", iconKey: "articles" },
  { href: "/admin/categories", label: "分类管理", iconKey: "categories" },
  { href: "/admin/tags", label: "标签管理", iconKey: "tags" },
  { href: "/admin/media", label: "素材库", iconKey: "media" },
  { href: "/admin/faqs", label: "FAQ 管理", iconKey: "faqs" },
  { href: "/admin/resources", label: "资源管理", iconKey: "resources" },
  { href: "/admin/clicks", label: "点击记录", iconKey: "clicks" },
  { href: "/admin/home", label: "首页板块", iconKey: "home" },
  { href: "/admin/settings", label: "站点设置", iconKey: "settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-card md:block">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b border-border px-5">
          <Link href="/admin" className="text-lg font-bold tracking-tight">
            CryptoGuide <span className="text-gold">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-gold/10 text-gold-dark"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span className="text-muted-foreground">{iconMap[item.iconKey]}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <span className="text-muted-foreground"><ArrowLeft className="h-4 w-4" /></span>
            返回前台
          </Link>
        </div>
      </div>
    </aside>
  );
}
