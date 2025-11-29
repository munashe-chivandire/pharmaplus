/**
 * Next.js Middleware
 * Security, authentication, and request processing
 */

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Security headers
const securityHeaders = {
  "X-DNS-Prefetch-Control": "on",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-XSS-Protection": "1; mode=block",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
}

// Rate limit store (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/portal", "/admin", "/settings"]

// Routes that are only for non-authenticated users
const authRoutes = ["/login", "/register", "/forgot-password"]

// API rate limits (requests per minute)
const apiRateLimits: Record<string, number> = {
  "/api/auth": 10,
  "/api/v1": 100,
  "/api/upload": 20,
  "/api/export": 10,
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  if (forwarded) return forwarded.split(",")[0].trim()
  if (realIp) return realIp
  return "unknown"
}

function checkRateLimit(
  ip: string,
  path: string,
  limit: number
): { allowed: boolean; remaining: number } {
  const key = `${ip}:${path}`
  const now = Date.now()
  const windowMs = 60000 // 1 minute

  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  rateLimitMap.set(key, record)
  return { allowed: true, remaining: limit - record.count }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // API rate limiting
  if (pathname.startsWith("/api/")) {
    const ip = getClientIp(request)

    // Find matching rate limit
    let limit = 100 // default
    for (const [route, rateLimit] of Object.entries(apiRateLimits)) {
      if (pathname.startsWith(route)) {
        limit = rateLimit
        break
      }
    }

    const { allowed, remaining } = checkRateLimit(ip, pathname, limit)

    response.headers.set("X-RateLimit-Limit", String(limit))
    response.headers.set("X-RateLimit-Remaining", String(remaining))

    if (!allowed) {
      return new NextResponse(
        JSON.stringify({
          error: "Too many requests",
          message: "Rate limit exceeded. Please try again later.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "60",
            ...Object.fromEntries(Object.entries(securityHeaders)),
          },
        }
      )
    }
  }

  // Check authentication for protected routes
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Get session token from cookies
  const sessionToken =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value

  const isAuthenticated = !!sessionToken

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users from auth routes
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Block suspicious requests
  const userAgent = request.headers.get("user-agent") || ""
  const suspiciousPatterns = [
    /sqlmap/i,
    /nikto/i,
    /nessus/i,
    /\.\.\//,
    /\/etc\/passwd/i,
    /<script>/i,
  ]

  if (suspiciousPatterns.some((pattern) => pattern.test(pathname) || pattern.test(userAgent))) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  // CORS for API routes
  if (pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin")
    const allowedOrigins = [
      process.env.NEXTAUTH_URL,
      "http://localhost:3000",
      "https://pharmplus.co.zw",
    ].filter(Boolean)

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin)
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      )
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      )
      response.headers.set("Access-Control-Max-Age", "86400")
    }

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 200,
        headers: response.headers,
      })
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|icons|images|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
}
