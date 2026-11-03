import { NextResponse } from "next/server"
import { siteConfig, EventItem } from "@/data/siteConfig"
import { DISCORD_GUILD_ID } from "@/lib/discordAuth"

interface DiscordMessage {
  id: string
  channel_id: string
  content: string
  timestamp: string
  author?: {
    username: string
    avatar?: string
  }
  attachments?: Array<{
    id: string
    url: string
    proxy_url: string
    content_type?: string
  }>
  embeds?: Array<{
    title?: string
    description?: string
    image?: { url: string }
  }>
}

interface DiscordScheduledEvent {
  id: string
  guild_id: string
  name: string
  description?: string
  scheduled_start_time: string
  scheduled_end_time?: string
  status: number // 1 = SCHEDULED, 2 = ACTIVE, 3 = COMPLETED, 4 = CANCELED
  entity_type: number
  entity_metadata?: {
    location?: string
  }
  image?: string
  user_count?: number
}

function detectCategory(name: string, desc: string): "PVP" | "PVE" | "COMMUNITY" | "BUILDING" | "ECONOMY" {
  const text = `${name} ${desc}`.toLowerCase()
  if (text.includes("pvp") || text.includes("duel") || text.includes("tournament") || text.includes("arena") || text.includes("fight") || text.includes("തല്ല്")) {
    return "PVP"
  }
  if (text.includes("boss") || text.includes("dragon") || text.includes("wither") || text.includes("raid") || text.includes("pve") || text.includes("dungeon")) {
    return "PVE"
  }
  if (text.includes("build") || text.includes("contest") || text.includes("showcase") || text.includes("creative") || text.includes("architect")) {
    return "BUILDING"
  }
  if (text.includes("coin") || text.includes("multiplier") || text.includes("economy") || text.includes("shop") || text.includes("sell") || text.includes("auction")) {
    return "ECONOMY"
  }
  return "COMMUNITY"
}

function parseChannelAnnouncement(msg: DiscordMessage, guildId: string): EventItem | null {
  const raw = msg.content || ""
  // Strip user / role mentions like <@&1504136807527219281>
  const cleaned = raw.replace(/<@&?\d+>/g, "").trim()
  const lines = cleaned.split("\n").map(l => l.trim()).filter(Boolean)

  // Skip standalone "EVENT OVER" or thank you recap messages from the main event feed
  if (cleaned.toLowerCase().startsWith("# event over") || cleaned.toLowerCase() === "event over") {
    return null
  }
  if (lines.length === 0 && (!msg.attachments || msg.attachments.length === 0)) {
    return null
  }

  // Extract banner
  const bannerUrl = msg.attachments?.[0]?.url || msg.embeds?.[0]?.image?.url || "/assets/tiles/events_600x438.png"

  // Extract title
  let title = "NAPA Community Event"
  let subtitle = "Announced in #event-announcements"

  if (lines[0]) {
    title = lines[0]
      .replace(/^[#*🌼🚣🏆⚔️🔥🌸\s]+|[#*🌼🚣🏆⚔️🔥🌸\s]+$/g, "")
      .replace(/^napa presents\s*[:—–-]\s*/i, "")
      .trim()
  }

  if (lines[1] && (lines[1].includes("PRESENT") || lines[1].includes("—") || lines[1].includes(":"))) {
    subtitle = lines[1].replace(/^[#*🌼🚣🏆⚔️🔥🌸\s]+|[#*🌼🚣🏆⚔️🔥🌸\s]+$/g, "").trim()
  }

  // Extract schedule / date
  let schedule = ""
  const dateLine = lines.find(l => l.includes("📅") || l.toLowerCase().includes("date:"))
  const timeLine = lines.find(l => l.includes("⏰") || l.toLowerCase().includes("time:"))
  if (dateLine) {
    const cleanDate = dateLine.replace(/^[#*📅\s]+|[#*\s]+$/g, "").replace(/^date\s*[:—–-]\s*/i, "").replace(/\*\*/g, "").trim()
    const cleanTime = timeLine ? timeLine.replace(/^[#*⏰\s]+|[#*\s]+$/g, "").replace(/^time\s*[:—–-]\s*/i, "").replace(/\*\*/g, "").trim() : ""
    schedule = cleanTime ? `${cleanDate} • ${cleanTime}` : cleanDate
  } else {
    try {
      const d = new Date(msg.timestamp)
      schedule = d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " • Recent Announcement"
    } catch {
      schedule = "Check Discord for Schedule"
    }
  }

  // Extract rewards
  const rewardLines = lines.filter(l => 
    l.includes("🥇") || l.includes("🥈") || l.includes("🥉") || 
    l.toLowerCase().includes("prize") || l.toLowerCase().includes("pool")
  ).map(l => l.replace(/^[#*\s]+|[#*\s]+$/g, "").replace(/\*\*/g, ""))

  const rewards = rewardLines.length > 0
    ? rewardLines.slice(0, 4)
    : ["In-Game Coins & Currency", "Exclusive Discord Event Role", "Server Prestige & Keys"]

  // Build clean description
  const descParagraphs = lines.filter(l => 
    !l.startsWith("#") && 
    !l.includes("📅") && 
    !l.includes("⏰") && 
    !l.includes("🥇") && 
    !l.includes("🥈") && 
    !l.includes("🥉") &&
    l !== lines[0] &&
    l !== lines[1]
  )
  const description = descParagraphs.length > 0 
    ? descParagraphs.slice(0, 3).join(" ").replace(/\*\*/g, "")
    : "Official NAPA SMP community event announced in Discord."

  const category = detectCategory(title, description)
  const jumpUrl = `https://discord.com/channels/${guildId}/${msg.channel_id}/${msg.id}`

  return {
    id: `channel-${msg.id}`,
    title,
    subtitle: subtitle || "Official Discord Announcement",
    category,
    status: "LIVE",
    schedule,
    locationCommand: "/warp event",
    description,
    rewards,
    accentColor: "purple",
    badgeText: "DISCORD ANNOUNCEMENT",
    isDiscordEvent: true,
    discordEventUrl: jumpUrl,
    bannerUrl
  }
}

export async function GET() {
  const staticEvents: EventItem[] = (siteConfig as any).events || []
  const botToken = process.env.DISCORD_BOT_TOKEN
  const guildId = process.env.DISCORD_GUILD_ID || DISCORD_GUILD_ID
  // Default to #event-announcements channel (1532680998444077096)
  const channelId = process.env.DISCORD_EVENT_CHANNEL_ID || "1532680998444077096"

  let discordEvents: EventItem[] = []
  let discordSyncStatus = "FALLBACK"

  if (botToken && guildId) {
    // 1. Fetch channel messages from #event-announcements
    try {
      const channelRes = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages?limit=15`, {
        headers: {
          Authorization: `Bot ${botToken}`,
          "Content-Type": "application/json"
        },
        next: { revalidate: 30 }
      })

      if (channelRes.ok) {
        const messages: DiscordMessage[] = await channelRes.json()
        discordSyncStatus = "LIVE"

        for (const msg of messages) {
          const parsed = parseChannelAnnouncement(msg, guildId)
          if (parsed) {
            discordEvents.push(parsed)
          }
        }
      } else {
        console.warn(`Discord Channel API error: ${channelRes.status}`)
      }
    } catch (err: any) {
      console.warn("Failed to fetch Discord channel messages:", err?.message)
    }

    // 2. Also fetch Discord Scheduled Events if any exist
    try {
      const eventsRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/scheduled-events?with_user_count=true`, {
        headers: {
          Authorization: `Bot ${botToken}`,
          "Content-Type": "application/json"
        },
        next: { revalidate: 30 }
      })

      if (eventsRes.ok) {
        const scheduledEvents: DiscordScheduledEvent[] = await eventsRes.json()
        const active = scheduledEvents.filter(e => e.status === 1 || e.status === 2)

        for (const ev of active) {
          discordEvents.unshift({
            id: `scheduled-${ev.id}`,
            title: ev.name,
            subtitle: ev.status === 2 ? "Live Now on Discord" : "Scheduled Discord Event",
            category: detectCategory(ev.name, ev.description || ""),
            status: ev.status === 2 ? "LIVE" : "UPCOMING",
            schedule: new Date(ev.scheduled_start_time).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              timeZone: "Asia/Kolkata"
            }) + " IST",
            locationCommand: ev.entity_metadata?.location || "/warp event",
            description: ev.description || "Official Discord server event.",
            rewards: ["In-Game Rewards", "Discord Event Role"],
            accentColor: "emerald",
            badgeText: ev.user_count ? `👥 ${ev.user_count} Interested` : "DISCORD EVENT",
            isDiscordEvent: true,
            discordEventUrl: `https://discord.com/events/${guildId}/${ev.id}`,
            interestedCount: ev.user_count || 0,
            bannerUrl: ev.image ? `https://cdn.discordapp.com/guild-events/${ev.id}/${ev.image}.png?size=1024` : "/assets/tiles/events_600x438.png"
          })
        }
      }
    } catch (err: any) {
      console.warn("Failed to fetch Discord scheduled events:", err?.message)
    }
  }

  // Combine Discord channel announcements + Discord scheduled events + static recurring events
  const combinedEvents = [...discordEvents, ...staticEvents]

  return NextResponse.json({
    status: "ok",
    syncStatus: discordSyncStatus,
    guildId,
    channelId,
    discordEventsCount: discordEvents.length,
    events: combinedEvents
  })
}
