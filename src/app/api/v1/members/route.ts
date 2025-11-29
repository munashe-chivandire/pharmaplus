/**
 * Members API v1
 * RESTful endpoints for member management
 */

import { NextRequest, NextResponse } from "next/server"

// GET /api/v1/members - List members with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100)
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const packageId = searchParams.get("packageId") || ""
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    // In production, use Prisma
    // const where = {
    //   organizationId: session.user.organizationId,
    //   ...(search && {
    //     OR: [
    //       { membershipNumber: { contains: search, mode: 'insensitive' } },
    //       { firstName: { contains: search, mode: 'insensitive' } },
    //       { surname: { contains: search, mode: 'insensitive' } },
    //       { email: { contains: search, mode: 'insensitive' } },
    //     ],
    //   }),
    //   ...(status && { status }),
    //   ...(packageId && { packageId }),
    // }
    // const members = await prisma.member.findMany({
    //   where,
    //   skip: (page - 1) * limit,
    //   take: limit,
    //   orderBy: { [sortBy]: sortOrder },
    //   include: {
    //     package: true,
    //     dependents: true,
    //   },
    // })

    // Mock response
    const mockMembers = [
      {
        id: "mem_001",
        membershipNumber: "PP-2024-001234",
        firstName: "Tendai",
        surname: "Moyo",
        email: "tendai.moyo@email.co.zw",
        phone: "+263771234567",
        idNumber: "63-123456-A-78",
        dateOfBirth: "1985-06-15",
        address: "123 Samora Machel Ave, Harare",
        status: "ACTIVE",
        package: {
          id: "pkg_gold",
          name: "Gold Family Plan",
          monthlyPremium: 150,
        },
        dependents: 3,
        validFrom: "2024-01-01",
        validUntil: "2024-12-31",
        createdAt: "2024-01-01T10:00:00Z",
      },
      {
        id: "mem_002",
        membershipNumber: "PP-2024-001235",
        firstName: "Chipo",
        surname: "Ndlovu",
        email: "chipo.ndlovu@email.co.zw",
        phone: "+263772345678",
        idNumber: "63-234567-B-89",
        dateOfBirth: "1990-03-22",
        address: "45 Robert Mugabe Road, Bulawayo",
        status: "ACTIVE",
        package: {
          id: "pkg_silver",
          name: "Silver Individual Plan",
          monthlyPremium: 75,
        },
        dependents: 0,
        validFrom: "2024-02-01",
        validUntil: "2025-01-31",
        createdAt: "2024-02-01T14:30:00Z",
      },
    ]

    return NextResponse.json({
      success: true,
      data: mockMembers,
      pagination: {
        page,
        limit,
        total: mockMembers.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
      filters: {
        search,
        status,
        packageId,
        sortBy,
        sortOrder,
      },
    })
  } catch (error) {
    console.error("Error fetching members:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch members" },
      { status: 500 }
    )
  }
}

// POST /api/v1/members - Create a new member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      "firstName",
      "surname",
      "email",
      "phone",
      "idNumber",
      "dateOfBirth",
      "packageId",
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      )
    }

    // In production, create member in database
    // const member = await prisma.member.create({
    //   data: {
    //     ...body,
    //     membershipNumber: generateMembershipNumber(),
    //     organizationId: session.user.organizationId,
    //     status: 'ACTIVE',
    //     validFrom: new Date(),
    //     validUntil: addMonths(new Date(), 12),
    //   },
    // })

    const mockMember = {
      id: `mem_${Date.now()}`,
      membershipNumber: `PP-2024-${Math.floor(Math.random() * 900000) + 100000}`,
      ...body,
      status: "ACTIVE",
      validFrom: new Date().toISOString(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(
      {
        success: true,
        data: mockMember,
        message: "Member created successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating member:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create member" },
      { status: 500 }
    )
  }
}
