import { NextResponse } from "next/server"
import { getYoupiOrder, updateYoupiOrderCustomerPhone, getYoupiConfig } from "@/lib/youpi"
import {
  cleanPhoneNumber,
  formatDisplayPhone,
  formatReceiptText,
  getWhatsAppReceiptUrl,
  getSmsReceiptUrl
} from "@/lib/receipt"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { orderId, phone } = body

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 }
      )
    }

    let order = getYoupiOrder(orderId.trim())
    if (!order) {
      return NextResponse.json(
        { success: false, error: `Order ${orderId} not found` },
        { status: 404 }
      )
    }

    const rawPhone = (typeof phone === "string" && phone.trim()) || order.customerPhone || ""
    const cleanPhone = cleanPhoneNumber(rawPhone)

    if (!cleanPhone || cleanPhone.length !== 10) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid 10-digit mobile number" },
        { status: 400 }
      )
    }

    // Save phone number on order if updated
    if (order.customerPhone !== cleanPhone) {
      order = updateYoupiOrderCustomerPhone(order.orderId, cleanPhone)
    }

    let origin: string | undefined
    try {
      const headerOrigin = req.headers.get("origin") || req.headers.get("referer")
      if (headerOrigin) origin = new URL(headerOrigin).origin
    } catch {}

    const receiptText = formatReceiptText(order, { origin })
    const whatsappUrl = getWhatsAppReceiptUrl(cleanPhone, receiptText)
    const smsUrl = getSmsReceiptUrl(cleanPhone, receiptText)
    const formattedPhone = formatDisplayPhone(cleanPhone)

    // Attempt automated background dispatch via NAPA Pay backend if active
    let deliveredViaGateway = false
    try {
      const config = getYoupiConfig()
      if (order.paymentId && config.apiUrl) {
        const res = await fetch(`${config.apiUrl}/api/v1/payments/${order.paymentId}/send-receipt`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Merchant-Key": config.merchantKey
          },
          body: JSON.stringify({
            phone: cleanPhone,
            message: receiptText
          }),
          signal: AbortSignal.timeout(3000)
        })

        if (res.ok) {
          const gwData = await res.json()
          if (gwData.delivered) {
            deliveredViaGateway = true
          }
        }
      }
    } catch (e: any) {
      // Backend offline or timeout; fallback smoothly to instant direct links
    }

    return NextResponse.json({
      success: true,
      deliveredViaGateway,
      phone: cleanPhone,
      formattedPhone,
      whatsappUrl,
      smsUrl,
      receiptText,
      order
    })
  } catch (err: any) {
    console.error("Send receipt error:", err)
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process receipt dispatch" },
      { status: 500 }
    )
  }
}

