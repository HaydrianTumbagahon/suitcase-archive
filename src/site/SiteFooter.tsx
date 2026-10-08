import { legal, site } from '../data'
import { Marquee } from '../components/ui'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__details">
        <p>{legal.disclaimerLines.join(' ')}</p>
        <p>Updated for version {site.gameVersion} · Story sections contain spoilers.</p>
      </div>
      <Marquee className="site-footer__marquee" label="Unofficial fan-made non-commercial project">
        <span>UNOFFICIAL</span><span aria-hidden="true"> • </span>
        <span>FAN-MADE</span><span aria-hidden="true"> • </span>
        <span>NON-COMMERCIAL</span>
      </Marquee>
    </footer>
  )
}
