import { NextResponse } from "next/server"
import { claimYoupiUtr } from "@/lib/youpi"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { orderId, utr } = body

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json(
        { success: false, error: "orderId is required" },
        { status: 400 }
      )
    }

    if (!utr || typeof utr !== "string") {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 12-digit UTR number" },
        { status: 400 }
      )
    }

    const order = claimYoupiUtr(orderId.trim(), utr.trim())

    return NextResponse.json({
      success: true,
      message: "UTR reference received! Verifying with bank records...",
      order
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to submit UTR" },
      { status: 400 }
    )
  }
}
