/**
 * Copies text to the clipboard with full fallback support.
 * Works in secure contexts (HTTPS / localhost), non-secure contexts (HTTP / IP addresses),
 * and restrictive webviews / mobile browsers where navigator.clipboard is unavailable or restricted.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === "undefined" || !text) return false

  // 1. Modern Clipboard API (supported in secure contexts)
  if (typeof navigator !== "undefined" && navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fall through to fallback if writeText fails/rejects
    }
  }

  // 2. execCommand fallback (works in HTTP, IP addresses, older browsers, and webviews)
  try {
    const textArea = document.createElement("textarea")
    textArea.value = text
    textArea.style.position = "fixed"
    textArea.style.top = "0"
    textArea.style.left = "-9999px"
    textArea.style.opacity = "0"
    textArea.setAttribute("readonly", "")
    document.body.appendChild(textArea)

    textArea.focus()
    textArea.select()
    textArea.setSelectionRange(0, text.length)

    const successful = document.execCommand("copy")
    document.body.removeChild(textArea)
    return successful
  } catch (err) {
    console.warn("Clipboard fallback error:", err)
    return false
  }
}

