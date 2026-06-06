"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiClient } from "@/lib/api-client"
import type { MediaType } from "@/types"
import { ImageIcon, Upload, Trash2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface MediaPickerDialogProps {
  onSelect: (url: string, alt?: string) => void
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function MediaPickerDialog({
  onSelect,
  children,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: MediaPickerDialogProps) {
  const [open, setOpen] = useState(false)
  const [mediaList, setMediaList] = useState<MediaType[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [error, setError] = useState("")

  const isOpen = controlledOpen ?? open
  const setIsOpen = setControlledOpen ?? setOpen

  const fetchMedia = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const data = await apiClient.get<{ media: MediaType[]; total: number }>(
        "/api/media"
      )
      setMediaList(data.media)
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载素材失败")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      fetchMedia()
    }
  }, [isOpen, fetchMedia])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError("")
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || "上传失败")
      }

      await fetchMedia()
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleDelete = async (media: MediaType) => {
    if (!confirm(`确定删除"${media.filename}"吗？`)) return
    try {
      await apiClient.delete(`/api/media/${media.id}`)
      setMediaList((prev) => prev.filter((m) => m.id !== media.id))
      if (selectedId === media.id) setSelectedId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除失败")
    }
  }

  const handleSelect = () => {
    const selected = mediaList.find((m) => m.id === selectedId)
    if (selected) {
      onSelect(selected.url, selected.alt || undefined)
      setIsOpen(false)
      setSelectedId(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>选择素材</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload area */}
          <div className="flex items-center gap-3">
            <Label className="cursor-pointer">
              <div className="flex items-center gap-2 rounded-md border border-dashed border-border px-4 py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {uploading ? "上传中..." : "上传新图片"}
              </div>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </Label>
            {error && (
              <span className="text-sm text-destructive">{error}</span>
            )}
          </div>

          {/* Media grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              加载中...
            </div>
          ) : mediaList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ImageIcon className="mb-2 h-10 w-10" />
              <p className="text-sm">暂无素材，请上传</p>
            </div>
          ) : (
            <div className="grid max-h-80 grid-cols-4 gap-3 overflow-y-auto">
              {mediaList.map((media) => (
                <div
                  key={media.id}
                  className={cn(
                    "group relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all",
                    selectedId === media.id
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => setSelectedId(media.id)}
                >
                  <div className="aspect-square">
                    <img
                      src={media.url}
                      alt={media.alt || media.filename}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="truncate px-1 py-0.5 text-xs text-muted-foreground">
                    {media.filename}
                  </div>
                  <button
                    type="button"
                    className="absolute right-1 top-1 hidden rounded bg-background/80 p-1 text-destructive hover:bg-background group-hover:block"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(media)
                    }}
                    title="删除"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              取消
            </Button>
            <Button
              type="button"
              onClick={handleSelect}
              disabled={!selectedId}
            >
              确认选择
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Helper Label wrapper for file input
function Label({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={className} {...props}>
      {children}
    </label>
  )
}
