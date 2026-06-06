"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { apiClient } from "@/lib/api-client"
import type { MediaType, MediaFolderType } from "@/types"
import {
  ImageIcon,
  Upload,
  Trash2,
  Loader2,
  Copy,
  Check,
  Search,
  FolderPlus,
  Grid3X3,
  List,
  MoreHorizontal,
  Pencil,
  FolderOpen,
  X,
  ArrowUpDown,
  FileImage,
  LayoutGrid,
} from "lucide-react"
import { formatDateShort } from "@/lib/utils"

type ViewMode = "grid" | "list"

export default function MediaAdminPage() {
  // --- Data states ---
  const [mediaList, setMediaList] = useState<MediaType[]>([])
  const [folders, setFolders] = useState<MediaFolderType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // --- Filter & view states ---
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [folderId, setFolderId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  // --- Upload ---
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // --- Selection ---
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // --- Edit dialog ---
  const [editingMedia, setEditingMedia] = useState<MediaType | null>(null)
  const [editFilename, setEditFilename] = useState("")
  const [editAlt, setEditAlt] = useState("")
  const [editSortOrder, setEditSortOrder] = useState("")
  const [editSaving, setEditSaving] = useState(false)

  // --- Folder dialog ---
  const [folderDialogOpen, setFolderDialogOpen] = useState(false)
  const [folderDialogMode, setFolderDialogMode] = useState<"create" | "rename">("create")
  const [folderDialogValue, setFolderDialogValue] = useState("")
  const [editingFolder, setEditingFolder] = useState<MediaFolderType | null>(null)
  const [folderDialogSaving, setFolderDialogSaving] = useState(false)
  const [folderToDelete, setFolderToDelete] = useState<MediaFolderType | null>(null)

  // --- Copy ---
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // --- Batch move ---
  const [batchMoveOpen, setBatchMoveOpen] = useState(false)
  const [batchMoveTarget, setBatchMoveTarget] = useState<string>("")

  // --- Search debounce ---
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  // --- Data fetching ---
  const fetchMedia = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (debouncedSearch) params.set("search", debouncedSearch)
      if (folderId === "none") {
        params.set("folderId", "null")
      } else if (folderId) {
        params.set("folderId", folderId)
      }
      const qs = params.toString()
      const data = await apiClient.get<{ media: MediaType[]; total: number }>(
        `/api/media${qs ? `?${qs}` : ""}`
      )
      setMediaList(data.media)
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载素材失败")
    }
  }, [debouncedSearch, folderId])

  const fetchFolders = useCallback(async () => {
    try {
      const data = await apiClient.get<MediaFolderType[]>("/api/media/folders")
      setFolders(data)
    } catch {
      // silent
    }
  }, [])

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError("")
    await Promise.all([fetchMedia(), fetchFolders()])
    setLoading(false)
  }, [fetchMedia, fetchFolders])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  // --- Upload ---
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError("")
    try {
      const formData = new FormData()
      formData.append("file", file)
      if (folderId) formData.append("folderId", folderId)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || "上传失败")
      }

      await loadAll()
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  // --- Selection ---
  const allSelected = mediaList.length > 0 && selectedIds.size === mediaList.length

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(mediaList.map((m) => m.id)))
    }
  }

  const clearSelection = () => setSelectedIds(new Set())

  // --- Single delete ---
  const handleDelete = async (media: MediaType) => {
    if (!confirm(`确定删除"${media.filename}"吗？此操作不可恢复。`)) return
    try {
      await apiClient.delete(`/api/media/${media.id}`)
      setMediaList((prev) => prev.filter((m) => m.id !== media.id))
      selectedIds.delete(media.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除失败")
    }
  }

  // --- Batch delete ---
  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`确定删除选中的 ${selectedIds.size} 个素材吗？此操作不可恢复。`)) return
    try {
      await apiClient.post("/api/media", {
        action: "batch-delete",
        ids: Array.from(selectedIds),
      })
      setSelectedIds(new Set())
      await fetchMedia()
    } catch (err) {
      setError(err instanceof Error ? err.message : "批量删除失败")
    }
  }

  // --- Batch move ---
  const handleBatchMove = async () => {
    if (selectedIds.size === 0) return
    try {
      await apiClient.post("/api/media", {
        action: "batch-move",
        ids: Array.from(selectedIds),
        folderId: batchMoveTarget || null,
      })
      setSelectedIds(new Set())
      setBatchMoveOpen(false)
      setBatchMoveTarget("")
      await fetchMedia()
    } catch (err) {
      setError(err instanceof Error ? err.message : "移动失败")
    }
  }

  // --- Copy URL ---
  const handleCopyUrl = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(window.location.origin + url)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      const input = document.createElement("input")
      input.value = window.location.origin + url
      document.body.appendChild(input)
      input.select()
      document.execCommand("copy")
      document.body.removeChild(input)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  // --- Edit dialog ---
  const openEditDialog = (media: MediaType) => {
    setEditingMedia(media)
    setEditFilename(media.filename)
    setEditAlt(media.alt || "")
    setEditSortOrder(String(media.sortOrder ?? 0))
  }

  const handleEditSave = async () => {
    if (!editingMedia) return
    if (!editFilename.trim()) {
      setError("文件名不能为空")
      return
    }
    setEditSaving(true)
    setError("")
    try {
      const updated = await apiClient.patch<MediaType>(`/api/media/${editingMedia.id}`, {
        filename: editFilename.trim(),
        alt: editAlt.trim(),
        sortOrder: Number(editSortOrder) || 0,
      })
      setMediaList((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
      setEditingMedia(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败")
    } finally {
      setEditSaving(false)
    }
  }

  // --- Folder management ---
  const openCreateFolder = () => {
    setFolderDialogMode("create")
    setFolderDialogValue("")
    setEditingFolder(null)
    setFolderDialogOpen(true)
  }

  const openRenameFolder = (folder: MediaFolderType) => {
    setFolderDialogMode("rename")
    setFolderDialogValue(folder.name)
    setEditingFolder(folder)
    setFolderDialogOpen(true)
  }

  const handleFolderSave = async () => {
    if (!folderDialogValue.trim()) {
      setError("请输入分类名称")
      return
    }
    setFolderDialogSaving(true)
    setError("")
    try {
      if (folderDialogMode === "create") {
        await apiClient.post("/api/media/folders", { name: folderDialogValue.trim() })
      } else if (editingFolder) {
        await apiClient.patch(`/api/media/folders/${editingFolder.id}`, {
          name: folderDialogValue.trim(),
        })
      }
      setFolderDialogOpen(false)
      await fetchFolders()
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失败")
    } finally {
      setFolderDialogSaving(false)
    }
  }

  const handleDeleteFolder = async (folder: MediaFolderType) => {
    const msg = `确定删除分类"${folder.name}"吗？该分类下的素材将变为"未分类"。`
    if (!confirm(msg)) return
    try {
      await apiClient.delete(`/api/media/folders/${folder.id}`)
      setFolders((prev) => prev.filter((f) => f.id !== folder.id))
      if (folderId === folder.id) setFolderId(null)
      await fetchMedia()
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除分类失败")
    }
  }

  // --- Sort helpers ---
  const moveSortOrder = async (media: MediaType, direction: "up" | "down") => {
    const sorted = [...mediaList].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    const idx = sorted.findIndex((m) => m.id === media.id)
    if (idx === -1) return
    const swapIdx = direction === "up" ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sorted.length) return

    const current = sorted[idx]
    const target = sorted[swapIdx]

    try {
      await Promise.all([
        apiClient.patch(`/api/media/${current.id}`, { sortOrder: target.sortOrder ?? 0 }),
        apiClient.patch(`/api/media/${target.id}`, { sortOrder: current.sortOrder ?? 0 }),
      ])
      await fetchMedia()
    } catch (err) {
      setError(err instanceof Error ? err.message : "排序失败")
    }
  }

  // --- Helpers ---
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const activeFolderName = folderId
    ? folders.find((f) => f.id === folderId)?.name || "未分类"
    : "全部"

  return (
    <div>
      {/* ===== Header ===== */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">素材库</h1>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex overflow-hidden rounded-md border">
            <Button
              type="button"
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="rounded-none px-2.5"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="rounded-none px-2.5"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Upload button */}
          <Button
            variant="default"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                上传中...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                上传素材
              </>
            )}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </div>
      </div>

      {/* ===== Search & Folder bar ===== */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索素材文件名..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-8"
          />
          {search && (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearch("")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge
            variant={folderId === null ? "default" : "outline"}
            className="cursor-pointer px-3 py-1.5 text-sm"
            onClick={() => setFolderId(null)}
          >
            <LayoutGrid className="mr-1 h-3.5 w-3.5" />
            全部
          </Badge>
          <Badge
            variant={folderId === "none" ? "default" : "outline"}
            className="cursor-pointer px-3 py-1.5 text-sm"
            onClick={() => setFolderId("none")}
          >
            <FileImage className="mr-1 h-3.5 w-3.5" />
            未分类
          </Badge>
          {folders.map((folder) => (
            <DropdownMenu key={folder.id}>
              <DropdownMenuTrigger asChild>
                <Badge
                  variant={folderId === folder.id ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1.5 text-sm"
                >
                  <FolderOpen className="mr-1 h-3.5 w-3.5" />
                  {folder.name}
                  {folder._count && (
                    <span className="ml-1 text-[10px] opacity-70">
                      ({folder._count.media})
                    </span>
                  )}
                </Badge>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                <DropdownMenuItem onClick={() => setFolderId(folder.id)}>
                  <FolderOpen className="mr-2 h-4 w-4" />
                  查看该分类
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => openRenameFolder(folder)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  重命名
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => handleDeleteFolder(folder)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="ml-1 h-7 gap-1 text-xs"
            onClick={openCreateFolder}
          >
            <FolderPlus className="h-3.5 w-3.5" />
            新建
          </Button>
        </div>
      </div>

      {/* ===== Error ===== */}
      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* ===== Bulk action bar ===== */}
      {selectedIds.size > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border bg-muted/50 px-4 py-2.5">
          <span className="text-sm font-medium">
            已选 {selectedIds.size} 项
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={clearSelection}
          >
            <X className="mr-1 h-3.5 w-3.5" />
            取消选择
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setBatchMoveOpen(true)}
            >
              <FolderOpen className="mr-1.5 h-3.5 w-3.5" />
              移动到...
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="h-8 text-xs"
              onClick={handleBatchDelete}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              批量删除
            </Button>
          </div>
        </div>
      )}

      {/* ===== Content ===== */}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          加载中...
        </div>
      ) : mediaList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-muted-foreground">
          <ImageIcon className="mb-3 h-12 w-12" />
          <p className="mb-1 text-lg font-medium">
            {debouncedSearch ? "未找到匹配的素材" : "暂无素材"}
          </p>
          <p className="mb-4 text-sm">
            {debouncedSearch
              ? "尝试其他关键词搜索"
              : `点击"上传素材"按钮添加图片`}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* ===== Grid View ===== */
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {mediaList.map((media) => (
            <div
              key={media.id}
              className={`group relative overflow-hidden rounded-lg border transition-all hover:shadow-md ${
                selectedIds.has(media.id)
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border bg-card"
              }`}
            >
              {/* Checkbox */}
              <div className="absolute left-2 top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                <Checkbox
                  checked={selectedIds.has(media.id)}
                  onCheckedChange={() => toggleSelect(media.id)}
                />
              </div>

              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={media.url}
                  alt={media.alt || media.filename}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => handleCopyUrl(media.url, media.id)}
                  >
                    {copiedId === media.id ? (
                      <Check className="mr-1 h-3.5 w-3.5" />
                    ) : (
                      <Copy className="mr-1 h-3.5 w-3.5" />
                    )}
                    {copiedId === media.id ? "已复制" : "复制"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => openEditDialog(media)}
                  >
                    <Pencil className="mr-1 h-3.5 w-3.5" />
                    编辑
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => handleDelete(media)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Info */}
              <div className="p-2">
                <p className="truncate text-xs font-medium" title={media.filename}>
                  {media.filename}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {formatSize(media.size)} · {formatDateShort(media.createdAt)}
                </p>
                {media.folder && (
                  <Badge variant="secondary" className="mt-1 h-5 text-[10px]">
                    {media.folder.name}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ===== List View ===== */
        <div className="rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50 text-xs font-medium text-muted-foreground">
                <th className="w-10 px-3 py-2.5">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="px-3 py-2.5 text-left">预览</th>
                <th className="px-3 py-2.5 text-left">文件名</th>
                <th className="px-3 py-2.5 text-left">分类</th>
                <th className="px-3 py-2.5 text-left">大小</th>
                <th className="px-3 py-2.5 text-left">排序</th>
                <th className="px-3 py-2.5 text-left">上传时间</th>
                <th className="w-24 px-3 py-2.5 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {mediaList.map((media) => (
                <tr
                  key={media.id}
                  className={`border-b text-sm transition-colors hover:bg-muted/30 ${
                    selectedIds.has(media.id) ? "bg-primary/5" : ""
                  }`}
                >
                  <td className="px-3 py-2.5">
                    <Checkbox
                      checked={selectedIds.has(media.id)}
                      onCheckedChange={() => toggleSelect(media.id)}
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="h-10 w-10 overflow-hidden rounded bg-muted">
                      <img
                        src={media.url}
                        alt={media.alt || media.filename}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="max-w-[200px] px-3 py-2.5">
                    <p className="truncate font-medium" title={media.filename}>
                      {media.filename}
                    </p>
                    {media.alt && (
                      <p className="truncate text-[11px] text-muted-foreground">
                        Alt: {media.alt}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    {media.folder ? (
                      <Badge variant="secondary" className="text-[10px]">
                        {media.folder.name}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-xs text-muted-foreground">
                    {formatSize(media.size)}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-0.5">
                      <span className="text-xs text-muted-foreground">
                        {media.sortOrder ?? 0}
                      </span>
                      <div className="flex flex-col">
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => moveSortOrder(media, "up")}
                        >
                          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m18 15-6-6-6 6" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => moveSortOrder(media, "down")}
                        >
                          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-muted-foreground">
                    {formatDateShort(media.createdAt)}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        title="复制URL"
                        onClick={() => handleCopyUrl(media.url, media.id)}
                      >
                        {copiedId === media.id ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        title="编辑"
                        onClick={() => openEditDialog(media)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-destructive"
                        title="删除"
                        onClick={() => handleDelete(media)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== Edit Media Dialog ===== */}
      <Dialog
        open={!!editingMedia}
        onOpenChange={(open) => {
          if (!open) setEditingMedia(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>编辑素材</DialogTitle>
            <DialogDescription>
              修改文件名、Alt 文本或排序值
            </DialogDescription>
          </DialogHeader>
          {editingMedia && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="h-32 w-32 overflow-hidden rounded-lg bg-muted">
                  <img
                    src={editingMedia.url}
                    alt={editingMedia.filename}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">文件名</label>
                <Input
                  value={editFilename}
                  onChange={(e) => setEditFilename(e.target.value)}
                  placeholder="文件名"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Alt 文本</label>
                <Input
                  value={editAlt}
                  onChange={(e) => setEditAlt(e.target.value)}
                  placeholder="Alt 文本（用于 SEO）"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">排序值</label>
                <Input
                  type="number"
                  value={editSortOrder}
                  onChange={(e) => setEditSortOrder(e.target.value)}
                  placeholder="数字越小越靠前"
                />
                <p className="text-xs text-muted-foreground">
                  数字越小，排列越靠前
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingMedia(null)}
            >
              取消
            </Button>
            <Button
              type="button"
              onClick={handleEditSave}
              disabled={editSaving}
            >
              {editSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : (
                "保存"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Create / Rename Folder Dialog ===== */}
      <Dialog
        open={folderDialogOpen}
        onOpenChange={setFolderDialogOpen}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {folderDialogMode === "create" ? "新建分类" : "重命名分类"}
            </DialogTitle>
            <DialogDescription>
              {folderDialogMode === "create"
                ? "创建一个新的素材分类"
                : "修改当前分类的名称"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">分类名称</label>
            <Input
              value={folderDialogValue}
              onChange={(e) => setFolderDialogValue(e.target.value)}
              placeholder="例如：Banner、Logo、图标"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleFolderSave()
              }}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setFolderDialogOpen(false)}
            >
              取消
            </Button>
            <Button
              type="button"
              onClick={handleFolderSave}
              disabled={folderDialogSaving}
            >
              {folderDialogSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : (
                "确认"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Batch Move Dialog ===== */}
      <Dialog open={batchMoveOpen} onOpenChange={setBatchMoveOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>移动到分类</DialogTitle>
            <DialogDescription>
              将选中的 {selectedIds.size} 个素材移动到指定分类
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">目标分类</label>
            <Select
              value={batchMoveTarget}
              onValueChange={setBatchMoveTarget}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择分类（留空=未分类）" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">
                  未分类
                </SelectItem>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setBatchMoveOpen(false)}
            >
              取消
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (batchMoveTarget === "__none__") {
                  setBatchMoveTarget("")
                }
                handleBatchMove()
              }}
            >
              移动
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
