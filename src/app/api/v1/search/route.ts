/**
 * Global Search API
 * Search across all entities with filters and facets
 */

import { NextRequest, NextResponse } from "next/server"
import { search, SearchableEntity } from "@/lib/search"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const query = searchParams.get("q") || ""
    const entitiesParam = searchParams.get("entities")
    const entities = entitiesParam
      ? (entitiesParam.split(",") as SearchableEntity[])
      : undefined
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100)
    const statusParam = searchParams.get("status")
    const status = statusParam ? statusParam.split(",") : undefined
    const amountMin = searchParams.get("amountMin")
    const amountMax = searchParams.get("amountMax")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")

    const results = await search({
      query,
      entities,
      filters: {
        status,
        amountMin: amountMin ? parseFloat(amountMin) : undefined,
        amountMax: amountMax ? parseFloat(amountMax) : undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      },
      page,
      limit,
    })

    return NextResponse.json({
      success: true,
      ...results,
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      { success: false, error: "Search failed" },
      { status: 500 }
    )
  }
}
