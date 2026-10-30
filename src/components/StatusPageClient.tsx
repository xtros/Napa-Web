"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import { copyToClipboard } from "@/lib/clipboard"
import {
  CustomServerEmoji,
  CustomCpuEmoji,
  CustomRamEmoji,
  CustomPlayerHeadEmoji,
  CustomMinecraftIcon
} from "@/components/CustomEmojis"
import type { ServerStatusResponse, PlayerInfo } from "@/app/api/status/route"

const CopyIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const RefreshIcon = ({ isSpinning }: { isSpinning: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={isSpinning ? "animate-spin" : ""}
    aria-hidden="true"
  >
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
  </svg>
)

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const ClockIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

interface StatusPageClientProps {
  initialStatus: ServerStatusResponse | null
}

export default function StatusPageClient({ initialStatus }: StatusPageClientProps) {
  const [status, setStatus] = useState<ServerStatusResponse | null>(initialStatus)
  const [loading, setLoading] = useState<boolean>(!initialStatus)
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedJava, setCopiedJava] = useState(false)
  const [copiedBedrock, setCopiedBedrock] = useState(false)
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date())

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/status", { cache: "no-store" })
      if (res.ok) {
        const data: ServerStatusResponse = await res.json()
        if (data && typeof data.online === "boolean") {
          setStatus(data)
          setLastRefreshedAt(new Date())
        }
      }
    } catch (err) {
      console.warn("Failed to load server status:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!initialStatus) {
      fetchStatus()
    }
    const interval = setInterval(() => {
      fetchStatus()
    }, 15000)
    return () => clearInterval(interval)
  }, [fetchStatus, initialStatus])

  const copyJavaIp = async () => {
    const success = await copyToClipboard("play.napasmp.fun")
    if (success) {
      setCopiedJava(true)
      setTimeout(() => setCopiedJava(false), 2200)
    }
  }

  const copyBedrockIp = async () => {
    const success = await copyToClipboard("bd.napasmp.fun:19132")
    if (success) {
      setCopiedBedrock(true)
      setTimeout(() => setCopiedBedrock(false), 2200)
    }
  }

  const filteredPlayers = useMemo(() => {
    if (!status?.players?.list) return []
    if (!searchQuery.trim()) return status.players.list
    const q = searchQuery.toLowerCase().trim()
    return status.players.list.filter((p: PlayerInfo) => p.name.toLowerCase().includes(q))
  }, [status?.players?.list, searchQuery])

  const isOnline = status?.online ?? false
  const playerCount = status?.players?.online ?? 0
  const maxPlayers = status?.players?.max ?? 100
  const playerList = status?.players?.list ?? []

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Hero Banner Card */}
      <div className="tile-card tile-blue tile-md p-6 sm:p-8 relative overflow-hidden shadow-[0_0_50px_rgba(37,99,235,0.25)] border border-blue-500/30">
        <div className="relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-950/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-200">
              <CustomServerEmoji className="w-3.5 h-3.5" />
              <span>Pterodactyl Live Telemetry</span>
            </span>

            {loading && !status ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                <RefreshIcon isSpinning={true} />
                <span>Checking Status...</span>
              </span>
            ) : isOnline ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.35)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Server Online
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.35)]">
                <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                Server Offline
              </span>
            )}
          </div>

          <h1 className="font-display text-2xl sm:text-4xl uppercase tracking-wider text-white drop-shadow-md">
            Server Status & Telemetry
          </h1>
          <p className="mt-2 text-sm sm:text-base text-white text-opacity-80 leading-relaxed">
            Live server performance, active resource monitoring, and real-time players currently online in NAPA SMP.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/70">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
              <span>Updated: {lastRefreshedAt.toLocaleTimeString()}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Quick Connect IP Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Java Connect Card */}
        <div
          role="button"
          tabIndex={0}
          onClick={copyJavaIp}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              copyJavaIp()
            }
          }}
          className="p-5 rounded-2xl bg-[#0c1222] border border-cyan-500/20 hover:border-cyan-400/50 hover:bg-cyan-950/20 transition-all cursor-pointer flex items-center justify-between group shadow-lg"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300">
              <CustomMinecraftIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-cyan-300 font-semibold">
                Java Edition Server IP
              </div>
              <div className="text-base sm:text-lg font-mono font-bold text-white group-hover:text-cyan-200">
                play.napasmp.fun
              </div>
              <div className="text-xs text-white/50">Click card to copy server IP</div>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-white/5 group-hover:bg-cyan-500/20 text-xs text-white/80 group-hover:text-cyan-200 font-semibold flex items-center gap-1.5 transition-all">
            {copiedJava ? (
              <>
                <CheckIcon />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <CopyIcon />
                <span>Copy IP</span>
              </>
            )}
          </div>
        </div>

        {/* Bedrock Connect Card */}
        <div
          role="button"
          tabIndex={0}
          onClick={copyBedrockIp}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              copyBedrockIp()
            }
          }}
          className="p-5 rounded-2xl bg-[#120d24] border border-purple-500/20 hover:border-purple-400/50 hover:bg-purple-950/20 transition-all cursor-pointer flex items-center justify-between group shadow-lg"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-purple-500/15 border border-purple-400/30 text-purple-300">
              <CustomMinecraftIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-purple-300 font-semibold">
                Bedrock Edition (MCPE / Windows)
              </div>
              <div className="text-base sm:text-lg font-mono font-bold text-white group-hover:text-purple-200">
                bd.napasmp.fun <span className="text-purple-400 text-sm">:19132</span>
              </div>
              <div className="text-xs text-white/50">Click card to copy host & port</div>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-white/5 group-hover:bg-purple-500/20 text-xs text-white/80 group-hover:text-purple-200 font-semibold flex items-center gap-1.5 transition-all">
            {copiedBedrock ? (
              <>
                <CheckIcon />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <CopyIcon />
                <span>Copy IP</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Real-time Hardware Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Players */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0c101d] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-white/60 mb-2">
            <span className="uppercase tracking-wider font-semibold">Online Players</span>
            <CustomPlayerHeadEmoji className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-300 tracking-tight">
            {loading && !status ? "..." : playerCount}
            <span className="text-sm font-normal text-white/50 ml-1">/ {maxPlayers}</span>
          </div>
          <div className="mt-2 text-xs text-white/50">
            {isOnline ? "Active SMP Network" : "Server is currently offline"}
          </div>
        </div>

        {/* Metric 2: Memory */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0c101d] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-white/60 mb-2">
            <span className="uppercase tracking-wider font-semibold">Memory (RAM)</span>
            <CustomRamEmoji className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-300 tracking-tight">
            {status?.resources?.memoryPercent ?? 0}%
          </div>
          <div className="mt-2 text-xs text-white/50 truncate">
            {status?.resources?.memoryUsedMb ?? 0} MB / {status?.resources?.memoryLimitMb ?? 14000} MB
          </div>
        </div>

        {/* Metric 3: CPU */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0c101d] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-white/60 mb-2">
            <span className="uppercase tracking-wider font-semibold">CPU Utilization</span>
            <CustomCpuEmoji className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-300 tracking-tight">
            {status?.resources?.cpuPercent ?? 0}%
          </div>
          <div className="mt-2 text-xs text-white/50">Pterodactyl Node 1</div>
        </div>

        {/* Metric 4: Uptime */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0c101d] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-white/60 mb-2">
            <span className="uppercase tracking-wider font-semibold">Server Uptime</span>
            <ClockIcon />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">
            {status?.resources?.uptimeFormatted ?? "0m"}
          </div>
          <div className="mt-2 text-xs text-white/50">Uninterrupted Session</div>
        </div>
      </div>

      {/* Online Players Explorer */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0b0f1a] border border-white/10 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
                Players Online Now ({playerList.length})
              </h2>
              {isOnline ? (
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ) : null}
            </div>
            <p className="text-xs text-white/60 mt-0.5">
              Live players list retrieved directly from server console
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <span className="absolute inset-y-0 left-3 flex items-center text-white/40 pointer-events-none">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search online players by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-colors"
            />
          </div>
        </div>

        {/* Player Cards Grid */}
        {filteredPlayers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredPlayers.map((player: PlayerInfo) => (
              <div
                key={player.name}
                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 hover:bg-white/[0.06] transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Skin Avatar */}
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-black/40 border border-white/15 flex-shrink-0 group-hover:scale-105 transition-transform shadow">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={player.avatarUrl}
                      alt={player.name}
                      className="w-full h-full object-cover pixelated"
                      loading="lazy"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src =
                          "https://mc-heads.net/avatar/MHF_Steve/64"
                      }}
                    />
                  </div>

                  {/* Player Name */}
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-white truncate font-mono group-hover:text-cyan-200 transition-colors">
                      {player.name}
                    </div>
                    <div className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">
                      {player.isBedrock ? "Bedrock" : "Java"} Edition
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  {player.isAfk ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      AFK
                    </span>
                  ) : null}
                  {player.isVanished ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Vanished
                    </span>
                  ) : null}
                  {!player.isAfk && !player.isVanished ? (
                    <span className="h-2 w-2 rounded-full bg-emerald-400" title="Active"></span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-center">
            <p className="text-sm text-white/60">
              {searchQuery
                ? `No online players found matching "${searchQuery}"`
                : isOnline
                ? "No players currently online on the server."
                : "The server is currently offline."}
            </p>
          </div>
        )}
      </div>

      {/* Back to Home Button */}
      <div className="flex justify-center pt-2">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-colors"
        >
          <span>← Back to Home</span>
        </Link>
      </div>
    </div>
  )
}

