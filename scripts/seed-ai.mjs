/**
 * Seed the general AI content cluster (tools / agents / research workflows).
 * Apply: node scripts/seed-ai.mjs --apply
 */
import fs from "node:fs"
import path from "node:path"
import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"

config({ path: ".env.production.local", quiet: true })
config({ path: ".env.local", quiet: true })

const prisma = new PrismaClient()
const APPLY = process.argv.includes("--apply")

const categories = [
  { slug: "ai-tools", name: "AI 工具", description: "AI 搜索、写作、编程与办公工具，不追新闻。", sortOrder: 56 },
  { slug: "ai-agents", name: "Agent / 自动化", description: "AI Agent、工作流、权限与安全。", sortOrder: 57 },
]

const articles = [
  {
    slug: "ai-search-tools-comparison",
    category: "ai-tools",
    title: "AI 搜索工具怎么选：ChatGPT、Perplexity、Gemini 的实用差异",
    excerpt:
      "不比较发布会参数，只看真实使用：来源引用、文件处理、写作和多轮研究。附验证流程和常见坑。",
    file: "content/ai/ai-search-tools-comparison.md",
    coverImage: "/images/articles/ai/ai-search-cover.png",
    tags: ["AI", "工具"],
  },
  {
    slug: "ai-agent-guide",
    category: "ai-agents",
    title: "AI Agent 是什么？和聊天机器人、自动化脚本的区别",
    excerpt:
      "Agent 不是更聪明的聊天机器人，而是能调用工具、观察结果、调整步骤的执行闭环。附安全边界和评估方法。",
    file: "content/ai/ai-agent-guide.md",
    coverImage: "/images/articles/ai/ai-agent-cover.png",
    tags: ["AI", "Agent"],
  },
  {
    slug: "ai-research-workflow",
    category: "ai-tools",
    title: "用 AI 做资料整理和竞品分析：一套可复制的工作流",
    excerpt:
      "先找来源、再做证据表、最后人工写结论。附提示词、输出模板和交叉验证清单，避免 AI 编造。",
    file: "content/ai/ai-research-workflow.md",
    coverImage: "/images/articles/ai/ai-research-cover.png",
    tags: ["AI", "工具"],
  },
]

const tagSlugs = { AI: "ai", Agent: "agent", 工具: "ai-tools" }

async function main() {
  console.log(APPLY ? "Applying AI cluster…" : "Dry run (pass --apply to write)")

  // Keep the existing crypto-AI category separate from general AI.
  await prisma.category.upsert({
    where: { slug: "ai" },
    update: { name: "AI × Crypto" },
    create: {
      name: "AI × Crypto",
      slug: "ai",
      description: "币安 AI、Agentic Wallet、x402 等 AI × Crypto 内容。",
      type: "article",
      sortOrder: 55,
    },
  })

  const ids = {}
  for (const cat of categories) {
    const row = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, type: "article", sortOrder: cat.sortOrder },
      create: { ...cat, type: "article" },
    })
    ids[cat.slug] = row.id
    console.log(`[category] ${row.name}`)
  }

  for (const item of articles) {
    const content = fs.readFileSync(path.resolve(item.file), "utf8")
    console.log(`[article] ${item.slug}: ${content.length} chars`)
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
        categoryId: ids[item.category],
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
        publishedAt: new Date("2026-10-29T00:00:00+08:00"),
        categoryId: ids[item.category],
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
