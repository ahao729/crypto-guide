/**
 * Seed the Binance registration + KYC visual guide.
 * Apply: node scripts/seed-binance-visual.mjs --apply
 */
import fs from "node:fs"
import path from "node:path"
import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"

config({ path: ".env.production.local", quiet: true })
config({ path: ".env.local", quiet: true })

const prisma = new PrismaClient()
const APPLY = process.argv.includes("--apply")

const article = {
  slug: "binance-registration-kyc-visual-guide",
  title: "币安注册与 KYC 步骤图：邀请码 BQZN1、证件与人脸验证",
  excerpt:
    "用币安官方注册页和 KYC 截图，拆解邮箱注册、邀请码、证件上传、人脸验证和审核，附每一步的点击位置。",
  file: "content/infra/binance-registration-kyc-visual-guide.md",
  coverImage: "/images/articles/binance/binance-register-cover.png",
  tags: [
    { name: "币安", slug: "binance" },
    { name: "KYC", slug: "kyc" },
    { name: "新手", slug: "beginner" },
  ],
}

async function main() {
  const category = await prisma.category.upsert({
    where: { slug: "guide" },
    update: {},
    create: {
      name: "交易所教程",
      slug: "guide",
      description: "交易所注册、入金、KYC 与基础操作教程。",
      type: "article",
      sortOrder: 20,
    },
  })

  const content = fs.readFileSync(path.resolve(article.file), "utf8")
  console.log(`[article] ${article.slug}: ${content.length} chars`)
  if (!APPLY) return

  await prisma.article.upsert({
    where: { slug: article.slug },
    update: {
      title: article.title,
      excerpt: article.excerpt,
      content,
      coverImage: article.coverImage,
      author: "币圈指南团队",
      published: true,
      categoryId: category.id,
      tags: {
        deleteMany: {},
        create: article.tags.map((tag) => ({
          tag: {
            connectOrCreate: {
              where: { slug: tag.slug },
              create: tag,
            },
          },
        })),
      },
    },
    create: {
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content,
      coverImage: article.coverImage,
      author: "币圈指南团队",
      published: true,
      publishedAt: new Date("2026-10-23T00:00:00+08:00"),
      categoryId: category.id,
      tags: {
        create: article.tags.map((tag) => ({
          tag: { connectOrCreate: { where: { slug: tag.slug }, create: tag } },
        })),
      },
    },
  })
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
