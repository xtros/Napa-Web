import type { CSSProperties } from "react"
import Image from "next/image"
import Link from "next/link"
import { HighlightBadge, TileConfig } from "@/data/siteConfig"
import ServerStatusTile from "@/components/ServerStatusTile"
import type { ServerStatusResponse } from "@/app/api/status/route"

const layoutClasses: Record<TileConfig["layout"], string> = {
  full: "lg:col-span-3",
  wide: "lg:col-span-2 lg:row-span-2",
  stackTop: "lg:col-start-3 lg:row-start-2",
  stackBottom: "lg:col-start-3 lg:row-start-3"
}

const sizeClasses: Record<TileConfig["size"], string> = {
  xl: "tile-xl",
  lg: "tile-lg",
  md: "tile-md",
  sm: "tile-sm"
}

type ArtSize = NonNullable<TileConfig["artSize"]> | TileConfig["size"]

const artClasses: Record<ArtSize, string> = {
  xs: "tile-art-xs",
  sm: "tile-art-sm",
  md: "tile-art-md",
  lg: "tile-art-lg",
  xl: "tile-art-xl",
  hero: "tile-art-hero",
  mega: "tile-art-mega"
}

export default function TilesGrid({
  tiles,
  highlightBadge,
  initialServerStatus
}: {
  tiles: TileConfig[]
  highlightBadge?: HighlightBadge
  initialServerStatus?: ServerStatusResponse | null
}) {
  return (
    <section className="tiles-grid grid gap-6">
      {tiles.map((tile) => {
        // Render dynamic Server Status tile for live telemetry and player list
        if (tile.id === "server-status") {
          return (
            <ServerStatusTile
              key={tile.id}
              tile={tile}
              highlightBadge={highlightBadge}
              initialStatus={initialServerStatus}
            />
          )
        }

        const artKey = (tile.artSize ?? tile.size) as ArtSize
        const badgeText = highlightBadge?.tileId === tile.id ? highlightBadge.text : tile.badge
        const content = (
          <>
            {tile.backgroundImage ? (
              <div
                className="tile-bg"
                aria-hidden="true"
                style={
                  {
                    "--tile-bg-tint": tile.backgroundTint ?? "rgba(0, 0, 0, 0.45)",
                    "--tile-bg-opacity": tile.backgroundOpacity ?? 0.24
                  } as CSSProperties
                }
              >
                <Image
                  src={tile.backgroundImage.src}
                  alt={tile.backgroundImage.alt ?? ""}
                  fill
                  className="tile-bg-image"
                  sizes="(min-width: 1024px) 640px, 100vw"
                />
              </div>
            ) : null}
            {badgeText ? <div className="tile-ribbon">{badgeText}</div> : null}
            <div className="tile-content">
              <div>
                <div className="tile-title text-lg uppercase text-white sm:text-2xl">{tile.title}</div>
                <p className="tile-sub mt-2 text-sm text-white text-opacity-80">{tile.description}</p>
              </div>
              <span className="tile-cta">{tile.cta}</span>
            </div>
            <div
              className={`tile-art ${artClasses[artKey]} ${tile.image ? "tile-art-image" : ""}`}
              aria-hidden="true"
            >
              {tile.image ? (
                <Image
                  src={tile.image.src}
                  alt={tile.image.alt}
                  fill
                  className="tile-image"
                  sizes="(min-width: 1024px) 220px, 160px"
                />
              ) : null}
            </div>
          </>
        )

        const className = `tile-card ${tile.theme} ${layoutClasses[tile.layout]} ${sizeClasses[tile.size]} animate-fade-up`

        if (tile.href) {
          return (
            <Link key={tile.id} href={tile.href} className={className}>
              {content}
            </Link>
          )
        }

        return (
          <div key={tile.id} className={className}>
            {content}
          </div>
        )
      })}
    </section>
  )
}
