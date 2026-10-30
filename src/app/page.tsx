import PageShell from "@/components/PageShell"
import HomeTilesClient from "@/components/HomeTilesClient"
import { getServerStatus, ServerStatusResponse } from "@/app/api/status/route"

export const revalidate = 10

export default async function HomePage() {
  let initialServerStatus: ServerStatusResponse | null = null
  try {
    initialServerStatus = await getServerStatus()
  } catch (err) {
    console.warn("SSR server status fetch error:", err)
  }

  return (
    <PageShell>
      <HomeTilesClient initialServerStatus={initialServerStatus} />
    </PageShell>
  )
}
