import useAdminPreview from "@/components/useAdminPreview"
import { siteConfig } from "@/data/siteConfig"
import Logo from "@/components/Logo"

export default function Footer() {
  const preview = useAdminPreview()
  return (
    <footer className="mt-16 border-t border-line bg-panel bg-opacity-90">
      <div className="section-wrap py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4 text-sm text-white text-opacity-70">
            <p>{siteConfig.footer.copyright}</p>
            <p>{siteConfig.footer.legal}</p>
            <div className="flex flex-wrap gap-4 text-xs uppercase tracking-widest">
              {siteConfig.footer.links.map((link) => (
                <a key={link.label} href={link.href} className="text-white text-opacity-70 hover:text-opacity-100">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div className="flex justify-start lg:justify-end">
            <Logo brandName={preview.brandName} tagline={preview.tagline} />
          </div>
        </div>
      </div>
    </footer>
  )
}
