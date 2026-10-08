import { useEffect, useState, type ReactNode } from 'react'
import { ReactLenis } from 'lenis/react'

interface SmoothScrollProviderProps {
  children: ReactNode
}

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReducedMotion(mediaQuery.matches)

    mediaQuery.addEventListener('change', updatePreference)
    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  return reducedMotion
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const reducedMotion = usePrefersReducedMotion()

  if (reducedMotion) return children

  return (
    <ReactLenis root options={{ lerp: 0.1, autoRaf: true }}>
      {children}
    </ReactLenis>
  )
}
