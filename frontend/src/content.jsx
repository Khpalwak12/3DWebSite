import { createContext, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { api } from './api'
import { useI18n } from './i18n'
import { WELCOME_IMAGES } from './slides'

const ContentContext = createContext(null)

const EMPTY = {
  profile: null,
  welcome: { text: {}, images: { ...WELCOME_IMAGES } },
  tonight: { text: {} },
}

function filled(value, fallback) {
  return typeof value === 'string' && value.trim() ? value : fallback
}

function localizeDigits(value, lang) {
  if (lang === 'en') return String(value ?? '')
  return String(value ?? '').replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[digit])
}

export function ContentProvider({ children }) {
  const location = useLocation()
  const [content, setContent] = useState(EMPTY)

  useEffect(() => {
    let live = true
    api('/api/content')
      .then((data) => {
        if (live) setContent({ ...EMPTY, ...data })
      })
      .catch(() => {})
    return () => {
      live = false
    }
  }, [location.pathname])

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}

export function useContent() {
  return useContext(ContentContext) || EMPTY
}

export function usePlace() {
  const { place, lang } = useI18n()
  const content = useContent()
  const custom = content.profile?.translations?.[lang] || {}
  const address = filled(custom.address, place.address)
  const city = filled(custom.city, place.city)

  return {
    ...place,
    brand: filled(custom.brand, place.brand),
    tagline: filled(custom.tagline, place.tagline),
    heroNote: filled(custom.heroNote, place.heroNote),
    about: filled(custom.about, place.about),
    address,
    city,
    line: `${address}${lang === 'en' ? ', ' : '، '}${city}`,
  }
}

export function useHours() {
  const { hours, lang } = useI18n()
  const content = useContent()
  const rows = content.profile?.hours
  if (!Array.isArray(rows) || !rows.length || typeof rows[0]?.days === 'string') return hours

  return rows.map((row) => ({
    days: filled(row.days?.[lang], row.days?.ps || ''),
    time: localizeDigits(row.time, lang),
  }))
}

export function useWelcome() {
  const { t, lang } = useI18n()
  const content = useContent()
  const text = content.welcome?.text?.[lang] || {}
  const images = content.welcome?.images || {}

  return {
    meet: filled(text.meet, t('home.meet')),
    kicker: filled(text.kicker, t('home.trueFlavor')),
    heading: filled(text.heading, t('home.experience')),
    body: filled(text.body, t('home.welcomeBody')),
    left: filled(images.left, WELCOME_IMAGES.left),
    right: filled(images.right, WELCOME_IMAGES.right),
  }
}

export function useTonight() {
  const { t, lang } = useI18n()
  const content = useContent()
  const text = content.tonight?.text?.[lang] || {}

  return {
    eyebrow: filled(text.eyebrow, t('home.tonight')),
    title: filled(text.title, t('home.tonightTitle')),
  }
}

export function usePhone(fallback = '') {
  const content = useContent()
  return filled(content.profile?.phone, fallback)
}
