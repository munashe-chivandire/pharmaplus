/**
 * Security Module
 * Rate limiting, CSRF protection, input validation, and security headers
 */

import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// Rate limiting store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  message?: string
}

export const defaultRateLimits: Record<string, RateLimitConfig> = {
  api: { windowMs: 60000, maxRequests: 100 }, // 100 requests per minute
  auth: { windowMs: 300000, maxRequests: 5 }, // 5 login attempts per 5 minutes
  upload: { windowMs: 60000, maxRequests: 10 }, // 10 uploads per minute
  export: { windowMs: 60000, maxRequests: 5 }, // 5 exports per minute
}

/**
 * Get client IP address
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  if (realIp) {
    return realIp
  }

  return "unknown"
}

/**
 * Rate limiter
 */
export function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = defaultRateLimits.api
): { allowed: boolean; remaining: number; resetIn: number } {
  const ip = getClientIp(request)
  const key = `${ip}:${request.nextUrl.pathname}`
  const now = Date.now()

  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    // First request or window expired
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    })
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetIn: config.windowMs,
    }
  }

  if (record.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: record.resetTime - now,
    }
  }

  record.count++
  rateLimitStore.set(key, record)

  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetIn: record.resetTime - now,
  }
}

/**
 * Generate CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

/**
 * Validate CSRF token
 */
export function validateCsrfToken(token: string, sessionToken: string): boolean {
  if (!token || !sessionToken) return false
  return crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(sessionToken)
  )
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  if (typeof input !== "string") return ""

  return input
    .replace(/[<>]/g, "") // Remove < and >
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim()
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject(obj: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {}

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeString(value)
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((v) =>
        typeof v === "string" ? sanitizeString(v) : v
      )
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeObject(value)
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

/**
 * Validate Zimbabwe phone number
 */
export function isValidZimbabwePhone(phone: string): boolean {
  const phoneRegex = /^\+263(71|73|77|78)\d{7}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

/**
 * Validate Zimbabwe ID number
 */
export function isValidZimbabweId(id: string): boolean {
  const idRegex = /^\d{2}-\d{6,7}-[A-Z]-\d{2}$/
  return idRegex.test(id)
}

/**
 * Password strength checker
 */
export function checkPasswordStrength(password: string): {
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push("Password should be at least 8 characters")
  }

  if (password.length >= 12) {
    score += 1
  }

  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push("Add lowercase letters")
  }

  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push("Add uppercase letters")
  }

  if (/\d/.test(password)) {
    score += 1
  } else {
    feedback.push("Add numbers")
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1
  } else {
    feedback.push("Add special characters")
  }

  // Common password patterns to avoid
  const commonPatterns = [
    /^123/,
    /password/i,
    /qwerty/i,
    /abc123/i,
    /(.)\1{2,}/, // Repeated characters
  ]

  if (commonPatterns.some((pattern) => pattern.test(password))) {
    score = Math.max(0, score - 2)
    feedback.push("Avoid common patterns")
  }

  return { score, feedback }
}

/**
 * Security headers configuration
 */
export const securityHeaders = {
  "X-DNS-Prefetch-Control": "on",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-XSS-Protection": "1; mode=block",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-ancestors 'self'",
  ].join("; "),
}

/**
 * Apply security headers to response
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

/**
 * Audit log entry
 */
export interface AuditLogEntry {
  id: string
  timestamp: Date
  userId: string
  action: string
  resource: string
  resourceId?: string
  ipAddress: string
  userAgent: string
  details?: Record<string, any>
  status: "success" | "failure"
}

/**
 * Create audit log entry
 */
export async function createAuditLog(
  entry: Omit<AuditLogEntry, "id" | "timestamp">
): Promise<AuditLogEntry> {
  const auditEntry: AuditLogEntry = {
    ...entry,
    id: `audit_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
    timestamp: new Date(),
  }

  // In production, save to database
  // await prisma.auditLog.create({ data: auditEntry })

  console.log("[AUDIT]", JSON.stringify(auditEntry))

  return auditEntry
}

/**
 * Data encryption utilities
 */
export const encryption = {
  /**
   * Encrypt sensitive data
   */
  encrypt(data: string, key: string = process.env.ENCRYPTION_KEY || ""): string {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(
      "aes-256-gcm",
      Buffer.from(key.padEnd(32).slice(0, 32)),
      iv
    )

    let encrypted = cipher.update(data, "utf8", "hex")
    encrypted += cipher.final("hex")

    const authTag = cipher.getAuthTag()

    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`
  },

  /**
   * Decrypt sensitive data
   */
  decrypt(encryptedData: string, key: string = process.env.ENCRYPTION_KEY || ""): string {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(":")

    const iv = Buffer.from(ivHex, "hex")
    const authTag = Buffer.from(authTagHex, "hex")

    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      Buffer.from(key.padEnd(32).slice(0, 32)),
      iv
    )

    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encrypted, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  },

  /**
   * Hash sensitive data (one-way)
   */
  hash(data: string): string {
    return crypto.createHash("sha256").update(data).digest("hex")
  },

  /**
   * Generate secure random token
   */
  generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString("hex")
  },
}
