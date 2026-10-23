/**
 * Seed the wallets / bridges / oracles content cluster.
 *
 * Dry run:
 *   node scripts/seed-infra.mjs
 * Apply:
 *   node scripts/seed-infra.mjs --apply
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
  "钱包": "wallet",
  "跨链桥": "bridge",
  "预言机": "oracle",
  "安全": "security",
}

const articles = [
  {
    slug: "hot-wallet-comparison-2026",
    title: "热钱包怎么选？MetaMask、Trust Wallet、Phantom、Rabby 对比",
    excerpt:
      "热钱包不是越有名越好。对比 MetaMask、Trust Wallet、Phantom、Rabby 的链支持、体验和安全风险，附钱包安全清单。",
    file: "content/infra/hot-wallet-comparison-2026.md",
    coverImage: "/images/articles/infra/hot-wallet-comparison.png",
    tags: ["钱包", "安全"],
  },
  {
    slug: "cross-chain-bridge-guide-2026",
    title: "跨链桥怎么选？LayerZero、Wormhole、Across、CCTP 风险对比",
    excerpt:
      "包装资产、原生 USDC、消息层和意图式桥有什么区别？拆解 LayerZero、Wormhole、Stargate、Across、CCTP、THORChain 的风险与安全步骤。",
    file: "content/infra/cross-chain-bridge-guide-2026.md",
    coverImage: "/images/articles/infra/cross-chain-bridge-guide.png",
    tags: ["跨链桥", "安全"],
  },
  {
    slug: "oracle-guide-2026",
    title: "预言机是什么？Chainlink、Pyth、RedStone 的作用与风险",
    excerpt:
      "预言机把价格和事件带到链上，也把延迟、操纵和集成风险带进 DeFi。对比 Chainlink、Pyth、RedStone、API3、UMA 的模式。",
    file: "content/infra/oracle-guide-2026.md",
    coverImage: "/images/articles/infra/oracle-guide.png",
    tags: ["预言机", "安全"],
  },
]

async function main() {
  console.log(APPLY ? "Applying infra cluster…" : "Dry run (pass --apply to write)")

  const category = await prisma.category.upsert({
    where: { slug: "infra" },
    update: {
      name: "基础设施",
      description: "热钱包、跨链桥与预言机：品牌目录、功能与风险。",
      type: "article",
      sortOrder: 55,
    },
    create: {
      name: "基础设施",
      slug: "infra",
      description: "热钱包、跨链桥与预言机：品牌目录、功能与风险。",
      type: "article",
      sortOrder: 55,
    },
  })
  console.log(`[category] ${category.name} (${category.slug})`)

  for (const item of articles) {
    const content = fs.readFileSync(path.resolve(item.file), "utf8")
    const existing = await prisma.article.findUnique({ where: { slug: item.slug } })
    console.log(`[article] ${item.slug}: ${existing ? "update" : "create"} (${content.length} chars)`)
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
