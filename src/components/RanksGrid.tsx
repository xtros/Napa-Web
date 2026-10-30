"use client"

import { useState } from "react"
import Image from "next/image"
import { RankProduct } from "@/data/siteConfig"
import LoginModal from "@/components/LoginModal"

const CheckIcon = () => (
  <svg
    className="h-4 w-4 flex-shrink-0 text-emerald"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default function RanksGrid({ products }: { products: RankProduct[] }) {
  const [selectedRank, setSelectedRank] = useState<RankProduct | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [username, setUsername] = useState("")
  const [confirmed, setConfirmed] = useState(false)

  const handlePurchaseClick = (product: RankProduct) => {
    setSelectedRank(product)
    setConfirmed(false)
    setUsername("")
    setCheckoutOpen(true)
  }

  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      setConfirmed(true)
    }
  }

  return (
    <>
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 items-stretch">
        {products.map((product) => {
          const isPopular = product.popular

          return (
            <div
              key={product.id}
              className={`panel-card group relative flex flex-col justify-between p-6 transition duration-300 ease-out hover:-translate-y-1.5 ${
                isPopular ? "border-amber-400/40 shadow-[0_0_30px_rgba(245,158,11,0.2)]" : "border-line"
              }`}
            >
              {/* Top Ribbon Badge */}
              {product.badge ? (
                <div className="absolute -top-3 right-5 z-20">
                  <span
                    className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-md ${
                      isPopular
                        ? "bg-gradient-to-r from-amber-500 to-amber-600"
                        : product.id === "creator"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500"
                        : product.id === "mvp"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600"
                        : "bg-gradient-to-r from-emerald-500 to-emerald-600"
                    }`}
                  >
                    {product.badge}
                  </span>
                </div>
              ) : null}

              <div>
                {/* 3D Posed Minecraft Skin Showcase */}
                <div className="relative flex items-center justify-center mb-4 pt-2 h-44 overflow-visible">
                  {/* Glowing background pedestal aura */}
                  <div
                    className={`rank-art absolute bottom-1 ${product.accent} opacity-75`}
                    aria-hidden="true"
                  />

                  {/* 3D Posed Minecraft Character Skin */}
                  {product.skinImage ? (
                    <div className="relative z-10 h-44 w-36 flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-2">
                      <Image
                        src={product.skinImage}
                        alt={`${product.name} Minecraft Skin`}
                        width={180}
                        height={240}
                        className="h-full w-auto object-contain drop-shadow-[0_12px_22px_rgba(0,0,0,0.75)] filter"
                        priority
                        unoptimized
                      />
                    </div>
                  ) : null}
                </div>

                {/* Title & Price */}
                <div className="text-center">
                  <h3 className="font-display text-xl uppercase tracking-wider text-white">
                    {product.name}
                  </h3>
                  <div className="mt-2 text-2xl font-bold tracking-tight text-white">
                    {product.price}
                  </div>
                  <p className="mt-2 text-xs italic text-white text-opacity-70 min-h-[32px] flex items-center justify-center">
                    "{product.focus}"
                  </p>
                </div>

                {/* Key Economy Metrics Chips */}
                <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl border border-line bg-midnight p-2 text-center text-xs">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-white text-opacity-50">
                      Bonus
                    </span>
                    <span className="font-bold text-emerald">{product.joiningBonus}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-white text-opacity-50">
                      Salary
                    </span>
                    <span className="font-bold text-amber-300">{product.weeklySalary}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-white text-opacity-50">
                      Sell
                    </span>
                    <span className="font-bold text-purple-300">{product.multiplier}</span>
                  </div>
                </div>

                {/* Perks Checklist */}
                <div className="mt-5 space-y-2.5 border-t border-line pt-4">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-white text-opacity-60 block">
                    Economy Perks:
                  </span>
                  <ul className="space-y-2 text-xs text-white text-opacity-80">
                    {product.perks.map((perk, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckIcon />
                        <span className="leading-tight">{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-line">
                {product.ctaHref ? (
                  <a
                    href={product.ctaHref}
                    target="_blank"
                    rel="noreferrer"
                    className="ghost-button w-full text-center text-xs uppercase tracking-widest text-accentSoft hover:text-white"
                  >
                    {product.ctaText ?? "Apply on Discord"}
                  </a>
                ) : (
                  <button
                    className="primary-button w-full"
                    onClick={() => handlePurchaseClick(product)}
                    type="button"
                  >
                    Purchase ({product.price})
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </section>

      {/* In-Game Username Checkout Modal */}
      {checkoutOpen && selectedRank ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 px-6">
          <div className="panel-card w-full max-w-md p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <span className="text-xs uppercase tracking-widest text-white text-opacity-60">
                  Store Checkout
                </span>
                <h3 className="text-xl font-bold uppercase tracking-wide text-white">
                  Unlock {selectedRank.name}
                </h3>
              </div>
              <button
                className="ghost-button h-8 w-8 px-0 flex items-center justify-center"
                onClick={() => setCheckoutOpen(false)}
                type="button"
                aria-label="Close"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {!confirmed ? (
              <form onSubmit={handleConfirmPurchase} className="space-y-4">
                <div className="rounded-xl border border-line bg-midnight p-3 flex items-center justify-between">
                  <span className="text-sm font-semibold">{selectedRank.name} Rank</span>
                  <span className="text-sm font-bold text-amber-300">{selectedRank.price}</span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white text-opacity-70">
                    Minecraft In-Game Username:
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
                  <span className="text-[11px] text-white text-opacity-50 block">
                    Perks and bonuses will be delivered to this player in-game automatically.
                  </span>
                </div>

                <button className="primary-button w-full text-sm font-bold uppercase tracking-wider" type="submit">
                  Proceed to Payment ({selectedRank.price})
                </button>
              </form>
            ) : (
              <div className="space-y-4 py-2 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald bg-opacity-20 text-emerald">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-white">Ready for Delivery!</h4>
                <p className="text-xs text-white text-opacity-80">
                  Player <strong className="text-accentSoft">{username}</strong> selected for{" "}
                  <strong>{selectedRank.name}</strong> ({selectedRank.price}).
                </p>
                <div className="rounded-xl border border-line bg-midnight p-3 text-xs text-white text-opacity-70 text-left space-y-1">
                  <div>• Server IP: <code className="text-purple-300">play.napasmp.fun</code></div>
                  <div>• Open a ticket on <a href="https://dsc.gg/napa" target="_blank" rel="noreferrer" className="text-accentSoft underline">Discord (dsc.gg/napa)</a> with your username to complete UPI/Tebex order.</div>
                </div>
                <button
                  type="button"
                  className="ghost-button w-full text-xs uppercase tracking-widest"
                  onClick={() => setCheckoutOpen(false)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
