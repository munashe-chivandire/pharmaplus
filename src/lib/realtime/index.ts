/**
 * Real-time Notifications System
 * WebSocket-based real-time updates for the application
 */

// Event types for real-time notifications
export type RealtimeEventType =
  | "notification"
  | "application.created"
  | "application.updated"
  | "application.status_changed"
  | "claim.created"
  | "claim.updated"
  | "claim.status_changed"
  | "member.created"
  | "member.updated"
  | "payment.received"
  | "payment.failed"
  | "message.new"
  | "system.alert"

export interface RealtimeEvent {
  id: string
  type: RealtimeEventType
  payload: Record<string, any>
  timestamp: Date
  userId?: string
  organizationId?: string
}

export interface Notification {
  id: string
  type: "info" | "success" | "warning" | "error"
  title: string
  message: string
  read: boolean
  createdAt: Date
  actionUrl?: string
  metadata?: Record<string, any>
}

// In-memory store for SSE connections (use Redis in production)
const connections = new Map<string, Set<ReadableStreamDefaultController>>()

/**
 * Generate unique connection ID
 */
function generateConnectionId(): string {
  return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Create SSE stream for a user
 */
export function createEventStream(userId: string): ReadableStream {
  const connectionId = generateConnectionId()

  return new ReadableStream({
    start(controller) {
      // Add connection to user's connection set
      if (!connections.has(userId)) {
        connections.set(userId, new Set())
      }
      connections.get(userId)!.add(controller)

      // Send initial connection event
      const connectEvent = `data: ${JSON.stringify({
        type: "connected",
        connectionId,
        timestamp: new Date().toISOString(),
      })}\n\n`
      controller.enqueue(new TextEncoder().encode(connectEvent))

      // Keep connection alive with heartbeat
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(": heartbeat\n\n"))
        } catch {
          clearInterval(heartbeat)
        }
      }, 30000)
    },
    cancel() {
      // Remove connection when client disconnects
      const userConnections = connections.get(userId)
      if (userConnections) {
        userConnections.forEach((controller) => {
          try {
            controller.close()
          } catch {}
        })
        connections.delete(userId)
      }
    },
  })
}

/**
 * Send event to specific user
 */
export function sendToUser(userId: string, event: RealtimeEvent): void {
  const userConnections = connections.get(userId)
  if (!userConnections) return

  const eventData = `data: ${JSON.stringify(event)}\n\n`
  const encoded = new TextEncoder().encode(eventData)

  userConnections.forEach((controller) => {
    try {
      controller.enqueue(encoded)
    } catch {
      // Connection closed, will be cleaned up
    }
  })
}

/**
 * Send event to all users in an organization
 */
export function sendToOrganization(organizationId: string, event: RealtimeEvent): void {
  // In production, you'd query Redis for all user connections in this org
  // For now, we'll broadcast to all connections with org context in event
  const eventWithOrg = { ...event, organizationId }
  connections.forEach((controllers, userId) => {
    sendToUser(userId, eventWithOrg)
  })
}

/**
 * Broadcast event to all connected users
 */
export function broadcast(event: RealtimeEvent): void {
  connections.forEach((controllers, userId) => {
    sendToUser(userId, event)
  })
}

/**
 * Create notification and send real-time event
 */
export async function createNotification(
  userId: string,
  notification: Omit<Notification, "id" | "read" | "createdAt">
): Promise<Notification> {
  const fullNotification: Notification = {
    ...notification,
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    read: false,
    createdAt: new Date(),
  }

  // In production, save to database
  // await prisma.notification.create({ data: fullNotification })

  // Send real-time event
  sendToUser(userId, {
    id: fullNotification.id,
    type: "notification",
    payload: fullNotification,
    timestamp: new Date(),
    userId,
  })

  return fullNotification
}

/**
 * Notification templates for common events
 */
export const notificationTemplates = {
  applicationSubmitted: (applicationNumber: string) => ({
    type: "success" as const,
    title: "Application Submitted",
    message: `Your application ${applicationNumber} has been submitted successfully.`,
    actionUrl: `/portal/applications/${applicationNumber}`,
  }),

  applicationApproved: (applicationNumber: string, membershipNumber: string) => ({
    type: "success" as const,
    title: "Application Approved!",
    message: `Your application ${applicationNumber} has been approved. Your membership number is ${membershipNumber}.`,
    actionUrl: `/portal/membership`,
  }),

  applicationRejected: (applicationNumber: string, reason: string) => ({
    type: "error" as const,
    title: "Application Rejected",
    message: `Your application ${applicationNumber} was not approved. Reason: ${reason}`,
    actionUrl: `/portal/applications/${applicationNumber}`,
  }),

  claimSubmitted: (claimNumber: string) => ({
    type: "info" as const,
    title: "Claim Submitted",
    message: `Your claim ${claimNumber} has been submitted and is under review.`,
    actionUrl: `/portal/claims/${claimNumber}`,
  }),

  claimApproved: (claimNumber: string, amount: number) => ({
    type: "success" as const,
    title: "Claim Approved",
    message: `Your claim ${claimNumber} for $${amount.toFixed(2)} has been approved.`,
    actionUrl: `/portal/claims/${claimNumber}`,
  }),

  claimRejected: (claimNumber: string, reason: string) => ({
    type: "error" as const,
    title: "Claim Rejected",
    message: `Your claim ${claimNumber} was rejected. Reason: ${reason}`,
    actionUrl: `/portal/claims/${claimNumber}`,
  }),

  paymentReceived: (invoiceNumber: string, amount: number) => ({
    type: "success" as const,
    title: "Payment Received",
    message: `We've received your payment of $${amount.toFixed(2)} for invoice ${invoiceNumber}.`,
    actionUrl: `/portal/billing`,
  }),

  paymentFailed: (invoiceNumber: string) => ({
    type: "error" as const,
    title: "Payment Failed",
    message: `Payment for invoice ${invoiceNumber} failed. Please try again.`,
    actionUrl: `/portal/billing`,
  }),

  renewalReminder: (daysUntilExpiry: number) => ({
    type: "warning" as const,
    title: "Membership Expiring Soon",
    message: `Your membership expires in ${daysUntilExpiry} days. Renew now to maintain coverage.`,
    actionUrl: `/portal/billing/renew`,
  }),

  documentRequired: (documentType: string) => ({
    type: "warning" as const,
    title: "Document Required",
    message: `Please upload your ${documentType} to complete your application.`,
    actionUrl: `/portal/documents`,
  }),

  newMessage: (senderName: string) => ({
    type: "info" as const,
    title: "New Message",
    message: `You have a new message from ${senderName}.`,
    actionUrl: `/portal/messages`,
  }),

  systemMaintenance: (startTime: string, duration: string) => ({
    type: "warning" as const,
    title: "Scheduled Maintenance",
    message: `System maintenance scheduled for ${startTime}. Expected duration: ${duration}.`,
  }),
}

/**
 * React hook for real-time notifications (client-side)
 */
export function useRealtimeNotifications() {
  // This would be implemented in a React component file
  // Using EventSource API for SSE
  return {
    connect: (userId: string) => {
      const eventSource = new EventSource(`/api/realtime/events?userId=${userId}`)
      return eventSource
    },
    disconnect: (eventSource: EventSource) => {
      eventSource.close()
    },
  }
}
