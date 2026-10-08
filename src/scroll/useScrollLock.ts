import { useEffect } from 'react'
import { useLenis } from 'lenis/react'

const activeLocks = new Set<symbol>()
let previousOverflow: string | null = null
let lockedLenis: ReturnType<typeof useLenis>

export function useScrollLock(locked: boolean) {
  const lenis = useLenis()

  useEffect(() => {
    if (!locked) return

    const token = Symbol('scroll-lock')
    if (activeLocks.size === 0) {
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      lockedLenis = lenis
      lockedLenis?.stop()
    } else if (!lockedLenis && lenis) {
      lockedLenis = lenis
      lockedLenis.stop()
    }

    activeLocks.add(token)
    return () => {
      activeLocks.delete(token)
      if (activeLocks.size > 0) return

      document.body.style.overflow = previousOverflow ?? ''
      lockedLenis?.start()
      previousOverflow = null
      lockedLenis = undefined
    }
  }, [lenis, locked])
}
