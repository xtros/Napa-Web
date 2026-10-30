"use client"

import { ReactNode, useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import useAdminPreview from "@/components/useAdminPreview"
import { siteConfig } from "@/data/siteConfig"
import Logo from "@/components/Logo"
import { CustomMinecraftIcon, CustomCocIcon, CustomCocShield } from "@/components/CustomEmojis"
import { copyToClipboard } from "@/lib/clipboard"
import type { DiscordUser } from "@/lib/discordAuth"

type HeaderProps = {
  onLoginClick: () => void
}

const DiscordIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M5 5H19V15H8L5 18V5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="10" r="1" fill="currentColor" />
    <circle cx="15" cy="10" r="1" fill="currentColor" />
  </svg>
)

const ServerIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect x="5" y="3" width="14" height="6" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <rect x="5" y="10.5" width="14" height="6" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <rect x="5" y="18" width="14" height="3" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="9" cy="6" r="1" fill="currentColor" />
    <circle cx="9" cy="13.5" r="1" fill="currentColor" />
  </svg>
)

const CheckIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const ModuleCard = ({
  title,
  label,
  detail,
  icon,
  url,
  onClick
}: {
  title: string
  label: string
  detail?: string
  icon: ReactNode
  url?: string
  onClick?: () => void
}) => {
  const content = (
    <>
      <div className="module-icon text-accentSoft">{icon}</div>
      <div className="text-left">
        <div className="text-xs uppercase tracking-widest text-white text-opacity-60">{title}</div>
        <div className="text-sm font-semibold">{label}</div>
        {detail ? <div className="text-xs text-white text-opacity-60">{detail}</div> : null}
      </div>
    </>
  )

  if (url) {
    return (
      <a className="module-card text-white cursor-pointer" href={url} target="_blank" rel="noreferrer">
        {content}
      </a>
    )
  }

  if (onClick) {
    return (
      <button
        type="button"
        className="module-card text-white text-left cursor-pointer transition hover:border-accentSoft focus:outline-none"
        onClick={onClick}
      >
        {content}
      </button>
    )
  }

  return <div className="module-card text-white">{content}</div>
}

export default function Header({ onLoginClick }: HeaderProps) {
  const preview = useAdminPreview()
  const pathname = usePathname()
  const isCoc = pathname?.startsWith("/coc")

  const [copiedIp, setCopiedIp] = useState(false)
  const [copiedCoc, setCopiedCoc] = useState(false)
  const [user, setUser] = useState<DiscordUser | null>(null)
  const discordUrl = preview.discordUrl?.trim()

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.loggedIn && data?.user) {
          setUser(data.user)
        } else {
          setUser(null)
        }
      })
      .catch(() => {})
  }, [])

  const modules = {
    discord: {
      ...siteConfig.modules.discord,
      label: preview.discordInvite,
      enabled: preview.modules.discord,
      url: discordUrl || siteConfig.modules.discord.url
    },
    serverIp: {
      ...siteConfig.modules.serverIp,
      label: preview.serverIp,
      enabled: preview.modules.serverIp,
      detail: siteConfig.modules.serverIp.detail
    }
  }

  const handleCopyIp = async () => {
    if (modules.serverIp.label) {
      const success = await copyToClipboard(modules.serverIp.label)
      if (success) {
        setCopiedIp(true)
        setTimeout(() => setCopiedIp(false), 2000)
      }
    }
  }

  const handleCopyCoc = async () => {
    if (siteConfig.coc?.clanTag) {
      const success = await copyToClipboard(siteConfig.coc.clanTag)
      if (success) {
        setCopiedCoc(true)
        setTimeout(() => setCopiedCoc(false), 2000)
      }
    }
  }

  return (
    <header className="pt-10 pb-8">
      <div className="section-wrap">
        <div className="grid gap-6 lg:grid-cols-3 lg:items-center">
          {/* Left Module: Discord (Shared for Minecraft & CoC) */}
          <div className="flex items-center justify-center gap-4 lg:justify-start">
            {modules.discord.enabled ? (
              <ModuleCard
                title="Discord"
                label={modules.discord.label}
                detail={modules.discord.detail}
                icon={<DiscordIcon />}
                url={modules.discord.url}
              />
            ) : null}
          </div>

          {/* Center Column: Logo + Dual Game Navigation Switcher */}
          <div className="flex flex-col items-center justify-center text-center">
            <Logo
              brandName={preview.brandName}
              tagline={isCoc ? `${siteConfig.coc.clanTag} • CLASH OF CLANS` : preview.tagline}
            />

            {/* Navigation Options: Minecraft & Clash of Clans */}
            <nav
              aria-label="Game Selection Navigation"
              className="mt-4 inline-flex items-center gap-1.5 rounded-2xl border border-purple-500/25 bg-black/50 p-1.5 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
            >
              <Link
                href="/"
                className={`group flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  !isCoc
                    ? "bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-purple-400/50 scale-[1.02]"
                    : "text-white/65 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <CustomMinecraftIcon className="h-4 w-4 transition-transform group-hover:rotate-12" />
                <span>Minecraft</span>
              </Link>

              <Link
                href="/coc"
                className={`group flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  isCoc
                    ? "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.5)] border border-amber-300/50 scale-[1.02]"
                    : "text-white/65 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <CustomCocIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>Clash of Clans</span>
              </Link>
            </nav>
          </div>

          {/* Right Module: Server IP or Clan Tag + Login */}
          <div className="flex items-center justify-center gap-4 lg:justify-end">
            {isCoc ? (
              <ModuleCard
                title="Clan Tag"
                label={siteConfig.coc.clanTag}
                detail={copiedCoc ? "Copied to clipboard!" : `Click to copy • ${siteConfig.coc.clanLevel}`}
                icon={copiedCoc ? <CheckIcon /> : <CustomCocShield className="w-5 h-5 text-amber-400" />}
                onClick={handleCopyCoc}
              />
            ) : modules.serverIp.enabled ? (
              <ModuleCard
                title="Server IP"
                label={modules.serverIp.label}
                detail={copiedIp ? "Copied to clipboard!" : (modules.serverIp.detail ?? "Click to copy")}
                icon={copiedIp ? <CheckIcon /> : <ServerIcon />}
                onClick={handleCopyIp}
              />
            ) : null}
            {user?.isAdmin ? (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-600/30 text-purple-200 border border-purple-400/50 hover:bg-purple-600/50 hover:text-white transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                title="Go to Admin Panel"
              >
                <span>Admin</span>
              </Link>
            ) : null}
            {user ? (
              <button
                type="button"
                onClick={onLoginClick}
                className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-950/60 pl-1.5 pr-3 py-1 text-xs font-semibold text-white hover:border-purple-400 hover:bg-purple-900/60 transition-all shadow-md group cursor-pointer"
                title={`Logged in as ${user.global_name || user.username} (Click to manage account)`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="w-6 h-6 rounded-full border border-purple-400/60"
                />
                <span className="truncate max-w-[100px] text-purple-200 group-hover:text-white">
                  {user.global_name || user.username}
                </span>
              </button>
            ) : (
              <button className="ghost-button" onClick={onLoginClick} type="button">
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
