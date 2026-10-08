import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useLenis } from 'lenis/react'

const HEADER_GAP = 6

export function ScrollToTop() {
  const lenis = useLenis()
  const { pathname, search, hash } = useLocation()
  const previousRoute = useRef({ pathname, search })

  useEffect(() => {
    const routeChanged = previousRoute.current.pathname !== pathname || previousRoute.current.search !== search
    previousRoute.current = { pathname, search }
    if (routeChanged) {
      lenis?.scrollTo(0, { force: true, immediate: true })
      window.scrollTo(0, 0)
    }
    const fragment = hash || window.location.hash
    if (!fragment) return

    const id = decodeURIComponent(fragment.slice(1))
    let timeout = 0
    const scrollToAnchor = () => {
      const target = document.getElementById(id)
      if (target) {
        observer.disconnect()
        timeout = window.setTimeout(() => {
          const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0
          const destination = target.getBoundingClientRect().top + window.scrollY - headerHeight - HEADER_GAP
          lenis?.scrollTo(destination, { force: true, immediate: true })
          window.scrollTo(0, destination)
        }, 100)
      }
    }

    const observer = new MutationObserver(scrollToAnchor)
    observer.observe(document.body, { childList: true, subtree: true })
    scrollToAnchor()
    return () => {
      observer.disconnect()
      window.clearTimeout(timeout)
    }
  }, [hash, lenis, pathname, search])

  return null
}
