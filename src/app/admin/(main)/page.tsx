import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

async function getStats() {
  const [
    exchangeCount,
    articleCount,
    categoryCount,
    tagCount,
    faqCount,
    clickCount,
    totalClicks,
  ] = await Promise.all([
    prisma.exchange.count(),
    prisma.article.count(),
    prisma.category.count(),
    prisma.tag.count(),
    prisma.fAQ.count(),
    prisma.clickLog.count(),
    prisma.exchange.aggregate({ _sum: { clickCount: true } }),
  ])
  return {
    exchangeCount,
    articleCount,
    categoryCount,
    tagCount,
    faqCount,
    clickCount,
    totalClicks: totalClicks._sum.clickCount || 0,
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats()

  const cards = [
    { title: "交易所", value: stats.exchangeCount, href: "/admin/exchanges", color: "bg-blue-500" },
    { title: "文章", value: stats.articleCount, href: "/admin/articles", color: "bg-green-500" },
    { title: "分类", value: stats.categoryCount, href: "/admin/categories", color: "bg-purple-500" },
    { title: "标签", value: stats.tagCount, href: "/admin/tags", color: "bg-yellow-500" },
    { title: "常见问题", value: stats.faqCount, href: "/admin/faqs", color: "bg-pink-500" },
    { title: "点击记录", value: stats.clickCount, href: "/admin/clicks", color: "bg-indigo-500" },
    { title: "总点击数", value: stats.totalClicks, href: "/admin/clicks", color: "bg-orange-500" },
  ]

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">仪表盘</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${card.color} flex items-center justify-center text-lg font-bold text-white`}>
                    {card.value}
                  </div>
                  <span className="text-2xl font-bold">{card.value}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
