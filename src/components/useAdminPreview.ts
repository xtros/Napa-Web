"use client"

import { useEffect, useState } from "react"
import { ADMIN_STORAGE_KEY, adminDefaultDraft, readAdminDraft } from "@/lib/adminDraft"

export default function useAdminPreview() {
  const [preview, setPreview] = useState(adminDefaultDraft)

  useEffect(() => {
    const saved = readAdminDraft()
    if (saved) setPreview(saved)
  }, [])

  useEffect(() => {
    const handler = (event: StorageEvent) => {
      if (event.key !== ADMIN_STORAGE_KEY) return
      const saved = readAdminDraft()
      if (saved) setPreview(saved)
    }

    window.addEventListener("storage", handler)
    return () => window.removeEventListener("storage", handler)
  }, [])

  return preview
}
