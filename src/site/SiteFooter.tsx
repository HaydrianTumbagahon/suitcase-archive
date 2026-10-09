import { legal, site } from '../data'
import { Link } from 'react-router-dom'

export function SiteFooter() {
  const copy = legal.footer
  const hasGitHubUrl = Boolean(site.githubUrl)

  return (
    <footer className="site-footer">
      <div className="site-footer__main">
        <section aria-label={site.name} className="site-footer__brand">
          <Link aria-label={`${site.name} home`} className="wordmark" to="/">
            <span>{site.name}</span>
          </Link>
          <p>{copy.description}</p>
        </section>
        <nav aria-label={copy.navigationLabel} className="site-footer__navigation">
          {site.footerNavigation.map(({ label, path }) => (
            <Link key={path} to={path}>{label}</Link>
          ))}
          {hasGitHubUrl && (
            <a aria-label={copy.githubAriaLabel} href={site.githubUrl} rel="noopener noreferrer" target="_blank">
              {copy.githubLabel}
            </a>
          )}
        </nav>
        <section aria-label={copy.noticesLabel} className="site-footer__notices">
          {copy.notices.map((notice) => <p key={notice}>{notice}</p>)}
        </section>
      </div>
      <div className="site-footer__bottom">
        <p>{copy.createdBy} {site.creator}</p>
        <p>{copy.updatedFor} {site.gameVersion}</p>
      </div>
    </footer>
  )
}
