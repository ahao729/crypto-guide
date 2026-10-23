/**
 * Seed the Meme / NFT / RWA / Web3 / AI content cluster.
 *
 * Dry run:
 *   node scripts/seed-trends.mjs
 * Apply:
 *   node scripts/seed-trends.mjs --apply
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
  "Meme": "meme",
  "NFT": "nft",
  "RWA": "rwa",
  "Web3": "web3",
  "AI": "ai",
  "币安": "binance",
}

const categories = [
  { slug: "meme", name: "Meme 币", description: "Meme 币交易逻辑、流动性和 Rug 风险。", sortOrder: 50 },
  { slug: "nft", name: "NFT", description: "NFT 市场、应用场景、钱包安全与防骗。", sortOrder: 51 },
  { slug: "rwa", name: "RWA", description: "链上美债、基金、房地产与私人信贷入门。", sortOrder: 52 },
  { slug: "web3", name: "Web3.0", description: "钱包、DApp、Layer2 与 AI Agent 入门。", sortOrder: 53 },
  { slug: "ai", name: "AI", description: "币安 AI 产品、Agent OS、Agentic Wallet 与 x402。", sortOrder: 54 },
]

const articles = [
  {
    slug: "meme-coin-guide-2026",
    category: "meme",
    title: "Meme 币是什么？2026 交易逻辑、流动性与 Rug 风险",
    excerpt:
      "Meme 币没有现金流，价格由注意力、流动性和情绪驱动。本文拆解生命周期、合约检查、交易坑和仓位管理。",
    file: "content/trends/meme-coin-guide-2026.md",
    coverImage: "/images/articles/trends/meme-coin-guide.png",
    tags: ["Meme"],
  },
  {
    slug: "nft-guide-2026",
    category: "nft",
    title: "NFT 还有机会吗？2026 市场、应用与防骗指南",
    excerpt:
      "NFT 从头像炒作转向会员、游戏资产和链上凭证。本文拆解 2026 年的应用、流动性、购买流程和钱包安全。",
    file: "content/trends/nft-guide-2026.md",
    coverImage: "/images/articles/trends/nft-guide.png",
    tags: ["NFT"],
  },
  {
    slug: "rwa-guide-2026",
    category: "rwa",
    title: "RWA 是什么？链上美债、基金与房地产代币入门",
    excerpt:
      "RWA 把现实资产代币化，但并不消除发行方、托管和流动性风险。本文拆解结构、类型、购买路径和判断清单。",
    file: "content/trends/rwa-guide-2026.md",
    coverImage: "/images/articles/trends/rwa-guide.png",
    tags: ["RWA"],
  },
  {
    slug: "web3-guide-2026",
    category: "web3",
    title: "Web3.0 是什么？钱包、DApp、Layer2 与 AI Agent 入门",
    excerpt:
      "从钱包、网络、Gas 到 Layer2、RWA 和 AI Agent：一篇看懂 Web3 的基本结构、2026 趋势和安全清单。",
    file: "content/trends/web3-guide-2026.md",
    coverImage: "/images/articles/trends/web3-guide.png",
    tags: ["Web3", "AI"],
  },
  {
    slug: "binance-ai-products-guide",
    category: "ai",
    title: "币安 AI 产品全景：Binance AI、AI Pro、Agent OS 与 Agentic Wallet",
    excerpt:
      "梳理 Binance AI、AI Pro、Binance Intelligence、Agent OS、Skills Hub、Agentic Wallet、x402/B402 和 Agent Native 的关系与风险。",
    file: "content/trends/binance-ai-products-guide.md",
    coverImage: "/images/articles/trends/binance-ai-products.png",
    tags: ["AI", "币安", "Web3"],
  },
  {
    slug: "ai-agent-wallet-x402-guide",
    category: "ai",
    title: "AI Agent 怎么用钱包？Agentic Wallet、x402 与 B402 入门",
    excerpt:
      "Agent 要自己花钱，需要钱包、权限和支付协议。本文拆解 Agentic Wallet、x402、B402 Bazaar 的安全流程和常见坑。",
    file: "content/trends/ai-agent-wallet-x402-guide.md",
    coverImage: "/images/articles/trends/ai-agent-wallet-x402.png",
    tags: ["AI", "Web3"],
  },
]

async function main() {
  console.log(APPLY ? "Applying trends cluster…" : "Dry run (pass --apply to write)")

  const categoryIds = {}
  for (const cat of categories) {
    const row = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        type: "article",
        sortOrder: cat.sortOrder,
      },
      create: { ...cat, type: "article" },
    })
    categoryIds[cat.slug] = row.id
    console.log(`[category] ${row.name} (${row.slug})`)
  }

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
        categoryId: categoryIds[item.category],
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
        categoryId: categoryIds[item.category],
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
