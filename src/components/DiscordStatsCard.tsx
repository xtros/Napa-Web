"use client"

import { useEffect, useMemo, useState } from "react"
import { siteConfig } from "@/data/siteConfig"

type DiscordStatsState = {
  status: "loading" | "ready" | "error"
  members: number | null
  online: number | null
  guild: string | null
  error?: string
}

const resolveInviteCode = (override?: string) => {
  if (override?.trim()) {
    const clean = override.trim()
    if (clean.includes("dsc.gg/napa") || clean.endsWith("/napa") || clean === "napa") {
      return "napacommunity"
    }
    if (clean.includes("discord.gg/")) {
      const parts = clean.split("/")
      return parts[parts.length - 1]
    }
    if (clean.startsWith("gg/")) {
      return clean.replace("gg/", "")
    }
    return clean
  }

  const { inviteCode, url, label } = siteConfig.modules.discord
  if (inviteCode) return inviteCode

  const candidates = [url, label].filter(Boolean) as string[]

  for (const value of candidates) {
    const clean = value.trim()
    if (clean.includes("dsc.gg/napa") || clean.endsWith("/napa") || clean === "napa") {
      return "napacommunity"
    }
    if (clean.includes("discord.gg/")) {
      const parts = clean.split("/")
      return parts[parts.length - 1]
    }
    if (clean.startsWith("gg/")) {
      return clean.replace("gg/", "")
    }
    if (clean.length > 0) {
      return clean
    }
  }

  return null
}

type DiscordStatsCardProps = {
  inviteOverride?: string
}

export default function DiscordStatsCard({ inviteOverride }: DiscordStatsCardProps) {
  const inviteCode = useMemo(() => resolveInviteCode(inviteOverride), [inviteOverride])
  const [state, setState] = useState<DiscordStatsState>({
    status: "loading",
    members: null,
    online: null,
    guild: null
  })

  useEffect(() => {
    if (!inviteCode) {
      setState({ status: "error", members: null, online: null, guild: null, error: "Missing invite" })
      return
    }

    let active = true

    const load = async () => {
      try {
        const response = await fetch(`/api/discord?code=${encodeURIComponent(inviteCode)}`)
        if (!response.ok) {
          throw new Error("Discord fetch failed")
        }
        const data = await response.json()
        if (active) {
          setState({
            status: "ready",
            members: data.members ?? null,
            online: data.online ?? null,
            guild: data.guild ?? null
          })
        }
      } catch {
        if (active) {
          setState({ status: "error", members: null, online: null, guild: null, error: "Failed to load" })
        }
      }
    }

    load()

    return () => {
      active = false
    }
  }, [inviteCode])

  return (
    <div className="panel-card p-6">
      <div className="text-xs uppercase tracking-widest text-white text-opacity-60">Discord Stats</div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white text-opacity-70">Guild</span>
          <span className="text-sm font-semibold">
            {state.guild ?? (state.status === "loading" ? "Loading" : "Unknown")}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-white text-opacity-70">Members</span>
          <span className="text-sm font-semibold">
            {state.members ?? (state.status === "loading" ? "Loading" : "--")}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-white text-opacity-70">Online</span>
          <span className="text-sm font-semibold">
            {state.online ?? (state.status === "loading" ? "Loading" : "--")}
          </span>
        </div>
      </div>
      {state.status === "error" ? (
        <div className="mt-4 text-xs uppercase tracking-widest text-white text-opacity-60">
          {state.error}
        </div>
      ) : null}
    </div>
  )
}
