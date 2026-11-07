import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import { siteConfig } from "@/data/siteConfig"
import { generateQrSvg } from "@/lib/youpiQr"

export type OrderStatus =
  | "INITIATED"
  | "ACTIVE"
  | "MANUAL_REVIEW"
  | "OBSERVED_SUCCESS"
  | "RECONCILED"
  | "COMPLETED"
  | "FAILED"
  | "EXPIRED"
  | "CANCELLED"

export type YoupiOrder = {
  orderId: string
  paymentId: string
  username: string
  rankId: string
  rankName: string
  amount: number
  currency: string
  status: OrderStatus
  utr: string | null
  upiUri: string
  checkoutUrl: string
  qrSvg: string
  payeeVpa: string
  customerPhone?: string
  receiptSentAt?: string
  verifiedBy?: string
  verificationNote?: string
  createdAt: string
  updatedAt: string
}

const ORDERS_FILE_PATH = path.join(process.cwd(), "data", "youpi_orders.json")

function ensureDataDirectory() {
  const dir = path.dirname(ORDERS_FILE_PATH)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function loadOrders(): Record<string, YoupiOrder> {
  try {
    ensureDataDirectory()
    if (fs.existsSync(ORDERS_FILE_PATH)) {
      const data = fs.readFileSync(ORDERS_FILE_PATH, "utf8")
      return JSON.parse(data)
    }
  } catch (err) {
    console.error("Error loading YouPI orders:", err)
  }
  return {}
}

function saveOrders(orders: Record<string, YoupiOrder>) {
  try {
    ensureDataDirectory()
    fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify(orders, null, 2), "utf8")
  } catch (err) {
    console.error("Error saving YouPI orders:", err)
  }
}

export const getYoupiConfig = () => {
  return {
    apiUrl: (process.env.YOUPI_API_URL || "http://localhost:6100").replace(/\/$/, ""),
    portalUrl: (process.env.YOUPI_PORTAL_URL || "http://localhost:7000").replace(/\/$/, ""),
    merchantId: process.env.YOUPI_MERCHANT_ID || "napa_smp",
    merchantKey: process.env.YOUPI_MERCHANT_KEY || process.env.YOUPI_MERCHANT_API_KEY || "napa_secret_key_2026",
    webhookSecret: process.env.YOUPI_WEBHOOK_SECRET || "napa_webhook_secret_2026",
    payeeVpa: process.env.UPI_MERCHANT_VPA || "playnapa@upi",
    scriptUrl: process.env.NEXT_PUBLIC_YOUPI_SCRIPT_URL || "/assets/youpi.js"
  }
}

/**
 * Extracts numeric price from strings like "80/-", "₹250", "500"
 */
export function parseRankPrice(priceStr: string): number {
  const digits = priceStr.replace(/[^0-9]/g, "")
  const parsed = parseInt(digits, 10)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Creates a new YouPI payment session for a Minecraft player
 */
export async function createYoupiOrder(params: {
  username: string
  rankId: string
  customerPhone?: string
  origin?: string
}): Promise<YoupiOrder> {
  const config = getYoupiConfig()
  const username = params.username.trim()
  if (!username) {
    throw new Error("Minecraft username is required")
  }

  // Find rank product
  const product = siteConfig.ranks.products.find((p) => p.id === params.rankId)
  if (!product) {
    throw new Error(`Invalid rank ID: ${params.rankId}`)
  }

  const amount = parseRankPrice(product.price)
  if (amount <= 0) {
    throw new Error(`Rank ${product.name} cannot be purchased directly (amount is 0 or application only)`)
  }

  // Unique Order ID
  const timestamp = Date.now().toString(36).toUpperCase()
  const randomSuffix = Math.floor(1000 + Math.random() * 9000)
  const orderId = `NAPA-${product.id.toUpperCase()}-${timestamp}-${randomSuffix}`

  let paymentId = `youpi_${crypto.randomUUID()}`
  let checkoutUrl = `${config.portalUrl}/checkout/${paymentId}`
  let status: OrderStatus = "ACTIVE"

  // Attempt to create session via YouPI PG Payment API
  try {
    const baseReturnUrl = (params.origin || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "")
    const res = await fetch(`${config.apiUrl}/api/v1/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Merchant-Id": config.merchantId,
        "X-Merchant-Key": config.merchantKey
      },
      body: JSON.stringify({
        orderId,
        amount: `${amount}.00`,
        currency: "INR",
        returnUrl: `${baseReturnUrl}/order-status?order_id=${orderId}`,
        autoActivate: true,
        customer: {
          fullName: username,
          phoneNumber: params.customerPhone || ""
        },
        metadata: {
          minecraftUsername: username,
          rankId: product.id,
          rankName: product.name,
          platform: "NAPA SMP Web"
        }
      }),
      signal: AbortSignal.timeout(4000)
    })

    if (res.ok) {
      const data = await res.json()
      if (data.paymentId) paymentId = data.paymentId
      if (data.checkoutUrl) checkoutUrl = data.checkoutUrl
      if (data.status) status = data.status as OrderStatus
      console.log(`[YouPI PG] Successfully created & activated payment session ${paymentId} for order ${orderId}`)
    } else {
      const errText = await res.text()
      console.error(`[YouPI PG API Error ${res.status}]:`, errText)
    }
  } catch (err: any) {
    console.warn(`[YouPI PG] Gateway unreachable (${err?.message}). Running in standalone mode.`)
  }

  // Generate authentic UPI Deep Link and QR Code
  const upiUri = `upi://pay?pa=${encodeURIComponent(config.payeeVpa)}&pn=${encodeURIComponent("NAPA SMP")}&am=${amount}.00&cu=INR&tn=${encodeURIComponent(orderId)}`
  const qrSvg = generateQrSvg(upiUri, 240)

  const order: YoupiOrder = {
    orderId,
    paymentId,
    username,
    rankId: product.id,
    rankName: product.name,
    amount,
    currency: "INR",
    status,
    utr: null,
    upiUri,
    checkoutUrl,
    qrSvg,
    payeeVpa: config.payeeVpa,
    customerPhone: params.customerPhone,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  const orders = loadOrders()
  orders[orderId] = order
  saveOrders(orders)

  return order
}

export function getYoupiOrder(orderId: string): YoupiOrder | null {
  const orders = loadOrders()
  return orders[orderId] || null
}

export function getYoupiOrderByPaymentId(paymentId: string): YoupiOrder | null {
  const orders = loadOrders()
  for (const id in orders) {
    if (orders[id].paymentId === paymentId) {
      return orders[id]
    }
  }
  return null
}

export function listYoupiOrders(): YoupiOrder[] {
  const orders = loadOrders()
  return Object.values(orders).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

/**
 * Submits customer's 12-digit UTR for manual review
 */
export function claimYoupiUtr(orderId: string, utr: string): YoupiOrder {
  const cleanUtr = utr.trim().replace(/[^0-9]/g, "")
  if (cleanUtr.length !== 12) {
    throw new Error("UTR must be a 12-digit numerical reference number")
  }

  const orders = loadOrders()
  const order = orders[orderId]
  if (!order) {
    throw new Error(`Order ${orderId} not found`)
  }

  if (order.status === "COMPLETED") {
    return order
  }

  order.utr = cleanUtr
  order.status = "MANUAL_REVIEW"
  order.updatedAt = new Date().toISOString()
  saveOrders(orders)

  return order
}

/**
 * Updates order status from Webhook or Gateway event
 */
export function updateYoupiOrderStatus(
  orderId: string,
  status: OrderStatus,
  patch: Partial<YoupiOrder> = {}
): YoupiOrder {
  const orders = loadOrders()
  const order = orders[orderId]
  if (!order) {
    throw new Error(`Order ${orderId} not found`)
  }

  order.status = status
  if (patch.utr) order.utr = patch.utr
  if (patch.verifiedBy) order.verifiedBy = patch.verifiedBy
  if (patch.verificationNote) order.verificationNote = patch.verificationNote
  if (patch.customerPhone) order.customerPhone = patch.customerPhone
  if (patch.receiptSentAt) order.receiptSentAt = patch.receiptSentAt
  order.updatedAt = new Date().toISOString()
  saveOrders(orders)

  return order
}

/**
 * Updates or attaches the customer's phone number to an order
 */
export function updateYoupiOrderCustomerPhone(orderId: string, phone: string): YoupiOrder {
  const orders = loadOrders()
  const order = orders[orderId]
  if (!order) {
    throw new Error(`Order ${orderId} not found`)
  }

  order.customerPhone = phone.trim()
  order.updatedAt = new Date().toISOString()
  saveOrders(orders)

  return order
}

/**
 * Cryptographically verifies YouPI PG Webhook HMAC-SHA256 signature
 */
export function verifyYoupiWebhookSignature(
  rawPayload: string,
  signatureHeader: string,
  timestampHeader?: string | null
): boolean {
  const config = getYoupiConfig()
  const secret = config.webhookSecret

  if (!signatureHeader || !signatureHeader.startsWith("sha256=")) {
    return false
  }

  const actualSig = signatureHeader.replace("sha256=", "")

  // Check V1 signature: HMAC(secret, rawPayload)
  const hmacV1 = crypto.createHmac("sha256", secret).update(rawPayload).digest("hex")
  if (
    actualSig.length === hmacV1.length &&
    crypto.timingSafeEqual(Buffer.from(actualSig), Buffer.from(hmacV1))
  ) {
    return true
  }

  // Check V2 signature if timestamp header present: HMAC(secret, `${timestamp}.${rawPayload}`)
  if (timestampHeader) {
    const hmacV2 = crypto
      .createHmac("sha256", secret)
      .update(`${timestampHeader}.${rawPayload}`)
      .digest("hex")
    if (
      actualSig.length === hmacV2.length &&
      crypto.timingSafeEqual(Buffer.from(actualSig), Buffer.from(hmacV2))
    ) {
      return true
    }
  }

  return false
}

