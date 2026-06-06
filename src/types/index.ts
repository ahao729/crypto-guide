export interface ExchangeType {
  id: string
  name: string
  shortName: string | null
  slug: string
  logo: string | null
  description: string | null
  content: string | null
  rating: number
  referralUrl: string | null
  inviteCode: string | null
  feeRate: string | null
  spotFee: string | null
  futuresFee: string | null
  features: string | null
  supportedCoins: string | null
  regulation: string | null
  status: string
  sortOrder: number
  isFeatured: boolean
  isPopular: boolean
  clickCount: number
  createdAt: Date
  updatedAt: Date
  categoryId: string | null
  category: CategoryType | null
}

export interface ArticleType {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  coverImage: string | null
  author: string | null
  published: boolean
  publishedAt: Date | null
  clickCount: number
  createdAt: Date
  updatedAt: Date
  categoryId: string | null
  category: CategoryType | null
  tags: { tag: TagType }[]
}

export interface CategoryType {
  id: string
  name: string
  slug: string
  description: string | null
  type: string
  sortOrder: number
  _count?: {
    exchanges?: number
    articles?: number
  }
}

export interface TagType {
  id: string
  name: string
  slug: string
  _count?: {
    articles?: number
  }
}

export interface FAQType {
  id: string
  question: string
  answer: string
  sortOrder: number
  published: boolean
}

export interface SiteSettingType {
  id: string
  key: string
  value: string
}

export interface HomeSectionType {
  id: string
  title: string
  subtitle: string | null
  type: string
  sortOrder: number
  published: boolean
}

export interface MediaType {
  id: string
  filename: string
  url: string
  type: string
  size: number
  alt: string | null
  sortOrder: number
  folderId: string | null
  folder: MediaFolderType | null
  createdAt: Date
  updatedAt: Date
}

export interface ResourceType {
  id: string
  title: string
  description: string | null
  category: string    // newbie, template, tool, link
  type: string        // file, external
  fileUrl: string | null
  fileSize: string | null
  externalUrl: string | null
  icon: string | null
  tags: string | null
  downloadCount: number
  sortOrder: number
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export interface MediaFolderType {
  id: string
  name: string
  slug: string
  _count?: {
    media: number
  }
  createdAt: Date
  updatedAt: Date
}
