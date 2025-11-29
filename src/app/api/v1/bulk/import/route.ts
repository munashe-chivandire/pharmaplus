/**
 * Bulk Import API
 * Import members, claims, or applications from CSV
 */

import { NextRequest, NextResponse } from "next/server"
import { importMembers, importClaims, getImportTemplate } from "@/lib/bulk"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const entity = formData.get("entity") as string | null

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      )
    }

    if (!entity) {
      return NextResponse.json(
        { success: false, error: "Entity type is required (members, claims, applications)" },
        { status: 400 }
      )
    }

    // Check file type
    if (!file.name.endsWith(".csv")) {
      return NextResponse.json(
        { success: false, error: "Only CSV files are supported" },
        { status: 400 }
      )
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "File size exceeds 10MB limit" },
        { status: 400 }
      )
    }

    const content = await file.text()

    let result
    switch (entity) {
      case "members":
        result = await importMembers(content)
        break
      case "claims":
        result = await importClaims(content)
        break
      case "applications":
        // Implement as needed
        return NextResponse.json(
          { success: false, error: "Application import not yet implemented" },
          { status: 400 }
        )
      default:
        return NextResponse.json(
          { success: false, error: `Unsupported entity type: ${entity}` },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: result.success,
      data: result,
      message: result.success
        ? `Successfully imported ${result.imported} of ${result.totalRows} records`
        : `Import completed with ${result.failed} errors`,
    })
  } catch (error) {
    console.error("Bulk import error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to process import" },
      { status: 500 }
    )
  }
}

// GET - Download import template
export async function GET(request: NextRequest) {
  try {
    const entity = request.nextUrl.searchParams.get("entity")

    if (!entity) {
      return NextResponse.json(
        { success: false, error: "Entity type is required" },
        { status: 400 }
      )
    }

    const validEntities = ["members", "claims", "applications", "transactions"]
    if (!validEntities.includes(entity)) {
      return NextResponse.json(
        { success: false, error: `Invalid entity. Valid options: ${validEntities.join(", ")}` },
        { status: 400 }
      )
    }

    const template = getImportTemplate(entity as any)

    return new Response(template, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${entity}_import_template.csv"`,
      },
    })
  } catch (error) {
    console.error("Template generation error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to generate template" },
      { status: 500 }
    )
  }
}
