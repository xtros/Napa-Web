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
 * Builds the official receipt text message suitable for WhatsApp and SMS
 */
export function formatReceiptText(order: YoupiOrder, options?: { origin?: string }): string {
  const origin = (
    options?.origin ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://napa-web.vercel.app"
  ).replace(/\/$/, "")

  const receiptUrl = `${origin}/order-status?order_id=${encodeURIComponent(order.orderId)}`
  const dateStr = new Date(order.updatedAt || order.createdAt).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short"
  })

  return `🧾 *NAPA SMP — OFFICIAL PURCHASE RECEIPT*
━━━━━━━━━━━━━━━━━━━━━━
• *Receipt No:* REC-${order.orderId}
• *Order ID:* ${order.orderId}
• *Date:* ${dateStr}
• *Player Username:* ${order.username}
• *Purchased Tier:* ${order.rankName} Rank
• *Amount Paid:* INR ₹${order.amount}.00
• *Payment Method:* UPI Instant Settlement (Zero Fee)
• *Bank UTR / Ref:* ${order.utr || "Verified Auto-Credit"}
• *Payment Status:* COMPLETED & VERIFIED ✓
• *Minecraft Server:* play.napasmp.fun
━━━━━━━━━━━━━━━━━━━━━━
📄 *Download / View Printable Receipt:*
${receiptUrl}

🎮 *Activation Status:* All in-game perks, bonus multipliers, and weekly salary are active on play.napasmp.fun!
💬 *Discord Support:* https://dsc.gg/napa
━━━━━━━━━━━━━━━━━━━━━━
Thank you for supporting NAPA SMP!`
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
  // Generic WhatsApp share if no valid phone provided
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

