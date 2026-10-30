import { NextResponse } from "next/server"
import { getAppBaseUrl } from "@/lib/discordAuth"

export async function GET(request: Request) {
  const clientId = process.env.DISCORD_CLIENT_ID
  const baseUrl = getAppBaseUrl(request)
  const redirectUri = `${baseUrl}/api/auth/discord/callback`

  if (!clientId) {
    // If credentials are not yet configured in .env.local, redirect with helpful prompt
    return NextResponse.redirect(`${baseUrl}/?auth_error=missing_credentials`)
  }

  const state = crypto.randomUUID()
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "identify email guilds.members.read",
    state: state
  })

  const discordAuthUrl = `https://discord.com/oauth2/authorize?${params.toString()}`

  const response = NextResponse.redirect(discordAuthUrl)
  response.cookies.set("discord_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10,
    path: "/"
  })

  return response
}

