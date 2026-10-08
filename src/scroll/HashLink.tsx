import { useCallback, type MouseEvent, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLenis } from 'lenis/react'

const HEADER_GAP = 6

interface HashLinkProps {
  to: string
  children: ReactNode
  className?: string
}

export function HashLink({ to, children, className }: HashLinkProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const lenis = useLenis()

  const handleClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    const destination = new URL(to, window.location.origin)
    if (!destination.hash) return
    if (destination.pathname !== location.pathname || destination.search !== location.search) return

    const target = document.getElementById(decodeURIComponent(destination.hash.slice(1)))
    if (!target) return

    event.preventDefault()
    navigate(to)
    window.setTimeout(() => {
      const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0
      const destinationY = target.getBoundingClientRect().top + window.scrollY - headerHeight - HEADER_GAP
      lenis?.scrollTo(destinationY, { force: true, immediate: true })
      window.scrollTo(0, destinationY)
    }, 100)
  }, [lenis, location.pathname, location.search, navigate, to])

  return <Link className={className} to={to} onClick={handleClick}>{children}</Link>
}
