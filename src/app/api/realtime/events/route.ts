/**
 * Real-time Events API - Server-Sent Events (SSE) endpoint
 */

import { NextRequest } from "next/server"
import { createEventStream } from "@/lib/realtime"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId")

  if (!userId) {
    return new Response("User ID required", { status: 400 })
  }

  // In production, validate the user session
  // const session = await getServerSession(authOptions)
  // if (!session || session.user.id !== userId) {
  //   return new Response("Unauthorized", { status: 401 })
  // }

  const stream = createEventStream(userId)

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}
