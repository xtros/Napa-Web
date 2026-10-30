import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { verifyDiscordSession } from "@/lib/discordAuth"

export async function GET() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("napa_discord_session")?.value

  if (!sessionToken) {
    return NextResponse.json({ loggedIn: false, user: null })
  }

  const user = verifyDiscordSession(sessionToken)
  if (!user) {
    return NextResponse.json({ loggedIn: false, user: null })
  }

  return NextResponse.json({
    loggedIn: true,
    user
  })
}

