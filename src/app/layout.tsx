import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "NAPA",
  description: "Official store and community platform for NAPA Minecraft SMP.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/assets/branding/napa_logo.png", type: "image/png" }
    ],
    shortcut: "/icon.png",
    apple: "/assets/branding/napa_logo.png"
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative min-h-screen overflow-x-hidden">
        {/* Animated Gradient Aurora Orbs */}
        <div className="bg-ambient-glow" aria-hidden="true">
          <div className="glow-orb glow-orb-1" />
          <div className="glow-orb glow-orb-2" />
          <div className="glow-orb glow-orb-3" />
          <div className="glow-orb glow-orb-4" />
        </div>
        {children}
      </body>
    </html>
  )
}
