interface SceneHeadingProps {
  id?: string
  title: string
  className?: string
}

export function SceneHeading({ id, title, className = '' }: SceneHeadingProps) {
  return (
    <header className={`ui-scene-heading${className ? ` ${className}` : ''}`}>
      <h2 className="ui-scene-heading__title" id={id}>{title}</h2>
    </header>
  )
}
