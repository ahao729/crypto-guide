/**
 * Lightweight in-memory TTL cache.
 *
 * Designed for server-side use — keeps a simple Map of key → { data, expiresAt }.
 * Each API route creates (or reuses) a named singleton with a sensible TTL.
 *
 * Features:
 *  - Configurable TTL per instance
 *  - Force-refresh support via `_refresh` query parameter (handled in route)
 *  - Periodic background cleanup (every 5 min) to prevent memory leaks
 *  - Works in both long-running servers and serverless (per-instance cache)
 */

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

export class TTLCache {
  private store = new Map<string, CacheEntry<unknown>>()
  private defaultTTL: number
  private cleanupTimer: ReturnType<typeof setInterval> | null = null

  /**
   * @param defaultTTLMs  Default time-to-live in milliseconds (default 15s)
   */
  constructor(defaultTTLMs = 15_000) {
    this.defaultTTL = defaultTTLMs
    // Start periodic cleanup to avoid unbounded memory growth
    this.cleanupTimer = setInterval(() => this.cleanup(), 300_000) // every 5 min
    // Allow the process to exit naturally without clearing this timer
    if (this.cleanupTimer && typeof this.cleanupTimer === "object" && "unref" in this.cleanupTimer) {
      this.cleanupTimer.unref()
    }
  }

  /** Retrieve a cached value. Returns `undefined` if missing or expired. */
  get<T>(key: string): T | undefined {
    const entry = this.store.get(key)
    if (!entry) return undefined
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return undefined
    }
    return entry.data as T
  }

  /** Store a value in the cache. */
  set<T>(key: string, data: T, ttlMs?: number): void {
    this.store.set(key, {
      data,
      expiresAt: Date.now() + (ttlMs ?? this.defaultTTL),
    })
  }

  /** Check if a key exists and is still fresh. */
  has(key: string): boolean {
    return this.get(key) !== undefined
  }

  /**
   * Invalidate one key, or all keys if no key is provided.
   * Used for force-refresh: the API route ignores cache and calls
   * `cache.invalidate(key)` before re-fetching.
   */
  invalidate(key?: string): void {
    if (key) {
      this.store.delete(key)
    } else {
      this.store.clear()
    }
  }

  /** Remove all expired entries. Called periodically. */
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.store) {
      if (now > entry.expiresAt) {
        this.store.delete(key)
      }
    }
  }

  /** Tear down the cleanup timer and clear all entries. */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = null
    }
    this.store.clear()
  }
}

// ─── Pre-configured singletons ─────────────────────────────────────────

/** Market data cache — 30 seconds TTL.
 *  Used by /api/market/overview and /api/market/coins */
export const marketCache = new TTLCache(30_000)
