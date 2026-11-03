"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import PageShell from "@/components/PageShell"
import { YoupiOrder } from "@/lib/youpi"

function OrderStatusContent() {
  const searchParams = useSearchParams()
  const initialOrderId = searchParams.get("order_id") || searchParams.get("orderId") || ""
  const [queryId, setQueryId] = useState(initialOrderId)
  const [order, setOrder] = useState<YoupiOrder | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      {/* Search Header */}
      <div className="panel-card p-6 space-y-4 text-center">
        <span className="text-xs uppercase tracking-widest text-accentSoft font-bold">
          YouPI Payment Gateway
        </span>
        <h1 className="text-2xl font-bold uppercase tracking-wide text-white">
          Order & Payment Status
        </h1>
        <p className="text-xs text-white/70 max-w-md mx-auto">
          Look up your NAPA SMP rank purchase status using your unique Order ID.
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
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300 text-center">
          {error}
        </div>
      )}

      {/* Order Details Card */}
      {order && (
        <div className="panel-card p-6 space-y-5 border border-purple-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-line pb-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-white/50 block">Order ID</span>
              <span className="text-base font-mono font-bold text-white">{order.orderId}</span>
            </div>
            <div>{getStatusBadge(order.status)}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl border border-line bg-midnight p-3">
              <span className="text-white/50 block text-[10px] uppercase">Minecraft Player</span>
              <span className="text-sm font-bold text-accentSoft">{order.username}</span>
            </div>

            <div className="rounded-xl border border-line bg-midnight p-3">
              <span className="text-white/50 block text-[10px] uppercase">Rank Purchased</span>
              <span className="text-sm font-bold text-white">{order.rankName}</span>
            </div>

            <div className="rounded-xl border border-line bg-midnight p-3">
              <span className="text-white/50 block text-[10px] uppercase">Amount</span>
              <span className="text-sm font-bold text-amber-300">₹{order.amount}.00</span>
            </div>

            <div className="rounded-xl border border-line bg-midnight p-3">
              <span className="text-white/50 block text-[10px] uppercase">Bank UTR</span>
              <span className="text-sm font-mono text-purple-300">{order.utr || "Not Submitted"}</span>
            </div>
          </div>

          {order.status === "COMPLETED" && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald text-center space-y-1">
              <div className="font-bold text-sm">✓ Rank Verified and Provisioned!</div>
              <div>Perks are live for <strong>{order.username}</strong> on <code>play.napasmp.fun</code>.</div>
            </div>
          )}

          {order.status === "MANUAL_REVIEW" && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-300 text-center space-y-1">
              <div className="font-bold text-sm">⏳ Claim Received — Reviewing Bank Records</div>
              <div>Our staff compares your UTR <code>{order.utr}</code> against incoming UPI transactions. Your perks will activate automatically once confirmed.</div>
            </div>
          )}

          <div className="text-[11px] text-white/50 text-center pt-2">
            Created: {new Date(order.createdAt).toLocaleString()} • Last Updated: {new Date(order.updatedAt).toLocaleString()}
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

