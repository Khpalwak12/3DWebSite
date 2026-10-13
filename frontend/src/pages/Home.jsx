import { lazy, Suspense, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DishSlides from '../components/DishSlides'
import { useHours, usePhone, usePlace, useTonight, useWelcome } from '../content'
import { useApi, useRestaurant } from '../context'
import { useI18n } from '../i18n'
import { SLIDES } from '../slides'

const DiningScene = lazy(() => import('../three/DiningScene'))

export default function Home() {
  const { info } = useRestaurant()
  const featured = useApi('/api/menu?featured=1')
  const { t, money, item, band } = useI18n()
  const place = usePlace()
  const hours = useHours()
  const welcome = useWelcome()
  const tonight = useTonight()
  const phone = usePhone(info?.phone || '')

  useEffect(() => {
    const id = window.setTimeout(() => {
      import('../three/DishView')
      import('../three/TableMap')
    }, 1200)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <main>
      <section className="hero">
        <div className="hero-canvas">
          <Suspense fallback={<div className="scene-fallback" />}>
            <DiningScene />
          </Suspense>
        </div>
        <div className="hero-scrim" />
        <div className="hero-copy">
          <p className="eyebrow">{t('home.eyebrow', { city: place.city })}</p>
          <h1>{place.brand}</h1>
          <p className="lede">{place.tagline}</p>
          <p className="note">{place.heroNote}</p>
          <div className="hero-actions">
            <Link className="btn btn-gold" to="/menu">{t('home.menu')}</Link>
            <Link className="btn btn-ghost" to="/reserve">{t('home.reserve')}</Link>
          </div>
        </div>
        <p className="hero-hint">{t('home.drag')}</p>
      </section>

      <section className="welcome">
        <h2 className="welcome-title">{welcome.meet}</h2>
        <div className="welcome-layout">
          <div className="welcome-photos">
            <img className="welcome-pizza" src={welcome.left} alt={t('home.pizzaAlt')} />
            <img className="welcome-platter" src={welcome.right} alt={t('home.platterAlt')} />
          </div>
          <div className="welcome-copy">
            <p className="welcome-kicker">{welcome.kicker}</p>
            <h3>{welcome.heading}</h3>
            <p>{welcome.body}</p>
          </div>
        </div>
      </section>

      <section className="band">
        <p>{band}</p>
      </section>

      <section className="section">
        <div className="section-head">
          <p className="eyebrow dark">{tonight.eyebrow}</p>
          <h2>{tonight.title}</h2>
        </div>
        {featured.loading && <p className="status">{t('home.menuLoading')}</p>}
        {featured.error && <p className="status error">{t('home.menuError')}</p>}
        <div className="dish-rows">
          {(featured.data?.items || []).map((dish, index) => {
            const card = item(dish)
            return (
              <article key={card.id} className={`dish-row ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                <DishSlides images={card.images?.length ? card.images : (SLIDES[card.slug] || [])} alt={card.name} />
                <div className="dish-copy">
                  <p className="eyebrow dark">{card.category}</p>
                  <h3>{card.name}</h3>
                  <p>{card.description}</p>
                  <strong>{money(card.price)}</strong>
                </div>
              </article>
            )
          })}
        </div>
        <Link className="text-link" to="/menu">{t('home.allMenu')}</Link>
      </section>

      <section className="quote-band">
        <blockquote>
          {place.heroNote}
        </blockquote>
        <Link className="btn btn-gold" to="/about">{t('home.readStory')}</Link>
      </section>

      <section className="section visit">
        <div>
          <p className="eyebrow dark">{t('home.visit')}</p>
          <h2>{t('home.visitTitle')}</h2>
          <p>{place.line}</p>
          <p className="phone"><bdi dir="ltr">{phone}</bdi></p>
        </div>
        <ul className="hours">
          {hours.map((row) => (
            <li key={row.days}>
              <span>{row.days}</span>
              <span>{row.time}</span>
            </li>
          ))}
        </ul>
        <Link className="btn btn-dark" to="/reserve">{t('home.freeTable')}</Link>
      </section>
    </main>
  )
}
