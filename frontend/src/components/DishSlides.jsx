import { useEffect, useState } from 'react'

const WAIT = 5600

export default function DishSlides({ images, alt, className = '' }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = images.length

  useEffect(() => {
    setIndex(0)
  }, [images])

  useEffect(() => {
    if (count < 2 || paused) return undefined
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motion.matches) return undefined
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count)
    }, WAIT)
    return () => window.clearInterval(id)
  }, [count, paused, images])

  function go(step) {
    setIndex((current) => (current + step + count) % count)
  }

  return (
    <div
      className={`dish-slides ${className}`.trim()}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {images.map((src, imageIndex) => (
        <img
          key={`${src}-${imageIndex}`}
          src={src}
          alt={imageIndex === index ? alt : ''}
          className={`${imageIndex === index ? 'is-on' : ''} ${imageIndex % 2 ? 'drift-b' : 'drift-a'}`}
        />
      ))}
      <span className="slide-veil" aria-hidden="true" />
      {count > 1 && (
        <>
          <span className={`slide-progress ${paused ? 'is-paused' : ''}`} key={index} />
          <div className="slide-controls">
            <button type="button" className="slide-arrow" onClick={() => go(-1)} aria-label="مخکینی عکس">
              <span aria-hidden="true" />
            </button>
            {count <= 6 ? (
              <span className="slide-dots">
                {images.map((src, imageIndex) => (
                  <button
                    key={`${src}-dot`}
                    type="button"
                    className={imageIndex === index ? 'is-on' : ''}
                    aria-label={`${alt} ${imageIndex + 1}`}
                    aria-current={imageIndex === index ? 'true' : undefined}
                    onClick={() => setIndex(imageIndex)}
                  />
                ))}
              </span>
            ) : (
              <span className="slide-count"><bdi>{index + 1} / {count}</bdi></span>
            )}
            <button type="button" className="slide-arrow next" onClick={() => go(1)} aria-label="بل عکس">
              <span aria-hidden="true" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
