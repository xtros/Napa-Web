import { NextResponse } from "next/server"
import { siteConfig, EventItem } from "@/data/siteConfig"
import { DISCORD_GUILD_ID } from "@/lib/discordAuth"

interface DiscordScheduledEvent {
  id: string
  guild_id: string
  name: string
  description?: string
  scheduled_start_time: string
  scheduled_end_time?: string
  status: number // 1 = SCHEDULED, 2 = ACTIVE, 3 = COMPLETED, 4 = CANCELED
  entity_type: number // 1 = STAGE_INSTANCE, 2 = VOICE, 3 = EXTERNAL
  entity_metadata?: {
    location?: string
  }
  image?: string
  user_count?: number
}

function detectCategory(name: string, desc: string): "PVP" | "PVE" | "COMMUNITY" | "BUILDING" | "ECONOMY" {
  const text = `${name} ${desc}`.toLowerCase()
  if (text.includes("pvp") || text.includes("duel") || text.includes("tournament") || text.includes("arena") || text.includes("fight")) {
    return "PVP"
  }
  if (text.includes("boss") || text.includes("dragon") || text.includes("wither") || text.includes("raid") || text.includes("pve") || text.includes("dungeon")) {
    return "PVE"
  }
  if (text.includes("build") || text.includes("contest") || text.includes("showcase") || text.includes("creative")) {
    return "BUILDING"
  }
  if (text.includes("coin") || text.includes("multiplier") || text.includes("economy") || text.includes("shop") || text.includes("sell")) {
    return "ECONOMY"
  }
  return "COMMUNITY"
}

function formatDiscordTime(isoString: string): string {
  try {
    const d = new Date(isoString)
    return d.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
      hour12: true
    }) + " IST"
  } catch {
    return isoString
  }
}

function extractRewards(desc?: string): string[] {
  if (!desc) return ["Server Rewards & Prestige", "Event Crate Key", "Community Highlights"]
  const lines = desc.split("\n").map(l => l.trim()).filter(Boolean)
  const rewardLines = lines.filter(l => 
    l.toLowerCase().includes("reward") || 
    l.startsWith("•") || 
    l.startsWith("-") || 
    l.startsWith("*") ||
    l.includes("₹") ||
    l.includes("$") ||
    l.includes("coins") ||
    l.includes("key")
  )
  if (rewardLines.length > 0) {
    return rewardLines.slice(0, 4).map(l => l.replace(/^[-•*]\s*/, ""))
  }
  return ["Special Discord Event Role", "Exclusive In-Game Loot", "Event Prestige Points"]
}

export async function GET() {
  const staticEvents: EventItem[] = (siteConfig as any).events || []
  const botToken = process.env.DISCORD_BOT_TOKEN
  const guildId = process.env.DISCORD_GUILD_ID || DISCORD_GUILD_ID

  let discordEvents: EventItem[] = []
  let discordSyncStatus = "FALLBACK"

  if (botToken && guildId) {
    try {
      const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/scheduled-events?with_user_count=true`, {
        headers: {
          Authorization: `Bot ${botToken}`,
          "Content-Type": "application/json"
        },
        next: { revalidate: 30 } // Cache for 30s so events refresh nearly instantaneously
      })

      if (res.ok) {
        const data: DiscordScheduledEvent[] = await res.json()
        discordSyncStatus = "LIVE"

        // Filter out completed (3) or canceled (4) events
        const activeOrScheduled = data.filter(e => e.status === 1 || e.status === 2)

        discordEvents = activeOrScheduled.map((ev): EventItem => {
          const category = detectCategory(ev.name, ev.description || "")
          const scheduleStr = formatDiscordTime(ev.scheduled_start_time)
          const location = ev.entity_metadata?.location || (ev.entity_type === 2 ? "Discord Voice Channel" : "/warp event")
          const bannerUrl = ev.image 
            ? `https://cdn.discordapp.com/guild-events/${ev.id}/${ev.image}.png?size=1024` 
            : "/assets/tiles/events_600x438.png"

          const isLiveNow = ev.status === 2

          return {
            id: `discord-${ev.id}`,
            title: ev.name,
            subtitle: isLiveNow ? "Live Now on Discord & SMP" : "Discord Scheduled Event",
            category,
            status: isLiveNow ? "LIVE" : "UPCOMING",
            schedule: scheduleStr,
            locationCommand: location,
            description: ev.description || "Official NAPA SMP community event scheduled on Discord.",
            rewards: extractRewards(ev.description),
            accentColor: isLiveNow ? "emerald" : "purple",
            badgeText: isLiveNow ? "LIVE NOW" : (ev.user_count ? `👥 ${ev.user_count} Interested` : "DISCORD EVENT"),
            isDiscordEvent: true,
            discordEventUrl: `https://discord.com/events/${guildId}/${ev.id}`,
            interestedCount: ev.user_count || 0,
            bannerUrl
          }
        })
      } else {
        console.warn(`Discord API returned ${res.status}: ${await res.text()}`)
        discordSyncStatus = "API_ERROR"
      }
    } catch (err: any) {
      console.warn("Failed to fetch Discord events:", err?.message)
      discordSyncStatus = "NETWORK_ERROR"
    }
  } else {
    discordSyncStatus = "TOKEN_NOT_CONFIGURED"
  }

  // Discord events first, then static recurring server events
  const combinedEvents = [...discordEvents, ...staticEvents]

  return NextResponse.json({
    status: "ok",
    syncStatus: discordSyncStatus,
    guildId,
    discordEventsCount: discordEvents.length,
    events: combinedEvents
  })
}
