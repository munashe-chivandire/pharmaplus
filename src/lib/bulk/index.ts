/**
 * Bulk Import/Export System
 * CSV/Excel import and export for members, applications, and claims
 */

export type ExportableEntity = "members" | "applications" | "claims" | "transactions"

export interface ImportResult {
  success: boolean
  totalRows: number
  imported: number
  failed: number
  errors: ImportError[]
  warnings: ImportWarning[]
}

export interface ImportError {
  row: number
  field: string
  value: string
  message: string
}

export interface ImportWarning {
  row: number
  field: string
  message: string
}

export interface ExportOptions {
  entity: ExportableEntity
  format: "csv" | "xlsx" | "json"
  filters?: Record<string, any>
  columns?: string[]
  dateFrom?: string
  dateTo?: string
  includeHeaders?: boolean
}

/**
 * CSV Parser
 */
function parseCSV(content: string): Record<string, string>[] {
  const lines = content.trim().split("\n")
  if (lines.length < 2) return []

  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""))
  const rows: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""))
    const row: Record<string, string> = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ""
    })
    rows.push(row)
  }

  return rows
}

/**
 * CSV Generator
 */
function generateCSV(data: Record<string, any>[], columns?: string[]): string {
  if (data.length === 0) return ""

  const headers = columns || Object.keys(data[0])
  const headerRow = headers.map((h) => `"${h}"`).join(",")

  const dataRows = data.map((row) =>
    headers.map((h) => {
      const value = row[h]
      if (value === null || value === undefined) return '""'
      if (typeof value === "object") return `"${JSON.stringify(value).replace(/"/g, '""')}"`
      return `"${String(value).replace(/"/g, '""')}"`
    }).join(",")
  )

  return [headerRow, ...dataRows].join("\n")
}

/**
 * Validate member import data
 */
function validateMemberRow(
  row: Record<string, string>,
  rowIndex: number
): { data: Record<string, any> | null; errors: ImportError[]; warnings: ImportWarning[] } {
  const errors: ImportError[] = []
  const warnings: ImportWarning[] = []

  // Required fields
  const requiredFields = ["firstName", "surname", "email", "phone", "idNumber", "dateOfBirth"]
  requiredFields.forEach((field) => {
    if (!row[field]?.trim()) {
      errors.push({
        row: rowIndex,
        field,
        value: row[field] || "",
        message: `${field} is required`,
      })
    }
  })

  // Validate email
  if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
    errors.push({
      row: rowIndex,
      field: "email",
      value: row.email,
      message: "Invalid email format",
    })
  }

  // Validate phone (Zimbabwe format)
  if (row.phone && !/^\+263\d{9}$/.test(row.phone.replace(/\s/g, ""))) {
    warnings.push({
      row: rowIndex,
      field: "phone",
      message: "Phone number may not be in correct Zimbabwe format (+263XXXXXXXXX)",
    })
  }

  // Validate ID number (Zimbabwe format)
  if (row.idNumber && !/^\d{2}-\d{6,7}-[A-Z]-\d{2}$/.test(row.idNumber)) {
    warnings.push({
      row: rowIndex,
      field: "idNumber",
      message: "ID number may not be in correct format (XX-XXXXXX-X-XX)",
    })
  }

  // Validate date of birth
  if (row.dateOfBirth) {
    const dob = new Date(row.dateOfBirth)
    if (isNaN(dob.getTime())) {
      errors.push({
        row: rowIndex,
        field: "dateOfBirth",
        value: row.dateOfBirth,
        message: "Invalid date format. Use YYYY-MM-DD",
      })
    } else if (dob > new Date()) {
      errors.push({
        row: rowIndex,
        field: "dateOfBirth",
        value: row.dateOfBirth,
        message: "Date of birth cannot be in the future",
      })
    }
  }

  if (errors.length > 0) {
    return { data: null, errors, warnings }
  }

  return {
    data: {
      firstName: row.firstName.trim(),
      surname: row.surname.trim(),
      email: row.email.trim().toLowerCase(),
      phone: row.phone.replace(/\s/g, ""),
      idNumber: row.idNumber.trim().toUpperCase(),
      dateOfBirth: row.dateOfBirth,
      address: row.address?.trim() || null,
      packageId: row.packageId?.trim() || null,
      notes: row.notes?.trim() || null,
    },
    errors: [],
    warnings,
  }
}

/**
 * Import members from CSV
 */
export async function importMembers(csvContent: string): Promise<ImportResult> {
  const rows = parseCSV(csvContent)
  const result: ImportResult = {
    success: false,
    totalRows: rows.length,
    imported: 0,
    failed: 0,
    errors: [],
    warnings: [],
  }

  for (let i = 0; i < rows.length; i++) {
    const validation = validateMemberRow(rows[i], i + 2) // +2 for header row and 1-based index

    if (validation.errors.length > 0) {
      result.failed++
      result.errors.push(...validation.errors)
      result.warnings.push(...validation.warnings)
      continue
    }

    // In production, save to database
    // await prisma.member.create({ data: validation.data })
    result.imported++
    result.warnings.push(...validation.warnings)
  }

  result.success = result.failed === 0
  return result
}

/**
 * Import claims from CSV
 */
export async function importClaims(csvContent: string): Promise<ImportResult> {
  const rows = parseCSV(csvContent)
  const result: ImportResult = {
    success: false,
    totalRows: rows.length,
    imported: 0,
    failed: 0,
    errors: [],
    warnings: [],
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const rowIndex = i + 2

    // Required fields
    if (!row.memberId && !row.membershipNumber) {
      result.errors.push({
        row: rowIndex,
        field: "memberId",
        value: "",
        message: "memberId or membershipNumber is required",
      })
      result.failed++
      continue
    }

    if (!row.type) {
      result.errors.push({
        row: rowIndex,
        field: "type",
        value: "",
        message: "Claim type is required",
      })
      result.failed++
      continue
    }

    if (!row.amount || isNaN(parseFloat(row.amount))) {
      result.errors.push({
        row: rowIndex,
        field: "amount",
        value: row.amount || "",
        message: "Valid amount is required",
      })
      result.failed++
      continue
    }

    // In production, save to database
    result.imported++
  }

  result.success = result.failed === 0
  return result
}

/**
 * Export members to CSV
 */
export async function exportMembers(options: Omit<ExportOptions, "entity">): Promise<string> {
  // In production, fetch from database with filters
  const mockMembers = [
    {
      membershipNumber: "PP-2024-001234",
      firstName: "Tendai",
      surname: "Moyo",
      email: "tendai.moyo@email.co.zw",
      phone: "+263771234567",
      idNumber: "63-123456-A-78",
      dateOfBirth: "1985-06-15",
      address: "123 Samora Machel Ave, Harare",
      status: "ACTIVE",
      package: "Gold Family Plan",
      validFrom: "2024-01-01",
      validUntil: "2024-12-31",
      dependents: 3,
    },
    {
      membershipNumber: "PP-2024-001235",
      firstName: "Chipo",
      surname: "Ndlovu",
      email: "chipo.ndlovu@email.co.zw",
      phone: "+263772345678",
      idNumber: "63-234567-B-89",
      dateOfBirth: "1990-03-22",
      address: "45 Robert Mugabe Road, Bulawayo",
      status: "ACTIVE",
      package: "Silver Individual Plan",
      validFrom: "2024-02-01",
      validUntil: "2025-01-31",
      dependents: 0,
    },
  ]

  return generateCSV(mockMembers, options.columns)
}

/**
 * Export claims to CSV
 */
export async function exportClaims(options: Omit<ExportOptions, "entity">): Promise<string> {
  const mockClaims = [
    {
      claimNumber: "CLM-2024-000123",
      membershipNumber: "PP-2024-001234",
      memberName: "Tendai Moyo",
      type: "MEDICAL_CONSULTATION",
      provider: "Parirenyatwa Hospital",
      serviceDate: "2024-03-15",
      submissionDate: "2024-03-16",
      amount: 85.0,
      approvedAmount: 85.0,
      status: "APPROVED",
    },
    {
      claimNumber: "CLM-2024-000124",
      membershipNumber: "PP-2024-001234",
      memberName: "Tendai Moyo",
      type: "PRESCRIPTION",
      provider: "MedPharm Pharmacy",
      serviceDate: "2024-03-20",
      submissionDate: "2024-03-20",
      amount: 45.5,
      approvedAmount: null,
      status: "PENDING",
    },
  ]

  return generateCSV(mockClaims, options.columns)
}

/**
 * Export transactions to CSV
 */
export async function exportTransactions(
  options: Omit<ExportOptions, "entity">
): Promise<string> {
  const mockTransactions = [
    {
      transactionId: "TXN-2024-000001",
      membershipNumber: "PP-2024-001234",
      memberName: "Tendai Moyo",
      type: "PAYMENT",
      method: "ECOCASH",
      amount: 150.0,
      currency: "USD",
      status: "COMPLETED",
      date: "2024-03-01",
      reference: "ECO-123456789",
    },
    {
      transactionId: "TXN-2024-000002",
      membershipNumber: "PP-2024-001235",
      memberName: "Chipo Ndlovu",
      type: "PAYMENT",
      method: "VISA",
      amount: 75.0,
      currency: "USD",
      status: "COMPLETED",
      date: "2024-02-15",
      reference: "VISA-987654321",
    },
  ]

  return generateCSV(mockTransactions, options.columns)
}

/**
 * Main export function
 */
export async function exportData(options: ExportOptions): Promise<string> {
  switch (options.entity) {
    case "members":
      return exportMembers(options)
    case "claims":
      return exportClaims(options)
    case "transactions":
      return exportTransactions(options)
    default:
      throw new Error(`Unsupported entity: ${options.entity}`)
  }
}

/**
 * Generate import template CSV
 */
export function getImportTemplate(entity: ExportableEntity): string {
  const templates: Record<ExportableEntity, string[]> = {
    members: [
      "firstName",
      "surname",
      "email",
      "phone",
      "idNumber",
      "dateOfBirth",
      "address",
      "packageId",
      "notes",
    ],
    applications: [
      "firstName",
      "surname",
      "email",
      "phone",
      "idNumber",
      "dateOfBirth",
      "address",
      "employerName",
      "packageId",
    ],
    claims: [
      "membershipNumber",
      "type",
      "provider",
      "serviceDate",
      "amount",
      "description",
      "receiptNumber",
    ],
    transactions: [
      "membershipNumber",
      "type",
      "method",
      "amount",
      "currency",
      "reference",
      "date",
    ],
  }

  const headers = templates[entity] || []
  return headers.map((h) => `"${h}"`).join(",") + "\n"
}
