"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import PageShell from "@/components/PageShell"
import { siteConfig, EventItem } from "@/data/siteConfig"
import { copyToClipboard } from "@/lib/clipboard"

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL")
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null)
  const [events, setEvents] = useState<EventItem[]>((siteConfig as any).events || [])
  const [loading, setLoading] = useState<boolean>(true)
  const [syncStatus, setSyncStatus] = useState<string>("SYNCING")
  const [discordCount, setDiscordCount] = useState<number>(0)

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/events")
      if (res.ok) {
        const data = await res.json()
        if (data.events && Array.isArray(data.events)) {
          setEvents(data.events)
          setSyncStatus(data.syncStatus)
          setDiscordCount(data.discordEventsCount || 0)
        }
      }
    } catch (e) {
      console.warn("Failed to load events API", e)
      setSyncStatus("FALLBACK")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
    // Poll every 45s for fresh Discord events
    const interval = setInterval(fetchEvents, 45000)
    return () => clearInterval(interval)
  }, [])

  const categories = [
    { id: "ALL", label: "All Events" },
    { id: "DISCORD", label: `Discord Events ${discordCount > 0 ? `(${discordCount})` : ""}` },
    { id: "WEEKLY", label: "Weekly Recurring" },
    { id: "PVP", label: "PvP & Tournaments" },
    { id: "PVE", label: "Boss Raids & PvE" },
    { id: "COMMUNITY", label: "Community & Drops" },
    { id: "BUILDING", label: "Contests" }
  ]

  const filteredEvents = events.filter((ev) => {
    if (activeCategory === "ALL") return true
    if (activeCategory === "DISCORD") return ev.isDiscordEvent === true
    if (activeCategory === "WEEKLY") return ev.status === "WEEKLY"
    return ev.category === activeCategory
  })

  const handleCopyCommand = async (cmd: string) => {
    if (cmd && cmd.startsWith("/")) {
      const clean = cmd.split(" ")[0]
      const success = await copyToClipboard(clean)
      if (success) {
        setCopiedCmd(cmd)
        setTimeout(() => setCopiedCmd(null), 2000)
      }
    }
  }

  return (
    <PageShell>
      <div className="space-y-12">
        {/* Top Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-line bg-panel/80 p-8 md:p-12 backdrop-blur-md shadow-[0_0_50px_rgba(139,92,246,0.18)]">
          <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-purple-500/15 blur-[90px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 -z-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />

          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-950/60 px-3 py-1 text-xs font-bold uppercase tracking-widest text-purple-300">
                <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                Discord Auto-Sync Active
              </span>

              {syncStatus === "LIVE" ? (
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                  ● {discordCount} Discord Events Synced
                </span>
              ) : (
                <span className="rounded-full border border-line bg-midnight px-3 py-1 text-xs font-semibold text-white/60">
                  NAPA SMP Community Calendar
                </span>
              )}
            </div>

            <h1 className="text-3xl font-extrabold uppercase tracking-wide text-white sm:text-5xl">
              Server Events &amp; Challenges
            </h1>

            <p className="text-sm leading-relaxed text-white/75 sm:text-base">
              Scheduled events in our Discord server sync directly to this page in real time!
              Compete in weekly Ender Dragon raids, high-stakes 1v1 PvP tournaments, drop parties,
              and community challenges with in-game ranks, crate keys, and coins.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="https://dsc.gg/napa"
                target="_blank"
                rel="noreferrer"
                className="primary-button text-xs font-bold uppercase tracking-widest flex items-center gap-2 py-3 px-6 shadow-[0_0_25px_rgba(139,92,246,0.4)]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span>Add Event on Discord</span>
              </a>

              <button
                type="button"
                onClick={fetchEvents}
                disabled={loading}
                className="ghost-button text-xs font-bold uppercase tracking-widest flex items-center gap-2 py-3 px-5 hover:border-purple-400"
              >
                <svg className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                </svg>
                <span>{loading ? "Syncing..." : "Refresh Discord"}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Filter Pills */}
        <section className="flex flex-wrap items-center gap-2 border-b border-line pb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                  : "border border-line bg-midnight text-white/70 hover:border-purple-500/40 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </section>

        {/* Events Grid or Clean Empty State */}
        {filteredEvents.length === 0 ? (
          <div className="panel-card p-12 sm:p-16 text-center border border-line/60 rounded-3xl bg-midnight/60 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold uppercase tracking-wider text-white">
              No Active Events Right Now
            </h3>
            <p className="text-xs text-white/60 max-w-md mx-auto leading-relaxed">
              All events are currently cleared. As soon as a new event is announced in <span className="text-purple-300 font-semibold">#「🟣┃ᴇᴠᴇɴᴛ-ᴀɴɴᴏɴᴄᴇᴍᴇɴᴛ</span> on Discord, it will sync and display here automatically!
            </p>
            <div className="pt-2">
              <a
                href="https://dsc.gg/napa"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-purple-600/25 hover:from-purple-500 hover:to-indigo-500 transition-all cursor-pointer"
              >
                <span>Join Discord Announcements</span>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>
        ) : (
          <section className="grid gap-6 md:grid-cols-2">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className={`panel-card group relative overflow-hidden p-6 sm:p-8 flex flex-col justify-between border transition-all duration-300 ${
                  ev.isDiscordEvent 
                    ? "border-purple-500/50 shadow-[0_0_40px_rgba(139,92,246,0.18)] hover:border-purple-400" 
                    : "border-line hover:border-purple-500/40 hover:shadow-[0_0_35px_rgba(139,92,246,0.12)]"
                }`}
              >
                <div className="space-y-4">
                  {/* Header Tags */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-md px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider ${
                        ev.status === "LIVE"
                          ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 animate-pulse"
                          : ev.isDiscordEvent
                          ? "bg-purple-500/20 border border-purple-500/40 text-purple-300"
                          : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                      }`}>
                        {ev.badgeText}
                      </span>

                      {ev.isDiscordEvent && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#5865F2]/20 border border-[#5865F2]/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#98a1f8]">
                          💬 Discord Event
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-mono uppercase tracking-widest text-white/50">
                      {ev.category}
                    </span>
                  </div>

                  {/* Event Title */}
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-wide text-white group-hover:text-purple-300 transition-colors">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-purple-300 font-medium mt-1">
                      {ev.subtitle}
                    </p>
                  </div>

                  {/* Schedule & Warp Pill */}
                  <div className="grid gap-2 sm:grid-cols-2 pt-1 text-xs">
                    <div className="flex items-center gap-2 rounded-xl bg-midnight/90 border border-line p-2.5 text-white/80">
                      <svg className="h-4 w-4 text-purple-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span className="truncate font-semibold">{ev.schedule}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyCommand(ev.locationCommand)}
                      className="flex items-center justify-between gap-2 rounded-xl bg-midnight/90 border border-line p-2.5 text-accentSoft hover:border-accentSoft/50 transition-all cursor-pointer font-mono text-xs"
                      title="Click to copy in-game command"
                    >
                      <span className="truncate font-bold">
                        {copiedCmd === ev.locationCommand ? "✓ Copied!" : ev.locationCommand}
                      </span>
                      <svg className="h-3.5 w-3.5 text-white/40 group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-xs leading-relaxed text-white/70">
                    {ev.description}
                  </p>

                  {/* Rewards List */}
                  <div className="rounded-2xl border border-line/70 bg-midnight/60 p-4 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
                      🏆 Featured Event Rewards:
                    </span>
                    <ul className="grid gap-1.5 text-xs text-white/85">
                      {ev.rewards.map((reward, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                          <span>{reward}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Quick Action */}
                <div className="pt-6 border-t border-line/50 mt-6 flex items-center justify-between">
                  {ev.interestedCount && ev.interestedCount > 0 ? (
                    <span className="text-[11px] text-purple-300 font-semibold">
                      👥 {ev.interestedCount} players marked interested
                    </span>
                  ) : (
                    <span className="text-[11px] text-white/40">
                      Open to all active players
                    </span>
                  )}

                  {ev.discordEventUrl ? (
                    <a
                      href={ev.discordEventUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#858df3] hover:text-[#b4bbfb] transition-colors"
                    >
                      <span>RSVP on Discord</span>
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </a>
                  ) : (
                    <a
                      href="https://dsc.gg/napa"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <span>Event Discussion</span>
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Weekly Event Roadmap Table */}
        <section className="panel-card p-6 sm:p-8 space-y-6 border border-line">
          <div>
            <span className="text-xs uppercase tracking-widest text-purple-400 font-bold block">
              Official Schedule
            </span>
            <h2 className="text-2xl font-bold uppercase tracking-wide text-white mt-1">
              Weekly Server Rhythm &amp; Routine
            </h2>
            <p className="text-xs text-white/70 mt-1">
              Events take place on the main SMP server and sync in real time from Discord Scheduled Events.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/80">
              <thead className="border-b border-line bg-midnight text-[11px] uppercase tracking-wider text-white/50">
                <tr>
                  <th className="py-3 px-4">Day</th>
                  <th className="py-3 px-4">Time (IST)</th>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Location / Warp</th>
                  <th className="py-3 px-4">Primary Rewards</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                <tr className="hover:bg-purple-950/20 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">Mon – Thu</td>
                  <td className="py-3.5 px-4 font-mono text-purple-300">All Day</td>
                  <td className="py-3.5 px-4 font-semibold">Survival Megabase Building Sprint</td>
                  <td className="py-3.5 px-4 font-mono text-accentSoft">/discord #builds</td>
                  <td className="py-3.5 px-4">Architect Chat Tag + 100k In-game Coins</td>
                </tr>
                <tr className="hover:bg-purple-950/20 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">Friday</td>
                  <td className="py-3.5 px-4 font-mono text-purple-300">8:00 PM IST</td>
                  <td className="py-3.5 px-4 font-semibold">1v1 Gladiator Arena Tournament</td>
                  <td className="py-3.5 px-4 font-mono text-accentSoft">/warp pvp</td>
                  <td className="py-3.5 px-4">Elite Rank Upgrade Voucher + Netherite Trophy</td>
                </tr>
                <tr className="hover:bg-purple-950/20 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">Saturday</td>
                  <td className="py-3.5 px-4 font-mono text-purple-300">7:00 PM IST</td>
                  <td className="py-3.5 px-4 font-semibold">Weekly Ender Dragon Void Raid</td>
                  <td className="py-3.5 px-4 font-mono text-accentSoft">/warp boss</td>
                  <td className="py-3.5 px-4">Dragon Slayer Tag + 3x Mythic Keys</td>
                </tr>
                <tr className="hover:bg-purple-950/20 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">Saturday Night</td>
                  <td className="py-3.5 px-4 font-mono text-purple-300">9:30 PM IST</td>
                  <td className="py-3.5 px-4 font-semibold">Spawn Mega Drop Party &amp; Coin Flip</td>
                  <td className="py-3.5 px-4 font-mono text-accentSoft">/warp spawn</td>
                  <td className="py-3.5 px-4">Shulker Boxes, Enchanted Books &amp; Cash</td>
                </tr>
                <tr className="hover:bg-purple-950/20 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">Sunday</td>
                  <td className="py-3.5 px-4 font-mono text-purple-300">All Day</td>
                  <td className="py-3.5 px-4 font-semibold">Weekend 2x Sell Multiplier Frenzy</td>
                  <td className="py-3.5 px-4 font-mono text-accentSoft">/shop &amp; /sell</td>
                  <td className="py-3.5 px-4">Double Economy Profits on All Crops</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PageShell>
  )
}
