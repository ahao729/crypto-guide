/**
 * Seed the US-stocks content cluster.
 *
 * Dry run:
 *   node scripts/seed-stocks.mjs
 * Apply:
 *   node scripts/seed-stocks.mjs --apply
 */
import fs from "node:fs"
import path from "node:path"
import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"

config({ path: ".env.production.local", quiet: true })
config({ path: ".env.local", quiet: true })

const prisma = new PrismaClient()
const APPLY = process.argv.includes("--apply")

const tagSlugs = {
  "美股": "us-stocks",
  "币安": "binance",
  "ETF": "etf",
  "bStocks": "bstocks",
  "新手": "beginner",
}

const articles = [
  {
    slug: "binance-us-stocks-guide",
    title: "币安美股怎么买？2026 开户、入金与交易时间",
    excerpt:
      "币安已向部分非美国地区开放美股和 ETF。本文拆解开户条件、入金、直接股票与 bStocks 的区别、交易时间和常见坑。",
    file: "content/stocks/binance-us-stocks-guide.md",
    coverImage: "/images/articles/stocks/binance-us-stocks.png",
    tags: ["美股", "币安", "ETF"],
  },
  {
    slug: "bstocks-vs-us-stocks",
    title: "bStocks 是什么？和直接买美股、ETF 有什么区别",
    excerpt:
      "bStocks 是币安的代币化证券：1:1 支持、24/7 交易。本文对比直接股票、bStocks 和加密资产，拆解发行、托管、折溢价和税务风险。",
    file: "content/stocks/bstocks-vs-us-stocks.md",
    coverImage: "/images/articles/stocks/bstocks-vs-us-stocks.png",
    tags: ["美股", "bStocks", "币安"],
  },
  {
    slug: "us-stock-etf-beginners",
    title: "美股 ETF 新手怎么选？SPY、VOO、QQQ 区别",
    excerpt:
      "第一只美股 ETF 怎么选：标普 500 与纳斯达克 100 的差异、SPY/VOO/QQQ 的费率和流动性，以及在币安交易的注意事项。",
    file: "content/stocks/us-stock-etf-beginners.md",
    coverImage: "/images/articles/stocks/us-stock-etf-beginners.png",
    tags: ["美股", "ETF", "新手"],
  },
]

async function main() {
  console.log(APPLY ? "Applying US-stocks cluster…" : "Dry run (pass --apply to write)")

  const category = await prisma.category.upsert({
    where: { slug: "stocks" },
    update: {
      name: "美股",
      description: "美股、ETF 与 bStocks 入门：开户、入金、交易时间和风险。",
      type: "article",
      sortOrder: 45,
    },
    create: {
      name: "美股",
      slug: "stocks",
      description: "美股、ETF 与 bStocks 入门：开户、入金、交易时间和风险。",
      type: "article",
      sortOrder: 45,
    },
  })
  console.log(`[category] ${category.name} (${category.slug})`)

  for (const item of articles) {
    const content = fs.readFileSync(path.resolve(item.file), "utf8")
    const existing = await prisma.article.findUnique({ where: { slug: item.slug } })
    console.log(
      `[article] ${item.slug}: ${existing ? "update" : "create"} (${content.length} chars)`,
    )

    if (!APPLY) continue

    await prisma.article.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        excerpt: item.excerpt,
        content,
        coverImage: item.coverImage,
        author: "币圈指南团队",
        published: true,
        categoryId: category.id,
        tags: {
          deleteMany: {},
          create: item.tags.map((name) => ({
            tag: {
              connectOrCreate: {
                where: { slug: tagSlugs[name] },
                create: { name, slug: tagSlugs[name] },
              },
            },
          })),
        },
      },
      create: {
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt,
        content,
        coverImage: item.coverImage,
        author: "币圈指南团队",
        published: true,
        publishedAt: new Date("2026-10-23T00:00:00+08:00"),
        categoryId: category.id,
        tags: {
          create: item.tags.map((name) => ({
            tag: {
              connectOrCreate: {
                where: { slug: tagSlugs[name] },
                create: { name, slug: tagSlugs[name] },
              },
            },
          })),
        },
      },
    })
  }

  console.log("Done.")
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
