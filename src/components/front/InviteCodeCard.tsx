"use client"

import { Tag, Copy, Check, AlertCircle } from "lucide-react"
import { useState } from "react"

export function InviteCodeCard({ inviteCode }: { inviteCode: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea")
      textarea.value = inviteCode
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card">
      <div className="border-b border-border/40 p-4">
        <h3 className="flex items-center gap-2 font-semibold">
          <Tag className="h-4 w-4 text-gold" />
          邀请码
        </h3>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <code className="rounded-md bg-gold/10 px-3 py-1.5 text-lg font-bold text-gold">
            {inviteCode}
          </code>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
            title={copied ? "已复制" : "复制邀请码"}
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            {copied ? "已复制" : "复制"}
          </button>
        </div>
        {/* Prominent reminder */}
        <div className="mt-4 rounded-lg border border-amber-200/60 bg-amber-50/80 p-3 dark:border-amber-800/40 dark:bg-amber-950/30">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">
              <strong className="font-semibold">重要提醒：</strong>
              注册时请务必填写上方邀请码 <strong className="font-semibold">{inviteCode}</strong>，
              否则无法享受专属手续费折扣和福利优惠。
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
