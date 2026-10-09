import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { legal, site } from '../data'
import { Button } from '../components/ui'
import { useScrollLock } from '../scroll/useScrollLock'

const DURATION = 14_000

interface DisclaimerLoaderProps {
  onDismiss: () => void
}

export function DisclaimerLoader({ onDismiss }: DisclaimerLoaderProps) {
  const [elapsed, setElapsed] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [closing, setClosing] = useState(false)
  const dialogRef = useRef<HTMLElement>(null)
  const enterRef = useRef<HTMLButtonElement>(null)
  useScrollLock(true)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const start = Date.now()
    const timer = window.setInterval(() => setElapsed(Math.min(Date.now() - start, DURATION)), 50)
    return () => window.clearInterval(timer)
  }, [reducedMotion])

  const clock = reducedMotion ? DURATION : elapsed
  const complete = clock >= DURATION
  const canSkip = clock >= 4_000
  const visibleLines = reducedMotion
    ? legal.launchLines.length
    : Math.min(legal.launchLines.length, Math.floor((clock / DURATION) * legal.launchLines.length) + 1)

  useEffect(() => {
    if (complete) enterRef.current?.focus()
    else dialogRef.current?.focus()
  }, [complete])

  const dismiss = () => {
    if (closing) return
    setClosing(true)
    window.setTimeout(onDismiss, reducedMotion ? 0 : 350)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape' && canSkip) {
      event.preventDefault()
      dismiss()
    }
    if (event.key !== 'Tab') return
    const actions = dialogRef.current?.querySelectorAll<HTMLElement>('[data-loader-action]') ?? []
    const first = actions[0]
    const last = actions[actions.length - 1]
    if (!first) {
      event.preventDefault()
    } else if (document.activeElement === dialogRef.current) {
      event.preventDefault()
      const target = event.shiftKey ? last : first
      target.focus()
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <section
      aria-label="Project disclaimer"
      aria-modal="true"
      className={`disclaimer-loader${closing ? ' is-closing' : ''}`}
      onKeyDown={handleKeyDown}
      ref={dialogRef}
      role="dialog"
      tabIndex={-1}
    >
      <div aria-hidden="true" className="disclaimer-loader__bar disclaimer-loader__bar--top" />
      <div aria-hidden="true" className="disclaimer-loader__bar disclaimer-loader__bar--bottom" />
      <div className="disclaimer-loader__content" data-lenis-prevent>
        <h1>Before you enter</h1>
        <ol aria-live="polite" className="disclaimer-loader__lines">
          {legal.launchLines.slice(0, visibleLines).map(({ status, text }, index) => (
            <li key={text} style={{ animationDelay: `${index * 18}ms` }}>
              <span className={`disclaimer-loader__status disclaimer-loader__status--${status.toLowerCase()}`}>[ {status} ]</span>
              <span>{text.replace('version 3.8', `version ${site.gameVersion}`)}</span>
            </li>
          ))}
        </ol>
        <div
          aria-label="Loading disclaimer"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={Math.round((clock / DURATION) * 100)}
          className="disclaimer-loader__progress"
          role="progressbar"
        >
          {legal.launchLines.map((_, index) => (
            <span key={index} className={index < Math.ceil((clock / DURATION) * legal.launchLines.length) ? 'is-filled' : ''} />
          ))}
        </div>
        <div className="disclaimer-loader__actions">
          {complete ? (
            <Button autoFocus data-loader-action onClick={dismiss} ref={enterRef}>Enter the Archive</Button>
          ) : canSkip ? (
            <Button data-loader-action onClick={dismiss} variant="secondary">Skip</Button>
          ) : null}
        </div>
      </div>
    </section>
  )
}
