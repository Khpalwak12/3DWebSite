import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { usePlace } from '../content'
import { useI18n } from '../i18n'

export default function Navbar() {
  const { t, lang, setLang, locales } = useI18n()
  const place = usePlace()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const solid = location.pathname !== '/' || scrolled || open
  const links = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/menu', label: t('nav.menu') },
    { to: '/about', label: t('nav.story') },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header className={`nav ${solid ? 'solid' : ''}`}>
      <NavLink to="/" className="brand">
        <span>{place.brand}</span>
        <small>{place.city}</small>
      </NavLink>
      <div className="nav-side">
        <nav className={open ? 'open' : ''}>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/reserve" className="nav-reserve">
            {t('nav.reserve')}
          </NavLink>
        </nav>
        <div className="lang-switch" role="group" aria-label={t('language')}>
          {locales.map((locale) => (
            <button
              key={locale.id}
              type="button"
              className={lang === locale.id ? 'on' : ''}
              aria-pressed={lang === locale.id}
              lang={locale.htmlLang}
              onClick={() => setLang(locale.id)}
            >
              {locale.label}
            </button>
          ))}
        </div>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-label={open ? t('nav.close') : t('nav.open')}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
