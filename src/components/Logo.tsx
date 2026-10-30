import Link from "next/link"
import Image from "next/image"
import { siteConfig } from "@/data/siteConfig"

type LogoProps = {
  brandName?: string
  tagline?: string
}

export default function Logo({ brandName, tagline }: LogoProps) {
  const name = brandName ?? siteConfig.brand.name
  const tag = tagline ?? siteConfig.brand.tagline

  return (
    <Link href="/" className="flex flex-col items-center group">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <Image
            src={siteConfig.brand.logo.src}
            alt={siteConfig.brand.logo.alt}
            width={siteConfig.brand.logo.width}
            height={siteConfig.brand.logo.height}
            priority
            className="h-20 w-auto sm:h-24 lg:h-28 object-contain filter drop-shadow-[0_8px_24px_rgba(168,85,247,0.35)]"
          />
        </div>
        <span className="sr-only">{name}</span>
        <div className="mt-2 text-xs font-semibold tracking-widest text-white text-opacity-80 group-hover:text-opacity-100 transition-opacity">
          {tag}
        </div>
      </div>
    </Link>
  )
}
