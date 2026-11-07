import PageShell from "@/components/PageShell"
import RanksGrid from "@/components/RanksGrid"
import { siteConfig } from "@/data/siteConfig"

export default function RanksPage() {
  return (
    <PageShell subnav={{ label: "Back to Main Page", href: "/", backText: "Back" }}>
      <div className="space-y-8">
        <div className="tile-card tile-purple tile-md p-8 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-950/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-purple-200">
                Official Server Store
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                NAPA Pay Active • Instant Direct UPI
              </span>
            </div>
            <h1 className="mt-3 font-display text-2xl sm:text-4xl uppercase tracking-wider text-white">
              {siteConfig.ranks.headline}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-white text-opacity-80 leading-relaxed">
              {siteConfig.ranks.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <a
                href="/receipts"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 border border-purple-400/30 text-xs font-bold uppercase tracking-wider text-purple-200 transition-colors shadow-sm"
              >
                <span>🧾</span> View Plan Receipt Templates
              </a>
              <a
                href="/order-status"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-midnight/80 hover:bg-midnight border border-white/10 text-xs font-bold uppercase tracking-wider text-white/80 hover:text-white transition-colors"
              >
                <span>🔍</span> Track Order & Receipt
              </a>
            </div>
          </div>
          <div className="tile-art tile-art-md" aria-hidden="true" />
        </div>

        <RanksGrid products={siteConfig.ranks.products} />
      </div>
    </PageShell>
  )
}
