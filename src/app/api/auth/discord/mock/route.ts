import { NextResponse } from "next/server"
import {
  signDiscordSession,
  DiscordUser,
  DISCORD_ADMIN_ROLES,
  DISCORD_MEMBER_ROLE
} from "@/lib/discordAuth"
import { getSessionToken } from "@/lib/adminAuth"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const username = body.username || "NapaPlayer"
  const roleType = body.roleType || "member" // "admin" | "member"

  const isAdmin = roleType === "admin"
  const roles = isAdmin ? DISCORD_ADMIN_ROLES : [DISCORD_MEMBER_ROLE]

  const mockUser: DiscordUser = {
    id: "123456789012345678",
    username: username,
    global_name: username,
    avatar: null,
    avatarUrl: "https://cdn.discordapp.com/embed/avatars/0.png",
    email: `${username.toLowerCase()}@napasmp.fun`,
    roles,
    isAdmin,
    isMember: true,
    inGuild: true,
    joinedAt: Date.now()
  }

  const sessionToken = signDiscordSession(mockUser)
  const response = NextResponse.json({ ok: true, user: mockUser })
  response.cookies.set("napa_discord_session", sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/"
  })

  if (isAdmin) {
    response.cookies.set("admin_session", getSessionToken(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/"
    })
  }

  return response
}
