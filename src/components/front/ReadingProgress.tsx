"use client"

import { useEffect, useState } from "react"

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) {
        setProgress(0)
        return
      }
      const scrolled = Math.min((scrollTop / docHeight) * 100, 100)
      setProgress(scrolled)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // initial

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className="reading-progress-bar"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="阅读进度"
    />
  )
}
