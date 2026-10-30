import crypto from "crypto"

export const DISCORD_GUILD_ID = "1226511703483748402"
export const DISCORD_ADMIN_ROLES = ["1543588740935585923", "1227507219323682858"]
export const DISCORD_MEMBER_ROLE = "1227272545963741267"
export const DISCORD_INVITE_URL = "https://dsc.gg/napa"

export interface DiscordUser {
  id: string
  username: string
  global_name: string | null
  avatar: string | null
  avatarUrl: string
  email?: string | null
  roles: string[]
  isAdmin: boolean
  isMember: boolean
  inGuild: boolean
  joinedAt: number
}

const getSecret = () => {
  return process.env.ADMIN_SECRET || "napa-discord-auth-secret-key-321"
}

export function getDiscordAvatarUrl(id: string, avatar: string | null): string {
  if (!avatar) {
    // Discord default avatar calculation based on user ID
    try {
      const index = Number((BigInt(id) >> BigInt(22)) % BigInt(6))
      return `https://cdn.discordapp.com/embed/avatars/${index}.png`
    } catch {
      return "https://cdn.discordapp.com/embed/avatars/0.png"
    }
  }
  const isGif = avatar.startsWith("a_")
  return `https://cdn.discordapp.com/avatars/${id}/${avatar}.${isGif ? "gif" : "png"}?size=128`
}

export function signDiscordSession(user: DiscordUser): string {
  const secret = getSecret()
  const payload = Buffer.from(JSON.stringify(user)).toString("base64url")
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url")
  return `${payload}.${signature}`
}

export function verifyDiscordSession(token: string): DiscordUser | null {
  if (!token || !token.includes(".")) return null
  try {
    const [payload, signature] = token.split(".")
    if (!payload || !signature) return null
    const secret = getSecret()
    const expectedSig = crypto.createHmac("sha256", secret).update(payload).digest("base64url")
    if (signature !== expectedSig) return null

    const json = Buffer.from(payload, "base64url").toString("utf-8")
    return JSON.parse(json) as DiscordUser
  } catch {
    return null
  }
}

export function getAppBaseUrl(req?: Request): string {
  if (req) {
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host")
    const proto = req.headers.get("x-forwarded-proto") || "http"
    if (host) return `${proto}://${host}`
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")
  }
  return "http://localhost:3000"
}
