import { NextResponse } from "next/server"
import {
  getAppBaseUrl,
  getDiscordAvatarUrl,
  signDiscordSession,
  DiscordUser,
  DISCORD_GUILD_ID,
  DISCORD_ADMIN_ROLES,
  DISCORD_MEMBER_ROLE
} from "@/lib/discordAuth"
import { getSessionToken } from "@/lib/adminAuth"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const error = searchParams.get("error")

  const baseUrl = getAppBaseUrl(request)

  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}/?auth_error=${encodeURIComponent(error || "no_code")}`)
  }

  const clientId = process.env.DISCORD_CLIENT_ID
  const clientSecret = process.env.DISCORD_CLIENT_SECRET
  const redirectUri = `${baseUrl}/api/auth/discord/callback`

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${baseUrl}/?auth_error=missing_credentials`)
  }

  try {
    // 1. Exchange code for access token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri
      }).toString()
    })

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text()
      console.error("Discord token exchange failed:", errText)
      return NextResponse.redirect(`${baseUrl}/?auth_error=token_exchange_failed`)
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // 2. Fetch authenticated user profile
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (!userResponse.ok) {
      console.error("Discord user fetch failed:", await userResponse.text())
      return NextResponse.redirect(`${baseUrl}/?auth_error=user_fetch_failed`)
    }

    const discordRaw = await userResponse.json()

    // 3. Fetch user's member object in NAPA Discord server (1226511703483748402)
    const memberResponse = await fetch(
      `https://discord.com/api/users/@me/guilds/${DISCORD_GUILD_ID}/member`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )

    if (memberResponse.status === 404) {
      // User has not joined the NAPA Discord server
      return NextResponse.redirect(`${baseUrl}/?auth_error=not_in_guild`)
    }

    let roles: string[] = []
    let inGuild = false
    if (memberResponse.ok) {
      inGuild = true
      const memberData = await memberResponse.json()
      roles = Array.isArray(memberData.roles) ? memberData.roles : []
    } else {
      console.warn("Could not fetch guild member:", await memberResponse.text())
      return NextResponse.redirect(`${baseUrl}/?auth_error=guild_check_failed`)
    }

    const isAdmin = roles.some((r) => DISCORD_ADMIN_ROLES.includes(r))
    const isMember = roles.includes(DISCORD_MEMBER_ROLE) || isAdmin

    if (!isMember && !isAdmin) {
      // In guild, but missing the required member role (1227272545963741267)
      return NextResponse.redirect(`${baseUrl}/?auth_error=missing_role`)
    }

    const user: DiscordUser = {
      id: discordRaw.id,
      username: discordRaw.username,
      global_name: discordRaw.global_name ?? discordRaw.username,
      avatar: discordRaw.avatar ?? null,
      avatarUrl: getDiscordAvatarUrl(discordRaw.id, discordRaw.avatar),
      email: discordRaw.email ?? null,
      roles,
      isAdmin,
      isMember,
      inGuild,
      joinedAt: Date.now()
    }

    // 4. Set signed session cookie
    const sessionToken = signDiscordSession(user)
    const targetUrl = isAdmin ? `${baseUrl}/?logged_in=1&admin=1` : `${baseUrl}/?logged_in=1`
    const response = NextResponse.redirect(targetUrl)

    response.cookies.set("napa_discord_session", sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/"
    })

    if (isAdmin) {
      // Grant instant admin panel access
      response.cookies.set("admin_session", getSessionToken(), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/"
      })
    }

    response.cookies.delete("discord_oauth_state")
    return response
  } catch (err) {
    console.error("OAuth error:", err)
    return NextResponse.redirect(`${baseUrl}/?auth_error=oauth_internal_error`)
  }
}

