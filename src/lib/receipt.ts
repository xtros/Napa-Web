import { YoupiOrder } from "@/lib/youpi"

/**
 * Normalizes an Indian phone number to 10 digits
 */
export function cleanPhoneNumber(rawPhone: string): string {
  const digits = String(rawPhone || "").replace(/\D/g, "")
  return digits.slice(-10)
}

/**
 * Formats a phone number for display (e.g. +91 98765 43210)
 */
export function formatDisplayPhone(rawPhone: string): string {
  const clean = cleanPhoneNumber(rawPhone)
  if (!clean || clean.length !== 10) return rawPhone || ""
  return `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`
}

/**
 * Builds the official receipt text message matching the exact graphical template
 */
export function formatReceiptText(order: YoupiOrder, options?: { origin?: string }): string {
  const origin = (
    options?.origin ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://napa-web.vercel.app"
  ).replace(/\/$/, "")

  const receiptUrl = `${origin}/order-status?order_id=${encodeURIComponent(order.orderId)}`
  const formattedDate = new Date(order.updatedAt || order.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  })

  return `🎮 *NAPA MINECRAFT NETWORK*
═══════ *RECEIPT* ═══════
*THANK YOU FOR PURCHASING OUR MINECRAFT PLAN!*
✦ *NAPANETWORK.IN* ✦

★★★★★★★★★★★★★★★★★★★★★★
*ORDER ID:*  #${order.orderId}
*DATE:*      ${formattedDate.toUpperCase()}
*PLAYER:*    ${order.username}
★★★★★★★★★★★★★★★★★★★★★★

*PLAN DETAILS*                          *AMOUNT*
*Minecraft Server Plan*                 *₹${order.amount}.00*
(${order.rankName} Rank Tier • Permanent)

────────────────────────
*TOTAL:*                             *₹${order.amount}.00*
────────────────────────

✅ *Your purchase was successful!*
*Enjoy your Minecraft experience with NAPA!*

*PLAY  ♦  BUILD  ♦  EXPLORE*

📄 *Download / View Your Graphic Receipt:*
${receiptUrl}

• *Server IP:* play.napasmp.fun
• *Bank UTR:* ${order.utr || "Auto-Verified"}
• *Discord Community:* https://dsc.gg/napa
════════════════════════`
}

/**
 * Generates an authentic WhatsApp Deep Link to send the receipt
 */
export function getWhatsAppReceiptUrl(rawPhone: string, receiptText: string): string {
  const clean = cleanPhoneNumber(rawPhone)
  const encoded = encodeURIComponent(receiptText)
  if (clean && clean.length === 10) {
    return `https://wa.me/91${clean}?text=${encoded}`
  }
  return `https://wa.me/?text=${encoded}`
}

/**
 * Generates an authentic native SMS Deep Link for mobile devices
 */
export function getSmsReceiptUrl(rawPhone: string, receiptText: string): string {
  const clean = cleanPhoneNumber(rawPhone)
  const encoded = encodeURIComponent(receiptText)
  if (clean && clean.length === 10) {
    return `sms:+91${clean}?body=${encoded}`
  }
  return `sms:?body=${encoded}`
}
