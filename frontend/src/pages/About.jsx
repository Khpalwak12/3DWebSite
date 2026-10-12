import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'

const DishView = lazy(() => import('../three/DishView'))

export default function About() {
  const { t, place } = useI18n()
  const paragraphs = place.about.split('\n\n').filter(Boolean)

  return (
    <main className="page">
      <header className="page-hero">
        <p className="eyebrow dark">{t('nav.story')}</p>
        <h1>{place.brand}</h1>
        <p>{place.tagline}</p>
      </header>

      <section className="about-grid">
        <div className="about-scene">
          <Suspense fallback={<div className="scene-fallback" />}>
            <DishView kind="platter" />
          </Suspense>
        </div>
        <div>
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
          <Link className="btn btn-dark" to="/reserve">{t('nav.reserve')}</Link>
        </div>
      </section>

      <section className="section points">
        <article>
          <h2>{t('about.floor')}</h2>
          <p>{t('about.floorText')}</p>
        </article>
        <article>
          <h2>{t('about.salon')}</h2>
          <p>{t('about.salonText')}</p>
        </article>
        <article>
          <h2>{t('about.kitchen')}</h2>
          <p>{t('about.kitchenText')}</p>
        </article>
      </section>
    </main>
  )
}
