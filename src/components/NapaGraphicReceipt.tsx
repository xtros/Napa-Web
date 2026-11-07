"use client"

import { useEffect, useRef, useState } from "react"
import { YoupiOrder } from "@/lib/youpi"
import { formatDisplayPhone } from "@/lib/receipt"

interface NapaGraphicReceiptProps {
  order: YoupiOrder
  onSendWhatsApp?: () => void
  isSendingWhatsApp?: boolean
  whatsappNotice?: string | null
}

const PLAN_THEMES: Record<string, {
  title: string
  sub: string
  icon: string
  badgeText: string
  badgeClass: string
  gradient: string
  boxShadow: string
  templatePath: string
}> = {
  vip: {
    title: "VIP Server Plan",
    sub: "Starter Tier • Permanent (+10% Boost • $1.5K/wk)",
    icon: "🟩",
    badgeText: "STARTER",
    badgeClass: "bg-emerald-950/60 text-emerald-300 border-emerald-500/30",
    gradient: "from-[#8b5cf6] to-[#6d28d9]",
    boxShadow: "rgba(139,92,246,0.6)",
    templatePath: "/images/templates/receipt-template-vip.png"
  },
  mvp: {
    title: "MVP Server Plan",
    sub: "Popular Tier • Permanent (+20% Boost • $4K/wk)",
    icon: "💎",
    badgeText: "POPULAR",
    badgeClass: "bg-sky-950/60 text-sky-300 border-sky-500/30",
    gradient: "from-[#38bdf8] to-[#6366f1]",
    boxShadow: "rgba(56,189,248,0.6)",
    templatePath: "/images/templates/receipt-template-mvp.png"
  },
  elite: {
    title: "ELITE Server Plan",
    sub: "Best Value Tier • Permanent (+35% Boost • $8.5K/wk)",
    icon: "👑",
    badgeText: "BEST VALUE",
    badgeClass: "bg-amber-950/60 text-amber-300 border-amber-500/30",
    gradient: "from-[#f59e0b] to-[#d946ef]",
    boxShadow: "rgba(245,158,11,0.6)",
    templatePath: "/images/templates/receipt-template-elite.png"
  },
  creator: {
    title: "CREATOR Partner Plan",
    sub: "Streamer Tier • Official Partner Perks",
    icon: "⭐",
    badgeText: "PARTNER",
    badgeClass: "bg-red-950/60 text-red-300 border-red-500/30",
    gradient: "from-[#ef4444] to-[#8b5cf6]",
    boxShadow: "rgba(239,68,68,0.6)",
    templatePath: "/images/templates/receipt-template-creator.png"
  }
}

export default function NapaGraphicReceipt({
  order,
  onSendWhatsApp,
  isSendingWhatsApp,
  whatsappNotice
}: NapaGraphicReceiptProps) {
  const [downloadingImg, setDownloadingImg] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const planKey = (order.rankId || "vip").toLowerCase()
  const theme = PLAN_THEMES[planKey] || PLAN_THEMES.vip

  const formattedDate = new Date(order.updatedAt || order.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  })

  // Generate PNG file from canvas overlaying the specific plan template
  const handleDownloadImage = () => {
    setDownloadingImg(true)
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = theme.templatePath

    img.onload = () => {
      const canvas = canvasRef.current || document.createElement("canvas")
      canvas.width = img.width || 820
      canvas.height = img.height || 1024
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        setDownloadingImg(false)
        return
      }

      // 1. Draw base plan template image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // 2. Patch & Overwrite ORDER ID
      ctx.fillStyle = "#f6f6f8"
      ctx.fillRect(430, 400, 280, 28)
      ctx.fillStyle = "#1e1338"
      ctx.font = "bold 21px 'Courier New', monospace"
      ctx.textAlign = "right"
      ctx.fillText(`#${order.orderId}`, 705, 421)

      // 3. Patch & Overwrite DATE
      ctx.fillRect(430, 432, 280, 26)
      ctx.font = "bold 20px 'Courier New', monospace"
      ctx.fillText(formattedDate.toUpperCase(), 705, 452)

      // 4. If promotional or custom price differs from default
      if (order.amount) {
        ctx.fillStyle = "#f6f6f8"
        ctx.fillRect(580, 532, 130, 36)
        ctx.fillStyle = "#160e2b"
        ctx.font = "bold 24px sans-serif"
        ctx.textAlign = "right"
        ctx.fillText(`₹${order.amount}.00`, 705, 557)
      }

      // 5. Trigger instant file download
      try {
        const dataUrl = canvas.toDataURL("image/png")
        const a = document.createElement("a")
        a.href = dataUrl
        a.download = `NAPA-Receipt-${planKey.toUpperCase()}-${order.orderId}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      } catch (err) {
        console.error("Canvas export failed:", err)
      } finally {
        setDownloadingImg(false)
      }
    }

    img.onerror = () => {
      setDownloadingImg(false)
      alert("Could not load receipt template. Please try the PDF / Print option.")
    }
  }

  return (
    <div className="relative mx-auto max-w-md sm:max-w-lg w-full">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* GRAPHICAL RECEIPT CARD */}
      <div className="relative rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(147,51,234,0.35)] border-2 border-purple-500/40 bg-[#0d041a] p-3 sm:p-5">
        {/* Minecraft Ambient Glow & Accents */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.25),transparent_70%)] pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-purple-600/30 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-indigo-600/30 blur-3xl pointer-events-none rounded-full" />

        {/* Paper receipt with serrated jagged edges */}
        <div
          className="relative bg-[#f7f6f8] text-[#1b1233] p-5 sm:p-7 shadow-2xl mx-auto rounded-md font-sans"
          style={{
            clipPath:
              "polygon(0% 12px, 2.5% 0px, 5% 12px, 7.5% 0px, 10% 12px, 12.5% 0px, 15% 12px, 17.5% 0px, 20% 12px, 22.5% 0px, 25% 12px, 27.5% 0px, 30% 12px, 32.5% 0px, 35% 12px, 37.5% 0px, 40% 12px, 42.5% 0px, 45% 12px, 47.5% 0px, 50% 12px, 52.5% 0px, 55% 12px, 57.5% 0px, 60% 12px, 62.5% 0px, 65% 12px, 67.5% 0px, 70% 12px, 72.5% 0px, 75% 12px, 77.5% 0px, 80% 12px, 82.5% 0px, 85% 12px, 87.5% 0px, 90% 12px, 92.5% 0px, 95% 12px, 97.5% 0px, 100% 12px, 100% calc(100% - 12px), 97.5% 100%, 95% calc(100% - 12px), 92.5% 100%, 90% calc(100% - 12px), 87.5% 100%, 85% calc(100% - 12px), 82.5% 100%, 80% calc(100% - 12px), 77.5% 100%, 75% calc(100% - 12px), 72.5% 100%, 70% calc(100% - 12px), 67.5% 100%, 65% calc(100% - 12px), 62.5% 100%, 60% calc(100% - 12px), 57.5% 100%, 55% calc(100% - 12px), 52.5% 100%, 50% calc(100% - 12px), 47.5% 100%, 45% calc(100% - 12px), 42.5% 100%, 40% calc(100% - 12px), 37.5% 100%, 35% calc(100% - 12px), 32.5% 100%, 30% calc(100% - 12px), 27.5% 100%, 25% calc(100% - 12px), 22.5% 100%, 20% calc(100% - 12px), 17.5% 100%, 15% calc(100% - 12px), 12.5% 100%, 10% calc(100% - 12px), 7.5% 100%, 5% calc(100% - 12px), 2.5% 100%, 0% calc(100% - 12px))"
          }}
        >
          {/* Top Logo & Title Area */}
          <div className="text-center pt-2 pb-3 space-y-1">
            <div className="inline-block">
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wider bg-gradient-to-b from-[#b377ff] via-[#8534e6] to-[#451087] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] filter">
                NAPA
              </h1>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#2c1b4d]">
              <span className="h-0.5 w-6 bg-[#2c1b4d]/40 inline-block"></span>
              <span>RECEIPT</span>
              <span className="h-0.5 w-6 bg-[#2c1b4d]/40 inline-block"></span>
            </div>

            <p className="text-[10px] sm:text-[11px] font-bold text-[#4c3a70] uppercase tracking-wide">
              Thank you for purchasing our Minecraft plan!
            </p>

            <div className="pt-1 flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#3b126d] text-white text-[10px] sm:text-xs font-black tracking-widest shadow-md">
                <span>✦</span> NAPANETWORK.IN <span>✦</span>
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold uppercase tracking-wider ${theme.badgeClass}`}>
                {theme.badgeText}
              </span>
            </div>
          </div>

          {/* Stars Divider */}
          <div className="text-center text-[10px] text-[#553c82] tracking-[0.25em] font-mono select-none my-1">
            ★★★★★★★★★★★★★★★★★★★★★★★★
          </div>

          {/* Order Meta Info */}
          <div className="space-y-1.5 text-xs sm:text-sm font-mono py-1">
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-[#3a275e]">ORDER ID:</span>
              <span className="font-extrabold text-[#1a0f30] font-mono">#{order.orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-[#3a275e]">DATE:</span>
              <span className="font-bold text-[#201538] uppercase">{formattedDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-[#3a275e]">PLAYER:</span>
              <span className="font-extrabold text-[#6b21a8] uppercase bg-purple-100 px-2 py-0.5 rounded">
                {order.username}
              </span>
            </div>
          </div>

          {/* Stars Divider */}
          <div className="text-center text-[10px] text-[#553c82] tracking-[0.25em] font-mono select-none my-1">
            ★★★★★★★★★★★★★★★★★★★★★★★★
          </div>

          {/* Plan Details Header Bar */}
          <div className="bg-[#2d0e59] text-white px-3.5 py-1.5 rounded-md flex justify-between items-center text-[11px] sm:text-xs font-extrabold uppercase tracking-wider my-2.5 shadow-sm">
            <span>PLAN DETAILS</span>
            <span>AMOUNT</span>
          </div>

          {/* Item Row */}
          <div className="flex items-center justify-between py-2.5 px-1">
            <div className="flex items-center gap-2.5">
              {/* Minecraft Plan Icon */}
              <div className="w-10 h-10 rounded bg-[#2a1352] border border-purple-500/30 flex items-center justify-center text-white text-lg shadow-sm flex-shrink-0">
                {theme.icon}
              </div>
              <div>
                <div className="font-extrabold text-sm sm:text-base text-[#1b1035] leading-snug">
                  {theme.title}
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#63557e] font-medium">
                  {theme.sub}
                </div>
              </div>
            </div>

            <div className="font-extrabold text-base sm:text-lg text-[#1b1035] font-mono">
              {planKey === "creator" ? "PARTNER" : `₹${order.amount}.00`}
            </div>
          </div>

          {/* Dashed Separator */}
          <div className="border-b-2 border-dashed border-[#2d0e59]/30 my-3" />

          {/* Total Row with Plan-Themed Gradient Badge */}
          <div className="flex justify-between items-center py-1">
            <span className="font-black text-xl sm:text-2xl text-[#1e1038] tracking-wider">
              TOTAL:
            </span>
            <div
              className={`px-5 py-2 rounded-full bg-gradient-to-r ${theme.gradient} text-white font-black text-xl sm:text-2xl tracking-wide shadow-lg`}
              style={{ boxShadow: `0 0 20px ${theme.boxShadow}` }}
            >
              {planKey === "creator" ? "PARTNER" : `₹${order.amount}.00`}
            </div>
          </div>

          {/* Success Banner */}
          <div className="text-center pt-3 pb-1 space-y-0.5">
            <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#15803d]">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#15803d] text-white text-[10px]">
                ✓
              </span>
              <span>Your purchase was successful!</span>
            </div>
            <p className="text-[11px] text-[#4d3b6e] font-semibold">
              Enjoy your Minecraft experience with NAPA!
            </p>
          </div>

          {/* Tagline */}
          <div className="text-center text-[10px] font-black tracking-widest text-[#2c1b4d] uppercase pt-2">
            PLAY  ♦  BUILD  ♦  EXPLORE
          </div>

          {/* Authentic Barcode */}
          <div className="pt-2 pb-3 text-center">
            <div className="mx-auto w-56 h-10 flex items-center justify-center gap-0.5">
              {[6, 2, 4, 1, 5, 2, 8, 1, 3, 2, 6, 4, 1, 7, 2, 5, 1, 8, 2, 4, 1, 5, 3, 2, 6, 1, 4, 2, 8, 3, 5, 1].map(
                (h, idx) => (
                  <span
                    key={idx}
                    className="bg-black inline-block h-full"
                    style={{ width: `${(idx % 4) + 1.5}px` }}
                  />
                )
              )}
            </div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-black/80 uppercase block mt-1">
              NAPANETWORK.IN
            </span>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="mt-4 pt-3 border-t border-purple-500/20 space-y-2.5">
          {/* WhatsApp Status Indicator */}
          {order.customerPhone && (
            <div className="flex items-center justify-between bg-purple-950/40 rounded-xl px-3 py-2 border border-purple-500/30 text-xs">
              <span className="text-white/70">
                WhatsApp Phone: <strong className="text-emerald-400">{formatDisplayPhone(order.customerPhone)}</strong>
              </span>
              {onSendWhatsApp && (
                <button
                  type="button"
                  onClick={onSendWhatsApp}
                  disabled={isSendingWhatsApp}
                  className="px-2.5 py-1 rounded bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold text-[11px] flex items-center gap-1 disabled:opacity-50"
                >
                  <span>💬</span> {isSendingWhatsApp ? "Sending..." : "Resend"}
                </button>
              )}
            </div>
          )}

          {whatsappNotice && (
            <div
              className={`text-xs text-center font-medium ${
                whatsappNotice.startsWith("✓") ? "text-emerald-400" : "text-amber-300"
              }`}
            >
              {whatsappNotice}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={downloadingImg}
              className="primary-button text-xs uppercase tracking-wider py-2.5 flex items-center justify-center gap-1.5 font-bold shadow-md"
            >
              <span>🖼️</span> {downloadingImg ? "Generating..." : "Download Image"}
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="ghost-button text-xs uppercase tracking-wider py-2.5 flex items-center justify-center gap-1.5 text-white hover:text-purple-300"
            >
              <span>🖨️</span> Print PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
