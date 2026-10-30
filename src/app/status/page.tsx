import PageShell from "@/components/PageShell"
import StatusPageClient from "@/components/StatusPageClient"
import { getServerStatus, ServerStatusResponse } from "@/app/api/status/route"

export const revalidate = 10

export default async function StatusPage() {
  let initialStatus: ServerStatusResponse | null = null
  try {
    initialStatus = await getServerStatus()
  } catch (err) {
    console.warn("StatusPage SSR fetch error:", err)
  }

  return (
    <PageShell subnav={{ label: "Back to Main Page", href: "/", backText: "Back" }}>
      <StatusPageClient initialStatus={initialStatus} />
    </PageShell>
  )
}

