import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSessionToken, isAuthConfigured } from "@/lib/adminAuth"
import { verifyDiscordSession } from "@/lib/discordAuth"
import { listYoupiOrders, updateYoupiOrderStatus, getYoupiOrder } from "@/lib/youpi"

export const dynamic = "force-dynamic"

async function checkAdminAuth() {
  const cookieStore = await cookies()
  const session = cookieStore.get("admin_session")?.value
  const discordSession = cookieStore.get("napa_discord_session")?.value

  const isPasswordAdmin = Boolean(session && isAuthConfigured() && session === getSessionToken())
  let isDiscordAdmin = false
  let adminName = "Admin"

  if (discordSession) {
    const user = verifyDiscordSession(discordSession)
    if (user && user.isAdmin) {
      isDiscordAdmin = true
      adminName = user.username
    }
  }

  return { authorized: isPasswordAdmin || isDiscordAdmin, adminName }
}

export async function GET() {
  const { authorized } = await checkAdminAuth()
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const orders = listYoupiOrders()
  return NextResponse.json({ success: true, orders })
}

export async function POST(req: Request) {
  const { authorized, adminName } = await checkAdminAuth()
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const { orderId, action, note } = body

    if (!orderId || !action) {
      return NextResponse.json({ error: "orderId and action are required" }, { status: 400 })
    }

    const order = getYoupiOrder(orderId)
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (action === "VERIFY") {
      const updated = updateYoupiOrderStatus(orderId, "COMPLETED", {
        verifiedBy: adminName,
        verificationNote: note || "Verified by admin after bank record confirmation"
      })
      return NextResponse.json({ success: true, order: updated })
    } else if (action === "REJECT") {
      const updated = updateYoupiOrderStatus(orderId, "FAILED", {
        verifiedBy: adminName,
        verificationNote: note || "Rejected by admin"
      })
      return NextResponse.json({ success: true, order: updated })
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Admin update error" }, { status: 500 })
  }
}
