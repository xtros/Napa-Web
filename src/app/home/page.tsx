"use client"

import { useState } from "react"
import Link from "next/link"
import PageShell from "@/components/PageShell"
import { siteConfig } from "@/data/siteConfig"
import { CustomPvpEmoji, CustomEconomyEmoji, CustomCrownEmoji } from "@/components/CustomEmojis"
import { copyToClipboard } from "@/lib/clipboard"

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

export default function HomePage() {
  const [copiedJava, setCopiedJava] = useState(false)
  const [copiedBedrock, setCopiedBedrock] = useState(false)

  const javaIp = siteConfig.modules.serverIp.label
  const bedrockIp = siteConfig.modules.serverIp.bedrockIp ?? "bd.napasmp.fun"
  const bedrockPort = siteConfig.modules.serverIp.bedrockPort ?? "19132"

  const copyIp = async (text: string, isBedrock = false) => {
    const success = await copyToClipboard(text)
    if (success) {
      if (isBedrock) {
        setCopiedBedrock(true)
        setTimeout(() => setCopiedBedrock(false), 2000)
      } else {
        setCopiedJava(true)
        setTimeout(() => setCopiedJava(false), 2000)
      }
    }
  }

  return (
    <PageShell subnav={{ label: "Back to Main Page", href: "/", backText: "Back" }}>
      <div className="space-y-10">
        {/* Hero Section */}
        <div className="tile-card tile-purple tile-lg p-8 sm:p-10 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-400 border-opacity-30 bg-purple-950 bg-opacity-60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-purple-200">
              <span className="h-2 w-2 rounded-full bg-emerald animate-pulse" />
              Live Server • Java & Bedrock
            </div>
            <h1 className="mt-4 font-display text-3xl sm:text-5xl uppercase tracking-wider text-white">
              Welcome to NAPA SMP
            </h1>
            <p className="mt-3 text-base sm:text-lg text-white text-opacity-85 font-medium leading-relaxed">
              The premier Minecraft SMP community. Grind, team up, trade in a player-driven economy,
              and dominate in intense PvP battles.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => copyIp(javaIp)}
                className="primary-button flex items-center gap-2 text-sm uppercase tracking-wider"
              >
                {copiedJava ? <CheckIcon /> : <CopyIcon />}
                <span>{copiedJava ? "Java IP Copied!" : `Copy Java IP: ${javaIp}`}</span>
              </button>

              <button
                type="button"
                onClick={() => copyIp(bedrockIp, true)}
                className="ghost-button flex items-center gap-2 text-sm uppercase tracking-wider text-purple-200 border-purple-400 border-opacity-30"
              >
                {copiedBedrock ? <CheckIcon /> : <CopyIcon />}
                <span>{copiedBedrock ? "Bedrock IP Copied!" : `Copy Bedrock: ${bedrockIp}`}</span>
              </button>

              <a
                href={siteConfig.modules.discord.url}
                target="_blank"
                rel="noreferrer"
                className="ghost-button flex items-center gap-2 text-sm uppercase tracking-wider text-white"
              >
                Join Discord
              </a>

              <Link
                href="/ranks"
                className="ghost-button flex items-center gap-2 text-sm uppercase tracking-wider text-accentSoft"
              >
                Browse Ranks &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Server Connection Details */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Java Card */}
          <div className="panel-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-white text-opacity-60">
                  PC Edition
                </span>
                <span className="rounded bg-accent bg-opacity-20 px-2 py-0.5 text-xs font-bold text-accentSoft">
                  JAVA
                </span>
              </div>
              <h2 className="mt-3 text-xl font-bold uppercase tracking-wide text-white">
                Java Connection
              </h2>
              <p className="mt-2 text-sm text-white text-opacity-70">
                Connect using Minecraft Java Edition 1.20+ (supports modern versions).
              </p>
              <div className="mt-4 rounded-xl border border-line bg-midnight p-3 font-mono text-sm text-purple-300 flex items-center justify-between">
                <span>{javaIp}</span>
                <span className="text-xs text-white text-opacity-50">Default port: 25565</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => copyIp(javaIp, false)}
              className="mt-6 ghost-button flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
            >
              {copiedJava ? <CheckIcon /> : <CopyIcon />}
              <span>{copiedJava ? "Copied Java IP!" : "Copy Java Address"}</span>
            </button>
          </div>

          {/* Bedrock Card */}
          <div className="panel-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-white text-opacity-60">
                  Mobile / Console / Windows
                </span>
                <span className="rounded bg-cobalt bg-opacity-20 px-2 py-0.5 text-xs font-bold text-blue-300">
                  BEDROCK
                </span>
              </div>
              <h2 className="mt-3 text-xl font-bold uppercase tracking-wide text-white">
                Bedrock Connection
              </h2>
              <p className="mt-2 text-sm text-white text-opacity-70">
                Play on phone, tablet, console, or Windows 10 Bedrock Edition.
              </p>
              <div className="mt-4 space-y-2">
                <div className="rounded-xl border border-line bg-midnight p-3 font-mono text-sm text-purple-300 flex items-center justify-between">
                  <span>IP: {bedrockIp}</span>
                  <span className="text-xs text-white text-opacity-50">Server Address</span>
                </div>
                <div className="rounded-xl border border-line bg-midnight p-3 font-mono text-sm text-purple-300 flex items-center justify-between">
                  <span>Port: {bedrockPort}</span>
                  <span className="text-xs text-white text-opacity-50">Bedrock Port</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => copyIp(bedrockIp, true)}
              className="mt-6 ghost-button flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
            >
              {copiedBedrock ? <CheckIcon /> : <CopyIcon />}
              <span>{copiedBedrock ? "Copied Bedrock IP!" : `Copy Bedrock Address (${bedrockIp})`}</span>
            </button>
          </div>
        </div>

        {/* Server Features Grid with Custom Emojis */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-white text-opacity-60 mb-4">
            Why Play on NAPA SMP?
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="panel-card p-6 space-y-4 group hover:border-purple-400 transition duration-300">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 via-purple-600/10 to-transparent border border-purple-400/25 shadow-[0_0_24px_rgba(168,85,247,0.25)] transition-transform duration-300 group-hover:scale-110">
                <CustomPvpEmoji className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-bold uppercase tracking-wider text-white">
                  Survival & PvP
                </h3>
                <p className="mt-1 text-sm text-white text-opacity-70 leading-relaxed">
                  Balanced combat, custom enchantments, challenging warzones, and rewarding mob drops designed for high adrenaline.
                </p>
              </div>
            </div>

            <div className="panel-card p-6 space-y-4 group hover:border-amber-400 transition duration-300">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 via-emerald-600/10 to-transparent border border-amber-400/25 shadow-[0_0_24px_rgba(245,158,11,0.25)] transition-transform duration-300 group-hover:scale-110">
                <CustomEconomyEmoji className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-bold uppercase tracking-wider text-white">
                  Economy & Trading
                </h3>
                <p className="mt-1 text-sm text-white text-opacity-70 leading-relaxed">
                  Player-driven shops, auction houses, jobs, and market trading. Build wealth and create your economic empire.
                </p>
              </div>
            </div>

            <div className="panel-card p-6 space-y-4 group hover:border-yellow-400 transition duration-300">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500/20 via-purple-600/10 to-transparent border border-yellow-400/25 shadow-[0_0_24px_rgba(234,179,8,0.25)] transition-transform duration-300 group-hover:scale-110">
                <CustomCrownEmoji className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-bold uppercase tracking-wider text-white">
                  Ranks & Custom Perks
                </h3>
                <p className="mt-1 text-sm text-white text-opacity-70 leading-relaxed">
                  Unlock exclusive cosmetics, private practice bots, unique armor trims, and title prefixes in our store.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Server Rules */}
        <div className="panel-card p-8 space-y-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-white text-opacity-60">Server Guidelines</div>
            <h2 className="mt-2 text-2xl font-bold uppercase tracking-wide text-white">
              NAPA SMP Rules
            </h2>
            <p className="mt-1 text-sm text-white text-opacity-70">
              Please follow these rules to ensure a fun and safe community for everyone.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-midnight p-4 space-y-1">
              <div className="text-sm font-bold text-accentSoft">1. Fair Play & Anti-Cheat</div>
              <p className="text-xs text-white text-opacity-70">
                Hacking, auto-clickers, x-ray texture packs, or glitch exploitation will result in an immediate permanent ban.
              </p>
            </div>

            <div className="rounded-xl border border-line bg-midnight p-4 space-y-1">
              <div className="text-sm font-bold text-accentSoft">2. Respect Community Members</div>
              <p className="text-xs text-white text-opacity-70">
                Harassment, hate speech, spamming, and toxic behavior are strictly prohibited in chat and Discord.
              </p>
            </div>

            <div className="rounded-xl border border-line bg-midnight p-4 space-y-1">
              <div className="text-sm font-bold text-accentSoft">3. Griefing & Land Claims</div>
              <p className="text-xs text-white text-opacity-70">
                Respect claimed player territories. Stealing or vandalizing protected zones will be rolled back and penalized.
              </p>
            </div>

            <div className="rounded-xl border border-line bg-midnight p-4 space-y-1">
              <div className="text-sm font-bold text-accentSoft">4. Trading Safety</div>
              <p className="text-xs text-white text-opacity-70">
                Scamming during item or coin trades is not tolerated. Use designated trade systems and report suspicious deals.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Callout */}
        <div className="tile-card tile-orange tile-sm p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="tile-title text-xl uppercase text-white font-bold sm:text-2xl">
              Ready to Join the Action?
            </div>
            <p className="mt-2 text-sm text-white text-opacity-90">
              Hop onto <span className="font-mono font-bold">play.napasmp.fun</span> (Java) or <span className="font-mono font-bold">bd.napasmp.fun:19132</span> (Bedrock)!
            </p>
          </div>
          <div className="flex gap-4">
            <a
              href={siteConfig.modules.discord.url}
              target="_blank"
              rel="noreferrer"
              className="primary-button text-sm uppercase tracking-wider whitespace-nowrap"
            >
              Join Discord
            </a>
            <Link
              href="/ranks"
              className="ghost-button text-sm uppercase tracking-wider whitespace-nowrap bg-black bg-opacity-30"
            >
              Store Ranks
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
