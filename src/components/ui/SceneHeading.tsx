interface SceneHeadingProps {
  id?: string
  scene: string | number
  label: string
  title: string
  number?: string | number
  className?: string
}

function formatNumber(number: string | number) {
  return String(number).padStart(2, '0')
}

export function SceneHeading({ id, scene, label, title, number, className = '' }: SceneHeadingProps) {
  return (
    <header className={`ui-scene-heading${className ? ` ${className}` : ''}`}>
      <p className="ui-scene-heading__scene">
        SCENE {String(scene).padStart(2, '0')} — {label}
      </p>
      <h2 className="ui-scene-heading__title" id={id}>{title}</h2>
      {number !== undefined && (
        <span aria-hidden="true" className="ui-scene-heading__number">
          {formatNumber(number)}
        </span>
      )}
    </header>
  )
}
