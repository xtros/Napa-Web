"use client"

import { useState } from "react"
import PageShell from "@/components/PageShell"
import { siteConfig, RankProduct } from "@/data/siteConfig"
import NapaGraphicReceipt from "@/components/NapaGraphicReceipt"
import YoupiCheckoutModal from "@/components/YoupiCheckoutModal"
import { YoupiOrder } from "@/lib/youpi"
import Image from "next/image"

const PLAN_PREVIEWS: Array<{
  id: string
  name: string
  price: string
  badge: string
  icon: string
  accent: string
  bonus: string
  salary: string
  multiplier: string
  templateImg: string
}> = [
  {
    id: "vip",
    name: "VIP Server Plan",
    price: "80.00",
    badge: "STARTER",
    icon: "🟩",
    accent: "text-emerald-400 border-emerald-500/30 bg-emerald-950/40",
    bonus: "$5,000",
    salary: "$1,500/wk",
    multiplier: "1.10x (+10%)",
    templateImg: "/images/templates/receipt-template-vip.png"
  },
  {
    id: "mvp",
    name: "MVP Server Plan",
    price: "250.00",
    badge: "POPULAR",
    icon: "💎",
    accent: "text-sky-400 border-sky-500/30 bg-sky-950/40",
    bonus: "$15,000",
    salary: "$4,000/wk",
    multiplier: "1.20x (+20%)",
    templateImg: "/images/templates/receipt-template-mvp.png"
  },
  {
    id: "elite",
    name: "ELITE Server Plan",
    price: "500.00",
    badge: "BEST VALUE",
    icon: "👑",
    accent: "text-amber-400 border-amber-500/30 bg-amber-950/40",
    bonus: "$35,000",
    salary: "$8,500/wk",
    multiplier: "1.35x (+35%)",
    templateImg: "/images/templates/receipt-template-elite.png"
  },
  {
    id: "creator",
    name: "CREATOR Partner Plan",
    price: "0.00",
    badge: "PARTNER",
    icon: "⭐",
    accent: "text-red-400 border-red-500/30 bg-red-950/40",
    bonus: "Creator Bonus",
    salary: "$5,000/wk",
    multiplier: "1.25x (+25%)",
    templateImg: "/images/templates/receipt-template-creator.png"
  }
]

export default function ReceiptTemplatesPage() {
  const [selectedPlanId, setSelectedPlanId] = useState("vip")
  const [customUsername, setCustomUsername] = useState("Steve")
  const [activeModalProduct, setActiveModalProduct] = useState<RankProduct | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const activePlan = PLAN_PREVIEWS.find((p) => p.id === selectedPlanId) || PLAN_PREVIEWS[0]

  // Construct mock order for live interactive preview
  const mockOrder: YoupiOrder = {
    orderId: `NAPA-${activePlan.id.toUpperCase()}-SAMPLE-2026`,
    paymentId: `mock_${activePlan.id}`,
    username: customUsername.trim() || "Steve",
    rankId: activePlan.id,
    rankName: activePlan.name.replace(" Server Plan", "").replace(" Partner Plan", ""),
    amount: activePlan.id === "creator" ? 0 : parseFloat(activePlan.price),
    currency: "INR",
    status: "COMPLETED",
    utr: "667529599978",
    upiUri: "upi://pay?pa=playnapa@upi&pn=NAPA%20SMP",
    checkoutUrl: "#",
    qrSvg: "",
    payeeVpa: "playnapa@upi",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  const handleOpenBuy = () => {
    const matched = siteConfig.ranks.products.find((p) => p.id === activePlan.id)
    if (matched) {
      setActiveModalProduct(matched)
      setCheckoutOpen(true)
    }
  }

  return (
    <PageShell subnav={{ label: "Back to Server Store", href: "/ranks", backText: "Store" }}>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Hero Header */}
        <div className="panel-card p-6 sm:p-8 space-y-3 text-center border-purple-500/30 shadow-[0_0_40px_rgba(147,51,234,0.2)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-950/60 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-purple-300">
            <span>🎮</span> Official Minecraft Receipt System
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-wide text-white">
            Minecraft Plan Receipt Templates
          </h1>
          <p className="text-sm text-white/70 max-w-xl mx-auto">
            High-resolution, dynamic receipt templates for every Minecraft rank plan. Customizes automatically with buyer details and sends directly to WhatsApp upon payment.
          </p>
        </div>

        {/* Plan Selector Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PLAN_PREVIEWS.map((plan) => {
            const isSelected = plan.id === selectedPlanId
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlanId(plan.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? "border-purple-400 bg-purple-900/40 shadow-[0_0_25px_rgba(168,85,247,0.35)] scale-[1.02]"
                    : "border-white/10 bg-midnight/60 hover:border-white/20 hover:bg-midnight"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{plan.icon}</span>
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${plan.accent}`}
                  >
                    {plan.badge}
                  </span>
                </div>
                <div className="text-sm font-bold text-white">{plan.name}</div>
                <div className="text-xs text-white/60 font-mono mt-0.5">
                  {plan.id === "creator" ? "Partner Application" : `INR ₹${plan.price}`}
                </div>
              </button>
            )
          })}
        </div>

        {/* Interactive Customization & Preview Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls & Plan Breakdown Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="panel-card p-6 space-y-4">
              <h2 className="text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <span>⚙️</span> Customize Live Preview
              </h2>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/70 block">
                  Test Minecraft Username:
                </label>
                <input
                  type="text"
                  value={customUsername}
                  onChange={(e) => setCustomUsername(e.target.value)}
                  placeholder="e.g. Steve"
                  className="input-field font-mono text-sm"
                  maxLength={16}
                />
                <span className="text-[11px] text-white/50 block">
                  Watch the receipt template update instantly as you type!
                </span>
              </div>

              <div className="pt-2 border-t border-line space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-white/80">
                  {activePlan.name} In-Game Benefits:
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/60">One-Time Joining Bonus:</span>
                    <span className="font-bold text-emerald-400">{activePlan.bonus}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/60">Weekly In-Game Salary:</span>
                    <span className="font-bold text-accentSoft">{activePlan.salary}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/60">Shop & Job Multiplier:</span>
                    <span className="font-bold text-amber-300">{activePlan.multiplier}</span>
                  </div>
                </div>

                <div className="pt-3 flex flex-col gap-2">
                  <a
                    href={activePlan.templateImg}
                    download={`NAPA-Template-${activePlan.id.toUpperCase()}.png`}
                    className="primary-button text-xs uppercase tracking-wider text-center py-3 flex items-center justify-center gap-2"
                  >
                    <span>📥</span> Download Clean {activePlan.id.toUpperCase()} Template (PNG)
                  </a>

                  {activePlan.id !== "creator" ? (
                    <button
                      type="button"
                      onClick={handleOpenBuy}
                      className="ghost-button text-xs uppercase tracking-wider text-center py-3 text-purple-300 hover:text-white flex items-center justify-center gap-2"
                    >
                      <span>⚡</span> Purchase This Plan (₹{activePlan.price})
                    </button>
                  ) : (
                    <a
                      href="https://dsc.gg/napa"
                      target="_blank"
                      rel="noreferrer"
                      className="ghost-button text-xs uppercase tracking-wider text-center py-3 text-purple-300 hover:text-white flex items-center justify-center gap-2"
                    >
                      <span>💬</span> Apply on Discord
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Template Files Quick Access */}
            <div className="panel-card p-5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-white/70 block">
                Direct High-Res Assets
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {PLAN_PREVIEWS.map((p) => (
                  <a
                    key={p.id}
                    href={p.templateImg}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-midnight border border-line text-center hover:border-purple-400/50 transition-colors"
                  >
                    <span className="block font-bold text-white uppercase">{p.id} Template</span>
                    <span className="text-[10px] text-white/50">820 × 1024 PNG ↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Live Graphical Receipt Render Column */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <NapaGraphicReceipt order={mockOrder} />
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <YoupiCheckoutModal
        product={activeModalProduct}
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </PageShell>
  )
}
