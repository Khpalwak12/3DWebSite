export const SLIDES = {
  qabili: ['/slides/qabili-1.jpg', '/slides/qabili-2.jpg'],
  'chicken-tikka': ['/slides/tikka-1.jpg', '/slides/tikka-2.jpg'],
  bolani: ['/slides/bolani-1.jpg', '/slides/bolani-2.jpg'],
  mantu: ['/slides/mantu-1.jpg', '/slides/mantu-2.jpg'],
  firni: ['/slides/firni-1.jpg', '/slides/firni-2.jpg'],
}

export const HERO_SLIDES = Object.values(SLIDES).flat()

export const WELCOME_IMAGES = {
  left: '/welcome-pizza.jpg',
  right: '/welcome-platter.jpg',
}

export const KIND_PHOTOS = {
  platter: SLIDES.qabili,
  skewer: SLIDES['chicken-tikka'],
  bread: SLIDES.bolani,
  bowl: SLIDES.mantu,
  dessert: SLIDES.firni,
  drink: [WELCOME_IMAGES.right, SLIDES.firni[0]],
}

export function photosFor(dish) {
  if (dish?.images?.length) return dish.images
  if (dish?.slug && SLIDES[dish.slug]) return SLIDES[dish.slug]
  return KIND_PHOTOS[dish?.kind] || SLIDES.qabili
}
