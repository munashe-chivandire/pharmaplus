/**
 * Performance Optimization Utilities
 * Caching, memoization, debouncing, and query optimization
 */

// Simple in-memory cache (use Redis in production)
const cache = new Map<string, { data: any; expiry: number }>()

/**
 * Cache configuration
 */
export const cacheConfig = {
  default: 300, // 5 minutes
  short: 60, // 1 minute
  medium: 600, // 10 minutes
  long: 3600, // 1 hour
  day: 86400, // 24 hours
}

/**
 * Get cached data
 */
export function getCache<T>(key: string): T | null {
  const cached = cache.get(key)
  if (!cached) return null

  if (Date.now() > cached.expiry) {
    cache.delete(key)
    return null
  }

  return cached.data as T
}

/**
 * Set cache data
 */
export function setCache<T>(key: string, data: T, ttlSeconds: number = cacheConfig.default): void {
  cache.set(key, {
    data,
    expiry: Date.now() + ttlSeconds * 1000,
  })
}

/**
 * Delete cache entry
 */
export function deleteCache(key: string): void {
  cache.delete(key)
}

/**
 * Clear cache by pattern
 */
export function clearCacheByPattern(pattern: string): number {
  let cleared = 0
  const regex = new RegExp(pattern)

  cache.forEach((_, key) => {
    if (regex.test(key)) {
      cache.delete(key)
      cleared++
    }
  })

  return cleared
}

/**
 * Cache wrapper for async functions
 */
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttlSeconds: number = cacheConfig.default
): Promise<T> {
  const cached = getCache<T>(key)
  if (cached !== null) {
    return cached
  }

  const result = await fn()
  setCache(key, result, ttlSeconds)
  return result
}

/**
 * Memoize function results
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  options: {
    maxSize?: number
    ttlMs?: number
    keyFn?: (...args: Parameters<T>) => string
  } = {}
): T {
  const { maxSize = 100, ttlMs = 60000, keyFn } = options
  const cache = new Map<string, { result: ReturnType<T>; timestamp: number }>()

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args)
    const cached = cache.get(key)

    if (cached && Date.now() - cached.timestamp < ttlMs) {
      return cached.result
    }

    const result = fn(...args)

    // Enforce max size
    if (cache.size >= maxSize) {
      const oldestKey = cache.keys().next().value
      if (oldestKey) cache.delete(oldestKey)
    }

    cache.set(key, { result, timestamp: Date.now() })
    return result
  }) as T
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  waitMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, waitMs)
  }
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limitMs: number
): (...args: Parameters<T>) => void {
  let lastRun = 0
  let pending = false

  return (...args: Parameters<T>) => {
    const now = Date.now()

    if (now - lastRun >= limitMs) {
      lastRun = now
      fn(...args)
    } else if (!pending) {
      pending = true
      setTimeout(() => {
        lastRun = Date.now()
        pending = false
        fn(...args)
      }, limitMs - (now - lastRun))
    }
  }
}

/**
 * Batch async operations
 */
export function createBatcher<K, V>(
  batchFn: (keys: K[]) => Promise<Map<K, V>>,
  options: {
    maxBatchSize?: number
    delayMs?: number
  } = {}
): (key: K) => Promise<V> {
  const { maxBatchSize = 100, delayMs = 10 } = options
  let batch: K[] = []
  let batchPromise: Promise<Map<K, V>> | null = null
  let resolvers: Map<K, { resolve: (v: V) => void; reject: (e: any) => void }> = new Map()

  const executeBatch = async () => {
    const currentBatch = batch
    const currentResolvers = resolvers
    batch = []
    resolvers = new Map()
    batchPromise = null

    try {
      const results = await batchFn(currentBatch)
      currentBatch.forEach((key) => {
        const resolver = currentResolvers.get(key)
        if (resolver) {
          const value = results.get(key)
          if (value !== undefined) {
            resolver.resolve(value)
          } else {
            resolver.reject(new Error(`No result for key: ${key}`))
          }
        }
      })
    } catch (error) {
      currentResolvers.forEach(({ reject }) => reject(error))
    }
  }

  return (key: K): Promise<V> => {
    return new Promise((resolve, reject) => {
      batch.push(key)
      resolvers.set(key, { resolve, reject })

      if (batch.length >= maxBatchSize) {
        executeBatch()
      } else if (!batchPromise) {
        batchPromise = new Promise((resolve) => {
          setTimeout(() => {
            executeBatch()
            resolve(new Map())
          }, delayMs)
        })
      }
    })
  }
}

/**
 * Lazy loading utility
 */
export function lazyLoad<T>(
  factory: () => Promise<T>,
  options: { preload?: boolean } = {}
): () => Promise<T> {
  let instance: T | null = null
  let loading: Promise<T> | null = null

  const load = async (): Promise<T> => {
    if (instance) return instance

    if (!loading) {
      loading = factory().then((result) => {
        instance = result
        return result
      })
    }

    return loading
  }

  if (options.preload) {
    load()
  }

  return load
}

/**
 * Connection pool for database connections
 */
export class ConnectionPool<T> {
  private pool: T[] = []
  private inUse: Set<T> = new Set()
  private waiting: ((conn: T) => void)[] = []

  constructor(
    private factory: () => Promise<T>,
    private options: {
      minSize?: number
      maxSize?: number
      idleTimeoutMs?: number
    } = {}
  ) {
    this.options = {
      minSize: 2,
      maxSize: 10,
      idleTimeoutMs: 30000,
      ...options,
    }

    // Initialize minimum connections
    this.initialize()
  }

  private async initialize() {
    for (let i = 0; i < (this.options.minSize || 2); i++) {
      const conn = await this.factory()
      this.pool.push(conn)
    }
  }

  async acquire(): Promise<T> {
    // Return available connection
    if (this.pool.length > 0) {
      const conn = this.pool.pop()!
      this.inUse.add(conn)
      return conn
    }

    // Create new connection if under max
    if (this.inUse.size < (this.options.maxSize || 10)) {
      const conn = await this.factory()
      this.inUse.add(conn)
      return conn
    }

    // Wait for available connection
    return new Promise((resolve) => {
      this.waiting.push(resolve)
    })
  }

  release(conn: T): void {
    this.inUse.delete(conn)

    // Give to waiting requester
    if (this.waiting.length > 0) {
      const resolve = this.waiting.shift()!
      this.inUse.add(conn)
      resolve(conn)
      return
    }

    // Return to pool
    this.pool.push(conn)
  }

  async withConnection<R>(fn: (conn: T) => Promise<R>): Promise<R> {
    const conn = await this.acquire()
    try {
      return await fn(conn)
    } finally {
      this.release(conn)
    }
  }
}

/**
 * Query optimization helpers
 */
export const queryOptimization = {
  /**
   * Paginate results efficiently
   */
  paginate<T>(
    items: T[],
    page: number,
    limit: number
  ): {
    data: T[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  } {
    const total = items.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const data = items.slice(start, start + limit)

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }
  },

  /**
   * Build efficient WHERE clause
   */
  buildWhereClause(
    filters: Record<string, any>,
    fieldMappings: Record<string, string> = {}
  ): { sql: string; params: any[] } {
    const conditions: string[] = []
    const params: any[] = []

    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null) return

      const field = fieldMappings[key] || key

      if (Array.isArray(value)) {
        const placeholders = value.map((_, i) => `$${params.length + i + 1}`).join(", ")
        conditions.push(`${field} IN (${placeholders})`)
        params.push(...value)
      } else if (typeof value === "object" && value !== null) {
        if (value.gte !== undefined) {
          conditions.push(`${field} >= $${params.length + 1}`)
          params.push(value.gte)
        }
        if (value.lte !== undefined) {
          conditions.push(`${field} <= $${params.length + 1}`)
          params.push(value.lte)
        }
        if (value.contains !== undefined) {
          conditions.push(`${field} ILIKE $${params.length + 1}`)
          params.push(`%${value.contains}%`)
        }
      } else {
        conditions.push(`${field} = $${params.length + 1}`)
        params.push(value)
      }
    })

    return {
      sql: conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
      params,
    }
  },
}

/**
 * Image optimization helper
 */
export function getOptimizedImageUrl(
  url: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: "webp" | "avif" | "jpg" | "png"
  } = {}
): string {
  const { width, height, quality = 80, format = "webp" } = options

  // For Next.js Image Optimization
  if (url.startsWith("/")) {
    const params = new URLSearchParams()
    params.set("url", url)
    if (width) params.set("w", String(width))
    if (height) params.set("h", String(height))
    params.set("q", String(quality))
    return `/_next/image?${params.toString()}`
  }

  return url
}
