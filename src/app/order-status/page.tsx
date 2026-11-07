"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import PageShell from "@/components/PageShell"
import { YoupiOrder } from "@/lib/youpi"
import NapaGraphicReceipt from "@/components/NapaGraphicReceipt"

function OrderStatusContent() {
  const searchParams = useSearchParams()
  const initialOrderId = searchParams.get("order_id") || searchParams.get("orderId") || ""
  const [queryId, setQueryId] = useState(initialOrderId)
  const [order, setOrder] = useState<YoupiOrder | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [phoneInput, setPhoneInput] = useState("")
  const [sendingReceipt, setSendingReceipt] = useState(false)
  const [receiptNotice, setReceiptNotice] = useState<string | null>(null)
  const receiptRef = useRef<HTMLDivElement>(null)

  const fetchStatus = async (id: string) => {
    if (!id.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/payment/status?orderId=${encodeURIComponent(id.trim())}`)
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Order not found")
      }
      setOrder(data.order)
      if (data.order?.customerPhone) {
        setPhoneInput(data.order.customerPhone)
      }
    } catch (err: any) {
      setError(err.message || "Failed to load order status")
      setOrder(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialOrderId) {
      fetchStatus(initialOrderId)
    }
  }, [initialOrderId])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchStatus(queryId)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleSendReceiptToPhone = async (channel: "whatsapp" | "sms") => {
    if (!order) return
    const cleanPhone = phoneInput.trim().replace(/\D/g, "").slice(-10)
    if (!cleanPhone || cleanPhone.length !== 10) {
      setReceiptNotice("⚠️ Please enter a valid 10-digit mobile number.")
      return
    }

    setSendingReceipt(true)
    setReceiptNotice(null)
    try {
      const res = await fetch("/api/payment/send-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.orderId,
          phone: cleanPhone
        })
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to dispatch receipt")
      }

      if (channel === "whatsapp" && data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank")
        setReceiptNotice(`✓ Receipt opened in WhatsApp for +91 ${cleanPhone}!`)
      } else if (channel === "sms" && data.smsUrl) {
        window.location.href = data.smsUrl
        setReceiptNotice(`✓ Opening SMS composer for +91 ${cleanPhone}!`)
      } else {
        setReceiptNotice(`✓ Receipt processed for +91 ${cleanPhone}!`)
      }
    } catch (err: any) {
      setReceiptNotice(`⚠️ ${err.message || "Failed to send receipt."}`)
    } finally {
      setSendingReceipt(false)
    }
  }

  const handleCopyReceipt = () => {
    if (!order) return
    const text = `================================================
NAPA SMP — OFFICIAL PURCHASE RECEIPT
================================================
Order ID:       ${order.orderId}
Receipt No:     REC-${order.orderId}
Date:           ${new Date(order.updatedAt || order.createdAt).toLocaleString()}
Player:         ${order.username}
Item Purchased: ${order.rankName}
Amount Paid:    INR ₹${order.amount}.00
Payment Method: UPI Instant Settlement (Auto-Verified)
Bank UTR / Ref: ${order.utr || "Verified"}
Payment Status: ${order.status}
Server IP:      play.napasmp.fun
================================================
Thank you for supporting NAPA SMP!
Discord Support: https://dsc.gg/napa
================================================`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/30">
            ✓ COMPLETED & VERIFIED
          </span>
        )
      case "MANUAL_REVIEW":
        return (
          <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300 border border-amber-500/30 animate-pulse">
            ⏳ PENDING BANK REVIEW
          </span>
        )
      case "ACTIVE":
      case "INITIATED":
        return (
          <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-400 border border-blue-500/30">
            ● AWAITING PAYMENT
          </span>
        )
      case "FAILED":
      case "EXPIRED":
        return (
          <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-400 border border-red-500/30">
            ✕ FAILED / EXPIRED
          </span>
        )
      default:
        return (
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white border border-white/20">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Search Header - Hidden on Print */}
      <div className="panel-card p-6 space-y-4 text-center print:hidden">
        <span className="text-xs uppercase tracking-widest text-accentSoft font-bold">
          NAPA Pay Gateway
        </span>
        <h1 className="text-2xl font-bold uppercase tracking-wide text-white">
          Order & Payment Status
        </h1>
        <p className="text-xs text-white/70 max-w-md mx-auto">
          Look up your NAPA SMP rank purchase status and download your official receipt.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto pt-2">
          <input
            className="input-field font-mono text-sm uppercase"
            placeholder="e.g. NAPA-VIP-..."
            type="text"
            value={queryId}
            onChange={(e) => setQueryId(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="primary-button text-xs uppercase tracking-wider px-5 flex-shrink-0"
          >
            {loading ? "..." : "Track"}
          </button>
        </form>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300 text-center print:hidden">
          {error}
        </div>
      )}

      {/* Main Order Details & Receipt */}
      {order && (
        <div className="space-y-6">
          {/* Status Alert Banner - Hidden on Print */}
          {order.status === "COMPLETED" && (
            <>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald text-center space-y-1 print:hidden shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <div className="font-bold text-sm flex items-center justify-center gap-1.5">
                  <span>✓</span> Payment Verified & Perks Provisioned!
                </div>
                <div>Perks are live for <strong>{order.username}</strong> on <code>play.napasmp.fun</code>. Your official receipt is ready below.</div>
              </div>

              {/* Graphical Minecraft Template Receipt */}
              <div className="py-2">
                <NapaGraphicReceipt
                  order={order}
                  onSendWhatsApp={() => handleSendReceiptToPhone("whatsapp")}
                  isSendingWhatsApp={sendingReceipt}
                  whatsappNotice={receiptNotice}
                />
              </div>
            </>
          )}

          {order.status === "MANUAL_REVIEW" && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-300 text-center space-y-1 print:hidden">
              <div className="font-bold text-sm">⏳ Claim Received — Reviewing Bank Records</div>
              <div>Our staff compares your UTR <code>{order.utr}</code> against incoming UPI transactions. Your perks will activate automatically once confirmed.</div>
            </div>
          )}

          {/* OFFICIAL PURCHASE RECEIPT CONTAINER */}
          <div
            ref={receiptRef}
            className="panel-card p-6 sm:p-8 space-y-6 border border-purple-500/30 bg-gradient-to-b from-[#120a2a] to-[#0a0518] print:bg-white print:text-black print:border-black print:p-0 print:shadow-none print:m-0"
          >
            {/* Receipt Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-white/10 print:border-black/20 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold uppercase tracking-widest text-white print:text-black">
                    NAPA SMP
                  </span>
                  <span className="rounded bg-accent/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accentSoft print:bg-gray-100 print:text-black border border-accent/30 print:border-gray-400">
                    Official Receipt
                  </span>
                </div>
                <p className="text-[11px] text-white/60 print:text-gray-600 font-mono">
                  play.napasmp.fun • support@napanetwork
                </p>
                <p className="text-[11px] text-white/50 print:text-gray-500">
                  Receipt ID: <span className="font-mono font-bold text-white/80 print:text-black">REC-{order.orderId}</span>
                </p>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <div className="text-[11px] uppercase tracking-wider text-white/50 print:text-gray-500">
                  Payment Status
                </div>
                <div className="print:hidden">{getStatusBadge(order.status)}</div>
                <div className="hidden print:block font-bold text-sm text-black">
                  {order.status === "COMPLETED" ? "PAID & VERIFIED ✓" : order.status}
                </div>
                <div className="text-[11px] text-white/60 print:text-gray-600 font-mono">
                  {new Date(order.updatedAt || order.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Customer & Transaction Overview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl border border-white/10 print:border-gray-300 bg-midnight/80 print:bg-gray-50 p-4 space-y-1.5">
                <span className="text-white/50 print:text-gray-500 block text-[10px] font-bold uppercase tracking-wider">
                  Customer / Gamer Info
                </span>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 print:text-gray-700">Minecraft Player:</span>
                  <span className="font-bold text-accentSoft print:text-black text-sm">{order.username}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 print:text-gray-700">Platform Server:</span>
                  <span className="font-mono text-white/90 print:text-black">play.napasmp.fun</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 print:text-gray-700">Fulfillment:</span>
                  <span className="text-emerald-400 print:text-green-700 font-bold">Instant Activation</span>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 print:border-gray-300 bg-midnight/80 print:bg-gray-50 p-4 space-y-1.5">
                <span className="text-white/50 print:text-gray-500 block text-[10px] font-bold uppercase tracking-wider">
                  Payment & Verification
                </span>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 print:text-gray-700">Payment Gateway:</span>
                  <span className="font-semibold text-white/90 print:text-black">NAPA Pay UPI</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 print:text-gray-700">Bank UTR / Ref:</span>
                  <span className="font-mono text-purple-300 print:text-black font-bold text-xs">
                    {order.utr || "Verified Auto-Credit"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 print:text-gray-700">Order Reference:</span>
                  <span className="font-mono text-white/80 print:text-gray-800 text-[11px]">{order.orderId}</span>
                </div>
              </div>
            </div>

            {/* Itemized Line Items Table */}
            <div className="border border-white/10 print:border-gray-300 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-white/5 print:bg-gray-100 border-b border-white/10 print:border-gray-300 text-white/60 print:text-gray-600 uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-4 font-bold">Item Description</th>
                    <th className="py-2.5 px-4 font-bold text-center">Type</th>
                    <th className="py-2.5 px-4 font-bold text-right">Qty</th>
                    <th className="py-2.5 px-4 font-bold text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 print:divide-gray-200 text-white print:text-black">
                  <tr>
                    <td className="py-3 px-4">
                      <div className="font-bold text-sm text-white print:text-black">{order.rankName} Rank Tier</div>
                      <div className="text-[11px] text-white/50 print:text-gray-500">
                        In-Game Permanent Rank & Multiplier Benefits for {order.username}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-white/70 print:text-gray-600 font-mono text-[11px]">
                      Digital Good
                    </td>
                    <td className="py-3 px-4 text-right font-mono">1</td>
                    <td className="py-3 px-4 text-right font-mono font-bold">₹{order.amount}.00</td>
                  </tr>
                </tbody>
              </table>

              {/* Total Calculation Area */}
              <div className="bg-white/[0.02] print:bg-gray-50 border-t border-white/10 print:border-gray-300 p-4 space-y-2 text-xs">
                <div className="flex justify-between text-white/60 print:text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-mono">₹{order.amount}.00</span>
                </div>
                <div className="flex justify-between text-white/60 print:text-gray-600">
                  <span>Processing / Gateway Fee:</span>
                  <span className="font-mono text-emerald-400 print:text-green-700">₹0.00 (Free)</span>
                </div>
                <div className="flex justify-between text-white/60 print:text-gray-600">
                  <span>Estimated Taxes:</span>
                  <span className="font-mono">₹0.00</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white print:text-black border-t border-white/10 print:border-gray-300 pt-2.5">
                  <span>Total Paid:</span>
                  <span className="font-mono text-base text-amber-300 print:text-black">₹{order.amount}.00</span>
                </div>
              </div>
            </div>

            {/* Official Verification Stamp & Security Note */}
            <div className="rounded-xl border border-dashed border-emerald-500/30 print:border-gray-400 bg-emerald-500/5 print:bg-transparent p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="space-y-0.5">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 print:text-black flex items-center justify-center sm:justify-start gap-1.5">
                  <span>🛡️</span> Cryptographically Verified UPI Settlement
                </div>
                <div className="text-[11px] text-white/60 print:text-gray-600">
                  Payment processed via direct bank observation. Retain this receipt for your records.
                </div>
              </div>
              <div className="flex-shrink-0 text-center border-2 border-emerald-500/40 print:border-black rounded-lg px-3 py-1 font-mono text-[10px] font-extrabold uppercase tracking-widest text-emerald-300 print:text-black rotate-[-2deg]">
                OFFICIAL RECEIPT • PAID
              </div>
            </div>

            {/* Direct Phone Dispatch (WhatsApp & SMS) - Hidden when printing */}
            <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-4 space-y-3 print:hidden">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <span>📱</span> Send Receipt to Phone Number
                </div>
                <span className="text-[11px] text-white/50">Instant delivery via WhatsApp & SMS</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs text-white/50 font-mono">
                    +91
                  </div>
                  <input
                    type="tel"
                    className="input-field pl-10 text-xs font-mono w-full"
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSendReceiptToPhone("whatsapp")}
                    disabled={sendingReceipt || !phoneInput}
                    className="primary-button text-xs uppercase tracking-wider px-3.5 py-2.5 flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold disabled:opacity-50"
                  >
                    <span>💬</span> WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendReceiptToPhone("sms")}
                    disabled={sendingReceipt || !phoneInput}
                    className="ghost-button text-xs uppercase tracking-wider px-3.5 py-2.5 flex items-center justify-center gap-1.5 text-white hover:text-purple-300 disabled:opacity-50"
                  >
                    <span>✉️</span> SMS
                  </button>
                </div>
              </div>

              {receiptNotice && (
                <div className={`text-[11px] ${receiptNotice.startsWith("✓") ? "text-emerald-400 font-semibold" : "text-amber-300"}`}>
                  {receiptNotice}
                </div>
              )}
            </div>

            {/* Action Bar - Hidden when printing */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 print:hidden">
              <button
                type="button"
                onClick={handlePrint}
                className="primary-button flex-1 text-xs uppercase tracking-wider flex items-center justify-center gap-2 py-3"
              >
                <span>🖨️</span> Download / Print PDF Receipt
              </button>

              <button
                type="button"
                onClick={handleCopyReceipt}
                className="ghost-button flex-1 text-xs uppercase tracking-wider flex items-center justify-center gap-2 py-3"
              >
                <span>{copied ? "✓" : "📋"}</span> {copied ? "Receipt Copied!" : "Copy Receipt Details"}
              </button>

              <a
                href="https://dsc.gg/napa"
                target="_blank"
                rel="noreferrer"
                className="ghost-button text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 py-3 px-4 text-purple-300 hover:text-white"
              >
                <span>💬</span> Discord Help
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function OrderStatusPage() {
  return (
    <PageShell subnav={{ label: "Back to Ranks Store", href: "/ranks", backText: "Ranks" }}>
      <Suspense fallback={<div className="text-center py-20 text-xs uppercase tracking-widest text-white/50">Loading order...</div>}>
        <OrderStatusContent />
      </Suspense>
    </PageShell>
  )
}
