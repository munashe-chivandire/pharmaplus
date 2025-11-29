/**
 * Custom Report Builder System
 * Create, save, and generate custom reports
 */

export type ReportType =
  | "members"
  | "claims"
  | "payments"
  | "applications"
  | "analytics"

export type AggregationType = "count" | "sum" | "avg" | "min" | "max"

export type ChartType = "bar" | "line" | "pie" | "area" | "table"

export interface ReportColumn {
  field: string
  label: string
  type: "string" | "number" | "date" | "currency" | "status"
  visible: boolean
  sortable: boolean
  aggregation?: AggregationType
}

export interface ReportFilter {
  field: string
  operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "contains" | "in" | "between"
  value: any
}

export interface ReportGrouping {
  field: string
  label: string
}

export interface ReportDefinition {
  id: string
  name: string
  description?: string
  type: ReportType
  columns: ReportColumn[]
  filters: ReportFilter[]
  groupBy?: ReportGrouping[]
  sortBy?: { field: string; order: "asc" | "desc" }[]
  chartType?: ChartType
  chartConfig?: Record<string, any>
  createdBy: string
  createdAt: Date
  updatedAt: Date
  isPublic: boolean
  organizationId: string
}

export interface ReportResult {
  columns: ReportColumn[]
  data: Record<string, any>[]
  summary: Record<string, any>
  totalRows: number
  generatedAt: Date
  executionTime: number
}

// Available columns for each report type
export const reportColumns: Record<ReportType, ReportColumn[]> = {
  members: [
    { field: "membershipNumber", label: "Membership #", type: "string", visible: true, sortable: true },
    { field: "firstName", label: "First Name", type: "string", visible: true, sortable: true },
    { field: "surname", label: "Surname", type: "string", visible: true, sortable: true },
    { field: "email", label: "Email", type: "string", visible: true, sortable: true },
    { field: "phone", label: "Phone", type: "string", visible: true, sortable: false },
    { field: "status", label: "Status", type: "status", visible: true, sortable: true },
    { field: "packageName", label: "Package", type: "string", visible: true, sortable: true },
    { field: "monthlyPremium", label: "Monthly Premium", type: "currency", visible: true, sortable: true, aggregation: "sum" },
    { field: "dependents", label: "Dependents", type: "number", visible: true, sortable: true, aggregation: "sum" },
    { field: "validFrom", label: "Valid From", type: "date", visible: true, sortable: true },
    { field: "validUntil", label: "Valid Until", type: "date", visible: true, sortable: true },
    { field: "createdAt", label: "Joined Date", type: "date", visible: true, sortable: true },
  ],
  claims: [
    { field: "claimNumber", label: "Claim #", type: "string", visible: true, sortable: true },
    { field: "memberName", label: "Member", type: "string", visible: true, sortable: true },
    { field: "membershipNumber", label: "Membership #", type: "string", visible: true, sortable: true },
    { field: "type", label: "Claim Type", type: "string", visible: true, sortable: true },
    { field: "provider", label: "Provider", type: "string", visible: true, sortable: true },
    { field: "serviceDate", label: "Service Date", type: "date", visible: true, sortable: true },
    { field: "submissionDate", label: "Submission Date", type: "date", visible: true, sortable: true },
    { field: "amount", label: "Claimed Amount", type: "currency", visible: true, sortable: true, aggregation: "sum" },
    { field: "approvedAmount", label: "Approved Amount", type: "currency", visible: true, sortable: true, aggregation: "sum" },
    { field: "status", label: "Status", type: "status", visible: true, sortable: true },
    { field: "reviewedBy", label: "Reviewed By", type: "string", visible: false, sortable: true },
    { field: "reviewedAt", label: "Review Date", type: "date", visible: false, sortable: true },
  ],
  payments: [
    { field: "transactionId", label: "Transaction ID", type: "string", visible: true, sortable: true },
    { field: "memberName", label: "Member", type: "string", visible: true, sortable: true },
    { field: "membershipNumber", label: "Membership #", type: "string", visible: true, sortable: true },
    { field: "type", label: "Payment Type", type: "string", visible: true, sortable: true },
    { field: "method", label: "Payment Method", type: "string", visible: true, sortable: true },
    { field: "amount", label: "Amount", type: "currency", visible: true, sortable: true, aggregation: "sum" },
    { field: "currency", label: "Currency", type: "string", visible: true, sortable: true },
    { field: "status", label: "Status", type: "status", visible: true, sortable: true },
    { field: "date", label: "Date", type: "date", visible: true, sortable: true },
    { field: "reference", label: "Reference", type: "string", visible: true, sortable: false },
  ],
  applications: [
    { field: "applicationNumber", label: "Application #", type: "string", visible: true, sortable: true },
    { field: "firstName", label: "First Name", type: "string", visible: true, sortable: true },
    { field: "surname", label: "Surname", type: "string", visible: true, sortable: true },
    { field: "email", label: "Email", type: "string", visible: true, sortable: true },
    { field: "packageName", label: "Package", type: "string", visible: true, sortable: true },
    { field: "status", label: "Status", type: "status", visible: true, sortable: true },
    { field: "submittedAt", label: "Submitted", type: "date", visible: true, sortable: true },
    { field: "reviewedAt", label: "Reviewed", type: "date", visible: false, sortable: true },
    { field: "assignedTo", label: "Assigned To", type: "string", visible: false, sortable: true },
  ],
  analytics: [
    { field: "metric", label: "Metric", type: "string", visible: true, sortable: true },
    { field: "value", label: "Value", type: "number", visible: true, sortable: true },
    { field: "change", label: "Change %", type: "number", visible: true, sortable: true },
    { field: "period", label: "Period", type: "string", visible: true, sortable: true },
  ],
}

// Filter operators for different field types
export const filterOperators: Record<string, { operator: ReportFilter["operator"]; label: string }[]> = {
  string: [
    { operator: "eq", label: "Equals" },
    { operator: "neq", label: "Not equals" },
    { operator: "contains", label: "Contains" },
  ],
  number: [
    { operator: "eq", label: "Equals" },
    { operator: "neq", label: "Not equals" },
    { operator: "gt", label: "Greater than" },
    { operator: "gte", label: "Greater or equal" },
    { operator: "lt", label: "Less than" },
    { operator: "lte", label: "Less or equal" },
    { operator: "between", label: "Between" },
  ],
  currency: [
    { operator: "eq", label: "Equals" },
    { operator: "gt", label: "Greater than" },
    { operator: "gte", label: "Greater or equal" },
    { operator: "lt", label: "Less than" },
    { operator: "lte", label: "Less or equal" },
    { operator: "between", label: "Between" },
  ],
  date: [
    { operator: "eq", label: "On" },
    { operator: "gt", label: "After" },
    { operator: "lt", label: "Before" },
    { operator: "between", label: "Between" },
  ],
  status: [
    { operator: "eq", label: "Is" },
    { operator: "neq", label: "Is not" },
    { operator: "in", label: "Is any of" },
  ],
}

/**
 * Create a new report definition
 */
export function createReportDefinition(
  type: ReportType,
  name: string,
  userId: string,
  organizationId: string,
  options?: Partial<ReportDefinition>
): ReportDefinition {
  return {
    id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    type,
    columns: reportColumns[type].map((col) => ({ ...col })),
    filters: [],
    createdBy: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: false,
    organizationId,
    ...options,
  }
}

/**
 * Apply filters to data
 */
function applyFilters(data: Record<string, any>[], filters: ReportFilter[]): Record<string, any>[] {
  return data.filter((row) => {
    return filters.every((filter) => {
      const value = row[filter.field]
      const filterValue = filter.value

      switch (filter.operator) {
        case "eq":
          return value === filterValue
        case "neq":
          return value !== filterValue
        case "gt":
          return value > filterValue
        case "gte":
          return value >= filterValue
        case "lt":
          return value < filterValue
        case "lte":
          return value <= filterValue
        case "contains":
          return String(value).toLowerCase().includes(String(filterValue).toLowerCase())
        case "in":
          return Array.isArray(filterValue) && filterValue.includes(value)
        case "between":
          return Array.isArray(filterValue) && value >= filterValue[0] && value <= filterValue[1]
        default:
          return true
      }
    })
  })
}

/**
 * Calculate aggregations
 */
function calculateAggregations(
  data: Record<string, any>[],
  columns: ReportColumn[]
): Record<string, any> {
  const summary: Record<string, any> = {}

  columns.forEach((col) => {
    if (!col.aggregation) return

    const values = data.map((row) => row[col.field]).filter((v) => v !== null && v !== undefined)

    switch (col.aggregation) {
      case "count":
        summary[`${col.field}_count`] = values.length
        break
      case "sum":
        summary[`${col.field}_sum`] = values.reduce((a, b) => a + Number(b), 0)
        break
      case "avg":
        summary[`${col.field}_avg`] = values.length > 0
          ? values.reduce((a, b) => a + Number(b), 0) / values.length
          : 0
        break
      case "min":
        summary[`${col.field}_min`] = Math.min(...values.map(Number))
        break
      case "max":
        summary[`${col.field}_max`] = Math.max(...values.map(Number))
        break
    }
  })

  return summary
}

/**
 * Execute a report and return results
 */
export async function executeReport(definition: ReportDefinition): Promise<ReportResult> {
  const startTime = Date.now()

  // In production, fetch data from database based on report type
  // For now, return mock data
  let rawData: Record<string, any>[] = []

  switch (definition.type) {
    case "members":
      rawData = [
        {
          membershipNumber: "PP-2024-001234",
          firstName: "Tendai",
          surname: "Moyo",
          email: "tendai.moyo@email.co.zw",
          phone: "+263771234567",
          status: "ACTIVE",
          packageName: "Gold Family Plan",
          monthlyPremium: 150,
          dependents: 3,
          validFrom: "2024-01-01",
          validUntil: "2024-12-31",
          createdAt: "2024-01-01",
        },
        {
          membershipNumber: "PP-2024-001235",
          firstName: "Chipo",
          surname: "Ndlovu",
          email: "chipo.ndlovu@email.co.zw",
          phone: "+263772345678",
          status: "ACTIVE",
          packageName: "Silver Individual Plan",
          monthlyPremium: 75,
          dependents: 0,
          validFrom: "2024-02-01",
          validUntil: "2025-01-31",
          createdAt: "2024-02-01",
        },
      ]
      break
    case "claims":
      rawData = [
        {
          claimNumber: "CLM-2024-000123",
          memberName: "Tendai Moyo",
          membershipNumber: "PP-2024-001234",
          type: "MEDICAL_CONSULTATION",
          provider: "Parirenyatwa Hospital",
          serviceDate: "2024-03-15",
          submissionDate: "2024-03-16",
          amount: 85,
          approvedAmount: 85,
          status: "APPROVED",
        },
        {
          claimNumber: "CLM-2024-000124",
          memberName: "Tendai Moyo",
          membershipNumber: "PP-2024-001234",
          type: "PRESCRIPTION",
          provider: "MedPharm Pharmacy",
          serviceDate: "2024-03-20",
          submissionDate: "2024-03-20",
          amount: 45.5,
          approvedAmount: null,
          status: "PENDING",
        },
      ]
      break
  }

  // Apply filters
  const filteredData = applyFilters(rawData, definition.filters)

  // Apply sorting
  if (definition.sortBy && definition.sortBy.length > 0) {
    filteredData.sort((a, b) => {
      for (const sort of definition.sortBy!) {
        const aVal = a[sort.field]
        const bVal = b[sort.field]
        if (aVal < bVal) return sort.order === "asc" ? -1 : 1
        if (aVal > bVal) return sort.order === "asc" ? 1 : -1
      }
      return 0
    })
  }

  // Filter visible columns
  const visibleColumns = definition.columns.filter((col) => col.visible)

  // Calculate summary
  const summary = calculateAggregations(filteredData, definition.columns)

  return {
    columns: visibleColumns,
    data: filteredData,
    summary,
    totalRows: filteredData.length,
    generatedAt: new Date(),
    executionTime: Date.now() - startTime,
  }
}

/**
 * Format report data for display
 */
export function formatCellValue(value: any, type: ReportColumn["type"]): string {
  if (value === null || value === undefined) return "-"

  switch (type) {
    case "currency":
      return `$${Number(value).toFixed(2)}`
    case "date":
      return new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    case "status":
      return String(value).replace(/_/g, " ")
    default:
      return String(value)
  }
}

/**
 * Export report to different formats
 */
export function exportReportToCSV(result: ReportResult): string {
  const headers = result.columns.map((col) => `"${col.label}"`).join(",")
  const rows = result.data.map((row) =>
    result.columns
      .map((col) => `"${formatCellValue(row[col.field], col.type)}"`)
      .join(",")
  )

  return [headers, ...rows].join("\n")
}
