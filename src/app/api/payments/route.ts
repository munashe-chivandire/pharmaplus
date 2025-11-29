import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { paynow } from "@/lib/paynow"

/**
 * Create a new payment
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.organizationId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { planId, amount, currency, paymentMethod, phone } = body

    // Validate input
    if (!planId || !amount || !paymentMethod) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    // Generate unique reference
    const reference = `ORG-${session.user.organizationId}-${planId}-${Date.now()}`

    // Handle different payment methods
    if (["ecocash", "onemoney"].includes(paymentMethod)) {
      // Mobile money payment
      if (!phone) {
        return NextResponse.json(
          { message: "Phone number is required for mobile payments" },
          { status: 400 }
        )
      }

      const result = await paynow.createMobilePayment({
        reference,
        email: session.user.email || "",
        amount,
        additionalInfo: `PharmPlus ${planId} Plan Subscription`,
        phone,
        method: paymentMethod as "ecocash" | "onemoney",
      })

      if (result.success) {
        // Log payment initiation
        await db.auditLog.create({
          data: {
            entityType: "PAYMENT",
            entityId: reference,
            action: "PAYMENT_INITIATED",
            userId: session.user.id,
            userEmail: session.user.email,
            changes: JSON.stringify({
              planId,
              amount,
              currency,
              paymentMethod,
              pollUrl: result.pollUrl,
            }),
          },
        })

        return NextResponse.json({
          success: true,
          type: "mobile",
          pollUrl: result.pollUrl,
          instructions: result.instructions,
          reference,
        })
      } else {
        return NextResponse.json(
          { message: result.error || "Payment initialization failed" },
          { status: 400 }
        )
      }
    } else if (["visa", "mastercard"].includes(paymentMethod)) {
      // Card payment - redirect to Paynow
      const result = await paynow.createPayment({
        reference,
        email: session.user.email || "",
        amount,
        additionalInfo: `PharmPlus ${planId} Plan Subscription`,
      })

      if (result.success) {
        await db.auditLog.create({
          data: {
            entityType: "PAYMENT",
            entityId: reference,
            action: "PAYMENT_INITIATED",
            userId: session.user.id,
            userEmail: session.user.email,
            changes: JSON.stringify({
              planId,
              amount,
              currency,
              paymentMethod,
              redirectUrl: result.redirectUrl,
            }),
          },
        })

        return NextResponse.json({
          success: true,
          type: "redirect",
          redirectUrl: result.redirectUrl,
          reference,
        })
      } else {
        return NextResponse.json(
          { message: result.error || "Payment initialization failed" },
          { status: 400 }
        )
      }
    } else if (paymentMethod === "bank") {
      // Bank transfer - return bank details
      await db.auditLog.create({
        data: {
          entityType: "PAYMENT",
          entityId: reference,
          action: "BANK_TRANSFER_INITIATED",
          userId: session.user.id,
          userEmail: session.user.email,
          changes: JSON.stringify({
            planId,
            amount,
            currency,
            paymentMethod,
          }),
        },
      })

      return NextResponse.json({
        success: true,
        type: "bank",
        reference,
        bankDetails: {
          bankName: "CBZ Bank",
          accountName: "PharmPlus Ltd",
          accountNumber: "12345678901234",
          branch: "Harare",
          swiftCode: "COBZZWHX",
        },
        instructions: "Please use the reference number as your payment reference. Your subscription will be activated within 24 hours of payment confirmation.",
      })
    } else {
      return NextResponse.json(
        { message: "Invalid payment method" },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Payment creation error:", error)
    return NextResponse.json(
      { message: "An error occurred while processing payment" },
      { status: 500 }
    )
  }
}

/**
 * Check payment status
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const pollUrl = searchParams.get("pollUrl")

    if (!pollUrl) {
      return NextResponse.json(
        { message: "Poll URL is required" },
        { status: 400 }
      )
    }

    const status = await paynow.checkPaymentStatus(pollUrl)

    return NextResponse.json({
      success: true,
      ...status,
    })
  } catch (error) {
    console.error("Payment status check error:", error)
    return NextResponse.json(
      { message: "Failed to check payment status" },
      { status: 500 }
    )
  }
}
