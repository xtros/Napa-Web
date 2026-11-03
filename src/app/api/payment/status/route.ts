import { NextResponse } from "next/server"
import {
  getYoupiOrder,
  getYoupiOrderByPaymentId,
  updateYoupiOrderStatus,
  getYoupiConfig
} from "@/lib/youpi"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const orderId = searchParams.get("orderId") || searchParams.get("order_id")
    const paymentId = searchParams.get("paymentId") || searchParams.get("payment_id")

    let order = orderId
      ? getYoupiOrder(orderId)
      : paymentId
      ? getYoupiOrderByPaymentId(paymentId)
      : null

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    // If order is active/manual_review, poll gateway if paymentId is registered
    if (order.status !== "COMPLETED" && order.status !== "FAILED" && order.status !== "EXPIRED" && order.paymentId) {
      const config = getYoupiConfig()
      try {
        const res = await fetch(`${config.apiUrl}/api/v1/payments/${order.paymentId}`, {
          headers: {
            "X-Merchant-Key": config.merchantKey
          },
          signal: AbortSignal.timeout(1500)
        })

        if (res.ok) {
          const gwData = await res.json()
          if (
            gwData.status === "SUCCESS" ||
            gwData.status === "OBSERVED_SUCCESS" ||
            gwData.status === "RECONCILED"
          ) {
            order = updateYoupiOrderStatus(order.orderId, "COMPLETED", {
              utr: gwData.utr || order.utr || undefined
            })
          } else if (gwData.status === "MANUAL_REVIEW" && order.status !== "MANUAL_REVIEW") {
            order = updateYoupiOrderStatus(order.orderId, "MANUAL_REVIEW", {
              utr: gwData.utr || order.utr || undefined
            })
          } else if (gwData.status === "EXPIRED") {
            order = updateYoupiOrderStatus(order.orderId, "EXPIRED")
          } else if (gwData.status === "FAILED") {
            order = updateYoupiOrderStatus(order.orderId, "FAILED")
          }
        }
      } catch (err) {
        // Gateway poll timeout or offline; return current cached state
      }
    }

    // Fallback: If order is still ACTIVE without UTR, and > 5 minutes have elapsed, mark as EXPIRED
    if (
      order.status === "ACTIVE" &&
      !order.utr &&
      Date.now() - new Date(order.createdAt).getTime() > 300_000
    ) {
      order = updateYoupiOrderStatus(order.orderId, "EXPIRED")
    }

    return NextResponse.json({
      success: true,
      order
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch order status" },
      { status: 500 }
    )
  }
}

