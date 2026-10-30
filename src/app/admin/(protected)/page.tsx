"use client"

import { useEffect, useState } from "react"
import PageShell from "@/components/PageShell"
import DiscordStatsCard from "@/components/DiscordStatsCard"
import { adminDefaultDraft, ADMIN_STORAGE_KEY, AdminDraft, readAdminDraft } from "@/lib/adminDraft"
import { siteConfig } from "@/data/siteConfig"

export default function AdminPage() {
  const [draft, setDraft] = useState<AdminDraft>(adminDefaultDraft)

  useEffect(() => {
    const saved = readAdminDraft()
    if (saved) setDraft(saved)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(draft))
  }, [draft])

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
    } finally {
      window.location.href = "/admin/login"
    }
  }

  return (
    <PageShell subnav={{ label: "Back to Main Page", href: "/", backText: "Back" }}>
      <div className="space-y-6">
        <div className="panel-card p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-white text-opacity-60">Admin</div>
            <h1 className="mt-2 text-2xl font-semibold uppercase tracking-widest">Dashboard</h1>
            <p className="mt-2 text-sm text-white text-opacity-70">
              Minimal settings. Changes auto-save locally for preview on this device.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="ghost-button self-start sm:self-auto text-xs uppercase tracking-widest text-red-300 hover:text-red-200 hover:border-red-500"
            type="button"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="panel-card p-6 space-y-6">
            <div>
              <div className="text-xs uppercase tracking-widest text-white text-opacity-60">Store</div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white text-opacity-60">Brand Name</label>
                  <input
                    className="input-field"
                    value={draft.brandName}
                    onChange={(event) => setDraft((prev) => ({ ...prev, brandName: event.target.value }))}
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white text-opacity-60">Tagline</label>
                  <input
                    className="input-field"
                    value={draft.tagline}
                    onChange={(event) => setDraft((prev) => ({ ...prev, tagline: event.target.value }))}
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white text-opacity-60">Discord Invite</label>
                  <input
                    className="input-field"
                    value={draft.discordInvite}
                    onChange={(event) => setDraft((prev) => ({ ...prev, discordInvite: event.target.value }))}
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white text-opacity-60">Discord URL</label>
                  <input
                    className="input-field"
                    value={draft.discordUrl}
                    onChange={(event) => setDraft((prev) => ({ ...prev, discordUrl: event.target.value }))}
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white text-opacity-60">Server IP</label>
                  <input
                    className="input-field"
                    value={draft.serverIp}
                    onChange={(event) => setDraft((prev) => ({ ...prev, serverIp: event.target.value }))}
                    type="text"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-line pt-6">
              <div className="text-xs uppercase tracking-widest text-white text-opacity-60">Modules</div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <button
                  className={`panel-card flex items-center justify-between px-4 py-3 ${
                    draft.modules.discord ? "border-accent" : ""
                  }`}
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      modules: { ...prev.modules, discord: !prev.modules.discord }
                    }))
                  }
                  type="button"
                >
                  <span className="text-sm font-semibold">Discord Module</span>
                  <span className={`toggle ${draft.modules.discord ? "toggle-on" : ""}`}>
                    <span className="toggle-handle" />
                  </span>
                </button>
                <button
                  className={`panel-card flex items-center justify-between px-4 py-3 ${
                    draft.modules.serverIp ? "border-accent" : ""
                  }`}
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      modules: { ...prev.modules, serverIp: !prev.modules.serverIp }
                    }))
                  }
                  type="button"
                >
                  <span className="text-sm font-semibold">Server IP Module</span>
                  <span className={`toggle ${draft.modules.serverIp ? "toggle-on" : ""}`}>
                    <span className="toggle-handle" />
                  </span>
                </button>
              </div>
            </div>

            <div className="border-t border-line pt-6">
              <div className="text-xs uppercase tracking-widest text-white text-opacity-60">Highlights</div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white text-opacity-60">Target Tile</label>
                  <select
                    className="input-field"
                    value={draft.badgeTileId}
                    onChange={(event) => setDraft((prev) => ({ ...prev, badgeTileId: event.target.value }))}
                  >
                    {siteConfig.tiles.map((tile) => (
                      <option key={tile.id} value={tile.id} className="bg-panel">
                        {tile.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white text-opacity-60">Badge Text</label>
                  <input
                    className="input-field"
                    value={draft.badgeText}
                    onChange={(event) => setDraft((prev) => ({ ...prev, badgeText: event.target.value }))}
                    type="text"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-line pt-6 flex flex-wrap gap-3">
              <button
                className="ghost-button"
                onClick={() => {
                  setDraft(adminDefaultDraft)
                  if (typeof window !== "undefined") {
                    window.localStorage.removeItem(ADMIN_STORAGE_KEY)
                  }
                }}
                type="button"
              >
                Reset to Defaults
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <DiscordStatsCard inviteOverride={draft.discordInvite} />
            <div className="panel-card p-6">
              <div className="text-xs uppercase tracking-widest text-white text-opacity-60">Local Preview</div>
              <p className="mt-2 text-sm text-white text-opacity-70">
                Stored locally in your browser. To ship changes, copy values into `src/data/siteConfig.ts`.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
