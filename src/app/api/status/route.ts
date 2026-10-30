import { NextResponse } from "next/server"

export interface PlayerInfo {
  name: string
  rawName: string
  isAfk: boolean
  isVanished: boolean
  isBedrock: boolean
  avatarUrl: string
}

export interface ServerStatusResponse {
  online: boolean
  state: "running" | "offline" | "starting" | "stopping" | string
  ip: string
  bedrockIp: string
  players: {
    online: number
    max: number
    list: PlayerInfo[]
  }
  resources: {
    cpuPercent: number
    memoryUsedMb: number
    memoryLimitMb: number
    memoryPercent: number
    diskUsedMb: number
    uptimeSeconds: number
    uptimeFormatted: string
  }
  motd: string
  version: string
  timestamp: number
}

// Global in-memory cache
let cachedData: ServerStatusResponse | null = null
let lastFetchedAt = 0
const CACHE_TTL_MS = 10000 // 10 seconds

function stripAnsi(str: string): string {
  return str.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, "").replace(/\u001b\[[0-9;]*[a-zA-Z]/g, "")
}

function formatUptime(seconds: number): string {
  if (seconds <= 0) return "0m"
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const parts: string[] = []
  if (d > 0) parts.push(`${d}d`)
  if (h > 0) parts.push(`${h}h`)
  if (m > 0 || parts.length === 0) parts.push(`${m}m`)
  return parts.join(" ")
}

export async function getServerStatus(force = false): Promise<ServerStatusResponse> {
  const now = Date.now()
  if (!force && cachedData && now - lastFetchedAt < CACHE_TTL_MS) {
    return cachedData
  }

  const wingsUrl = process.env.WINGS_URL || "http://129.225.127.162:8080"
  const wingsToken =
    process.env.WINGS_TOKEN ||
    "Wy5S2Uav2ufp3yk8LppZUVs4D4YoFboNSj33S7bzzA5cVyyubrdWh7J9TrkRQuoN"
  const serverUuid =
    process.env.PTERODACTYL_SERVER_UUID || "bdd64c01-349a-44ac-9f38-52e849fb0ed3"

  const wingsHeaders = {
    Authorization: `Bearer ${wingsToken}`,
    "Content-Type": "application/json"
  }

  let wingsState = "offline"
  let memoryBytes = 0
  let memoryLimitBytes = 0
  let cpuAbsolute = 0
  let diskBytes = 0
  let uptimeMs = 0
  let logData: string[] = []

  // 1. Fetch Wings status and logs in parallel for sub-200ms speed
  try {
    const [utilRes, logRes] = await Promise.all([
      fetch(`${wingsUrl}/api/servers/${serverUuid}`, {
        headers: wingsHeaders,
        signal: AbortSignal.timeout(3500),
        cache: "no-store"
      }),
      fetch(`${wingsUrl}/api/servers/${serverUuid}/logs`, {
        headers: wingsHeaders,
        signal: AbortSignal.timeout(3500),
        cache: "no-store"
      })
    ])

    if (utilRes.ok) {
      const data = await utilRes.json()
      wingsState = data.state || "offline"
      if (data.utilization) {
        memoryBytes = data.utilization.memory_bytes || 0
        memoryLimitBytes = data.utilization.memory_limit_bytes || 0
        cpuAbsolute = data.utilization.cpu_absolute || 0
        diskBytes = data.utilization.disk_bytes || 0
        uptimeMs = data.utilization.uptime || 0
      }
    }

    if (logRes.ok) {
      const ldata = await logRes.json()
      logData = ldata.data || []
    }
  } catch (err) {
    console.warn("Wings telemetry error:", err)
  }

  // 2. Extract player list and player count directly from server logs
  let playersList: PlayerInfo[] = []
  let detectedOnlineCount = 0
  let detectedMaxCount = 100

  if (wingsState === "running" && logData.length > 0) {
    let foundIdx = -1
    for (let i = logData.length - 1; i >= 0; i--) {
      const clean = stripAnsi(logData[i])
      if (/ONLINE PLAYERS/i.test(clean)) {
        foundIdx = i
        // Try parsing count from line like "ONLINE PLAYERS (22/100)"
        const countMatch = clean.match(/ONLINE PLAYERS\s*\((\d+)\/(\d+)\)/i)
        if (countMatch) {
          detectedOnlineCount = parseInt(countMatch[1], 10)
          detectedMaxCount = parseInt(countMatch[2], 10)
        }
        break
      }
    }

    // If no recent ONLINE PLAYERS in last 35 lines, trigger 'list' command
    if (foundIdx === -1 || logData.length - 1 - foundIdx > 35) {
      try {
        await fetch(`${wingsUrl}/api/servers/${serverUuid}/commands`, {
          method: "POST",
          headers: wingsHeaders,
          body: JSON.stringify({ commands: ["list"] }),
          signal: AbortSignal.timeout(2000)
        })

        await new Promise((r) => setTimeout(r, 450))

        const newLogRes = await fetch(`${wingsUrl}/api/servers/${serverUuid}/logs`, {
          headers: wingsHeaders,
          signal: AbortSignal.timeout(2500),
          cache: "no-store"
        })
        if (newLogRes.ok) {
          logData = (await newLogRes.json()).data || []
          for (let i = logData.length - 1; i >= 0; i--) {
            const clean = stripAnsi(logData[i])
            if (/ONLINE PLAYERS/i.test(clean)) {
              foundIdx = i
              const countMatch = clean.match(/ONLINE PLAYERS\s*\((\d+)\/(\d+)\)/i)
              if (countMatch) {
                detectedOnlineCount = parseInt(countMatch[1], 10)
                detectedMaxCount = parseInt(countMatch[2], 10)
              }
              break
            }
          }
        }
      } catch (err) {
        console.warn("Wings trigger command warning:", err)
      }
    }

    if (foundIdx !== -1 && foundIdx + 1 < logData.length) {
      const rawLine = logData[foundIdx + 1]
      const cleanLine = stripAnsi(rawLine).replace(/.*INFO\]:\s*/, "").trim()

      if (cleanLine && !cleanLine.startsWith("-")) {
        playersList = cleanLine
          .split(",")
          .map((s) => {
            const raw = s.trim()
            const isAfk = /\[AFK\]/i.test(raw)
            const isVanished = /\[VANISHED\]/i.test(raw)
            const cleanName = raw.replace(/\[.*?\]/g, "").trim()
            const isBedrock = cleanName.startsWith(".")
            const avatarUsername = isBedrock ? cleanName.replace(/^\./, "") : cleanName
            return {
              name: cleanName,
              rawName: raw,
              isAfk,
              isVanished,
              isBedrock,
              avatarUrl: `https://mc-heads.net/avatar/${encodeURIComponent(avatarUsername)}/64`
            }
          })
          .filter((p) => p.name.length > 0)
      }
    }
  }

  const isServerOnline = wingsState === "running"
  const uptimeSeconds = Math.floor(uptimeMs / 1000)
  const finalOnlineCount = Math.max(detectedOnlineCount, playersList.length)

  const payload: ServerStatusResponse = {
    online: isServerOnline,
    state: wingsState,
    ip: "play.napasmp.fun",
    bedrockIp: "bd.napasmp.fun:19132",
    players: {
      online: finalOnlineCount,
      max: detectedMaxCount,
      list: playersList
    },
    resources: {
      cpuPercent: Math.round(cpuAbsolute * 10) / 10,
      memoryUsedMb: Math.round(memoryBytes / 1024 / 1024),
      memoryLimitMb: Math.round(memoryLimitBytes / 1024 / 1024),
      memoryPercent:
        memoryLimitBytes > 0 ? Math.round((memoryBytes / memoryLimitBytes) * 100) : 0,
      diskUsedMb: Math.round(diskBytes / 1024 / 1024),
      uptimeSeconds,
      uptimeFormatted: formatUptime(uptimeSeconds)
    },
    motd: "✦ NAPA SMP ✦ Survival • Economy • PvP",
    version: "Velocity-CTD 1.13-26.3",
    timestamp: now
  }

  // Update in-memory cache
  cachedData = payload
  lastFetchedAt = now

  return payload
}

export async function GET() {
  const data = await getServerStatus()
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=10, stale-while-revalidate=20",
      "X-Cache": Date.now() - lastFetchedAt < 100 ? "MISS" : "HIT"
    }
  })
}
