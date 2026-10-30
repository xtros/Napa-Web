import { NextResponse } from "next/server"
import { getSessionToken, isAuthConfigured, verifyPassword } from "@/lib/adminAuth"

export async function POST(request: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json({ error: "Admin auth not configured" }, { status: 500 })
  }

  const body = await request.json().catch(() => null)
  const password = body?.password

  if (!password || typeof password !== "string") {
    return NextResponse.json({ error: "Missing password" }, { status: 400 })
  }

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set({
    name: "admin_session",
    value: getSessionToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/"
  })

  return response
}
