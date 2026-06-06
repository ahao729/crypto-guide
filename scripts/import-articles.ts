/**
 * import-articles.ts — MD 文章通用导入管线
 * =============================================
 *
 * 三种模式（通过 CLI 参数切换）:
 *   seed   读取 MD 目录，输出 seed-compatible 代码（可粘贴到 seed.ts）
 *   db     直接通过 Prisma 写入数据库（需 DATABASE_URL 环境变量）
 *   api    启动后调用 POST /api/articles 批量创建（需登录 cookie / 管理员 session）
 *
 * 用法:
 *   npx tsx scripts/import-articles.ts seed       # 输出 seed 代码
 *   npx tsx scripts/import-articles.ts db         # 直接写入数据库
 *   npx tsx scripts/import-articles.ts api        # 通过 API 导入（需先登录）
 *
 * 环境变量:
 *   ARTICLES_DIR    MD 文件目录（默认 /tmp/articles）
 *   API_BASE        API 基础地址（默认 http://localhost:3000）
 *   API_COOKIE      API 模式下的认证 cookie
 *   DEFAULT_AUTHOR  文章作者（默认 "币圈指南"）
 *   DEFAULT_CATEGORY 默认分类 slug（默认 "news"）
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

// ============================
// 1. 配置
// ============================
const ARTICLES_DIR = process.env.ARTICLES_DIR || '/tmp/articles'
const API_BASE = process.env.API_BASE || 'http://localhost:3000'
const API_COOKIE = process.env.API_COOKIE || ''
const DEFAULT_AUTHOR = process.env.DEFAULT_AUTHOR || '币圈指南'
const DEFAULT_CATEGORY = process.env.DEFAULT_CATEGORY || 'news'

// 分类 slug → 数据库 categoryId 映射（db / api 模式运行时查询）
// 标签 slug → 数据库 tagId 映射
let categoryMap: Record<string, string> = {}
let tagMap: Record<string, string> = {}

/** 手动 slug 映射：文件名 → 文章 slug（优先于自动生成） */
const FILENAME_SLUG_OVERRIDE: Record<string, string> = {
  // 以下为 /tmp/articles/ 的已知映射（来自 update-articles.ts）
  // 如果使用其他目录，可提供 slug-mapping.json 覆盖
  // 'article1.md': 'crypto-exchange-beginners-guide',
  // 'article2.md': 'binance-registration-guide',
}

// ============================
// 2. 类型定义
// ============================
interface ParsedArticle {
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  categorySlug: string
  tagSlugs: string[]
  coverImage: string | null
}

interface SeedArticleBlock {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string | null
  author: string
  published: boolean
  publishedAt: string
  categorySlug: string
  tagSlugs: string[]
}

// ============================
// 3. 解析 MD 文件
// ============================

/**
 * 从 MD 内容中提取 title
 * 规则：取第一个 # 或 ## 标题文本，去除编号前缀
 */
function extractTitle(content: string): string | null {
  const match = content.match(/^#{1,2}\s+(.+)$/m)
  if (!match) return null

  let title = match[1].trim()
  // 去除 "X.Y " 或 "X、 " 编号前缀
  title = title.replace(/^[\d一二三四五六七八九十]+[\.、．\s]+/, '')
  return title
}

/**
 * 从 MD 内容中提取 excerpt（摘要）
 * 规则：取 title 下方第一个非空段落（跳过标题行）
 */
function extractExcerpt(content: string, title: string): string {
  const lines = content.split('\n')
  let foundTitle = false
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('#') && trimmed.includes(title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').substring(0, 10))) {
      foundTitle = true
      continue
    }
    if (!foundTitle) continue
    if (trimmed === '' || trimmed.startsWith('#')) continue
    if (trimmed.startsWith('---') || trimmed.startsWith('>')) continue
    // 返回前 150 个字符作为摘要
    return trimmed.replace(/[*_`[\]()]/g, '').substring(0, 150).replace(/\s+/g, ' ').trim()
  }
  // fallback: 取开头不含标题的纯文本
  const plain = content
    .replace(/^#{1,6}\s+.*$/m, '')
    .replace(/[*_`[\]()#>|]/g, '')
    .replace(/\n{2,}/g, '\n')
    .trim()
  return plain.substring(0, 150).replace(/\s+/g, ' ').trim()
}

// 从映射文件加载的 slug 覆盖
let slugMapping: Record<string, string> = {}

/**
 * 从文章目录加载 slug-mapping.json（如果存在）
 */
function loadSlugMapping(articlesDir: string): Record<string, string> {
  const mappingPath = path.join(articlesDir, 'slug-mapping.json')
  if (fs.existsSync(mappingPath)) {
    try {
      const raw = fs.readFileSync(mappingPath, 'utf-8')
      const data = JSON.parse(raw)
      console.log(`📋 已加载 slug 映射文件: slug-mapping.json`)
      return data
    } catch (err) {
      console.warn(`⚠️  无法解析 slug-mapping.json，将使用自动生成:`, err)
    }
  }
  return {}
}

/**
 * 生成 URL 友好的 slug
 * - 去除中文和特殊字符
 * - 只保留字母、数字、连字符
 * - 自动替换空格
 */
function toUrlSlug(text: string): string {
  return text
    .toLowerCase()
    // 将常见中文关键词替换为英文
    .replace(/教程/g, '-tutorial')
    .replace(/指南/g, '-guide')
    .replace(/入门/g, '-beginners')
    .replace(/基础/g, '-basics')
    .replace(/什么/g, '-what-is')
    .replace(/完整/g, '-complete')
    .replace(/最新|全面/g, '-ultimate')
    .replace(/交易所/g, '-exchange')
    .replace(/合约/g, '-futures')
    .replace(/比特币/g, '-bitcoin')
    .replace(/以太坊/g, '-ethereum')
    .replace(/币安/g, '-binance')
    .replace(/注册/g, '-registration')
    .replace(/安全/g, '-security')
    .replace(/监管/g, '-regulation')
    .replace(/减半/g, '-halving')
    .replace(/市场/g, '-market')
    .replace(/回顾/g, '-review')
    .replace(/解析/g, '-analysis')
    .replace(/解读/g, '-guide')
    .replace(/获批/g, '-approved')
    .replace(/升级/g, '-upgrade')
    .replace(/跟单/g, '-copy-trading')
    .replace(/ETF/g, '-etf')
    .replace(/香港/g, '-hong-kong')
    // 去除非 URL 安全字符
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80)
}

/**
 * 根据文件名和标题生成合法 slug
 * 优先级：slug-mapping.json > FILENAME_SLUG_OVERRIDE > 自动生成
 */
function generateSlug(filename: string, title: string): string {
  const base = path.basename(filename, path.extname(filename))

  // 1. 先查映射文件
  if (slugMapping[filename]) {
    return slugMapping[filename]
  }

  // 2. 再查硬编码 override
  if (FILENAME_SLUG_OVERRIDE[filename]) {
    return FILENAME_SLUG_OVERRIDE[filename]
  }

  // 3. 如果文件名是 articleN 格式，用标题生成 URL slug
  if (/^article\d+$/i.test(base)) {
    const urlSlug = toUrlSlug(title)
    if (urlSlug) return urlSlug
  }

  // 4. 否则直接用文件名
  const fileSlug = toUrlSlug(base)
  if (fileSlug) return fileSlug

  // 5. 最终 fallback
  return `article-${Date.now()}`
}

/**
 * 通过内容关键词推断分类和标签
 */
function inferCategoryAndTags(title: string, content: string): { categorySlug: string; tagSlugs: string[] } {
  const combined = `${title}\n${content}`.toLowerCase()
  const tags: string[] = []

  // === 分类推断 ===
  let categorySlug = DEFAULT_CATEGORY

  if (/新手|入门|基础|初学者|第一次/.test(combined)) categorySlug = 'beginner'
  else if (/注册|认证|KYC|教程|下载|安装|使用指南/.test(combined)) categorySlug = 'guide'
  else if (/策略|技巧|套利|做多|做空|仓位|止盈|止损|技术分析/.test(combined)) categorySlug = 'strategy'
  else if (/资讯|动态|政策|监管|ETF|减半|升级|市场|行情/.test(combined)) categorySlug = 'news'
  else if (/工具|插件|软件|网站|资源/.test(combined)) categorySlug = 'tools'

  // === 标签推断 ===
  const tagRules: [RegExp, string][] = [
    [/比特币|btc/i, 'bitcoin'],
    [/以太坊|eth|ethereum/i, 'ethereum'],
    [/合约|永续|期货|futures|杠杆/i, 'futures-trading'],
    [/现货|spot/i, 'spot-trading'],
    [/杠杆|倍率/i, 'leverage'],
    [/跟单|copy.?trading/i, 'copy-trading-tag'],
    [/KYC|认证|实名/i, 'kyc'],
    [/手续费|费率|fee/i, 'fees'],
    [/API/i, 'api'],
    [/套利|搬砖/i, 'arbitrage'],
    [/DeFi|去中心化金融/i, 'defi'],
    [/Web3|web3/i, 'web3'],
    [/空投|airdrop/i, 'airdrop'],
    [/质押|staking|Staking/i, 'staking'],
    [/安全|防盗|钱包安全|钓鱼/i, 'security'],
    [/ETF|现货ETF/i, 'etf'],
    [/监管|合规|政策|牌照/i, 'regulation'],
    [/减半|halving/i, 'bitcoin-halving'],
    [/区块链|技术|layer2/i, 'blockchain-tech'],
    [/期权|option/i, 'options'],
    [/稳定币|USDT|USDC|DAI/i, 'stablecoin'],
    [/税务|报税|tax/i, 'tax'],
  ]

  for (const [pattern, slug] of tagRules) {
    if (pattern.test(combined) && !tags.includes(slug)) {
      tags.push(slug)
    }
  }

  return { categorySlug, tagSlugs: tags }
}

/**
 * 解析单个 MD 文件为 ParsedArticle
 */
function parseMdFile(filePath: string): ParsedArticle | null {
  const filename = path.basename(filePath)
  let content: string
  try {
    content = fs.readFileSync(filePath, 'utf-8')
  } catch (err) {
    console.error(`❌ 无法读取文件 ${filePath}:`, err)
    return null
  }

  if (!content.trim()) {
    console.warn(`⚠️  跳过空文件: ${filename}`)
    return null
  }

  const title = extractTitle(content) || filename.replace(/\.md$/i, '')
  const slug = generateSlug(filename, title)
  const excerpt = extractExcerpt(content, title)
  const { categorySlug, tagSlugs } = inferCategoryAndTags(title, content)

  return {
    title,
    slug,
    excerpt,
    content,
    author: DEFAULT_AUTHOR,
    categorySlug,
    tagSlugs,
    coverImage: null,
  }
}

// ============================
// 4. 输出 seed 代码模式
// ============================

function renderSeedOutput(articles: ParsedArticle[]): void {
  const outputFile = path.join(process.cwd(), 'scripts', 'seed-articles-output.ts')

  let code = `/**
 * seed-articles-output.ts — 由 import-articles.ts seed 模式自动生成
 * 用法: npx tsx scripts/seed-articles-output.ts
 * 将此文件集成到 seed.ts 中，或直接运行批量导入
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface SeedArticle {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string | null
  author: string
  published: boolean
  publishedAt: Date
  categorySlug: string
  tagSlugs: string[]
}

const articles: SeedArticle[] = [`

  for (const a of articles) {
    const escapedContent = a.content
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$\{/g, '\\${')

    code += `
  {
    title: ${JSON.stringify(a.title)},
    slug: ${JSON.stringify(a.slug)},
    excerpt: ${JSON.stringify(a.excerpt)},
    content: \`${escapedContent}\`,
    coverImage: ${a.coverImage ? JSON.stringify(a.coverImage) : 'null'},
    author: ${JSON.stringify(a.author)},
    published: true,
    publishedAt: new Date(),
    categorySlug: ${JSON.stringify(a.categorySlug)},
    tagSlugs: [${a.tagSlugs.map(t => JSON.stringify(t)).join(', ')}],
  },`
  }

  code += `
]

async function main() {
  console.log(\`📦 开始导入 \${articles.length} 篇文章...\n\`)

  let created = 0, updated = 0, skipped = 0

  for (const a of articles) {
    const category = await prisma.category.findUnique({ where: { slug: a.categorySlug } })
    if (!category) {
      console.warn(\`⚠️  分类 "\${a.categorySlug}" 不存在，跳过文章 "\${a.title}"\`)
      skipped++
      continue
    }

    const existing = await prisma.article.findUnique({ where: { slug: a.slug } })

    if (existing) {
      await prisma.article.update({
        where: { slug: a.slug },
        data: {
          title: a.title,
          content: a.content,
          excerpt: a.excerpt,
          coverImage: a.coverImage,
          author: a.author,
          published: a.published,
          publishedAt: a.publishedAt,
          categoryId: category.id,
          updatedAt: new Date(),
        },
      })
      updated++
    } else {
      await prisma.article.create({
        data: {
          title: a.title,
          slug: a.slug,
          excerpt: a.excerpt,
          content: a.content,
          coverImage: a.coverImage,
          author: a.author,
          published: a.published,
          publishedAt: a.publishedAt,
          categoryId: category.id,
        },
      })
      created++
    }

    // 处理标签
    for (const tagSlug of a.tagSlugs) {
      const tag = await prisma.tag.findUnique({ where: { slug: tagSlug } })
      if (tag) {
        const article = await prisma.article.findUnique({ where: { slug: a.slug } })
        if (article) {
          await prisma.tagOnArticle.upsert({
            where: { articleId_tagId: { articleId: article.id, tagId: tag.id } },
            update: {},
            create: { articleId: article.id, tagId: tag.id },
          })
        }
      } else {
        console.warn(\`  ⚠️  标签 "\${tagSlug}" 不存在，跳过\`)
      }
    }

    console.log(\`\${existing ? '🔄' : '✅'} \${a.slug}\`)
  }

  console.log(\`\n📊 统计: 新建 \${created}, 更新 \${updated}, 跳过 \${skipped}\`)
  console.log('✨ 完成!')
}

main()
  .catch((err) => { console.error('❌', err); process.exit(1) })
  .finally(() => prisma.$disconnect())
`

  fs.writeFileSync(outputFile, code, 'utf-8')
  console.log(`\n📄 已生成 seed 脚本: ${outputFile}`)
  console.log(`   运行: npx tsx scripts/seed-articles-output.ts\n`)
}

// ============================
// 5. DB 直接导入模式
// ============================

async function importToDb(articles: ParsedArticle[]): Promise<void> {
  const prisma = new PrismaClient()

  try {
    // 加载分类映射
    const categories = await prisma.category.findMany({ where: { type: 'article' } })
    categoryMap = {}
    for (const c of categories) {
      categoryMap[c.slug] = c.id
    }

    // 加载标签映射
    const tags = await prisma.tag.findMany()
    tagMap = {}
    for (const t of tags) {
      tagMap[t.slug] = t.id
    }

    console.log(`已加载 ${Object.keys(categoryMap).length} 个分类, ${Object.keys(tagMap).length} 个标签\n`)

    let created = 0
    let updated = 0
    const skipped = 0

    for (const article of articles) {
      const categoryId = categoryMap[article.categorySlug] || null

      // 检查是否已存在
      const existing = await prisma.article.findUnique({ where: { slug: article.slug } })

      if (existing) {
        await prisma.article.update({
          where: { slug: article.slug },
          data: {
            title: article.title,
            content: article.content,
            excerpt: article.excerpt,
            author: article.author,
            coverImage: article.coverImage,
            categoryId,
            updatedAt: new Date(),
          },
        })
        updated++
        console.log(`🔄 更新: ${article.slug}`)
      } else {
        await prisma.article.create({
          data: {
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt,
            content: article.content,
            author: article.author,
            coverImage: article.coverImage,
            published: true,
            publishedAt: new Date(),
            categoryId,
          },
        })
        created++
        console.log(`✅ 创建: ${article.slug}`)
      }

      // 处理标签
      const dbArticle = await prisma.article.findUnique({ where: { slug: article.slug } })
      if (dbArticle) {
        for (const tagSlug of article.tagSlugs) {
          const tagId = tagMap[tagSlug]
          if (!tagId) {
            console.warn(`  ⚠️  标签不存在 "${tagSlug}"，跳过`)
            continue
          }
          await prisma.tagOnArticle.upsert({
            where: { articleId_tagId: { articleId: dbArticle.id, tagId } },
            update: {},
            create: { articleId: dbArticle.id, tagId },
          })
        }
      }
    }

    console.log(`\n📊 统计: 新建 ${created}, 更新 ${updated}, 跳过 ${skipped}`)
  } finally {
    await prisma.$disconnect()
  }
}

// ============================
// 6. API 导入模式
// ============================

interface ApiLoginResponse {
  user?: { email: string }
  error?: string
}

async function importViaApi(articles: ParsedArticle[]): Promise<void> {
  // 1. 检查 cookie
  if (!API_COOKIE) {
    console.log('⚠️  未设置 API_COOKIE 环境变量。')
    console.log('   请先登录后台，从浏览器开发者工具中复制 cookie:')
    console.log('   1. 打开 http://localhost:3000/admin/login 并登录')
    console.log('   2. F12 → Application → Cookies → 复制完整 Cookie 字符串')
    console.log('   3. 运行: API_COOKIE="..." npx tsx scripts/import-articles.ts api\n')

    // 尝试无 cookie 登录提示
    console.log('   或者先通过 API 登录（需要修改脚本添加登录逻辑）')
    return
  }

  let successCount = 0
  let failCount = 0

  for (const article of articles) {
    try {
      const body: Record<string, unknown> = {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        published: true,
      }

      // 查找 categoryId
      if (article.categorySlug) {
        const catRes = await fetch(`${API_BASE}/api/categories?slug=${article.categorySlug}`, {
          headers: { Cookie: API_COOKIE },
        })
        if (catRes.ok) {
          const cats = await catRes.json()
          const cat = Array.isArray(cats) ? cats.find((c: any) => c.slug === article.categorySlug) : null
          if (cat?.id) body.categoryId = cat.id
        }
      }

      // 查找 tag IDs
      if (article.tagSlugs.length > 0) {
        const tagRes = await fetch(`${API_BASE}/api/tags`, {
          headers: { Cookie: API_COOKIE },
        })
        if (tagRes.ok) {
          const allTags = await tagRes.json()
          const tags = Array.isArray(allTags) ? allTags : allTags.tags || []
          const tagIds = article.tagSlugs
            .map(slug => tags.find((t: any) => t.slug === slug)?.id)
            .filter(Boolean)
          if (tagIds.length > 0) body.tags = tagIds
        }
      }

      const res = await fetch(`${API_BASE}/api/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: API_COOKIE,
        },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        successCount++
        console.log(`✅ [${successCount}] ${article.slug} — ${article.title}`)
      } else {
        const err = await res.json().catch(() => ({ error: res.statusText }))
        console.error(`❌ [${article.slug}] ${res.status}: ${err.error || 'unknown error'}`)
        failCount++
      }
    } catch (err) {
      console.error(`❌ [${article.slug}] 网络错误:`, err)
      failCount++
    }
  }

  console.log(`\n📊 结果: 成功 ${successCount}, 失败 ${failCount}`)
}

// ============================
// 7. 主入口
// ============================

async function main() {
  const mode = process.argv[2] || 'seed'

  console.log('=== MD 文章导入管线 ===\n')
  console.log(`📂 文章目录: ${ARTICLES_DIR}`)
  console.log(`🔧 导入模式: ${mode}\n`)

  // 0. 校验目录 & 加载映射
  if (!fs.existsSync(ARTICLES_DIR)) {
    console.error(`❌ 目录不存在: ${ARTICLES_DIR}`)
    process.exit(1)
  }

  slugMapping = loadSlugMapping(ARTICLES_DIR)

  // 1. 扫描 MD 文件
  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter(f => f.endsWith('.md'))
    .sort()

  if (files.length === 0) {
    console.error('❌ 目录中没有 .md 文件')
    process.exit(1)
  }

  console.log(`📄 找到 ${files.length} 个 MD 文件:\n`)
  for (const f of files) {
    console.log(`   ${f}`)
  }
  console.log('')

  // 2. 解析
  const articles: ParsedArticle[] = []
  for (const file of files) {
    const parsed = parseMdFile(path.join(ARTICLES_DIR, file))
    if (parsed) {
      articles.push(parsed)
      console.log(`📝 ${file} → slug: "${parsed.slug}", 分类: ${parsed.categorySlug}, 标签: [${parsed.tagSlugs.join(', ')}]`)
    }
  }

  if (articles.length === 0) {
    console.error('❌ 没有成功解析的文章')
    process.exit(1)
  }

  console.log(`\n✅ 成功解析 ${articles.length}/${files.length} 篇文章\n`)

  // 3. 执行导入
  switch (mode) {
    case 'seed':
      renderSeedOutput(articles)
      break

    case 'db':
      console.log('--- DB 导入模式 ---\n')
      await importToDb(articles)
      break

    case 'api':
      console.log('--- API 导入模式 ---\n')
      await importViaApi(articles)
      break

    default:
      console.error(`❌ 未知模式: ${mode}，可选: seed | db | api`)
      process.exit(1)
  }

  console.log('\n✨ 完成!')
}

main().catch((err) => {
  console.error('❌ 脚本异常:', err)
  process.exit(1)
})
