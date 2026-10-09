interface SpoilerRevealProps {
  id: string
  text: string
  expanded: boolean
  revealLabel: string
  hideLabel: string
  contentNotes?: string[]
  onToggle: () => void
}

export function SpoilerReveal({
  id,
  text,
  expanded,
  revealLabel,
  hideLabel,
  contentNotes = [],
  onToggle,
}: SpoilerRevealProps) {
  return (
    <div className={`story-spoiler${expanded ? ' is-revealed' : ''}`}>
      <p aria-hidden={!expanded} className="story-spoiler__text" id={id}>{text}</p>
      {!expanded && (
        <button aria-controls={id} aria-expanded={false} className="story-spoiler__button" onClick={onToggle} type="button">
          {revealLabel}
        </button>
      )}
      {(expanded || contentNotes.length > 0) && <div className="story-spoiler__actions">
        {expanded && (
          <button aria-controls={id} aria-expanded className="story-spoiler__toggle" onClick={onToggle} type="button">
            {hideLabel}
          </button>
        )}
        {contentNotes.map((note) => <span className="story-warning-chip" key={note}>{note}</span>)}
      </div>}
    </div>
  )
}
