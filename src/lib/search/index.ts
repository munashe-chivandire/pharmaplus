/**
 * Advanced Search System
 * Full-text search with filters, facets, and suggestions
 */

export type SearchableEntity = "member" | "application" | "claim" | "document"

export interface SearchQuery {
  query: string
  entities?: SearchableEntity[]
  filters?: SearchFilters
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface SearchFilters {
  status?: string[]
  dateFrom?: string
  dateTo?: string
  packageId?: string
  organizationId?: string
  memberId?: string
  amountMin?: number
  amountMax?: number
  tags?: string[]
}

export interface SearchResult<T> {
  id: string
  entity: SearchableEntity
  data: T
  score: number
  highlights: Record<string, string>
}

export interface SearchResponse<T> {
  results: SearchResult<T>[]
  total: number
  page: number
  limit: number
  query: string
  filters: SearchFilters
  facets: SearchFacets
  suggestions: string[]
  took: number
}

export interface SearchFacets {
  entities: { entity: SearchableEntity; count: number }[]
  statuses: { status: string; count: number }[]
  dateRanges: { range: string; count: number }[]
  packages: { id: string; name: string; count: number }[]
}

/**
 * Highlight matching text in search results
 */
function highlightText(text: string, query: string): string {
  if (!query) return text
  const words = query.toLowerCase().split(/\s+/)
  let highlighted = text
  words.forEach((word) => {
    const regex = new RegExp(`(${word})`, "gi")
    highlighted = highlighted.replace(regex, "<mark>$1</mark>")
  })
  return highlighted
}

/**
 * Calculate relevance score for search result
 */
function calculateScore(item: Record<string, any>, query: string, fields: string[]): number {
  if (!query) return 1
  const queryLower = query.toLowerCase()
  const queryWords = queryLower.split(/\s+/)
  let score = 0

  fields.forEach((field, index) => {
    const value = String(item[field] || "").toLowerCase()
    const fieldWeight = 1 / (index + 1) // Earlier fields have higher weight

    // Exact match
    if (value === queryLower) {
      score += 100 * fieldWeight
    }
    // Starts with query
    else if (value.startsWith(queryLower)) {
      score += 50 * fieldWeight
    }
    // Contains all words
    else if (queryWords.every((word) => value.includes(word))) {
      score += 30 * fieldWeight
    }
    // Contains any word
    else if (queryWords.some((word) => value.includes(word))) {
      score += 10 * fieldWeight
    }
  })

  return score
}

/**
 * Search members
 */
async function searchMembers(
  query: string,
  filters: SearchFilters
): Promise<SearchResult<any>[]> {
  // In production, use Prisma with full-text search or Elasticsearch
  const mockMembers = [
    {
      id: "mem_001",
      membershipNumber: "PP-2024-001234",
      firstName: "Tendai",
      surname: "Moyo",
      email: "tendai.moyo@email.co.zw",
      phone: "+263771234567",
      status: "ACTIVE",
      package: "Gold Family Plan",
    },
    {
      id: "mem_002",
      membershipNumber: "PP-2024-001235",
      firstName: "Chipo",
      surname: "Ndlovu",
      email: "chipo.ndlovu@email.co.zw",
      phone: "+263772345678",
      status: "ACTIVE",
      package: "Silver Individual Plan",
    },
    {
      id: "mem_003",
      membershipNumber: "PP-2024-001236",
      firstName: "Blessing",
      surname: "Mutasa",
      email: "blessing.mutasa@email.co.zw",
      phone: "+263773456789",
      status: "SUSPENDED",
      package: "Bronze Plan",
    },
  ]

  const searchFields = [
    "membershipNumber",
    "firstName",
    "surname",
    "email",
    "phone",
  ]

  return mockMembers
    .filter((member) => {
      if (!query) return true
      const searchText = searchFields
        .map((f) => member[f as keyof typeof member])
        .join(" ")
        .toLowerCase()
      return query
        .toLowerCase()
        .split(/\s+/)
        .some((word) => searchText.includes(word))
    })
    .filter((member) => {
      if (filters.status && filters.status.length > 0) {
        return filters.status.includes(member.status)
      }
      return true
    })
    .map((member) => ({
      id: member.id,
      entity: "member" as const,
      data: member,
      score: calculateScore(member, query, searchFields),
      highlights: {
        name: highlightText(`${member.firstName} ${member.surname}`, query),
        membershipNumber: highlightText(member.membershipNumber, query),
      },
    }))
}

/**
 * Search applications
 */
async function searchApplications(
  query: string,
  filters: SearchFilters
): Promise<SearchResult<any>[]> {
  const mockApplications = [
    {
      id: "app_001",
      applicationNumber: "APP-2024-000001",
      firstName: "John",
      surname: "Mutasa",
      email: "john.mutasa@email.co.zw",
      status: "SUBMITTED",
      submittedAt: "2024-03-20",
    },
    {
      id: "app_002",
      applicationNumber: "APP-2024-000002",
      firstName: "Mary",
      surname: "Chirisa",
      email: "mary.chirisa@email.co.zw",
      status: "APPROVED",
      submittedAt: "2024-03-15",
    },
  ]

  const searchFields = ["applicationNumber", "firstName", "surname", "email"]

  return mockApplications
    .filter((app) => {
      if (!query) return true
      const searchText = searchFields
        .map((f) => app[f as keyof typeof app])
        .join(" ")
        .toLowerCase()
      return query
        .toLowerCase()
        .split(/\s+/)
        .some((word) => searchText.includes(word))
    })
    .map((app) => ({
      id: app.id,
      entity: "application" as const,
      data: app,
      score: calculateScore(app, query, searchFields),
      highlights: {
        name: highlightText(`${app.firstName} ${app.surname}`, query),
        applicationNumber: highlightText(app.applicationNumber, query),
      },
    }))
}

/**
 * Search claims
 */
async function searchClaims(
  query: string,
  filters: SearchFilters
): Promise<SearchResult<any>[]> {
  const mockClaims = [
    {
      id: "clm_001",
      claimNumber: "CLM-2024-000123",
      memberName: "Tendai Moyo",
      provider: "Parirenyatwa Hospital",
      amount: 85.0,
      status: "APPROVED",
      type: "MEDICAL_CONSULTATION",
    },
    {
      id: "clm_002",
      claimNumber: "CLM-2024-000124",
      memberName: "Tendai Moyo",
      provider: "MedPharm Pharmacy",
      amount: 45.5,
      status: "PENDING",
      type: "PRESCRIPTION",
    },
  ]

  const searchFields = ["claimNumber", "memberName", "provider", "type"]

  return mockClaims
    .filter((claim) => {
      if (!query) return true
      const searchText = searchFields
        .map((f) => claim[f as keyof typeof claim])
        .join(" ")
        .toLowerCase()
      return query
        .toLowerCase()
        .split(/\s+/)
        .some((word) => searchText.includes(word))
    })
    .filter((claim) => {
      if (filters.amountMin !== undefined && claim.amount < filters.amountMin) {
        return false
      }
      if (filters.amountMax !== undefined && claim.amount > filters.amountMax) {
        return false
      }
      return true
    })
    .map((claim) => ({
      id: claim.id,
      entity: "claim" as const,
      data: claim,
      score: calculateScore(claim, query, searchFields),
      highlights: {
        claimNumber: highlightText(claim.claimNumber, query),
        provider: highlightText(claim.provider, query),
      },
    }))
}

/**
 * Generate search suggestions based on query
 */
async function generateSuggestions(query: string): Promise<string[]> {
  if (!query || query.length < 2) return []

  // In production, use search engine suggestions or recent searches
  const commonTerms = [
    "Tendai Moyo",
    "Chipo Ndlovu",
    "PP-2024",
    "CLM-2024",
    "APP-2024",
    "Parirenyatwa Hospital",
    "MedPharm Pharmacy",
    "Gold Family Plan",
    "Silver Individual Plan",
    "Bronze Plan",
  ]

  return commonTerms
    .filter((term) => term.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5)
}

/**
 * Main search function
 */
export async function search(searchQuery: SearchQuery): Promise<SearchResponse<any>> {
  const startTime = Date.now()

  const {
    query,
    entities = ["member", "application", "claim"],
    filters = {},
    page = 1,
    limit = 20,
    sortBy = "score",
    sortOrder = "desc",
  } = searchQuery

  let allResults: SearchResult<any>[] = []

  // Search each entity type
  const searchPromises: Promise<SearchResult<any>[]>[] = []

  if (entities.includes("member")) {
    searchPromises.push(searchMembers(query, filters))
  }
  if (entities.includes("application")) {
    searchPromises.push(searchApplications(query, filters))
  }
  if (entities.includes("claim")) {
    searchPromises.push(searchClaims(query, filters))
  }

  const results = await Promise.all(searchPromises)
  allResults = results.flat()

  // Sort results
  allResults.sort((a, b) => {
    if (sortBy === "score") {
      return sortOrder === "desc" ? b.score - a.score : a.score - b.score
    }
    // Add more sorting options as needed
    return 0
  })

  // Paginate
  const total = allResults.length
  const paginatedResults = allResults.slice((page - 1) * limit, page * limit)

  // Generate facets
  const facets: SearchFacets = {
    entities: entities.map((entity) => ({
      entity,
      count: allResults.filter((r) => r.entity === entity).length,
    })),
    statuses: [],
    dateRanges: [],
    packages: [],
  }

  // Get unique statuses
  const statusCounts = new Map<string, number>()
  allResults.forEach((r) => {
    const status = r.data.status
    if (status) {
      statusCounts.set(status, (statusCounts.get(status) || 0) + 1)
    }
  })
  facets.statuses = Array.from(statusCounts.entries()).map(([status, count]) => ({
    status,
    count,
  }))

  // Generate suggestions
  const suggestions = await generateSuggestions(query)

  return {
    results: paginatedResults,
    total,
    page,
    limit,
    query,
    filters,
    facets,
    suggestions,
    took: Date.now() - startTime,
  }
}

/**
 * API route for global search
 */
export async function searchAPI(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url)
    const query = url.searchParams.get("q") || ""
    const entities = url.searchParams.get("entities")?.split(",") as SearchableEntity[] | undefined
    const page = parseInt(url.searchParams.get("page") || "1")
    const limit = parseInt(url.searchParams.get("limit") || "20")
    const status = url.searchParams.get("status")?.split(",")
    const amountMin = url.searchParams.get("amountMin")
    const amountMax = url.searchParams.get("amountMax")

    const results = await search({
      query,
      entities,
      filters: {
        status,
        amountMin: amountMin ? parseFloat(amountMin) : undefined,
        amountMax: amountMax ? parseFloat(amountMax) : undefined,
      },
      page,
      limit,
    })

    return new Response(JSON.stringify({ success: true, ...results }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Search error:", error)
    return new Response(
      JSON.stringify({ success: false, error: "Search failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
