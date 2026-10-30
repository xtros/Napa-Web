import { NextResponse } from "next/server"
import { siteConfig } from "@/data/siteConfig"

const COC_API = "https://api.clashofclans.com/v1"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tagParam = searchParams.get("tag") || process.env.COC_CLAN_TAG || siteConfig.coc?.clanTag || "#2J9GGJJPQ"
  const token = process.env.COC_API_TOKEN

  if (!token) {
    return NextResponse.json({ error: "Missing COC_API_TOKEN in server configuration" }, { status: 500 })
  }

  const cleanTag = tagParam.startsWith("#") ? tagParam : `#${tagParam}`
  const encodedTag = encodeURIComponent(cleanTag)
  const forceRefresh = searchParams.get("refresh") === "1"

  try {
    const response = await fetch(`${COC_API}/clans/${encodedTag}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      },
      ...(forceRefresh ? { cache: "no-store" } : { next: { revalidate: 30 } })
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: "Supercell API error", status: response.status, details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch from Supercell API" }, { status: 500 })
  }
}

