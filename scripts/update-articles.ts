import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

// Slug -> file mapping
const articleMapping: Record<string, string> = {
  'crypto-exchange-beginners-guide': '/tmp/articles/article1.md',
  'binance-registration-guide': '/tmp/articles/article2.md',
  'what-is-perpetual-futures': '/tmp/articles/article3.md',
  // 'exchange-fee-comparison' -> article4.md, already updated, skip
  'what-is-copy-trading-bitget': '/tmp/articles/article5.md',
  'crypto-security-guide': '/tmp/articles/article6.md',
  'bitcoin-spot-etf-approved': '/tmp/articles/article7.md',
  'hong-kong-crypto-regulation': '/tmp/articles/article8.md',
  'bitcoin-halving-2026': '/tmp/articles/article9.md',
  'ethereum-dencun-upgrade': '/tmp/articles/article10.md',
  'crypto-market-review-2026-q1': '/tmp/articles/article11.md',
}

async function main() {
  console.log('=== Updating article content from .md files ===\n')

  for (const [slug, filePath] of Object.entries(articleMapping)) {
    // Read markdown file
    const mdContent = fs.readFileSync(filePath, 'utf-8')
    const fileName = path.basename(filePath)

    // Find article by slug
    const article = await prisma.article.findUnique({ where: { slug } })

    if (!article) {
      console.warn(`⚠️  [${fileName}] Article with slug "${slug}" not found in DB, skipping.`)
      continue
    }

    // Update content
    await prisma.article.update({
      where: { slug },
      data: { content: mdContent },
    })

    const preview = mdContent.substring(0, 60).replace(/\n/g, '\\n')
    console.log(`✅ [${fileName}] slug="${slug}" -> content updated (${mdContent.length} chars)`)
    console.log(`   Preview: ${preview}...`)
  }

  console.log('\n=== All updates completed ===')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
