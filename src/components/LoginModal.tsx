"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { DiscordUser } from "@/lib/discordAuth"

type LoginModalProps = {
  open: boolean
  onClose: () => void
}

const DiscordClydeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
)

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const [user, setUser] = useState<DiscordUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const err = params.get("auth_error")
      if (err) setAuthError(err)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    let active = true
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (active && data?.loggedIn && data?.user) {
          setUser(data.user)
        } else if (active) {
          setUser(null)
        }
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [open])

  const handleLogout = async () => {
    setLoading(true)
    try {
      await fetch("/api/auth/discord/logout", { method: "POST" })
      setUser(null)
      window.location.reload()
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="panel-card w-full max-w-md p-6 sm:p-7 relative border border-purple-500/30 shadow-[0_0_50px_rgba(88,101,242,0.25)] animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#5865F2]/20 text-[#5865F2] border border-[#5865F2]/40">
              <DiscordClydeIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold uppercase tracking-wider text-white">
                {user ? "Discord Profile" : "Discord Player Login"}
              </div>
              <div className="text-xs text-white/50">NAPA SMP Verification</div>
            </div>
          </div>
          <button
            className="ghost-button h-8 w-8 px-0 text-white/70 hover:text-white"
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Discord Membership Error Alert */}
        {authError === "not_in_guild" && !user ? (
          <div className="mt-5 p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs space-y-2">
            <div className="font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
              <span>⚠️ Discord Server Membership Required</span>
            </div>
            <p>
              To access this website and NAPA SMP, you must first join our official Discord server!
            </p>
            <div className="pt-1">
              <a
                href="https://dsc.gg/napa"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold uppercase tracking-wider text-xs transition-colors shadow-md"
              >
                <DiscordClydeIcon className="w-4 h-4" />
                <span>Join Discord (dsc.gg/napa)</span>
              </a>
            </div>
          </div>
        ) : authError === "missing_role" && !user ? (
          <div className="mt-5 p-4 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs space-y-2">
            <div className="font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <span>⚠️ Member Role Required</span>
            </div>
            <p>
              You are in our Discord, but need the verified Member role to access website features. Please verify in Discord!
            </p>
            <div className="pt-1">
              <a
                href="https://dsc.gg/napa"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold uppercase tracking-wider text-xs transition-colors"
              >
                <span>Open Discord to Verify</span>
              </a>
            </div>
          </div>
        ) : null}

        {/* Content */}
        {user ? (
          <div className="mt-6 space-y-5">
            <div className="p-4 rounded-2xl bg-black/40 border border-purple-500/30 flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-14 h-14 rounded-full border-2 border-purple-400/60 shadow-md"
              />
              <div className="overflow-hidden space-y-1">
                <div className="flex flex-wrap gap-1.5">
                  {user.isAdmin ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/25 text-purple-300 text-[10px] font-bold uppercase tracking-wider border border-purple-500/40">
                      ★ Administrator
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/40">
                      ✓ Verified Member
                    </span>
                  )}
                </div>
                <div className="text-base font-bold text-white truncate">
                  {user.global_name || user.username}
                </div>
                <div className="text-xs font-mono text-white/50 truncate">
                  @{user.username}
                </div>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed text-center">
              {user.isAdmin
                ? "You have Administrator privileges based on your Discord roles. You have full access to the Admin Panel."
                : "Your Discord membership is verified in NAPA SMP. Roles and store deliveries are synced."}
            </p>

            {user.isAdmin ? (
              <div className="pt-1">
                <Link
                  href="/admin"
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:brightness-110 transition-all"
                >
                  <span>Open Admin Dashboard &rarr;</span>
                </Link>
              </div>
            ) : null}

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors disabled:opacity-50"
              >
                {loading ? "Signing out..." : "Log Out"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed text-center">
              To access website features and store checkout, players must join the official NAPA SMP Discord server.
            </p>

            {/* Main Discord OAuth Button */}
            <a
              href="/api/auth/discord/login"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm text-white bg-[#5865F2] hover:bg-[#4752C4] shadow-[0_0_25px_rgba(88,101,242,0.45)] transition-all transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <DiscordClydeIcon className="w-5 h-5 text-white" />
              <span>Login with Discord</span>
            </a>

            <div className="text-[11px] text-white/50 text-center">
              Requires membership in NAPA SMP Discord (dsc.gg/napa)
            </div>

            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-white/40 hover:text-white uppercase tracking-wider transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
