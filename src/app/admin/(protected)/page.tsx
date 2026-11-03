"use client"

import { useEffect, useState } from "react"
import PageShell from "@/components/PageShell"
import DiscordStatsCard from "@/components/DiscordStatsCard"
import { adminDefaultDraft, ADMIN_STORAGE_KEY, AdminDraft, readAdminDraft } from "@/lib/adminDraft"
import { siteConfig } from "@/data/siteConfig"
import { YoupiOrder } from "@/lib/youpi"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"settings" | "orders">("orders")
  const [draft, setDraft] = useState<AdminDraft>(adminDefaultDraft)
  const [orders, setOrders] = useState<YoupiOrder[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const saved = readAdminDraft()
    if (saved) setDraft(saved)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(draft))
  }, [draft])

  const fetchOrders = async () => {
    setOrdersLoading(true)
    try {
      const res = await fetch("/api/admin/orders")
      if (res.ok) {
        const data = await res.json()
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders)
        }
      }
    } catch (err) {
      console.error("Failed to fetch admin orders:", err)
    } finally {
      setOrdersLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders()
    }
  }, [activeTab])

  const handleOrderAction = async (orderId: string, action: "VERIFY" | "REJECT") => {
    setActionLoading(orderId)
    setMessage(null)
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          action,
          note: action === "VERIFY" ? "Verified via Admin Console" : "Rejected by Admin"
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setMessage(`Order ${orderId} successfully ${action === "VERIFY" ? "verified" : "rejected"}!`)
        fetchOrders()
      } else {
        setMessage(`Error: ${data.error || "Action failed"}`)
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message || "Failed to update order"}`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
    } finally {
      window.location.href = "/admin/login"
    }
  }

  const pendingClaims = orders.filter((o) => o.status === "MANUAL_REVIEW").length
  const completedOrders = orders.filter((o) => o.status === "COMPLETED").length
  const totalRevenue = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, o) => sum + (o.amount || 0), 0)

  return (
    <PageShell subnav={{ label: "Back to Main Page", href: "/", backText: "Back" }}>
      <div className="space-y-6">
        {/* Top Header Bar */}
        <div className="panel-card p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-white text-opacity-60">Admin Console</div>
            <h1 className="mt-1 text-2xl font-semibold uppercase tracking-widest text-white">Dashboard</h1>
            <p className="mt-1 text-xs text-white text-opacity-70">
              Manage NAPA SMP Store settings and real-time NAPA Pay Gateway orders.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="ghost-button text-xs uppercase tracking-widest text-red-300 hover:text-red-200 hover:border-red-500"
              type="button"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-line gap-2">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all rounded-t-lg border-b-2 flex items-center gap-2 ${
              activeTab === "orders"
                ? "border-accentSoft text-white bg-panel/60"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            <span>NAPA Pay Gateway Orders</span>
            {pendingClaims > 0 && (
              <span className="rounded-full bg-amber-500 text-black px-2 py-0.2 text-[10px] font-extrabold animate-pulse">
                {pendingClaims} PENDING
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all rounded-t-lg border-b-2 ${
              activeTab === "settings"
                ? "border-accentSoft text-white bg-panel/60"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            Store & Modules Settings
          </button>
        </div>

        {/* TAB 1: NAPA Pay Gateway Orders */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="panel-card p-4">
                <span className="text-[10px] uppercase tracking-wider text-white/50 block">Total Orders</span>
                <span className="text-2xl font-bold text-white mt-1 block">{orders.length}</span>
              </div>
              <div className="panel-card p-4">
                <span className="text-[10px] uppercase tracking-wider text-white/50 block">Completed</span>
                <span className="text-2xl font-bold text-emerald mt-1 block">{completedOrders}</span>
              </div>
              <div className="panel-card p-4">
                <span className="text-[10px] uppercase tracking-wider text-white/50 block">Pending UTR Claims</span>
                <span className="text-2xl font-bold text-amber-300 mt-1 block">{pendingClaims}</span>
              </div>
              <div className="panel-card p-4">
                <span className="text-[10px] uppercase tracking-wider text-white/50 block">Total Revenue</span>
                <span className="text-2xl font-bold text-purple-300 mt-1 block">₹{totalRevenue}</span>
              </div>
            </div>

            {message && (
              <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-3 text-xs text-purple-200 flex items-center justify-between">
                <span>{message}</span>
                <button onClick={() => setMessage(null)} className="text-white/60 hover:text-white text-sm">✕</button>
              </div>
            )}

            {/* Orders Table Panel */}
            <div className="panel-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Live Transactions & UTR Bank Verifications
                  </h3>
                  <p className="text-[11px] text-white/60 mt-0.5">
                    Compare submitted 12-digit UTR claims with incoming bank SMS/alerts before verification.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchOrders}
                  disabled={ordersLoading}
                  className="ghost-button text-[11px] uppercase tracking-widest px-3 py-1.5"
                >
                  {ordersLoading ? "Refreshing..." : "↻ Refresh"}
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-xs text-white/50">
                  {ordersLoading ? "Loading orders..." : "No payment orders recorded yet. Make a test purchase in the Ranks store!"}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-line text-white/50 uppercase tracking-widest text-[10px]">
                        <th className="py-3 px-2">Order ID</th>
                        <th className="py-3 px-2">Player</th>
                        <th className="py-3 px-2">Rank</th>
                        <th className="py-3 px-2">Amount</th>
                        <th className="py-3 px-2">Bank UTR</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2">Date</th>
                        <th className="py-3 px-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line/40">
                      {orders.map((order) => (
                        <tr key={order.orderId} className="hover:bg-white/[0.02]">
                          <td className="py-3 px-2 font-mono text-[11px] text-purple-300">
                            {order.orderId}
                          </td>
                          <td className="py-3 px-2 font-bold text-white">
                            {order.username}
                          </td>
                          <td className="py-3 px-2 text-white/80">
                            {order.rankName}
                          </td>
                          <td className="py-3 px-2 font-bold text-amber-300">
                            ₹{order.amount}
                          </td>
                          <td className="py-3 px-2 font-mono text-[11px] text-accentSoft">
                            {order.utr || "—"}
                          </td>
                          <td className="py-3 px-2">
                            {order.status === "COMPLETED" && (
                              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald border border-emerald-500/20">
                                COMPLETED
                              </span>
                            )}
                            {order.status === "MANUAL_REVIEW" && (
                              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/20 animate-pulse">
                                REVIEW UTR
                              </span>
                            )}
                            {(order.status === "ACTIVE" || order.status === "INITIATED") && (
                              <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/20">
                                AWAITING
                              </span>
                            )}
                            {order.status === "FAILED" && (
                              <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-[10px] font-bold text-red-400 border border-red-500/20">
                                FAILED
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-2 text-white/50 text-[10px]">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </td>
                          <td className="py-3 px-2 text-right">
                            {order.status !== "COMPLETED" ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  disabled={actionLoading === order.orderId}
                                  onClick={() => handleOrderAction(order.orderId, "VERIFY")}
                                  className="primary-button text-[10px] uppercase tracking-wider px-2.5 py-1"
                                >
                                  {actionLoading === order.orderId ? "..." : "Verify ✓"}
                                </button>
                                <button
                                  type="button"
                                  disabled={actionLoading === order.orderId}
                                  onClick={() => handleOrderAction(order.orderId, "REJECT")}
                                  className="ghost-button text-[10px] uppercase tracking-wider px-2 py-1 text-red-300 hover:text-red-200"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-emerald font-bold">Delivered</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Gateway Integration Info Panel */}
            <div className="rounded-2xl border border-line bg-midnight p-5 space-y-3 text-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                NAPA Pay Gateway Configuration
              </h4>
              <div className="grid gap-2 sm:grid-cols-3 font-mono text-[11px] text-white/70">
                <div>
                  <span className="block text-[10px] uppercase text-white/40">Webhook Endpoint:</span>
                  <code className="text-purple-300">/api/payment/webhook</code>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-white/40">Merchant ID:</span>
                  <code className="text-white">napa_smp</code>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-white/40">UPI Merchant VPA:</span>
                  <code className="text-emerald">playnapa@upi</code>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Store & Settings (Existing) */}
        {activeTab === "settings" && (
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
        )}
      </div>
    </PageShell>
  )
}
