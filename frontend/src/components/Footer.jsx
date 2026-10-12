import { Link } from 'react-router-dom'
import { useRestaurant } from '../context'
import { useI18n } from '../i18n'

export default function Footer() {
  const { info } = useRestaurant()
  const { place, hours, t } = useI18n()

  return (
    <footer className="footer">
      <div>
        <p className="brand-mark">{place.brand}</p>
        <p>{place.tagline}</p>
      </div>
      <div>
        <h2>{t('footer.address')}</h2>
        <p>{place.line}</p>
        <p><a href={`tel:${info?.phone || ''}`}><bdi dir="ltr">{info?.phone}</bdi></a></p>
      </div>
      <div>
        <h2>{t('footer.hours')}</h2>
        {hours.map((row) => (
          <p key={row.days}>{row.days}: {row.time}</p>
        ))}
      </div>
      <div>
        <h2>{t('footer.pages')}</h2>
        <p><Link to="/menu">{t('nav.menu')}</Link></p>
        <p><Link to="/reserve">{t('footer.reserve')}</Link></p>
        <p><Link to="/about">{t('nav.story')}</Link></p>
      </div>
    </footer>
  )
}
