"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { type Editor, useEditor, EditorContent } from "@tiptap/react"
import { Node, mergeAttributes } from "@tiptap/core"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import { TextStyle } from "@tiptap/extension-text-style"
import TextAlign from "@tiptap/extension-text-align"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Highlight from "@tiptap/extension-highlight"
import Placeholder from "@tiptap/extension-placeholder"
import { Table } from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { common, createLowlight } from "lowlight"
import { FontSize } from "./FontSizeExtension"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  CodeSquare,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ImageIcon,
  Link as LinkIcon,
  Table as TableIcon,
  Highlighter,
  Palette,
  Type,
  Undo,
  Redo,
  SmilePlus,
  BadgeCheck,
  Sigma,
  Sparkles,
  CircleDollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

const lowlight = createLowlight(common)

export interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: number
}

const FONT_SIZES = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
  "36px",
  "48px",
]

const TEXT_COLORS = [
  { label: "默认", value: "inherit" },
  { label: "红色", value: "#ef4444" },
  { label: "橙色", value: "#f97316" },
  { label: "黄色", value: "#eab308" },
  { label: "绿色", value: "#22c55e" },
  { label: "蓝色", value: "#3b82f6" },
  { label: "紫色", value: "#a855f7" },
  { label: "灰色", value: "#6b7280" },
  { label: "黑色", value: "#111827" },
  { label: "白色", value: "#ffffff" },
]

const HIGHLIGHT_COLORS = [
  { label: "黄色", value: "#fef08a" },
  { label: "绿色", value: "#bbf7d0" },
  { label: "蓝色", value: "#bfdbfe" },
  { label: "粉色", value: "#fbcfe8" },
  { label: "橙色", value: "#fed7aa" },
  { label: "紫色", value: "#e9d5ff" },
]

const EMOJI_GROUPS = [
  {
    label: "常用",
    items: ["✅", "⚠️", "🚨", "🔥", "💡", "🎯", "⭐", "📌", "🔒", "🚀", "📈", "📉"],
  },
  {
    label: "教程",
    items: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "👉", "👇", "🔍", "🧭", "📝", "📷", "🎁"],
  },
  {
    label: "币圈",
    items: ["₿", "💰", "🪙", "💳", "🏦", "🛡️", "🔐", "🔑", "📊", "⛓️", "🌐", "⚡"],
  },
]

const SYMBOL_GROUPS = [
  {
    label: "箭头",
    items: ["→", "←", "↑", "↓", "↗", "↘", "⇒", "⇢", "➜", "➤", "⟶", "⇄"],
  },
  {
    label: "货币",
    items: ["$", "¥", "€", "£", "₿", "Ξ", "₮", "₩", "₽", "₹", "¢", "¤"],
  },
  {
    label: "标记",
    items: ["✓", "✕", "★", "☆", "◆", "◇", "●", "○", "▲", "▼", "※", "—"],
  },
]

const BADGE_PRESETS = [
  { label: "推荐", tone: "gold" },
  { label: "必看", tone: "red" },
  { label: "安全", tone: "green" },
  { label: "新手", tone: "blue" },
  { label: "进阶", tone: "purple" },
  { label: "风险", tone: "orange" },
]

const ICON_PRESETS = [
  { icon: "₿", label: "Bitcoin", tone: "gold" },
  { icon: "Ξ", label: "Ethereum", tone: "purple" },
  { icon: "₮", label: "USDT", tone: "green" },
  { icon: "🔒", label: "安全", tone: "blue" },
  { icon: "⚠️", label: "风险", tone: "orange" },
  { icon: "🎁", label: "奖励", tone: "red" },
]

const CALLOUT_PRESETS = [
  { tone: "tip", icon: "💡", title: "操作提示", text: "这里补充关键操作细节。" },
  { tone: "warning", icon: "⚠️", title: "风险提醒", text: "操作前请确认地址、金额和网络是否正确。" },
  { tone: "security", icon: "🔒", title: "安全建议", text: "不要向任何人透露密码、验证码、私钥或助记词。" },
  { tone: "reward", icon: "🎁", title: "奖励说明", text: "以交易所页面实际展示的活动规则为准。" },
]

const ArticleBadge = Node.create({
  name: "articleBadge",
  group: "inline",
  inline: true,
  atom: true,

  addAttributes() {
    return {
      label: {
        default: "标签",
        parseHTML: (element) => element.textContent || "标签",
      },
      tone: {
        default: "gold",
        parseHTML: (element) => element.getAttribute("data-tone") || "gold",
      },
    }
  },

  parseHTML() {
    return [{ tag: "span[data-editor-badge]" }]
  },

  renderHTML({ node, HTMLAttributes }) {
    const tone = node.attrs.tone || "gold"
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-editor-badge": "true",
        "data-tone": tone,
        class: `article-badge article-badge-${tone}`,
      }),
      node.attrs.label || "标签",
    ]
  },
})

const ArticleIconChip = Node.create({
  name: "articleIconChip",
  group: "inline",
  inline: true,
  atom: true,

  addAttributes() {
    return {
      icon: {
        default: "★",
        parseHTML: (element) => element.getAttribute("data-icon") || "★",
      },
      label: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-label") || "",
      },
      tone: {
        default: "gold",
        parseHTML: (element) => element.getAttribute("data-tone") || "gold",
      },
    }
  },

  parseHTML() {
    return [{ tag: "span[data-editor-icon-chip]" }]
  },

  renderHTML({ node, HTMLAttributes }) {
    const tone = node.attrs.tone || "gold"
    const label = node.attrs.label || ""
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-editor-icon-chip": "true",
        "data-icon": node.attrs.icon || "★",
        "data-label": label,
        "data-tone": tone,
        class: `article-icon-chip article-icon-chip-${tone}`,
      }),
      ["span", { class: "article-icon-chip__icon" }, node.attrs.icon || "★"],
      label ? ["span", { class: "article-icon-chip__label" }, label] : ["span", { class: "sr-only" }, ""],
    ]
  },
})

const ArticleCallout = Node.create({
  name: "articleCallout",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      icon: {
        default: "💡",
        parseHTML: (element) => element.getAttribute("data-icon") || "💡",
      },
      title: {
        default: "提示",
        parseHTML: (element) => element.getAttribute("data-title") || "提示",
      },
      text: {
        default: "这里补充说明内容。",
        parseHTML: (element) => element.getAttribute("data-text") || element.textContent || "这里补充说明内容。",
      },
      tone: {
        default: "tip",
        parseHTML: (element) => element.getAttribute("data-tone") || "tip",
      },
    }
  },

  parseHTML() {
    return [{ tag: "div[data-editor-callout]" }]
  },

  renderHTML({ node, HTMLAttributes }) {
    const tone = node.attrs.tone || "tip"
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-editor-callout": "true",
        "data-icon": node.attrs.icon || "💡",
        "data-title": node.attrs.title || "提示",
        "data-text": node.attrs.text || "这里补充说明内容。",
        "data-tone": tone,
        class: `article-callout article-callout-${tone}`,
      }),
      ["span", { class: "article-callout__icon" }, node.attrs.icon || "💡"],
      [
        "span",
        { class: "article-callout__body" },
        ["strong", { class: "article-callout__title" }, node.attrs.title || "提示"],
        ["span", { class: "article-callout__text" }, node.attrs.text || "这里补充说明内容。"],
      ],
    ]
  },
})

function looksLikeMarkdown(value: string): boolean {
  return (
    /(^|\n)\s{0,3}#{1,6}\s+\S/.test(value) ||
    /(^|\n)\s*\|.+\|\s*\n\s*\|[\s:-]+\|/.test(value) ||
    /(^|\n)```/.test(value) ||
    /(^|\n)\s*[-*+]\s+\S/.test(value)
  )
}

function looksLikeHtml(value: string): boolean {
  return /<(p|h[1-6]|ul|ol|li|table|blockquote|pre|figure|div|img|strong|em|br)\b/i.test(value)
}

async function normalizeEditorContent(value: string): Promise<string> {
  if (!value || looksLikeHtml(value) || !looksLikeMarkdown(value)) {
    return value
  }

  const [{ remark }, remarkGfmModule, remarkHtmlModule] = await Promise.all([
    import("remark"),
    import("remark-gfm"),
    import("remark-html"),
  ])
  const result = await remark()
    .use(remarkGfmModule.default)
    .use(remarkHtmlModule.default)
    .process(value)
  return result.toString()
}

interface ToolbarButtonProps {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}

function ToolbarButton({ onClick, active, title, children }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      title={title}
      className="h-8 w-8 p-0"
    >
      {children}
    </Button>
  )
}

interface ToolbarGroupProps {
  children: React.ReactNode
}

function ToolbarGroup({ children }: ToolbarGroupProps) {
  return (
    <div className="flex items-center gap-0.5 border-r border-border px-1">
      {children}
    </div>
  )
}

function MenuBar({ editor }: { editor: Editor }) {
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("输入链接 URL", previousUrl || "https://")
    if (url === null) return
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }, [editor])

  const addImage = useCallback(() => {
    const url = window.prompt("输入图片 URL")
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const addTable = useCallback(() => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run()
  }, [editor])

  const insertTextToken = useCallback(
    (value: string) => {
      editor.chain().focus().insertContent(value).run()
    },
    [editor]
  )

  const insertBadge = useCallback(
    (label: string, tone = "gold") => {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "articleBadge",
          attrs: { label, tone },
        })
        .insertContent(" ")
        .run()
    },
    [editor]
  )

  const insertCustomBadge = useCallback(() => {
    const label = window.prompt("输入徽标文字", "推荐")
    if (!label) return
    insertBadge(label, "gold")
  }, [insertBadge])

  const insertIconChip = useCallback(
    (icon: string, label: string, tone = "gold") => {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "articleIconChip",
          attrs: { icon, label, tone },
        })
        .insertContent(" ")
        .run()
    },
    [editor]
  )

  const insertCallout = useCallback(
    (preset: (typeof CALLOUT_PRESETS)[number]) => {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "articleCallout",
          attrs: preset,
        })
        .run()
    },
    [editor]
  )

  const insertCustomCallout = useCallback(() => {
    const title = window.prompt("输入提示块标题", "操作提示")
    if (!title) return
    const text = window.prompt("输入提示块正文", "这里补充关键说明。")
    if (!text) return
    editor
      .chain()
      .focus()
      .insertContent({
        type: "articleCallout",
        attrs: {
          icon: "💡",
          title,
          text,
          tone: "tip",
        },
      })
      .run()
  }, [editor])

  const currentFontSize = editor.getAttributes("textStyle").fontSize || ""
  const currentColor = editor.getAttributes("textStyle").color || ""
  const currentHighlight = editor.getAttributes("highlight").color || ""

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/30 px-2 py-1.5">
      {/* Undo / Redo */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="撤销"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="重做"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </ToolbarGroup>

      {/* Headings */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
          title="标题 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          title="标题 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
          title="标题 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          active={editor.isActive("heading", { level: 4 })}
          title="标题 4"
        >
          <Heading4 className="h-4 w-4" />
        </ToolbarButton>
      </ToolbarGroup>

      {/* Formatting */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="加粗"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="斜体"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="下划线"
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="删除线"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="行内代码"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>
      </ToolbarGroup>

      {/* Lists */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="无序列表"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="有序列表"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
      </ToolbarGroup>

      {/* Block */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="引用"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="代码块"
        >
          <CodeSquare className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="分隔线"
        >
          <Minus className="h-4 w-4" />
        </ToolbarButton>
      </ToolbarGroup>

      {/* Alignment */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title="左对齐"
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          title="居中"
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          title="右对齐"
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
      </ToolbarGroup>

      {/* Font Size */}
      <ToolbarGroup>
        <Select
          value={currentFontSize}
          onValueChange={(value) => {
            if (value === "default") {
              editor.chain().focus().unsetFontSize().run()
            } else {
              editor.chain().focus().setFontSize(value).run()
            }
          }}
        >
          <SelectTrigger className="h-8 w-20 text-xs">
            <SelectValue placeholder="字号">
              {currentFontSize ? (
                <span className="flex items-center gap-1">
                  <Type className="h-3 w-3" />
                  {currentFontSize}
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Type className="h-3 w-3" />
                  字号
                </span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">默认</SelectItem>
            {FONT_SIZES.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ToolbarGroup>

      {/* Text Color */}
      <ToolbarGroup>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="文字颜色"
            >
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3" align="start">
            <Label className="mb-2 text-xs text-muted-foreground">文字颜色</Label>
            <div className="grid grid-cols-5 gap-1.5">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  className={`h-6 w-6 rounded border ${
                    currentColor === c.value
                      ? "ring-2 ring-primary ring-offset-1"
                      : ""
                  }`}
                  style={{ backgroundColor: c.value === "inherit" ? "transparent" : c.value, borderColor: c.value === "#ffffff" ? "#e5e7eb" : undefined }}
                  title={c.label}
                  onClick={() => {
                    if (c.value === "inherit") {
                      editor.chain().focus().unsetColor().run()
                    } else {
                      editor.chain().focus().setColor(c.value).run()
                    }
                  }}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Highlight */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="高亮"
            >
              <Highlighter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3" align="start">
            <Label className="mb-2 text-xs text-muted-foreground">高亮颜色</Label>
            <div className="grid grid-cols-5 gap-1.5">
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  className={`h-6 w-6 rounded border ${
                    currentHighlight === c.value
                      ? "ring-2 ring-primary ring-offset-1"
                      : ""
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                  onClick={() => {
                    if (currentHighlight === c.value) {
                      editor.chain().focus().unsetHighlight().run()
                    } else {
                      editor.chain().focus().setHighlight({ color: c.value }).run()
                    }
                  }}
                />
              ))}
              <button
                type="button"
                className="col-span-5 mt-1 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => editor.chain().focus().unsetHighlight().run()}
              >
                清除高亮
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </ToolbarGroup>

      {/* Insert */}
      <ToolbarGroup>
        <ToolbarButton onClick={addImage} title="插入图片">
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={setLink} title="插入链接">
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={addTable} title="插入表格">
          <TableIcon className="h-4 w-4" />
        </ToolbarButton>
      </ToolbarGroup>

      {/* Visual Tokens */}
      <ToolbarGroup>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="插入 Emoji"
            >
              <SmilePlus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3" align="start">
            <Label className="mb-2 block text-xs text-muted-foreground">Emoji</Label>
            <div className="space-y-3">
              {EMOJI_GROUPS.map((group) => (
                <div key={group.label} className="space-y-1.5">
                  <div className="text-xs font-medium text-muted-foreground">{group.label}</div>
                  <div className="grid grid-cols-6 gap-1.5">
                    {group.items.map((emoji) => (
                      <button
                        key={`${group.label}-${emoji}`}
                        type="button"
                        className="grid h-8 w-8 place-items-center rounded-md border border-border bg-background text-lg hover:border-primary hover:bg-primary/10"
                        title={emoji}
                        onClick={() => insertTextToken(`${emoji} `)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="插入符号"
            >
              <Sigma className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3" align="start">
            <Label className="mb-2 block text-xs text-muted-foreground">符号</Label>
            <div className="space-y-3">
              {SYMBOL_GROUPS.map((group) => (
                <div key={group.label} className="space-y-1.5">
                  <div className="text-xs font-medium text-muted-foreground">{group.label}</div>
                  <div className="grid grid-cols-6 gap-1.5">
                    {group.items.map((symbol) => (
                      <button
                        key={`${group.label}-${symbol}`}
                        type="button"
                        className="grid h-8 w-8 place-items-center rounded-md border border-border bg-background text-base font-semibold hover:border-primary hover:bg-primary/10"
                        title={symbol}
                        onClick={() => insertTextToken(`${symbol} `)}
                      >
                        {symbol}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="插入徽标"
            >
              <BadgeCheck className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3" align="start">
            <div className="mb-2 flex items-center justify-between gap-2">
              <Label className="text-xs text-muted-foreground">文章徽标</Label>
              <button
                type="button"
                className="text-xs text-primary hover:underline"
                onClick={insertCustomBadge}
              >
                自定义
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {BADGE_PRESETS.map((badge) => (
                <button
                  key={`${badge.tone}-${badge.label}`}
                  type="button"
                  className={`article-badge article-badge-${badge.tone} justify-center`}
                  onClick={() => insertBadge(badge.label, badge.tone)}
                >
                  {badge.label}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="插入图标标签"
            >
              <CircleDollarSign className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3" align="start">
            <Label className="mb-2 block text-xs text-muted-foreground">图标标签</Label>
            <div className="grid grid-cols-2 gap-2">
              {ICON_PRESETS.map((item) => (
                <button
                  key={`${item.tone}-${item.label}`}
                  type="button"
                  className={`article-icon-chip article-icon-chip-${item.tone} justify-start`}
                  onClick={() => insertIconChip(item.icon, item.label, item.tone)}
                >
                  <span className="article-icon-chip__icon">{item.icon}</span>
                  <span className="article-icon-chip__label">{item.label}</span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="插入提示块"
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-3" align="start">
            <div className="mb-2 flex items-center justify-between gap-2">
              <Label className="text-xs text-muted-foreground">提示块</Label>
              <button
                type="button"
                className="text-xs text-primary hover:underline"
                onClick={insertCustomCallout}
              >
                自定义
              </button>
            </div>
            <div className="space-y-2">
              {CALLOUT_PRESETS.map((preset) => (
                <button
                  key={preset.tone}
                  type="button"
                  className={`article-callout article-callout-${preset.tone} w-full text-left`}
                  onClick={() => insertCallout(preset)}
                >
                  <span className="article-callout__icon">{preset.icon}</span>
                  <span className="article-callout__body">
                    <strong className="article-callout__title">{preset.title}</strong>
                    <span className="article-callout__text">{preset.text}</span>
                  </span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </ToolbarGroup>
    </div>
  )
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "开始编辑...",
  minHeight = 400,
}: RichTextEditorProps) {
  const [initialContent, setInitialContent] = useState<string | null>(null)
  const lastIncomingValueRef = useRef(value)
  const onChangeRef = useRef(onChange)
  const didApplyInitialContentRef = useRef(false)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    if (initialContent !== null) return

    let cancelled = false

    normalizeEditorContent(value)
      .then((normalized) => {
        if (!cancelled) {
          setInitialContent(normalized)
          lastIncomingValueRef.current = value
        }
      })
      .catch(() => {
        if (!cancelled) {
          setInitialContent(value)
          lastIncomingValueRef.current = value
        }
      })

    return () => {
      cancelled = true
    }
  }, [initialContent, value])

  const editorClassName = useMemo(
    () =>
      [
        "article-content",
        "admin-editor-content",
        "focus:outline-none",
        "min-h-[200px]",
        "mx-auto",
        "max-w-4xl",
        "px-5",
        "py-6",
        "sm:px-8",
        "lg:px-10",
      ].join(" "),
    []
  )

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      TextStyle,
      FontSize,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-md",
        },
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      ArticleBadge,
      ArticleIconChip,
      ArticleCallout,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    immediatelyRender: false,
    content: "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      lastIncomingValueRef.current = html
      onChangeRef.current(html)
    },
    editorProps: {
      attributes: {
        class: editorClassName,
      },
    },
  }, [editorClassName, placeholder])

  useEffect(() => {
    if (!editor || initialContent === null || didApplyInitialContentRef.current) {
      return
    }

    didApplyInitialContentRef.current = true
    if (initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent, { emitUpdate: false })
    }
  }, [editor, initialContent])

  useEffect(() => {
    if (!editor || value === lastIncomingValueRef.current) return

    let cancelled = false
    normalizeEditorContent(value)
      .then((normalized) => {
        if (cancelled) return
        lastIncomingValueRef.current = value
        if (normalized !== editor.getHTML()) {
          editor.commands.setContent(normalized, { emitUpdate: false })
        }
      })
      .catch(() => {
        if (cancelled) return
        lastIncomingValueRef.current = value
        if (value !== editor.getHTML()) {
          editor.commands.setContent(value, { emitUpdate: false })
        }
      })

    return () => {
      cancelled = true
    }
  }, [editor, value])

  if (!editor || initialContent === null) return null

  return (
    <div
      className="rich-text-editor overflow-hidden rounded-lg border border-border bg-card"
      style={{ minHeight }}
    >
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="bg-background/35 [&_.ProseMirror]:min-h-[250px] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]"
      />
    </div>
  )
}
