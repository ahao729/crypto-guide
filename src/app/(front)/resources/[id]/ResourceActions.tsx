"use client"

import { useState } from "react"
import { Download, ExternalLink, Loader2 } from "lucide-react"

interface ResourceActionsProps {
  resourceId: string
  type: string
  externalUrl: string | null
  fileUrl: string | null
  fileSize: string | null
}

export function ResourceActions({
  resourceId,
  type,
  externalUrl,
  fileUrl,
  fileSize,
}: ResourceActionsProps) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    setLoading(true)
    try {
      await fetch(`/api/resources/${resourceId}/download`, { method: "POST" })
    } catch {
      // ignore tracking errors
    } finally {
      setLoading(false)
    }
  }

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
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold to-gold-dark px-6 py-3 text-sm font-medium text-white shadow-md shadow-gold/20 transition-opacity hover:opacity-90"
          >
            <ExternalLink className="h-4 w-4" />
            访问外部资源
          </a>
        )}
        {type === "file" && fileUrl && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold to-gold-dark px-6 py-3 text-sm font-medium text-white shadow-md shadow-gold/20 transition-opacity hover:opacity-90"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            下载文件 {fileSize ? `(${fileSize})` : ""}
          </a>
        )}
      </div>
    </section>
  )
}
