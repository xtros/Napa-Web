"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { TileConfig, HighlightBadge } from "@/data/siteConfig"
import {
  CustomServerEmoji,
  CustomCpuEmoji,
  CustomRamEmoji,
  CustomPlayerHeadEmoji,
  CustomMinecraftIcon
} from "@/components/CustomEmojis"
import type { ServerStatusResponse, PlayerInfo } from "@/app/api/status/route"

// Custom SVG Icons (Zero Unicode Emojis)
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

const ArrowRightIcon = () => (
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
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

interface ServerStatusTileProps {
  tile: TileConfig
  highlightBadge?: HighlightBadge
  initialStatus?: ServerStatusResponse | null
}

export default function ServerStatusTile({
  tile,
  highlightBadge,
  initialStatus
}: ServerStatusTileProps) {
  const [status, setStatus] = useState<ServerStatusResponse | null>(initialStatus ?? null)
  const [loading, setLoading] = useState<boolean>(!initialStatus)

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/status", { cache: "no-store" })
      if (res.ok) {
        const data: ServerStatusResponse = await res.json()
        if (data && typeof data.online === "boolean") {
          setStatus(data)
        }
      }
    } catch (err) {
      console.warn("Failed to load server status:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Auto-fetch on mount (if no initial status) & poll every 20 seconds
  useEffect(() => {
    if (!initialStatus) {
      fetchStatus()
    }
    const interval = setInterval(() => {
      fetchStatus()
    }, 20000)
    return () => clearInterval(interval)
  }, [fetchStatus, initialStatus])

  const isOnline = status?.online ?? false
  const playerCount = status?.players?.online ?? 0
  const maxPlayers = status?.players?.max ?? 100
  const playerList = status?.players?.list ?? []
  const previewPlayers = playerList.slice(0, 5)

  const badgeText = highlightBadge?.tileId === tile.id ? highlightBadge.text : tile.badge

  return (
    <Link
      href="/status"
      className={`tile-card ${tile.theme} lg:col-start-3 lg:row-start-2 tile-md animate-fade-up cursor-pointer group text-left select-none relative overflow-hidden block`}
    >
      {/* Background Image & Tint */}
      {tile.backgroundImage ? (
        <div
          className="tile-bg"
          aria-hidden="true"
          style={
            {
              "--tile-bg-tint": tile.backgroundTint ?? "rgba(63, 108, 246, 0.8)",
              "--tile-bg-opacity": tile.backgroundOpacity ?? 0.28
            } as React.CSSProperties
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

      {/* Highlight Ribbon */}
      {badgeText ? <div className="tile-ribbon">{badgeText}</div> : null}

      {/* Live Status Pill Top Right */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {loading && !status ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 backdrop-blur-md">
            <RefreshIcon isSpinning={true} />
            <span>Connecting...</span>
          </span>
        ) : isOnline ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md shadow-[0_0_12px_rgba(16,185,129,0.35)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Online
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 backdrop-blur-md shadow-[0_0_12px_rgba(244,63,94,0.35)]">
            <span className="inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            Offline
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="tile-content justify-between h-full relative z-10 p-6 flex flex-col">
        {/* Header & Title */}
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs uppercase tracking-widest text-cyan-300 font-semibold">
            <CustomServerEmoji className="w-4 h-4 inline-block" />
            <span>NAPA SMP Live</span>
          </div>
          <h3 className="tile-title text-lg uppercase text-white sm:text-2xl drop-shadow-md">
            Server Status
          </h3>

          {/* Players online counter */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-sm">
              {loading && !status ? "..." : `${playerCount} / ${maxPlayers}`}
            </span>
            <span className="text-xs uppercase tracking-wider text-white/70 font-medium">
              Players Online
            </span>
          </div>

          {/* Active player preview chips */}
          {loading && !status ? (
            <div className="mt-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="text-xs text-white/70 font-mono">Syncing live server...</span>
            </div>
          ) : previewPlayers.length > 0 ? (
            <div className="mt-3">
              <div className="text-[11px] uppercase tracking-wider text-white/60 mb-1.5 flex items-center gap-1 font-semibold">
                <CustomPlayerHeadEmoji className="w-3.5 h-3.5" />
                <span>Currently Playing:</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {previewPlayers.map((player) => (
                  <span
                    key={player.name}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/40 border border-white/10 text-white/90 text-xs backdrop-blur-sm"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={player.avatarUrl}
                      alt={player.name}
                      className="w-3.5 h-3.5 rounded-sm pixelated"
                      loading="lazy"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src =
                          "https://mc-heads.net/avatar/MHF_Steve/64"
                      }}
                    />
                    <span className="truncate max-w-[85px]">{player.name}</span>
                  </span>
                ))}
                {playerList.length > previewPlayers.length ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-400/30 text-cyan-200 text-xs font-semibold">
                    +{playerList.length - previewPlayers.length} more
                  </span>
                ) : null}
              </div>
            </div>
          ) : isOnline ? (
            <p className="tile-sub mt-2 text-xs text-white text-opacity-80">
              Server is active! Connect at <code className="text-cyan-200">play.napasmp.fun</code>
            </p>
          ) : (
            <p className="tile-sub mt-2 text-xs text-rose-200 text-opacity-80">
              Server is offline. Check Discord for updates.
            </p>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs uppercase tracking-widest text-white/90 group-hover:text-cyan-200 transition-colors">
          <span className="font-semibold flex items-center gap-1.5">
            <span>View Players & Stats</span>
            <ArrowRightIcon />
          </span>
          <span className="text-[10px] text-white/50 lowercase tracking-normal">
            click to open page
          </span>
        </div>
      </div>
    </Link>
  )
}
