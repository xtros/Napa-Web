import { NextResponse } from "next/server"

const DISCORD_API = "https://discord.com/api/v10"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.json({ error: "Missing invite code" }, { status: 400 })
  }

  try {
    const safeCode = encodeURIComponent(code)
    const response = await fetch(`${DISCORD_API}/invites/${safeCode}?with_counts=true&with_expiration=true`, {
      cache: "no-store"
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Discord fetch failed" }, { status: 502 })
    }

    const data = await response.json()

    return NextResponse.json({
      invite: data.code ?? code,
      guild: data.guild?.name ?? null,
      members: data.approximate_member_count ?? null,
      online: data.approximate_presence_count ?? null
    })
  } catch (error) {
    return NextResponse.json({ error: "Discord request error" }, { status: 500 })
  }
}
