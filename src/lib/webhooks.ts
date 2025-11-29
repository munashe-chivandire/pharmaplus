/**
 * Webhooks System
 * Send webhook notifications for various events
 */

import crypto from "crypto"
import { db } from "@/lib/db"

export type WebhookEvent =
  | "application.created"
  | "application.submitted"
  | "application.approved"
  | "application.rejected"
  | "member.created"
  | "member.updated"
  | "claim.submitted"
  | "claim.approved"
  | "claim.rejected"
  | "payment.received"
  | "payment.failed"

interface WebhookPayload {
  event: WebhookEvent
  timestamp: string
  data: Record<string, any>
}

interface WebhookEndpoint {
  id: string
  url: string
  secret: string
  events: WebhookEvent[]
  isActive: boolean
}

/**
 * Generate webhook signature
 */
function generateSignature(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex")
}

/**
 * Send webhook to endpoint
 */
async function sendWebhook(
  endpoint: WebhookEndpoint,
  payload: WebhookPayload
): Promise<{ success: boolean; statusCode?: number; error?: string }> {
  try {
    const payloadString = JSON.stringify(payload)
    const signature = generateSignature(payloadString, endpoint.secret)

    const response = await fetch(endpoint.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Signature": signature,
        "X-Webhook-Event": payload.event,
        "X-Webhook-Timestamp": payload.timestamp,
      },
      body: payloadString,
    })

    return {
      success: response.ok,
      statusCode: response.status,
    }
  } catch (error) {
    console.error("Webhook delivery error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Trigger webhook event
 */
export async function triggerWebhook(
  organizationId: string,
  event: WebhookEvent,
  data: Record<string, any>
): Promise<void> {
  try {
    // Get active webhook endpoints for this organization and event
    // In a real implementation, you'd have a webhooks table
    // For now, we'll use environment variables or a config
    const endpoints = await getWebhookEndpoints(organizationId, event)

    if (endpoints.length === 0) {
      return
    }

    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      data,
    }

    // Send to all matching endpoints
    const results = await Promise.allSettled(
      endpoints.map((endpoint) => sendWebhook(endpoint, payload))
    )

    // Log webhook deliveries
    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      const endpoint = endpoints[i]

      await db.auditLog.create({
        data: {
          entityType: "WEBHOOK",
          entityId: endpoint.id,
          action: result.status === "fulfilled" && (result.value as any).success ? "DELIVERED" : "FAILED",
          changes: JSON.stringify({
            event,
            endpoint: endpoint.url,
            success: result.status === "fulfilled" ? (result.value as any).success : false,
            statusCode: result.status === "fulfilled" ? (result.value as any).statusCode : null,
            error: result.status === "rejected" ? result.reason : (result.value as any).error,
          }),
        },
      })
    }
  } catch (error) {
    console.error("Trigger webhook error:", error)
  }
}

/**
 * Get webhook endpoints for organization and event
 * In production, this would query a webhooks table
 */
async function getWebhookEndpoints(
  organizationId: string,
  event: WebhookEvent
): Promise<WebhookEndpoint[]> {
  // This is a placeholder - in production, you'd store webhooks in the database
  const webhookUrl = process.env.WEBHOOK_URL
  const webhookSecret = process.env.WEBHOOK_SECRET

  if (!webhookUrl || !webhookSecret) {
    return []
  }

  return [
    {
      id: "default",
      url: webhookUrl,
      secret: webhookSecret,
      events: [
        "application.created",
        "application.submitted",
        "application.approved",
        "application.rejected",
        "member.created",
        "claim.submitted",
        "payment.received",
      ],
      isActive: true,
    },
  ]
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = generateSignature(payload, secret)
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

/**
 * Webhook event handlers for internal use
 */
export const webhookEvents = {
  applicationCreated: (application: any) =>
    triggerWebhook(application.organizationId, "application.created", {
      applicationId: application.id,
      applicationNumber: application.applicationNumber,
      status: application.status,
      memberId: application.memberId,
    }),

  applicationApproved: (application: any) =>
    triggerWebhook(application.organizationId, "application.approved", {
      applicationId: application.id,
      applicationNumber: application.applicationNumber,
      membershipNumber: application.member?.membershipNumber,
      approvedAt: new Date().toISOString(),
    }),

  applicationRejected: (application: any, reason: string) =>
    triggerWebhook(application.organizationId, "application.rejected", {
      applicationId: application.id,
      applicationNumber: application.applicationNumber,
      reason,
      rejectedAt: new Date().toISOString(),
    }),

  claimSubmitted: (claim: any) =>
    triggerWebhook(claim.organizationId, "claim.submitted", {
      claimId: claim.id,
      claimNumber: claim.claimNumber,
      amount: claim.amount,
      memberId: claim.memberId,
    }),

  paymentReceived: (payment: any) =>
    triggerWebhook(payment.organizationId, "payment.received", {
      paymentId: payment.id,
      reference: payment.reference,
      amount: payment.amount,
      method: payment.method,
    }),
}
