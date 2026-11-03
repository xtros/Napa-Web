"use client"

import { useState, useEffect, useCallback } from "react"
import { RankProduct } from "@/data/siteConfig"
import { YoupiOrder } from "@/lib/youpi"

interface YoupiCheckoutModalProps {
  product: RankProduct | null
  open: boolean
  onClose: () => void
}

export default function YoupiCheckoutModal({ product, open, onClose }: YoupiCheckoutModalProps) {
  const [step, setStep] = useState<"USERNAME" | "PAYMENT" | "SUCCESS" | "EXPIRED" | "FAILED">("USERNAME")
  const [username, setUsername] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<YoupiOrder | null>(null)
  const [utrInput, setUtrInput] = useState("")
  const [submittingUtr, setSubmittingUtr] = useState(false)
  const [utrMessage, setUtrMessage] = useState<string | null>(null)
  const [copiedVpa, setCopiedVpa] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes

  // Reset state when opened with a new product
  useEffect(() => {
    if (open) {
      setStep("USERNAME")
      setUsername("")
      setPhone("")
      setError(null)
      setOrder(null)
      setUtrInput("")
      setUtrMessage(null)
      setCopiedVpa(false)
      setTimeLeft(300)
    }
  }, [open, product])

  // Countdown timer for active checkout session
  useEffect(() => {
    if (step !== "PAYMENT") return
    if (timeLeft <= 0) {
      if (order?.status !== "MANUAL_REVIEW" && !order?.utr) {
        setStep("EXPIRED")
      }
      return
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (order?.status !== "MANUAL_REVIEW" && !order?.utr) {
            setStep("EXPIRED")
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [step, timeLeft, order])

  // Real-time polling for order status
  const pollOrderStatus = useCallback(async () => {
    if (!order || (step !== "PAYMENT" && step !== "EXPIRED")) return

    try {
      const res = await fetch(`/api/payment/status?orderId=${encodeURIComponent(order.orderId)}`)
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.order) {
          setOrder(data.order)
          if (data.order.status === "COMPLETED") {
            setStep("SUCCESS")
          } else if (data.order.status === "EXPIRED" && !data.order.utr) {
            setStep("EXPIRED")
          } else if (data.order.status === "FAILED") {
            setStep("FAILED")
          }
        }
      }
    } catch {}
  }, [order, step])

  useEffect(() => {
    if (step !== "PAYMENT" && step !== "EXPIRED") return
    const interval = setInterval(pollOrderStatus, 3000)
    return () => clearInterval(interval)
  }, [step, pollOrderStatus])

  const handleRetry = () => {
    setStep("USERNAME")
    setOrder(null)
    setUtrInput("")
    setUtrMessage(null)
    setError(null)
    setTimeLeft(300)
  }

  if (!open || !product) return null

  const handleStartPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) {
      setError("Please enter your in-game Minecraft username.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          rankId: product.id,
          customerPhone: phone.trim() || undefined
        })
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to initialize payment")
      }

      setOrder(data.order)
      setStep("PAYMENT")
      setTimeLeft(300)

      // If official Youpi SDK script is available on window, try invoking it
      if (typeof window !== "undefined" && (window as any).Youpi?.pay) {
        try {
          ;(window as any).Youpi.pay({
            orderId: data.order.orderId,
            amount: data.order.amount,
            currency: "INR",
            name: "NAPA SMP Ranks",
            description: `Unlock ${product.name} Rank for ${username}`,
            checkoutUrl: data.order.checkoutUrl,
            handler: function () {
              setStep("SUCCESS")
            }
          })
        } catch {
          // Fall back gracefully to inline modal
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to NAPA Pay")
    } finally {
      setLoading(false)
    }
  }

  const handleClaimUtr = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!order || !utrInput.trim()) return

    const clean = utrInput.trim().replace(/[^0-9]/g, "")
    if (clean.length !== 12) {
      setError("UTR must be a 12-digit number found on your UPI receipt")
      return
    }

    setSubmittingUtr(true)
    setError(null)

    try {
      const res = await fetch("/api/payment/claim-utr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.orderId,
          utr: clean
        })
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit UTR")
      }

      setOrder(data.order)
      setUtrMessage("UTR reference submitted! Verifying with bank records...")
    } catch (err: any) {
      setError(err.message || "Error submitting UTR")
    } finally {
      setSubmittingUtr(false)
    }
  }

  const handleCopyVpa = () => {
    if (!order) return
    navigator.clipboard.writeText(order.payeeVpa)
    setCopiedVpa(true)
    setTimeout(() => setCopiedVpa(false), 2000)
  }

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s < 10 ? "0" : ""}${s}`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 py-6 overflow-y-auto">
      <div className="panel-card w-full max-w-lg p-6 space-y-5 border border-purple-500/30 shadow-[0_0_50px_rgba(147,51,234,0.15)] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md text-sm">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  NAPA Pay
                </span>
                <span className="text-[10px] text-white/50 tracking-wider">0% FEES • DIRECT UPI</span>
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wide text-white mt-0.5">
                {step === "SUCCESS"
                  ? "Order Completed!"
                  : step === "EXPIRED"
                  ? "Payment Window Expired"
                  : step === "FAILED"
                  ? "Payment Failed"
                  : `Unlock ${product.name} Rank (${product.price})`}
              </h3>
            </div>
          </div>
          <button
            className="ghost-button h-8 w-8 px-0 flex items-center justify-center text-white/70 hover:text-white"
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300 flex items-center gap-2">
            <svg className="h-4 w-4 flex-shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Enter Username */}
        {step === "USERNAME" && (
          <form onSubmit={handleStartPayment} className="space-y-4">
            <div className="rounded-xl border border-line bg-midnight p-3.5 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-white/60 block">Selected Package</span>
                <span className="text-sm font-bold text-white">{product.name} Rank</span>
              </div>
              <span className="text-base font-bold text-amber-300">{product.price}</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/70 flex items-center justify-between">
                <span>Minecraft In-Game Username: <strong className="text-purple-400">*</strong></span>
              </label>
              <input
                className="input-field"
                placeholder="e.g. Steve"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
              <span className="text-[11px] text-white/50 block">
                Perks and ranks are linked directly to your Minecraft UUID upon payment.
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/70 flex items-center justify-between">
                <span>Mobile Number (Optional for WhatsApp Receipt):</span>
              </label>
              <input
                className="input-field"
                placeholder="e.g. 9876543210"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button
              className="primary-button w-full text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 py-3"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Connecting NAPA Pay...</span>
                </>
              ) : (
                <>
                  <span>Pay with UPI ({product.price})</span>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: Interactive UPI Checkout */}
        {step === "PAYMENT" && order && (
          <div className="space-y-4">
            {/* Top Order Summary & Session Timer */}
            <div className="flex items-center justify-between rounded-xl border border-line bg-midnight p-3 text-xs">
              <div>
                <span className="text-white/50 block text-[10px] uppercase">Order ID</span>
                <span className="font-mono text-purple-300 font-semibold">{order.orderId}</span>
              </div>
              <div className="text-right">
                <span className="text-white/50 block text-[10px] uppercase">Time Remaining</span>
                <span className={`font-mono font-bold ${timeLeft < 60 ? "text-red-400 animate-pulse" : "text-amber-300"}`}>
                  {formatTimer(timeLeft)}
                </span>
              </div>
            </div>

            {/* QR Code Card */}
            <div className="rounded-2xl border border-purple-500/20 bg-panel/70 p-4 text-center space-y-3">
              <span className="text-xs uppercase tracking-widest text-white/70 block">
                Scan with any UPI App (GPay, PhonePe, Paytm)
              </span>

              {/* Dynamic QR Render */}
              <div className="mx-auto w-48 h-48 bg-white p-2.5 rounded-xl shadow-lg flex items-center justify-center">
                <div
                  className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: order.qrSvg }}
                />
              </div>

              {/* Amount badge */}
              <div className="text-xl font-extrabold text-white">
                ₹{order.amount}.00
              </div>

              {/* VPA copy chip */}
              <div className="flex items-center justify-center gap-2 text-xs">
                <span className="text-white/60">UPI ID:</span>
                <code className="bg-midnight px-2 py-1 rounded border border-line text-purple-300 font-mono">
                  {order.payeeVpa}
                </code>
                <button
                  type="button"
                  onClick={handleCopyVpa}
                  className="text-[11px] uppercase tracking-wider text-accentSoft hover:text-white transition-colors"
                >
                  {copiedVpa ? "Copied! ✓" : "Copy"}
                </button>
              </div>

              {/* Mobile 1-Tap Deep Link */}
              <div className="pt-1">
                <a
                  href={order.upiUri}
                  className="ghost-button inline-flex items-center gap-2 text-xs uppercase tracking-wider w-full justify-center text-emerald hover:text-white hover:border-emerald"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                  <span>Open in UPI App (Mobile Only)</span>
                </a>
              </div>
            </div>

            {/* UTR Claim Submission Form */}
            <form onSubmit={handleClaimUtr} className="space-y-2 border-t border-line pt-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] uppercase tracking-widest text-white/70">
                  Paid? Enter 12-Digit Bank UTR / Reference:
                </label>
                {order.utr && (
                  <span className="text-[10px] text-emerald font-mono">
                    Claimed: {order.utr}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  className="input-field font-mono text-sm tracking-wider"
                  placeholder="e.g. 431289123456"
                  maxLength={12}
                  type="text"
                  value={utrInput}
                  onChange={(e) => setUtrInput(e.target.value.replace(/[^0-9]/g, ""))}
                />
                <button
                  type="submit"
                  disabled={submittingUtr || utrInput.length !== 12}
                  className="primary-button text-xs uppercase tracking-wider px-4 flex-shrink-0 disabled:opacity-50"
                >
                  {submittingUtr ? "..." : "Submit UTR"}
                </button>
              </div>

              {utrMessage && (
                <div className="rounded-lg bg-emerald/10 border border-emerald/20 p-2 text-[11px] text-emerald flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{utrMessage}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between text-[11px] text-white/50 pt-1 gap-2">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald animate-ping inline-block" />
                  <span>Auto-detecting payment via NAPA Pay...</span>
                </span>
                <div className="flex items-center gap-3">
                  {order.checkoutUrl && (
                    <a
                      href={order.checkoutUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-300 hover:underline"
                    >
                      Open in NAPA Pay Portal ↗
                    </a>
                  )}
                  <a
                    href={`/order-status?order_id=${order.orderId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accentSoft hover:underline"
                  >
                    View Status ↗
                  </a>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: Order Completed & Perk Delivery */}
        {step === "SUCCESS" && order && (
          <div className="space-y-4 py-2 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald/20 text-emerald shadow-[0_0_25px_rgba(43,213,127,0.3)]">
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <div>
              <h4 className="text-xl font-bold uppercase tracking-wider text-white">
                Payment Confirmed! 🎉
              </h4>
              <p className="text-xs text-white/80 mt-1">
                Rank <strong className="text-amber-300">{product.name}</strong> unlocked for{" "}
                <strong className="text-accentSoft">{order.username}</strong>.
              </p>
            </div>

            <div className="rounded-xl border border-line bg-midnight p-3.5 text-xs text-left space-y-1.5 font-mono">
              <div className="flex justify-between text-white/70">
                <span>Order ID:</span>
                <span className="text-white">{order.orderId}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Amount Paid:</span>
                <span className="text-emerald font-bold">₹{order.amount}.00</span>
              </div>
              {order.utr && (
                <div className="flex justify-between text-white/70">
                  <span>Bank UTR:</span>
                  <span className="text-purple-300">{order.utr}</span>
                </div>
              )}
              <div className="flex justify-between text-white/70">
                <span>Server IP:</span>
                <span className="text-white">play.napasmp.fun</span>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald text-left">
              ✓ In-game bonus of <strong>{product.joiningBonus}</strong> and weekly salary of{" "}
              <strong>{product.weeklySalary}</strong> have been credited to player <strong>{order.username}</strong>!
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                className="ghost-button flex-1 text-xs uppercase tracking-widest"
                onClick={onClose}
              >
                Close
              </button>
              <a
                href="https://dsc.gg/napa"
                target="_blank"
                rel="noreferrer"
                className="primary-button flex-1 text-xs uppercase tracking-widest text-center"
              >
                Join Discord
              </a>
            </div>
          </div>
        )}

        {/* STEP 4: Session Expired / Failed */}
        {(step === "EXPIRED" || step === "FAILED") && order && (
          <div className="space-y-5 py-2 text-center animate-in fade-in duration-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>

            <div>
              <h4 className="text-xl font-bold uppercase tracking-wider text-white">
                {step === "EXPIRED" ? "Payment Window Expired" : "Payment Not Completed"}
              </h4>
              <p className="text-xs text-white/70 max-w-sm mx-auto mt-1">
                The 5-minute active UPI slot reservation for order{" "}
                <span className="font-mono text-purple-300 font-bold">{order.orderId}</span> has expired to free the receiver for other players.
              </p>
            </div>

            {/* If paid before timeout, allow submitting UTR */}
            <div className="rounded-xl border border-line bg-midnight p-4 text-left space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <span className="h-2 w-2 rounded-full bg-accentSoft inline-block" />
                <span>Did you already pay before the time ran out?</span>
              </div>
              <p className="text-[11px] text-white/60">
                If money was deducted from your UPI app, don't worry! Enter your 12-digit bank UTR below. The server admins will verify the bank transaction and manually deliver your rank.
              </p>

              <form onSubmit={handleClaimUtr} className="flex gap-2">
                <input
                  type="text"
                  maxLength={12}
                  className="input-field font-mono text-xs uppercase"
                  placeholder="Enter 12-digit Bank UTR"
                  value={utrInput}
                  onChange={(e) => setUtrInput(e.target.value.replace(/[^0-9]/g, ""))}
                />
                <button
                  type="submit"
                  disabled={submittingUtr || utrInput.length !== 12}
                  className="primary-button text-xs uppercase tracking-wider px-4 flex-shrink-0 disabled:opacity-50"
                >
                  {submittingUtr ? "..." : "Claim UTR"}
                </button>
              </form>

              {utrMessage && (
                <div className="rounded-lg bg-emerald/10 border border-emerald/20 p-2 text-[11px] text-emerald flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{utrMessage}</span>
                </div>
              )}
            </div>

            {/* Actions: Start New Payment or Close */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                className="ghost-button flex-1 text-xs uppercase tracking-widest py-3"
                onClick={onClose}
              >
                Close
              </button>
              <button
                type="button"
                className="primary-button flex-1 text-xs uppercase tracking-widest py-3 flex items-center justify-center gap-1.5 font-bold"
                onClick={handleRetry}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                <span>Start New Payment</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

