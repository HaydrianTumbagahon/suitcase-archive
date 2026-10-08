import type { ReactNode } from 'react'

interface PageFrameProps {
  scene: string
  serial: string
  title: string
  intro?: string
  children?: ReactNode
}

export function PageFrame({ scene, serial, title, intro, children }: PageFrameProps) {
  return (
    <article className="page-frame">
      <div className="scene-label">{scene}</div>
      <div className="serial-number">{serial}</div>
      <h1>{title}</h1>
      {intro && <p className="page-intro">{intro}</p>}
      {children}
    </article>
  )
}
