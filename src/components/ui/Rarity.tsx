interface RarityProps {
  value: number | null
  className?: string
}

export function Rarity({ value, className = '' }: RarityProps) {
  if (value === null) {
    return <span className={`ui-rarity ui-rarity--unverified${className ? ` ${className}` : ''}`}>Unverified</span>
  }

  return (
    <span
      aria-label={`${value} star`}
      className={`ui-rarity${className ? ` ${className}` : ''}`}
    >
      <span>{value}</span>{' '}
      <span aria-hidden="true" className="ui-rarity__star">★</span>
    </span>
  )
}
