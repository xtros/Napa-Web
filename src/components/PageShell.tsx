"use client"

import { ReactNode, useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import LoginModal from "@/components/LoginModal"
import Link from "next/link"

type SubnavConfig = {
  label?: string
  href?: string
  backText?: string
}

type PageShellProps = {
  children: ReactNode
  subnav?: SubnavConfig
}

export default function PageShell({ children, subnav }: PageShellProps) {
  const [loginOpen, setLoginOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <Header onLoginClick={() => setLoginOpen(true)} />
      {subnav ? (
        <div className="section-wrap mb-10">
          <div className="panel-card flex items-center px-5 py-4">
            <Link
              href={subnav.href ?? "/"}
              className="group flex items-center gap-3 text-sm uppercase tracking-widest text-white/80 hover:text-white transition-colors"
            >
              <span className="ghost-button group-hover:border-accentSoft group-hover:text-accentSoft transition-colors" aria-hidden="true">
                {subnav.backText ?? "Back"}
              </span>
              <span>{subnav.label ?? "Back to Main Page"}</span>
            </Link>
          </div>
        </div>
      ) : null}
      <main className="section-wrap pb-20">{children}</main>
      <Footer />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  )
}
