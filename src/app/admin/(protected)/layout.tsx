import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getSessionToken, isAuthConfigured } from "@/lib/adminAuth"
import { verifyDiscordSession } from "@/lib/discordAuth"

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const session = cookieStore.get("admin_session")?.value
  const discordSession = cookieStore.get("napa_discord_session")?.value

  const isPasswordAdmin = Boolean(session && isAuthConfigured() && session === getSessionToken())
  let isDiscordAdmin = false

  if (discordSession) {
    const user = verifyDiscordSession(discordSession)
    if (user && user.isAdmin) {
      isDiscordAdmin = true
    }
  }

  if (!isPasswordAdmin && !isDiscordAdmin) {
    redirect("/admin/login")
  }

  return <>{children}</>
}
