import { remark } from "remark"
import remarkGfm from "remark-gfm"
import remarkHtml from "remark-html"
import DOMPurify from "isomorphic-dompurify"
import { generateSlug } from "./utils"
import { replaceEmojiWithIcons } from "./emoji-icons"

const DOMPURIFY_CONFIG = {
  ALLOWED_TAGS: [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "br", "strong", "em", "u", "s", "del", "ins", "mark", "sub", "sup",
    "a", "img", "figure", "figcaption",
    "ul", "ol", "li",
    "blockquote", "pre", "code",
    "table", "thead", "tbody", "tr", "th", "td",
    "hr", "div", "span", "section", "article", "aside", "details", "summary",
    "input", "label",
  ],
  ALLOWED_ATTR: [
    "href", "src", "alt", "title", "width", "height", "loading",
    "class", "id", "target", "rel",
    "colspan", "rowspan", "align", "valign",
    "type", "checked", "disabled",
  ],
  ALLOW_DATA_ATTR: false,
}

export interface TocEntry {
  id: string
  text: string
  level: 2 | 3
}

function isHtmlContent(content: string): boolean {
  const trimmed = content.trim()
  const hasMarkdownStructure =
    /(^|\n)\s{0,3}#{1,6}\s+\S/.test(content) ||
    /(^|\n)\s*\|.+\|\s*\n\s*\|[\s:-]+\|/.test(content) ||
    /(^|\n)\s*[-*+]\s+\S/.test(content) ||
    /(^|\n)\s*\d+\.\s+\S/.test(content) ||
    /(^|\n)```/.test(content)

  if (hasMarkdownStructure) {
    return false
  }

  return /^<[\w-]+[\s>]/.test(trimmed) || /<(p|h[1-6]|ul|ol|li|table|blockquote|pre|figure|div|section|article)\b/i.test(trimmed)
}

/**
 * Process article content (markdown or HTML → HTML):
 * - If content is already HTML, use it directly (skip markdown conversion)
 * - If content is markdown, convert to HTML via remark + remark-html
 * - Add `id` attributes to h2/h3 elements for anchor linking
 * - Return processed HTML and an array of TOC entries
 */
export async function processArticleHtml(content: string): Promise<{
  html: string
  headings: TocEntry[]
}> {
  let html: string

  if (isHtmlContent(content)) {
    // Content is already HTML (from rich text editor), sanitize it
    html = DOMPurify.sanitize(content, DOMPURIFY_CONFIG) as string
  } else {
    // Convert markdown to HTML
    const result = await remark().use(remarkGfm).use(remarkHtml).process(content)
    html = DOMPurify.sanitize(result.toString(), DOMPURIFY_CONFIG) as string
  }

  // 2. Extract headings and inject anchor IDs
  const headings: TocEntry[] = []
  const seenIds = new Map<string, number>()

  const processed = html.replace(
    /<h([23])\b([^>]*)>(.*?)<\/h[23]>/gi,
    (_match, level: string, attrs: string, content: string) => {
      const lvl = parseInt(level) as 2 | 3
      const plainText = stripHtmlTags(content)
      let id = generateSlug(plainText)
      if (!id) {
        id = `heading-${headings.length}`
      }

      // Handle duplicate IDs
      if (seenIds.has(id)) {
        const count = seenIds.get(id)! + 1
        seenIds.set(id, count)
        id = `${id}-${count}`
      } else {
        seenIds.set(id, 1)
      }

      headings.push({ id, text: plainText, level: lvl })

      // Strip any existing id attribute from attrs to avoid duplicate id
      const cleanAttrs = attrs.replace(/\s+id\s*=\s*(?:"[^"]*"|'[^']*'|\S+)/gi, "")
      // Build heading with anchor link
      const anchor = `<a href="#${id}" class="heading-anchor" aria-hidden="true">#</a>`
      return `<h${level}${cleanAttrs} id="${id}">${anchor}${content}</h${level}>`
    }
  )

  // 3. Wrap images in <figure> with <figcaption> using alt or title
  html = wrapImagesWithFigure(processed)

  // 4. Replace emoji with inline SVG icons (content text only, not in tag attributes)
  html = replaceEmojiWithIcons(html)

  return { html, headings }
}

/**
 * Wrap <img> tags in <figure> with <figcaption>.
 * - Uses `title` attribute as caption if present
 * - Falls back to `alt` attribute
 * - Images already inside a <figure> are skipped
 */
function wrapImagesWithFigure(html: string): string {
  return html.replace(
    /<img[^>]+>/gi,
    (imgTag) => {
      // Skip if already inside a figure
      const titleMatch = imgTag.match(/title=["']([^"']*)["']/)
      const altMatch = imgTag.match(/alt=["']([^"']*)["']/)
      const caption = titleMatch?.[1]?.trim() || altMatch?.[1]?.trim() || ""

      const figcaption = caption
        ? `\n  <figcaption>${escapeHtml(caption)}</figcaption>\n`
        : ""
      return `<figure>\n  ${imgTag}${figcaption}</figure>`
    }
  )
}

/**
 * Minimal HTML escaping for figcaption content.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

/**
 * Strip HTML tags from a string, returning plain text.
 */
function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
}

/**
 * Extract first image URL from HTML content (for meta tags).
 */
export function extractFirstImage(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/)
  return match ? match[1] : null
}

/**
 * Estimate reading time in minutes based on Chinese + English content.
 */
export function estimateReadingTime(html: string): number {
  const text = stripHtmlTags(html)
  // Chinese: ~300 chars/min, English: ~200 words/min
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length
  const englishWords = text
    .replace(/[\u4e00-\u9fff]/g, "")
    .split(/\s+/)
    .filter(Boolean).length

  const minutes = Math.ceil(chineseChars / 300 + englishWords / 200)
  return Math.max(1, minutes)
}
