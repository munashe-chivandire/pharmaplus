/**
 * REST API v1 - Applications
 *
 * GET /api/v1/applications - List all applications
 * POST /api/v1/applications - Create new application
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { generateApplicationNumber } from "@/lib/utils"

// List applications with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.organizationId) {
      return NextResponse.json(
        { error: "Unauthorized", message: "API key or authentication required" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100)
    const status = searchParams.get("status")
    const type = searchParams.get("type")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      organizationId: session.user.organizationId,
    }

    if (status) {
      where.status = status
    }

    if (type) {
      where.applicationType = type
    }

    if (search) {
      where.OR = [
        { applicationNumber: { contains: search } },
        { member: { firstName: { contains: search } } },
        { member: { surname: { contains: search } } },
        { member: { email: { contains: search } } },
      ]
    }

    // Get applications with pagination
    const [applications, total] = await Promise.all([
      db.application.findMany({
        where,
        include: {
          member: {
            select: {
              id: true,
              firstName: true,
              surname: true,
              email: true,
              membershipNumber: true,
            },
          },
          package: {
            select: {
              id: true,
              name: true,
              monthlyPremium: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      db.application.count({ where }),
    ])

    return NextResponse.json({
      data: applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + applications.length < total,
      },
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch applications" },
      { status: 500 }
    )
  }
}

// Create new application
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.organizationId) {
      return NextResponse.json(
        { error: "Unauthorized", message: "API key or authentication required" },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate required fields
    const requiredFields = ["firstName", "surname", "email", "packageId"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: "Validation Error", message: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Create or find member
    let member = await db.member.findFirst({
      where: {
        email: body.email,
        organizationId: session.user.organizationId,
      },
    })

    if (!member) {
      member = await db.member.create({
        data: {
          firstName: body.firstName,
          surname: body.surname,
          email: body.email,
          title: body.title,
          dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
          idNumber: body.idNumber,
          phoneNumber: body.phoneNumber,
          physicalAddress: body.physicalAddress,
          organizationId: session.user.organizationId,
        },
      })
    }

    // Create application
    const application = await db.application.create({
      data: {
        applicationNumber: generateApplicationNumber(),
        applicationType: body.applicationType || "NEW_MEMBERSHIP",
        status: "SUBMITTED",
        priority: body.priority || "NORMAL",
        memberId: member.id,
        packageId: body.packageId,
        bankName: body.bankName,
        bankBranch: body.bankBranch,
        accountNumber: body.accountNumber,
        branchCode: body.branchCode,
        medicalHistory: body.medicalHistory ? JSON.stringify(body.medicalHistory) : null,
        submittedAt: new Date(),
        organizationId: session.user.organizationId,
      },
      include: {
        member: true,
        package: true,
      },
    })

    // Log action
    await db.applicationAction.create({
      data: {
        applicationId: application.id,
        action: "SUBMITTED",
        toStatus: "SUBMITTED",
        userId: session.user.id,
      },
    })

    return NextResponse.json(
      {
        data: application,
        message: "Application created successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to create application" },
      { status: 500 }
    )
  }
}
