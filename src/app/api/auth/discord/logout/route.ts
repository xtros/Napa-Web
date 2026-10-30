import { NextResponse } from "next/server"
import { getAppBaseUrl } from "@/lib/discordAuth"

export async function POST(request: Request) {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete("napa_discord_session")
  return response
}

export async function GET(request: Request) {
  const baseUrl = getAppBaseUrl(request)
  const response = NextResponse.redirect(`${baseUrl}/`)
  response.cookies.delete("napa_discord_session")
  return response
}

