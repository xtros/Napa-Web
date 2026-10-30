"use client"

import TilesGrid from "@/components/TilesGrid"
import useAdminPreview from "@/components/useAdminPreview"
import { siteConfig } from "@/data/siteConfig"
import type { ServerStatusResponse } from "@/app/api/status/route"

export default function HomeTilesClient({
  initialServerStatus
}: {
  initialServerStatus?: ServerStatusResponse | null
}) {
  const preview = useAdminPreview()
  const discordUrl = preview.discordUrl?.trim()
  const highlight = {
    tileId: preview.badgeTileId,
    text: preview.badgeText
  }
  const tiles = siteConfig.tiles.map((tile) =>
    tile.id === "discord"
      ? { ...tile, href: discordUrl || siteConfig.modules.discord.url || tile.href }
      : tile
  )

  return (
    <TilesGrid
      tiles={tiles}
      highlightBadge={highlight}
      initialServerStatus={initialServerStatus}
    />
  )
}
