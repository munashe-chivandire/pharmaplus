/**
 * Claims API v1
 * RESTful endpoints for claims management
 */

import { NextRequest, NextResponse } from "next/server"

// GET /api/v1/claims - List claims with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100)
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const type = searchParams.get("type") || ""
    const memberId = searchParams.get("memberId") || ""
    const dateFrom = searchParams.get("dateFrom") || ""
    const dateTo = searchParams.get("dateTo") || ""
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    // Mock response
    const mockClaims = [
      {
        id: "clm_001",
        claimNumber: "CLM-2024-000123",
        memberId: "mem_001",
        memberName: "Tendai Moyo",
        membershipNumber: "PP-2024-001234",
        type: "MEDICAL_CONSULTATION",
        category: "outpatient",
        provider: "Parirenyatwa Hospital",
        providerAddress: "Mazowe Street, Harare",
        serviceDate: "2024-03-15",
        submissionDate: "2024-03-16",
        amount: 85.00,
        approvedAmount: 85.00,
        status: "APPROVED",
        description: "General consultation with Dr. Manyika",
        documents: [
          { id: "doc_001", name: "receipt.pdf", type: "receipt" },
          { id: "doc_002", name: "prescription.pdf", type: "prescription" },
        ],
        reviewedBy: "Admin User",
        reviewedAt: "2024-03-17T10:00:00Z",
        notes: "All documentation verified",
        createdAt: "2024-03-16T09:00:00Z",
      },
      {
        id: "clm_002",
        claimNumber: "CLM-2024-000124",
        memberId: "mem_001",
        memberName: "Tendai Moyo",
        membershipNumber: "PP-2024-001234",
        type: "PRESCRIPTION",
        category: "pharmacy",
        provider: "MedPharm Pharmacy",
        providerAddress: "Sam Levy's Village, Harare",
        serviceDate: "2024-03-20",
        submissionDate: "2024-03-20",
        amount: 45.50,
        approvedAmount: null,
        status: "PENDING",
        description: "Prescription medication for chronic condition",
        documents: [
          { id: "doc_003", name: "pharmacy_receipt.pdf", type: "receipt" },
        ],
        reviewedBy: null,
        reviewedAt: null,
        notes: null,
        createdAt: "2024-03-20T14:30:00Z",
      },
      {
        id: "clm_003",
        claimNumber: "CLM-2024-000125",
        memberId: "mem_002",
        memberName: "Chipo Ndlovu",
        membershipNumber: "PP-2024-001235",
        type: "DENTAL",
        category: "dental",
        provider: "Smile Dental Clinic",
        providerAddress: "Borrowdale, Harare",
        serviceDate: "2024-03-18",
        submissionDate: "2024-03-19",
        amount: 200.00,
        approvedAmount: 0,
        status: "REJECTED",
        description: "Dental crown replacement",
        documents: [
          { id: "doc_004", name: "dental_invoice.pdf", type: "invoice" },
        ],
        reviewedBy: "Admin User",
        reviewedAt: "2024-03-21T11:00:00Z",
        notes: "Dental crown not covered under current plan",
        createdAt: "2024-03-19T08:00:00Z",
      },
    ]

    // Apply filters
    let filteredClaims = [...mockClaims]

    if (search) {
      const searchLower = search.toLowerCase()
      filteredClaims = filteredClaims.filter(
        (c) =>
          c.claimNumber.toLowerCase().includes(searchLower) ||
          c.memberName.toLowerCase().includes(searchLower) ||
          c.provider.toLowerCase().includes(searchLower)
      )
    }

    if (status) {
      filteredClaims = filteredClaims.filter((c) => c.status === status)
    }

    if (type) {
      filteredClaims = filteredClaims.filter((c) => c.type === type)
    }

    // Calculate summary
    const summary = {
      total: filteredClaims.length,
      pending: filteredClaims.filter((c) => c.status === "PENDING").length,
      approved: filteredClaims.filter((c) => c.status === "APPROVED").length,
      rejected: filteredClaims.filter((c) => c.status === "REJECTED").length,
      totalAmount: filteredClaims.reduce((sum, c) => sum + c.amount, 0),
      approvedAmount: filteredClaims.reduce(
        (sum, c) => sum + (c.approvedAmount || 0),
        0
      ),
    }

    return NextResponse.json({
      success: true,
      data: filteredClaims,
      summary,
      pagination: {
        page,
        limit,
        total: filteredClaims.length,
        totalPages: Math.ceil(filteredClaims.length / limit),
        hasNext: page * limit < filteredClaims.length,
        hasPrev: page > 1,
      },
      filters: {
        search,
        status,
        type,
        memberId,
        dateFrom,
        dateTo,
        sortBy,
        sortOrder,
      },
    })
  } catch (error) {
    console.error("Error fetching claims:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch claims" },
      { status: 500 }
    )
  }
}

// POST /api/v1/claims - Submit a new claim
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      "memberId",
      "type",
      "provider",
      "serviceDate",
      "amount",
      "description",
    ]

    const missingFields = requiredFields.filter((field) => !body[field])
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      )
    }

    // Validate amount
    if (typeof body.amount !== "number" || body.amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Amount must be a positive number" },
        { status: 400 }
      )
    }

    // Validate claim type
    const validTypes = [
      "MEDICAL_CONSULTATION",
      "PRESCRIPTION",
      "HOSPITALIZATION",
      "DENTAL",
      "OPTICAL",
      "MATERNITY",
      "CHRONIC",
      "OTHER",
    ]
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { success: false, error: `Invalid claim type. Valid types: ${validTypes.join(", ")}` },
        { status: 400 }
      )
    }

    // Generate claim number
    const claimNumber = `CLM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900000) + 100000).padStart(6, "0")}`

    const mockClaim = {
      id: `clm_${Date.now()}`,
      claimNumber,
      ...body,
      status: "PENDING",
      submissionDate: new Date().toISOString(),
      approvedAmount: null,
      reviewedBy: null,
      reviewedAt: null,
      notes: null,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(
      {
        success: true,
        data: mockClaim,
        message: "Claim submitted successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error submitting claim:", error)
    return NextResponse.json(
      { success: false, error: "Failed to submit claim" },
      { status: 500 }
    )
  }
}
