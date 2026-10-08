import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useScrollLock } from '../scroll/useScrollLock'

const navigation = [
  { to: '/characters', label: 'Characters' },
  { to: '/story', label: 'Story' },
  { to: '/meta', label: 'Meta' },
]

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  useScrollLock(menuOpen)

  useEffect(() => {
    if (menuOpen) menuRef.current?.querySelector<HTMLElement>('a')?.focus()
  }, [menuOpen])

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      setMenuOpen(false)
      toggleRef.current?.focus()
      return
    }
    if (event.key !== 'Tab') return

    const items = [toggleRef.current, ...Array.from(menuRef.current?.querySelectorAll<HTMLElement>('a') ?? [])]
      .filter((item): item is HTMLElement => item !== null)
    const first = items[0]
    const last = items[items.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header" onKeyDown={menuOpen ? handleMenuKeyDown : undefined}>
      <Link aria-label="Suitcase Archive home" className="wordmark" to="/" onClick={closeMenu}>
        <svg aria-hidden="true" className="wordmark-mark" viewBox="0 0 32 32">
          <rect x="5" y="11" width="22" height="16" rx="2" />
          <path d="M11 11V7h10v4M5 17h22M13 17v3m6-3v3" />
        </svg>
        <span>Suitcase Archive</span>
      </Link>
      <button
        aria-expanded={menuOpen}
        aria-controls="site-navigation"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        className="menu-toggle"
        ref={toggleRef}
        onClick={() => setMenuOpen((open) => !open)}
        type="button"
      >
        {menuOpen ? 'Close' : 'Menu'}
      </button>
      <nav
        aria-label="Main navigation"
        aria-modal={menuOpen || undefined}
        className={`site-nav${menuOpen ? ' is-open' : ''}`}
        data-lenis-prevent
        id="site-navigation"
        ref={menuRef}
        role={menuOpen ? 'dialog' : undefined}
      >
        {navigation.map(({ to, label }) => (
          <NavLink
            key={to}
            className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
            onClick={closeMenu}
            to={to}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
