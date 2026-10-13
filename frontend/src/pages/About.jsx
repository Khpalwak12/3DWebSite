import { Link } from 'react-router-dom'
import DishSlides from '../components/DishSlides'
import { usePlace } from '../content'
import { useI18n } from '../i18n'
import { HERO_SLIDES } from '../slides'

export default function About() {
  const { t } = useI18n()
  const place = usePlace()
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
          <DishSlides images={HERO_SLIDES} alt={place.brand} />
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
