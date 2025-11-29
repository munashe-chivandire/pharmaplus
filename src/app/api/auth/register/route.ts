import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { db } from "@/lib/db"
import { slugify } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, organizationName } = body

    // Validate input
    if (!name || !email || !password || !organizationName) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 400 }
      )
    }

    // Generate organization slug
    let slug = slugify(organizationName)
    let slugExists = await db.organization.findUnique({
      where: { slug },
    })

    // Make slug unique if necessary
    let counter = 1
    while (slugExists) {
      slug = `${slugify(organizationName)}-${counter}`
      slugExists = await db.organization.findUnique({
        where: { slug },
      })
      counter++
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create organization and user in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create organization
      const organization = await tx.organization.create({
        data: {
          name: organizationName,
          slug,
          plan: "FREE",
        },
      })

      // Create user
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "ADMIN",
          organizationId: organization.id,
        },
      })

      // Create default packages for the organization
      await tx.package.createMany({
        data: [
          {
            name: "Basic",
            description: "Essential coverage for individuals",
            monthlyPremium: 99,
            annualPremium: 990,
            coverageLimit: 50000,
            features: JSON.stringify([
              "GP visits",
              "Chronic medication",
              "Emergency care",
            ]),
            organizationId: organization.id,
          },
          {
            name: "Premium",
            description: "Comprehensive coverage for families",
            monthlyPremium: 299,
            annualPremium: 2990,
            coverageLimit: 200000,
            features: JSON.stringify([
              "All Basic benefits",
              "Specialist consultations",
              "Hospital cover",
              "Dental & optical",
            ]),
            organizationId: organization.id,
          },
          {
            name: "Enterprise",
            description: "Full coverage with additional benefits",
            monthlyPremium: 599,
            annualPremium: 5990,
            coverageLimit: 500000,
            features: JSON.stringify([
              "All Premium benefits",
              "International cover",
              "Executive health screening",
              "Maternity benefits",
              "Mental health support",
            ]),
            organizationId: organization.id,
          },
        ],
      })

      return { user, organization }
    })

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "An error occurred during registration" },
      { status: 500 }
    )
  }
}
