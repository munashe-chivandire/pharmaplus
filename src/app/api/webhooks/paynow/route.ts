import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

/**
 * Paynow Webhook Handler
 * Receives payment notifications from Paynow
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract Paynow callback data
    const reference = formData.get("reference") as string
    const paynowReference = formData.get("paynowreference") as string
    const amount = formData.get("amount") as string
    const status = formData.get("status") as string
    const hash = formData.get("hash") as string

    console.log("Paynow webhook received:", {
      reference,
      paynowReference,
      amount,
      status,
    })

    // Verify the hash (important for security)
    // In production, verify the hash matches expected value

    if (status === "Paid") {
      // Payment successful - update organization subscription
      // Parse reference to get organization ID (e.g., "ORG-clxxxxxx-professional")
      const [prefix, orgId, planId] = reference.split("-")

      if (prefix === "ORG" && orgId && planId) {
        // Update organization subscription
        await db.organization.update({
          where: { id: orgId },
          data: {
            plan: planId.toUpperCase() as "FREE" | "STARTER" | "PROFESSIONAL" | "ENTERPRISE",
            planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        })

        // Log the payment in audit log
        await db.auditLog.create({
          data: {
            entityType: "PAYMENT",
            entityId: paynowReference,
            action: "PAYMENT_RECEIVED",
            changes: JSON.stringify({
              reference,
              paynowReference,
              amount,
              status,
              plan: planId,
            }),
          },
        })

        console.log(`Subscription updated for org ${orgId} to ${planId}`)
      }
    } else if (status === "Cancelled" || status === "Failed") {
      // Payment failed or cancelled
      console.log(`Payment ${reference} ${status}`)

      await db.auditLog.create({
        data: {
          entityType: "PAYMENT",
          entityId: reference,
          action: `PAYMENT_${status.toUpperCase()}`,
          changes: JSON.stringify({
            reference,
            paynowReference,
            amount,
            status,
          }),
        },
      })
    }

    // Paynow expects "OK" response
    return new NextResponse("OK", { status: 200 })
  } catch (error) {
    console.error("Paynow webhook error:", error)
    return new NextResponse("Error processing webhook", { status: 500 })
  }
}

// Also handle GET requests (Paynow sometimes sends GET for verification)
export async function GET(request: NextRequest) {
  return new NextResponse("Paynow webhook endpoint active", { status: 200 })
}
