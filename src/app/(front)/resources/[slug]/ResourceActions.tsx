"use client"

import { useState, useCallback } from "react"
import { Download, ExternalLink, Loader2, CheckCircle } from "lucide-react"

interface ResourceActionsProps {
  resourceId: string
  resourceSlug: string
  type: string
  externalUrl: string | null
  fileUrl: string | null
  fileSize: string | null
}

export function ResourceActions({
  resourceId,
  resourceSlug,
  type,
  externalUrl,
  fileUrl,
  fileSize,
}: ResourceActionsProps) {
  const [loading, setLoading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)

  const handleDownload = useCallback(async () => {
    setLoading(true)
    try {
      // Track the download (by id for accuracy)
      await fetch(`/api/resources/${resourceId}/download`, { method: "POST" })

      // If file resource, trigger actual download
      if (type === "file" && fileUrl) {
        const link = document.createElement("a")
        link.href = fileUrl
        link.download = ""
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

      setDownloadComplete(true)
      setTimeout(() => setDownloadComplete(false), 3000)
    } catch (error) {
      console.error("Download failed:", error)
      if (type === "file" && fileUrl) {
        window.open(fileUrl, "_blank")
      }
    } finally {
      setLoading(false)
    }
  }, [resourceId, type, fileUrl])

  const hasAction = (type === "external" && externalUrl) || (type === "file" && fileUrl)
  if (!hasAction) return null

  return (
    <section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap gap-3">
        {type === "external" && externalUrl && (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold to-gold-dark px-6 py-3 text-sm font-medium text-white shadow-md shadow-gold/20 transition-all hover:shadow-lg hover:shadow-gold/30 hover:scale-105 active:scale-95"
          >
            <ExternalLink className="h-4 w-4" />
            访问外部资源
          </a>
        )}
        {type === "file" && fileUrl && (
          <button
            onClick={handleDownload}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold to-gold-dark px-6 py-3 text-sm font-medium text-white shadow-md shadow-gold/20 transition-all hover:shadow-lg hover:shadow-gold/30 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : downloadComplete ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {loading ? "下载中..." : downloadComplete ? "下载完成" : "下载文件"}
            {fileSize && !loading && !downloadComplete && (
              <span className="ml-1 text-xs opacity-80">({fileSize})</span>
            )}
          </button>
        )}
      </div>
    </section>
  )
}
