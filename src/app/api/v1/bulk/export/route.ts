/**
 * Bulk Export API
 * Export members, claims, or transactions to CSV
 */

import { NextRequest, NextResponse } from "next/server"
import { exportData, ExportableEntity } from "@/lib/bulk"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const entity = searchParams.get("entity") as ExportableEntity | null
    const format = (searchParams.get("format") || "csv") as "csv" | "xlsx" | "json"
    const columns = searchParams.get("columns")?.split(",")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")
    const status = searchParams.get("status")

    if (!entity) {
      return NextResponse.json(
        { success: false, error: "Entity type is required (members, claims, transactions)" },
        { status: 400 }
      )
    }

    const validEntities: ExportableEntity[] = ["members", "claims", "transactions", "applications"]
    if (!validEntities.includes(entity)) {
      return NextResponse.json(
        { success: false, error: `Invalid entity. Valid options: ${validEntities.join(", ")}` },
        { status: 400 }
      )
    }

    // Build filters
    const filters: Record<string, any> = {}
    if (dateFrom) filters.dateFrom = dateFrom
    if (dateTo) filters.dateTo = dateTo
    if (status) filters.status = status

    const csvContent = await exportData({
      entity,
      format,
      columns,
      filters,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      includeHeaders: true,
    })

    // For CSV format, return as downloadable file
    if (format === "csv") {
      const timestamp = new Date().toISOString().split("T")[0]
      return new Response(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${entity}_export_${timestamp}.csv"`,
        },
      })
    }

    // For JSON format
    if (format === "json") {
      // Parse CSV back to JSON for JSON format export
      const lines = csvContent.trim().split("\n")
      const headers = lines[0].split(",").map((h) => h.replace(/^"|"$/g, ""))
      const data = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.replace(/^"|"$/g, ""))
        const obj: Record<string, string> = {}
        headers.forEach((h, i) => {
          obj[h] = values[i]
        })
        return obj
      })

      return NextResponse.json({
        success: true,
        data,
        meta: {
          entity,
          exportedAt: new Date().toISOString(),
          totalRecords: data.length,
          filters,
        },
      })
    }

    // XLSX format would require a library like exceljs
    return NextResponse.json(
      { success: false, error: "XLSX export not yet implemented" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Bulk export error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to process export" },
      { status: 500 }
    )
  }
}

// POST - Custom export with body configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { entity, format = "csv", columns, filters, dateRange } = body

    if (!entity) {
      return NextResponse.json(
        { success: false, error: "Entity type is required" },
        { status: 400 }
      )
    }

    const csvContent = await exportData({
      entity,
      format,
      columns,
      filters,
      dateFrom: dateRange?.from,
      dateTo: dateRange?.to,
      includeHeaders: true,
    })

    if (format === "csv") {
      const timestamp = new Date().toISOString().split("T")[0]
      return new Response(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${entity}_export_${timestamp}.csv"`,
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: csvContent,
    })
  } catch (error) {
    console.error("Bulk export error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to process export" },
      { status: 500 }
    )
  }
}
