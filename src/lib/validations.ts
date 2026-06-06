import { z } from "zod"

// ============================================================
// Auth
// ============================================================
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "请输入邮箱地址")
    .email("请输入有效的邮箱地址"),
  password: z
    .string()
    .min(6, "密码至少需要 6 个字符"),
})

export type LoginInput = z.infer<typeof loginSchema>

// ============================================================
// Exchange (交易所)
// ============================================================
export const exchangeFormSchema = z.object({
  name: z
    .string()
    .min(1, "请输入交易所名称"),
  slug: z
    .string()
    .min(1, "请输入 Slug")
    .regex(/^[a-z0-9-]+$/, "Slug 只能包含小写字母、数字和连字符"),
  website: z
    .string()
    .url("请输入有效的 URL")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .optional()
    .or(z.literal("")),
  logo: z
    .string()
    .optional()
    .or(z.literal("")),
  feeTaker: z
    .string()
    .optional()
    .or(z.literal("")),
  feeMaker: z
    .string()
    .optional()
    .or(z.literal("")),
  features: z
    .string()
    .optional()
    .or(z.literal("")),
  supportedCountries: z
    .string()
    .optional()
    .or(z.literal("")),
  isActive: z
    .boolean()
    .default(true),
  order: z
    .number()
    .int()
    .min(0)
    .default(0),
})

export type ExchangeFormInput = z.infer<typeof exchangeFormSchema>

// ============================================================
// Article (文章)
// ============================================================
export const articleFormSchema = z.object({
  title: z
    .string()
    .min(1, "请输入文章标题"),
  slug: z
    .string()
    .min(1, "请输入 Slug")
    .regex(/^[a-z0-9-]+$/, "Slug 只能包含小写字母、数字和连字符"),
  content: z
    .string()
    .optional()
    .or(z.literal("")),
  excerpt: z
    .string()
    .optional()
    .or(z.literal("")),
  coverImage: z
    .string()
    .optional()
    .or(z.literal("")),
  categoryId: z
    .string()
    .optional()
    .or(z.literal("")),
  tags: z
    .array(z.string())
    .optional()
    .default([]),
  status: z
    .enum(["draft", "published", "archived"])
    .default("draft"),
  exchangeId: z
    .string()
    .optional()
    .or(z.literal("")),
  isFeatured: z
    .boolean()
    .default(false),
  order: z
    .number()
    .int()
    .min(0)
    .default(0),
})

export type ArticleFormInput = z.infer<typeof articleFormSchema>

// ============================================================
// FAQ
// ============================================================
export const faqFormSchema = z.object({
  question: z
    .string()
    .min(1, "请输入问题"),
  answer: z
    .string()
    .min(1, "请输入答案"),
  order: z
    .number()
    .int()
    .min(0)
    .default(0),
  category: z
    .string()
    .optional()
    .or(z.literal("")),
})

export type FAQFormInput = z.infer<typeof faqFormSchema>

// ============================================================
// Site Setting (站点设置)
// ============================================================
export const siteSettingSchema = z.object({
  siteName: z
    .string()
    .min(1, "请输入站点名称"),
  siteDescription: z
    .string()
    .optional()
    .or(z.literal("")),
  siteKeywords: z
    .string()
    .optional()
    .or(z.literal("")),
  siteUrl: z
    .string()
    .url("请输入有效的 URL")
    .optional()
    .or(z.literal("")),
  logo: z
    .string()
    .optional()
    .or(z.literal("")),
  favicon: z
    .string()
    .optional()
    .or(z.literal("")),
  footer: z
    .string()
    .optional()
    .or(z.literal("")),
  contactEmail: z
    .string()
    .email("请输入有效的邮箱地址")
    .optional()
    .or(z.literal("")),
  analyticsId: z
    .string()
    .optional()
    .or(z.literal("")),
})

export type SiteSettingInput = z.infer<typeof siteSettingSchema>

// ============================================================
// Home Section (首页板块)
// ============================================================
export const homeSectionSchema = z.object({
  title: z
    .string()
    .min(1, "请输入板块标题"),
  subtitle: z
    .string()
    .optional()
    .or(z.literal("")),
  type: z
    .string()
    .min(1, "请选择板块类型"),
  order: z
    .number()
    .int()
    .min(0)
    .default(0),
  published: z
    .boolean()
    .default(true),
  content: z
    .string()
    .optional()
    .or(z.literal("")),
})

export type HomeSectionInput = z.infer<typeof homeSectionSchema>
