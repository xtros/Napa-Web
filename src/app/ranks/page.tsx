import PageShell from "@/components/PageShell"
import RanksGrid from "@/components/RanksGrid"
import { siteConfig } from "@/data/siteConfig"

export default function RanksPage() {
  return (
    <PageShell subnav={{ label: "Back to Main Page", href: "/", backText: "Back" }}>
      <div className="space-y-8">
        <div className="tile-card tile-purple tile-md p-8 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-950/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-purple-200">
              Official Server Store
            </span>
            <h1 className="mt-3 font-display text-2xl sm:text-4xl uppercase tracking-wider text-white">
              {siteConfig.ranks.headline}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-white text-opacity-80 leading-relaxed">
              {siteConfig.ranks.description}
            </p>
          </div>
          <div className="tile-art tile-art-md" aria-hidden="true" />
        </div>

        <RanksGrid products={siteConfig.ranks.products} />
      </div>
    </PageShell>
  )
}
