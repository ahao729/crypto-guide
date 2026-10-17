/**
 * Rotate (or create) the single admin account without going through the UI.
 *
 * Usage:
 *   ADMIN_EMAIL=admin@bqzn.top ADMIN_PASSWORD='<new-strong-password>' \
 *     DATABASE_URL='postgresql://...' npm run rotate-admin
 *
 * Or, after `vercel env pull .env.production.local --environment=production`:
 *   ADMIN_EMAIL=admin@bqzn.top ADMIN_PASSWORD='<new-strong-password>' \
 *     npm run rotate-admin
 *
 * - Reads DATABASE_URL from the environment (same one the app uses).
 * - Hashes with bcrypt cost 12.
 * - Never prints the password.
 */
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { config } from "dotenv"

// Convenience for local operators: `vercel env pull .env.production.local`
// then run this script. Real environment variables always take precedence.
config({ path: ".env.production.local", quiet: true })
config({ path: ".env.local", quiet: true })

async function main() {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD || ""

  if (!email || !password) {
    console.error(
      "缺少参数。用法：ADMIN_EMAIL=... ADMIN_PASSWORD='...' DATABASE_URL=... npm run rotate-admin"
    )
    process.exit(1)
  }

  if (password.length < 12) {
    console.error("ADMIN_PASSWORD 至少需要 12 个字符。")
    process.exit(1)
  }

  if (!process.env.DATABASE_URL) {
    console.error("缺少 DATABASE_URL。")
    process.exit(1)
  }

  const prisma = new PrismaClient()

  try {
    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.upsert({
      where: { email },
      update: { password: passwordHash, role: "admin" },
      create: {
        email,
        password: passwordHash,
        name: "超级管理员",
        role: "admin",
      },
    })

    console.log(`✅ 管理员口令已更新：${user.email}`)
    console.log("   请妥善保存新口令，并在部署环境确认 AUTH_SECRET 已配置。")
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error("❌ 更新管理员口令失败：", error)
  process.exit(1)
})
