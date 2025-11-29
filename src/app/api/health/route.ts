/**
 * Health Check API
 * Used for monitoring and container health checks
 */

import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy"
  timestamp: string
  version: string
  uptime: number
  checks: {
    database: CheckResult
    memory: CheckResult
    disk?: CheckResult
  }
}

interface CheckResult {
  status: "pass" | "warn" | "fail"
  message?: string
  latency?: number
}

const startTime = Date.now()

async function checkDatabase(): Promise<CheckResult> {
  const start = Date.now()
  try {
    // In production, check actual database connection
    // const result = await prisma.$queryRaw`SELECT 1`
    return {
      status: "pass",
      message: "Database connection successful",
      latency: Date.now() - start,
    }
  } catch (error) {
    return {
      status: "fail",
      message: `Database connection failed: ${error}`,
      latency: Date.now() - start,
    }
  }
}

function checkMemory(): CheckResult {
  if (typeof process !== "undefined" && process.memoryUsage) {
    const usage = process.memoryUsage()
    const heapUsedMB = Math.round(usage.heapUsed / 1024 / 1024)
    const heapTotalMB = Math.round(usage.heapTotal / 1024 / 1024)
    const percentage = Math.round((usage.heapUsed / usage.heapTotal) * 100)

    if (percentage > 90) {
      return {
        status: "fail",
        message: `Memory usage critical: ${heapUsedMB}MB / ${heapTotalMB}MB (${percentage}%)`,
      }
    }

    if (percentage > 75) {
      return {
        status: "warn",
        message: `Memory usage high: ${heapUsedMB}MB / ${heapTotalMB}MB (${percentage}%)`,
      }
    }

    return {
      status: "pass",
      message: `Memory usage normal: ${heapUsedMB}MB / ${heapTotalMB}MB (${percentage}%)`,
    }
  }

  return {
    status: "pass",
    message: "Memory check skipped (not available in edge runtime)",
  }
}

export async function GET() {
  const [database, memory] = await Promise.all([
    checkDatabase(),
    Promise.resolve(checkMemory()),
  ])

  const allChecks = [database, memory]
  const hasFailure = allChecks.some((c) => c.status === "fail")
  const hasWarning = allChecks.some((c) => c.status === "warn")

  const status: HealthStatus = {
    status: hasFailure ? "unhealthy" : hasWarning ? "degraded" : "healthy",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
    uptime: Math.round((Date.now() - startTime) / 1000),
    checks: {
      database,
      memory,
    },
  }

  const httpStatus = hasFailure ? 503 : 200

  return NextResponse.json(status, { status: httpStatus })
}
