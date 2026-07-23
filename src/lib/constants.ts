export interface NavItem {
  label: string
  href: string
  external?: boolean
}

export interface SiteConfig {
  name: string
  shortName: string
  description: string
  url: string
  ogImage: string
  author: string
  locale: string
  contactEmail: string
  navItems: NavItem[]
}

export const siteConfig: SiteConfig = {
  name: "币圈指南",
  shortName: "币圈指南",
  description:
    "专业的数字货币交易所评测与推荐平台，提供最新交易所拉新活动、注册教程、手续费对比和深度评测，助您选择最合适的加密货币交易平台。",
  url: "https://bqzn.top",
  ogImage: "/og.png",
  author: "币圈指南团队",
  locale: "zh-CN",
  contactEmail: "hello@bqzn.top",
  navItems: [
    { label: "首页", href: "/" },
    { label: "交易所", href: "/exchanges" },
    { label: "文章", href: "/articles" },
    { label: "工具", href: "/tools" },
    { label: "常见问题", href: "/faq" },
    { label: "资源下载", href: "/resources" },
    { label: "加入社群", href: "/about" },
  ],
}

export interface FooterLinkGroup {
  title: string
  links: NavItem[]
}

export const footerLinks: FooterLinkGroup[] = [
  {
    title: "导航",
    links: [
      { label: "首页", href: "/" },
      { label: "交易所", href: "/exchanges" },
      { label: "文章", href: "/articles" },
      { label: "工具", href: "/tools" },
      { label: "常见问题", href: "/faq" },
      { label: "资源下载", href: "/resources" },
      { label: "加入社群", href: "/about" },
    ],
  },
  {
    title: "热门交易所",
    links: [
      { label: "币安 Binance", href: "/exchanges/binance" },
      { label: "欧易 OKX", href: "/exchanges/okx" },
      { label: "Bybit", href: "/exchanges/bybit" },
      { label: "Bitget", href: "/exchanges/bitget" },
      { label: "Gate.io", href: "/exchanges/gate" },
    ],
  },
  {
    title: "资源",
    links: [
      { label: "新手教程", href: "/articles?category=guide" },
      { label: "交易策略", href: "/articles?category=strategy" },
      { label: "行业资讯", href: "/articles?category=news" },
      { label: "工具推荐", href: "/articles?category=tools" },
    ],
  },
]

export const socialLinks = [
  { label: "X", href: "https://x.com/biquanzhinan", icon: "x" },
  { label: "Substack", href: "https://biquanzhinan.substack.com", icon: "substack" },
  { label: "Telegram", href: "https://t.me/biquanzhinan", icon: "telegram" },
]

export const siteStatistics = {
  exchanges: 15,
  articles: 50,
  users: 10000,
}

export const exchangeCategories = [
  { label: "全部", value: "all" },
  { label: "中心化交易所（CEX）", value: "cex" },
  { label: "去中心化交易所（DEX）", value: "dex" },
  { label: "合约交易平台", value: "futures" },
  { label: "跟单交易平台", value: "copy-trading" },
] as const
