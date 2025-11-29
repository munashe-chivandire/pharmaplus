/**
 * Reports API
 * Create, execute, and manage custom reports
 */

import { NextRequest, NextResponse } from "next/server"
import {
  createReportDefinition,
  executeReport,
  exportReportToCSV,
  reportColumns,
  ReportType,
} from "@/lib/reports"

// GET /api/v1/reports - List saved reports or get report columns
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get("action")
    const type = searchParams.get("type") as ReportType | null

    // Get available columns for a report type
    if (action === "columns" && type) {
      if (!reportColumns[type]) {
        return NextResponse.json(
          { success: false, error: "Invalid report type" },
          { status: 400 }
        )
      }

      return NextResponse.json({
        success: true,
        data: {
          type,
          columns: reportColumns[type],
        },
      })
    }

    // Get available report types
    if (action === "types") {
      return NextResponse.json({
        success: true,
        data: [
          { type: "members", label: "Members Report", description: "Report on member data and statistics" },
          { type: "claims", label: "Claims Report", description: "Report on claims submissions and approvals" },
          { type: "payments", label: "Payments Report", description: "Report on payment transactions" },
          { type: "applications", label: "Applications Report", description: "Report on membership applications" },
          { type: "analytics", label: "Analytics Report", description: "Key metrics and performance indicators" },
        ],
      })
    }

    // List saved reports
    const mockReports = [
      {
        id: "report_001",
        name: "Monthly Claims Summary",
        description: "Overview of all claims processed this month",
        type: "claims",
        isPublic: false,
        createdBy: "Admin User",
        createdAt: "2024-03-01T10:00:00Z",
        updatedAt: "2024-03-15T14:30:00Z",
      },
      {
        id: "report_002",
        name: "Active Members by Package",
        description: "Breakdown of active members grouped by package type",
        type: "members",
        isPublic: true,
        createdBy: "Admin User",
        createdAt: "2024-02-15T09:00:00Z",
        updatedAt: "2024-02-15T09:00:00Z",
      },
    ]

    return NextResponse.json({
      success: true,
      data: mockReports,
    })
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch reports" },
      { status: 500 }
    )
  }
}

// POST /api/v1/reports - Create or execute a report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const action = body.action || "create"

    if (action === "execute") {
      // Execute an existing or ad-hoc report
      const { definition } = body

      if (!definition || !definition.type) {
        return NextResponse.json(
          { success: false, error: "Report definition is required" },
          { status: 400 }
        )
      }

      const result = await executeReport(definition)

      // Check if export is requested
      if (body.export === "csv") {
        const csv = exportReportToCSV(result)
        return new Response(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="report_${Date.now()}.csv"`,
          },
        })
      }

      return NextResponse.json({
        success: true,
        data: result,
      })
    }

    // Create and save a new report
    const { name, description, type, columns, filters, groupBy, sortBy, chartType, isPublic } = body

    if (!name || !type) {
      return NextResponse.json(
        { success: false, error: "Report name and type are required" },
        { status: 400 }
      )
    }

    const validTypes: ReportType[] = ["members", "claims", "payments", "applications", "analytics"]
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: `Invalid report type. Valid types: ${validTypes.join(", ")}` },
        { status: 400 }
      )
    }

    const reportDef = createReportDefinition(
      type,
      name,
      "user_current", // Would come from session
      "org_current", // Would come from session
      {
        description,
        columns: columns || reportColumns[type],
        filters: filters || [],
        groupBy,
        sortBy,
        chartType,
        isPublic: isPublic || false,
      }
    )

    // In production, save to database
    // await prisma.report.create({ data: reportDef })

    return NextResponse.json(
      {
        success: true,
        data: reportDef,
        message: "Report created successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating report:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create report" },
      { status: 500 }
    )
  }
}
