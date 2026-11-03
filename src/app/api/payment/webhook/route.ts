import { NextResponse } from "next/server"
import {
  verifyYoupiWebhookSignature,
  getYoupiOrder,
  getYoupiOrderByPaymentId,
  updateYoupiOrderStatus
} from "@/lib/youpi"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get("x-gateway-signature") || req.headers.get("x-gateway-signature-v2") || ""
    const timestamp = req.headers.get("x-gateway-timestamp")
    const deliveryId = req.headers.get("x-gateway-delivery-id")

    // Cryptographically verify signature if a webhook secret is configured
    const isValid = verifyYoupiWebhookSignature(rawBody, signature, timestamp)
    if (!isValid) {
      console.warn("Invalid YouPI PG webhook signature attempt:", {
        deliveryId,
        hasSig: !!signature
      })
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 })
    }

    const payload = JSON.parse(rawBody)
    const { event, orderId, paymentId, utr, status } = payload

    // Locate target order
    let order = orderId
      ? getYoupiOrder(orderId)
      : paymentId
      ? getYoupiOrderByPaymentId(paymentId)
      : null

    if (!order) {
      console.warn(`YouPI PG webhook received for unknown order: ${orderId || paymentId}`)
      return NextResponse.json({ received: true, warning: "Order not found" })
    }

    // Map gateway outcome to order status
    if (
      event === "RECONCILED" ||
      event === "OBSERVED_SUCCESS" ||
      status === "SUCCESS" ||
      status === "OBSERVED_SUCCESS"
    ) {
      updateYoupiOrderStatus(order.orderId, "COMPLETED", {
        utr: utr || undefined,
        verificationNote: `Auto-verified via YouPI PG Webhook (${event || status})`
      })
      console.log(`[YouPI PG] Order ${order.orderId} COMPLETED for player ${order.username}!`)
    } else if (event === "MANUAL_REVIEW" || status === "MANUAL_REVIEW") {
      updateYoupiOrderStatus(order.orderId, "MANUAL_REVIEW", {
        utr: utr || undefined,
        verificationNote: "Customer submitted UTR. Awaiting bank statement check."
      })
    } else if (event === "FAILED" || event === "EXPIRED" || status === "FAILED") {
      updateYoupiOrderStatus(order.orderId, "FAILED", {
        verificationNote: `Gateway event: ${event || status}`
      })
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error("YouPI webhook processing error:", err)
    return NextResponse.json({ error: err.message || "Webhook processing error" }, { status: 500 })
  }
}
