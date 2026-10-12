import { useEffect, useState } from 'react'

export default function DishSlides({ images, alt }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (images.length < 2) return undefined
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motion.matches) return undefined
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.length)
    }, 4200)
    return () => window.clearInterval(id)
  }, [images])

  return (
    <div className="dish-slides">
      {images.map((src, imageIndex) => (
        <img
          key={src}
          src={src}
          alt={imageIndex === index ? alt : ''}
          className={imageIndex === index ? 'is-on' : ''}
        />
      ))}
    </div>
  )
}
