"use client"

import { useCallback, useEffect, useState } from "react"
import PageShell from "@/components/PageShell"
import { siteConfig } from "@/data/siteConfig"
import { copyToClipboard } from "@/lib/clipboard"
import {
  CustomCocIcon,
  CustomCocShield,
  CustomCrownEmoji,
  CustomTrophyEmoji,
  CustomShieldEmoji,
  CustomSwordsEmoji,
  CustomMembersEmoji,
  CustomLightningEmoji,
  CustomScrollEmoji,
  CustomChatEmoji
} from "@/components/CustomEmojis"

type ClanMember = {
  tag: string
  name: string
  role: string
  townHallLevel: number
  expLevel: number
  trophies: number
  clanRank: number
  builderBaseTrophies?: number
  leagueTier?: {
    name: string
    iconUrls?: { small?: string; large?: string }
  }
}

type ClanLabel = {
  id: number
  name: string
  iconUrls: { small: string; medium: string }
}

type LiveClanData = {
  name: string
  tag: string
  clanLevel: number
  clanPoints: number
  clanBuilderBasePoints: number
  members: number
  badgeUrls?: { small: string; medium: string; large: string }
  labels?: ClanLabel[]
  memberList?: ClanMember[]
}

const CheckIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const CopyIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

const ExternalLinkIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

const roleLabels: Record<string, { label: string; color: string }> = {
  leader: { label: "Leader", color: "bg-amber-500/20 text-amber-300 border-amber-400/40" },
  coLeader: { label: "Co-Leader", color: "bg-rose-500/20 text-rose-300 border-rose-400/40" },
  admin: { label: "Elder", color: "bg-purple-500/20 text-purple-300 border-purple-400/40" },
  member: { label: "Member", color: "bg-blue-500/20 text-blue-300 border-blue-400/40" }
}

export default function CocPage() {
  const coc = siteConfig.coc
  const [copiedTag, setCopiedTag] = useState(false)
  const [liveData, setLiveData] = useState<LiveClanData | null>(null)

  const fetchClanData = useCallback(async () => {
    try {
      const res = await fetch("/api/coc")
      if (res.ok) {
        const data = await res.json()
        if (data && !data.error) {
          setLiveData(data)
        }
      }
    } catch {
      // Keep existing data on transient error
    }
  }, [])

  useEffect(() => {
    fetchClanData()
    const interval = setInterval(fetchClanData, 30000)
    return () => clearInterval(interval)
  }, [fetchClanData])

  const handleCopyTag = async () => {
    const success = await copyToClipboard(coc.clanTag)
    if (success) {
      setCopiedTag(true)
      setTimeout(() => setCopiedTag(false), 2000)
    }
  }

  const currentLevel = liveData ? `Level ${liveData.clanLevel}` : coc.clanLevel
  const memberCount = liveData ? `${liveData.members} / 50 Active` : coc.members
  const clanPoints = liveData ? liveData.clanPoints.toLocaleString() : "2,200"
  const builderPoints = liveData ? liveData.clanBuilderBasePoints.toLocaleString() : "1,604"

  return (
    <PageShell>
      <div className="space-y-12">
        {/* Clan Hero Banner */}
        <div className="tile-card tile-gold tile-lg relative overflow-hidden p-8 sm:p-12 border-amber-400/40 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
          <div className="relative z-10 flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-950/70 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-200">
                  <CustomCocShield className="h-4 w-4 text-amber-400" />
                  {currentLevel} Clan
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/30 bg-purple-950/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple-200">
                  <span className="h-2 w-2 rounded-full bg-emerald animate-pulse" />
                  {memberCount}
                </span>
                <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-black/40 px-3 py-1 text-xs font-mono font-bold tracking-wider text-amber-300">
                  {coc.clanTag}
                </span>
              </div>

              <h1 className="mt-4 font-display text-3xl sm:text-5xl uppercase tracking-wider text-white">
                {liveData?.name || coc.clanName}
              </h1>

              <p className="mt-3 text-base sm:text-lg text-white/85 font-medium leading-relaxed">
                {coc.description}
              </p>

              {/* Clan Labels from live API */}
              {liveData?.labels && liveData.labels.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {liveData.labels.map((lbl) => (
                    <div
                      key={lbl.id}
                      className="inline-flex items-center gap-2 rounded-lg border border-amber-400/30 bg-black/40 px-3 py-1 text-xs font-semibold text-amber-200"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={lbl.iconUrls.small} alt={lbl.name} className="h-4 w-4 object-contain" />
                      <span>{lbl.name}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={coc.openLink}
                  target="_blank"
                  rel="noreferrer"
                  className="primary-button flex items-center gap-2 text-sm uppercase tracking-wider bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white border-amber-300/40 hover:brightness-110 shadow-[0_0_25px_rgba(245,158,11,0.4)]"
                >
                  <CustomCocIcon className="h-5 w-5" />
                  <span>Join Clan in Game</span>
                  <ExternalLinkIcon />
                </a>

                <button
                  type="button"
                  onClick={handleCopyTag}
                  className="ghost-button flex items-center gap-2 text-sm uppercase tracking-wider text-amber-200 border-amber-400/40 hover:text-white hover:border-amber-300"
                >
                  {copiedTag ? <CheckIcon /> : <CopyIcon />}
                  <span>{copiedTag ? "Clan Tag Copied!" : `Copy Tag: ${coc.clanTag}`}</span>
                </button>

                <a
                  href={coc.discordChannelUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ghost-button flex items-center gap-2 text-sm uppercase tracking-wider text-purple-200 border-purple-400/40 hover:text-white"
                >
                  <CustomChatEmoji className="h-4 w-4" />
                  <span>Join CoC Discord</span>
                </a>
              </div>
            </div>

            {/* Official Supercell Clan Badge */}
            {liveData?.badgeUrls?.large && (
              <div className="flex-shrink-0 flex items-center justify-center">
                <div className="relative group">
                  <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-amber-500/20 to-purple-600/30 blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={liveData.badgeUrls.large}
                    alt={`${liveData.name} badge`}
                    className="relative h-32 w-32 sm:h-44 sm:w-44 object-contain drop-shadow-[0_10px_25px_rgba(245,158,11,0.4)] transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="tile-art tile-art-hero opacity-30 pointer-events-none" aria-hidden="true" />
        </div>

        {/* Vital Stats Dashboard */}
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <div className="panel-card p-5 text-center transition hover:border-amber-400/40">
            <div className="text-2xl font-black text-amber-400 flex items-center justify-center gap-2">
              <CustomShieldEmoji className="h-6 w-6" />
              <span>{currentLevel}</span>
            </div>
            <div className="mt-1 text-xs uppercase tracking-wider text-white/60">Clan Level</div>
          </div>
          <div className="panel-card p-5 text-center transition hover:border-amber-400/40">
            <div className="text-2xl font-black text-white flex items-center justify-center gap-2">
              <CustomTrophyEmoji className="h-6 w-6" />
              <span>{clanPoints}</span>
            </div>
            <div className="mt-1 text-xs uppercase tracking-wider text-white/60">Home Base Points</div>
          </div>
          <div className="panel-card p-5 text-center transition hover:border-amber-400/40">
            <div className="text-2xl font-black text-purple-400 flex items-center justify-center gap-2">
              <CustomSwordsEmoji className="h-6 w-6" />
              <span>{builderPoints}</span>
            </div>
            <div className="mt-1 text-xs uppercase tracking-wider text-white/60">Builder Base Points</div>
          </div>
          <div className="panel-card p-5 text-center transition hover:border-amber-400/40">
            <div className="text-2xl font-black text-amber-300 flex items-center justify-center gap-2">
              <CustomSwordsEmoji className="h-6 w-6" />
              <span>Back-to-Back</span>
            </div>
            <div className="mt-1 text-xs uppercase tracking-wider text-white/60">War Schedule</div>
          </div>
          <div className="col-span-2 sm:col-span-1 panel-card p-5 text-center transition hover:border-amber-400/40">
            <div className="text-2xl font-black text-emerald flex items-center justify-center gap-2">
              <CustomMembersEmoji className="h-6 w-6" />
              <span>{memberCount}</span>
            </div>
            <div className="mt-1 text-xs uppercase tracking-wider text-white/60">Roster Capacity</div>
          </div>
        </section>

        {/* Live Clan Members Roster */}
        {liveData?.memberList && liveData.memberList.length > 0 && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-b border-line pb-4">
              <div>
                <h2 className="font-display text-2xl uppercase tracking-wider text-white">
                  Active Clan Roster
                </h2>
                <p className="mt-1 text-sm text-white/70">
                  Live members synchronized directly from Supercell's Clash of Clans API.
                </p>
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                {liveData.memberList.length} Members Online
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {liveData.memberList.map((member) => {
                const roleInfo = roleLabels[member.role] || {
                  label: member.role,
                  color: "bg-white/10 text-white border-white/20"
                }

                return (
                  <div
                    key={member.tag}
                    className="panel-card relative p-5 transition duration-200 hover:-translate-y-1 hover:border-amber-400/40"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 font-display text-sm font-bold text-amber-300 border border-amber-400/30">
                          #{member.clanRank}
                        </span>
                        <div>
                          <div className="font-bold text-white text-base leading-tight">{member.name}</div>
                          <div className="mt-0.5 text-xs font-mono text-white/50">{member.tag}</div>
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${roleInfo.color}`}
                      >
                        {roleInfo.label}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 border-t border-line/60 pt-3 text-xs">
                      <div>
                        <span className="text-white/60">Town Hall:</span>{" "}
                        <span className="font-bold text-amber-300">TH {member.townHallLevel}</span>
                      </div>
                      <div>
                        <span className="text-white/60">Level:</span>{" "}
                        <span className="font-bold text-white">XP {member.expLevel}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-white/60">Trophies:</span>{" "}
                        <span className="font-bold text-purple-300 inline-flex items-center gap-1">
                          <CustomTrophyEmoji className="h-3.5 w-3.5" />
                          {member.trophies}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-white/60">Builder:</span>{" "}
                        <span className="font-bold text-emerald inline-flex items-center gap-1">
                          <CustomSwordsEmoji className="h-3.5 w-3.5" />
                          {member.builderBaseTrophies ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Clan Perks Grid */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-b border-line pb-4">
            <div>
              <h2 className="font-display text-2xl uppercase tracking-wider text-white">
                Clan Perks & Community Focus
              </h2>
              <p className="mt-1 text-sm text-white/70">
                Benefits and activities for all NAPA Clash of Clans members.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
              <CustomLightningEmoji className="h-4 w-4" />
              <span>Clan Advantages</span>
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {coc.perks.map((perk) => (
              <div
                key={perk.title}
                className="panel-card group relative p-6 transition duration-200 hover:-translate-y-1 hover:border-amber-400/50"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 border border-amber-400/30">
                    {perk.badge}
                  </span>
                  <CustomCocShield className="h-5 w-5 text-amber-400/50 group-hover:text-amber-400 transition-colors" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  {perk.title}
                </h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">
                  {perk.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Requirements & Clan Rules */}
        <section className="grid gap-8 lg:grid-cols-2">
          {/* Requirements */}
          <div className="panel-card p-6 sm:p-8 space-y-6 border-line">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-400">
                <CustomScrollEmoji className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-xl uppercase tracking-wider text-white">
                  Join Requirements
                </h2>
                <p className="text-xs uppercase tracking-widest text-white/60">
                  Open to all active players
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {coc.requirements.map((req, idx) => (
                <div
                  key={req.title}
                  className="flex items-start gap-3.5 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-amber-400/30"
                >
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-300">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">{req.title}</h3>
                    <p className="mt-1 text-xs text-white/70 leading-relaxed">{req.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clan Roles & Hierarchy */}
          <div className="panel-card p-6 sm:p-8 space-y-6 border-line">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-400/30 text-purple-400">
                <CustomCrownEmoji className="h-6 w-6" />
              </span>
              <div>
                <h2 className="font-display text-xl uppercase tracking-wider text-white">
                  Clan Hierarchy & Promotion
                </h2>
                <p className="text-xs uppercase tracking-widest text-white/60">
                  Leadership and roles in NAPA
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {coc.roles.map((role) => (
                <div
                  key={role.role}
                  className="rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-purple-400/30"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold uppercase tracking-wider ${role.color}`}>
                      {role.role}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-white/50">Role</span>
                  </div>
                  <p className="mt-2 text-xs text-white/75 leading-relaxed">{role.requirement}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-purple-500/20 bg-purple-950/30 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-200">
                <CustomChatEmoji className="h-4 w-4" />
                <span>Need attack advice or troop requests?</span>
              </div>
              <p className="mt-1 text-xs text-white/70">
                Our Discord server has dedicated channels for attack meta, war base links, and CWL coordination.
              </p>
              <a
                href={coc.discordChannelUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300 hover:text-white"
              >
                <span>Open Discord War Room &rarr;</span>
              </a>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="panel-card relative overflow-hidden p-8 text-center border-amber-400/30 bg-gradient-to-b from-card to-amber-950/20">
          <div className="relative z-10 mx-auto max-w-xl space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-white">
              Ready to Clash with NAPA?
            </h2>
            <p className="text-sm text-white/80">
              Search Clan Tag <span className="font-mono font-bold text-amber-300">{coc.clanTag}</span> in-game or tap the button below to send your request.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href={coc.openLink}
                target="_blank"
                rel="noreferrer"
                className="primary-button flex items-center gap-2 text-sm uppercase tracking-wider bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white"
              >
                <CustomCocIcon className="h-4 w-4" />
                <span>Open in Clash of Clans</span>
              </a>
              <button
                type="button"
                onClick={handleCopyTag}
                className="ghost-button flex items-center gap-2 text-sm uppercase tracking-wider text-amber-300 border-amber-400/40"
              >
                {copiedTag ? <CheckIcon /> : <CopyIcon />}
                <span>{copiedTag ? "Copied to Clipboard!" : `Copy Tag: ${coc.clanTag}`}</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  )
}
