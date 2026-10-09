interface SmartImageProps {
  src: string | null
  alt: string
  aspectRatio?: string
  label: string
  className?: string
  fit?: 'cover' | 'contain'
}

function parseAspectRatio(aspectRatio: string) {
  const [width, height] = aspectRatio.split(/\s*[:/]\s*/).map(Number)
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return { css: '3 / 4', label: '3:4', width: 3, height: 4 }
  }
  return {
    css: `${width} / ${height}`,
    label: `${width}:${height}`,
    width,
    height,
  }
}

export function SmartImage({
  src,
  alt,
  aspectRatio = '3:4',
  label,
  className = '',
  fit = 'cover',
}: SmartImageProps) {
  const ratio = parseAspectRatio(aspectRatio)

  return (
    <figure
      className={`ui-smart-image ui-smart-image--${fit}${className ? ` ${className}` : ''}`}
      style={{ aspectRatio: ratio.css }}
    >
      {src ? (
        <img
          alt={alt}
          decoding="async"
          height={ratio.height}
          loading="lazy"
          src={src}
          width={ratio.width}
        />
      ) : (
        <div
          aria-label={`${label} ${ratio.label} — TODO`}
          className="ui-smart-image__placeholder"
          role="img"
        >
          <span>{label} {ratio.label} — TODO</span>
        </div>
      )}
    </figure>
  )
}
