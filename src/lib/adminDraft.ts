import { siteConfig } from "@/data/siteConfig"

export const ADMIN_STORAGE_KEY = "napa-admin"

export type AdminDraft = {
  brandName: string
  tagline: string
  discordInvite: string
  discordUrl: string
  serverIp: string
  badgeTileId: string
  badgeText: string
  modules: {
    discord: boolean
    serverIp: boolean
  }
}

export const adminDefaultDraft: AdminDraft = {
  brandName: siteConfig.brand.name,
  tagline: siteConfig.brand.tagline,
  discordInvite: siteConfig.modules.discord.label,
  discordUrl: siteConfig.modules.discord.url ?? "",
  serverIp: siteConfig.modules.serverIp.label,
  badgeTileId: siteConfig.badges.highlight.tileId,
  badgeText: siteConfig.badges.highlight.text,
  modules: {
    discord: siteConfig.modules.discord.enabled,
    serverIp: siteConfig.modules.serverIp.enabled
  }
}

export const readAdminDraft = () => {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(ADMIN_STORAGE_KEY)
  if (!raw) return null
  try {
    const saved = JSON.parse(raw) as Partial<AdminDraft>
    return {
      ...adminDefaultDraft,
      ...saved,
      modules: { ...adminDefaultDraft.modules, ...(saved.modules ?? {}) }
    }
  } catch {
    return null
  }
}
