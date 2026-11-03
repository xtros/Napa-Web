"use client"

import { useState } from "react"
import Link from "next/link"
import PageShell from "@/components/PageShell"
import { siteConfig, EventItem } from "@/data/siteConfig"
import { copyToClipboard } from "@/lib/clipboard"

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL")
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null)

  const events: EventItem[] = (siteConfig as any).events || []

  const categories = [
    { id: "ALL", label: "All Events" },
    { id: "WEEKLY", label: "Weekly Recurring" },
    { id: "PVP", label: "PvP & Tournaments" },
    { id: "PVE", label: "Boss Raids & PvE" },
    { id: "COMMUNITY", label: "Community & Drops" },
    { id: "BUILDING", label: "Contests" }
  ]

  const filteredEvents = events.filter((ev) => {
    if (activeCategory === "ALL") return true
    if (activeCategory === "WEEKLY") return ev.status === "WEEKLY"
    return ev.category === activeCategory
  })

  const handleCopyCommand = async (cmd: string) => {
    if (cmd.startsWith("/")) {
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
        <section className="relative overflow-hidden rounded-3xl border border-line bg-panel/80 p-8 md:p-12 backdrop-blur-md shadow-[0_0_50px_rgba(43,213,127,0.12)]">
          <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-[90px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 -z-10 h-64 w-64 rounded-full bg-purple-500/10 blur-[80px] pointer-events-none" />

          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-400">
                ● Live & Weekly Calendar
              </span>
              <span className="rounded-full border border-line bg-midnight px-3 py-1 text-xs font-semibold text-white/60">
                NAPA SMP Season 2
              </span>
            </div>

            <h1 className="text-3xl font-extrabold uppercase tracking-wide text-white sm:text-5xl">
              Server Events &amp; Challenges
            </h1>

            <p className="text-sm leading-relaxed text-white/75 sm:text-base">
              Step into the fray! Compete in weekly Ender Dragon void raids, high-stakes 1v1 PvP tournaments,
              massive spawn drop parties, and monthly survival architecture showcases with free rank upgrades,
              crate keys, and in-game economy prizes.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="https://dsc.gg/napa"
                target="_blank"
                rel="noreferrer"
                className="primary-button text-xs font-bold uppercase tracking-widest flex items-center gap-2 py-3 px-6"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span>Get Event Pings on Discord</span>
              </a>

              <Link
                href="/ranks"
                className="ghost-button text-xs font-bold uppercase tracking-widest flex items-center gap-2 py-3 px-6"
              >
                <span>Browse Event Ranks</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
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
                  ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(43,213,127,0.4)]"
                  : "border border-line bg-midnight text-white/70 hover:border-emerald-500/40 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </section>

        {/* Events Grid */}
        <section className="grid gap-6 md:grid-cols-2">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="panel-card group relative overflow-hidden p-6 sm:p-8 flex flex-col justify-between border border-line hover:border-emerald-500/40 transition-all duration-300 hover:shadow-[0_0_35px_rgba(43,213,127,0.12)]"
            >
              <div className="space-y-4">
                {/* Header Tags */}
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-300">
                    {ev.badgeText}
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-white/50">
                    {ev.category}
                  </span>
                </div>

                {/* Event Title */}
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-wide text-white group-hover:text-emerald-300 transition-colors">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-purple-300 font-medium mt-1">
                    {ev.subtitle}
                  </p>
                </div>

                {/* Schedule & Warp Pill */}
                <div className="grid gap-2 sm:grid-cols-2 pt-1 text-xs">
                  <div className="flex items-center gap-2 rounded-xl bg-midnight/90 border border-line p-2.5 text-white/80">
                    <svg className="h-4 w-4 text-emerald-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                        <span>{reward}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Quick Action */}
              <div className="pt-6 border-t border-line/50 mt-6 flex items-center justify-between">
                <span className="text-[11px] text-white/40">
                  Open to all active players
                </span>
                <a
                  href="https://dsc.gg/napa"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <span>Event Discussion</span>
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </section>

        {/* Weekly Event Roadmap Table */}
        <section className="panel-card p-6 sm:p-8 space-y-6 border border-line">
          <div>
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold block">
              Official Schedule
            </span>
            <h2 className="text-2xl font-bold uppercase tracking-wide text-white mt-1">
              Weekly Server Rhythm &amp; Routine
            </h2>
            <p className="text-xs text-white/70 mt-1">
              Mark your calendar so you never miss a boss fight, tournament, or community giveaway.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/80 border-collapse">
              <thead>
                <tr className="border-b border-line text-white/50 uppercase tracking-widest text-[11px]">
                  <th className="py-3 px-4">Day</th>
                  <th className="py-3 px-4">Event Activity</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Time (IST)</th>
                  <th className="py-3 px-4">Multiplier / Bonus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">Mon – Thu</td>
                  <td className="py-3.5 px-4">Mining &amp; Netherite Rush</td>
                  <td className="py-3.5 px-4 font-mono text-purple-300">/warp nether</td>
                  <td className="py-3.5 px-4">All Day</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-semibold">+25% Ore Exp</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-amber-300">Friday</td>
                  <td className="py-3.5 px-4">1v1 Gladiator Arena Tournament</td>
                  <td className="py-3.5 px-4 font-mono text-purple-300">/warp arena</td>
                  <td className="py-3.5 px-4">9:00 PM IST</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-semibold">Rank Upgrades</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-purple-400">Saturday</td>
                  <td className="py-3.5 px-4">Ender Dragon Void Raid &amp; Reset</td>
                  <td className="py-3.5 px-4 font-mono text-purple-300">/warp end</td>
                  <td className="py-3.5 px-4">8:00 PM IST</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-semibold">Dragon Egg &amp; Mythic Keys</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-emerald-400">Sunday</td>
                  <td className="py-3.5 px-4">Spawn Mega Drop Party &amp; Town Hall</td>
                  <td className="py-3.5 px-4 font-mono text-purple-300">/spawn</td>
                  <td className="py-3.5 px-4">7:00 PM IST</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-semibold">100+ Supply Drops</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Community Hosting Callout */}
        <section className="rounded-3xl border border-line bg-gradient-to-r from-purple-900/30 via-midnight to-emerald-950/30 p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <h3 className="text-xl font-bold uppercase tracking-wide text-white">
              Want to host your own player event?
            </h3>
            <p className="text-xs text-white/70">
              Content creators and faction leaders can request custom arena setups, drop parties, and staff broadcasts on our Discord community.
            </p>
          </div>
          <a
            href="https://dsc.gg/napa"
            target="_blank"
            rel="noreferrer"
            className="primary-button text-xs font-bold uppercase tracking-widest py-3 px-6 whitespace-nowrap self-start md:self-auto"
          >
            Submit Event Proposal
          </a>
        </section>
      </div>
    </PageShell>
  )
}

