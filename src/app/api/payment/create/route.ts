import { NextResponse } from "next/server"
import { createYoupiOrder } from "@/lib/youpi"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { username, rankId, customerPhone } = body

    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { success: false, error: "Please enter your Minecraft in-game username" },
        { status: 400 }
      )
    }

    if (!rankId || typeof rankId !== "string") {
      return NextResponse.json(
        { success: false, error: "Please select a rank to purchase" },
        { status: 400 }
      )
    }

    const order = await createYoupiOrder({
      username: username.trim(),
      rankId: rankId.trim(),
      customerPhone: typeof customerPhone === "string" ? customerPhone.trim() : undefined
    })

    return NextResponse.json({
      success: true,
      order
    })
  } catch (err: any) {
    console.error("Payment session creation error:", err)
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create payment session" },
      { status: 400 }
    )
  }
}

