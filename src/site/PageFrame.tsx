import type { ReactNode } from 'react'

interface PageFrameProps {
  title: string
  intro?: string
  children?: ReactNode
}

export function PageFrame({ title, intro, children }: PageFrameProps) {
  return (
    <article className="page-frame">
      <h1>{title}</h1>
      {intro && <p className="page-intro">{intro}</p>}
      {children}
    </article>
  )
}
