import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApi } from '../context'
import { useI18n } from '../i18n'

const DishView = lazy(() => import('../three/DishView'))

export default function MenuPage() {
  const { loading, error, data } = useApi('/api/menu')
  const { t, money, category, spice } = useI18n()
  const [filter, setFilter] = useState('all')
  const [active, setActive] = useState(null)
  const categories = useMemo(
    () => (data?.categories || []).map(category),
    [data, category],
  )

  const visible = useMemo(
    () => categories.filter((group) => filter === 'all' || group.slug === filter),
    [categories, filter],
  )
  const shown = useMemo(() => {
    if (!active) return null
    return categories.flatMap((group) => group.items).find((dish) => dish.id === active.id) || active
  }, [active, categories])

  useEffect(() => {
    if (!active) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setActive(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  return (
    <main className="page">
      <header className="page-hero">
        <p className="eyebrow dark">{t('nav.menu')}</p>
        <h1>{t('menu.title')}</h1>
        <p>{t('menu.intro')}</p>
      </header>

      {loading && <p className="status">{t('menu.loading')}</p>}
      {error && <p className="status error">{t('menu.error')}</p>}

      {categories.length > 0 && (
        <div className="chips">
          <button type="button" className={filter === 'all' ? 'on' : ''} onClick={() => setFilter('all')}>{t('menu.all')}</button>
          {categories.map((group) => (
            <button
              key={group.id}
              type="button"
              className={filter === group.slug ? 'on' : ''}
              onClick={() => setFilter(group.slug)}
            >
              {group.name}
            </button>
          ))}
        </div>
      )}

      {visible.map((group) => (
        <section key={group.id} className="menu-block">
          <header>
            <h2>{group.name}</h2>
            <p>{group.description}</p>
          </header>
          <ul>
            {group.items.map((dish) => (
              <li key={dish.id}>
                <button type="button" onClick={() => setActive(dish)}>
                  <span className={`medallion kind-${dish.kind}`} aria-hidden="true" />
                  <span className="dish-copy">
                    <strong>{dish.name}</strong>
                    <em>{dish.description}</em>
                  </span>
                  <span className="price">{money(dish.price)}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {shown && (
        <div className="dialog-back" onClick={() => setActive(null)}>
          <article className="dialog" role="dialog" aria-modal="true" aria-labelledby="dish-title" onClick={(event) => event.stopPropagation()}>
            <div className="dialog-scene">
              <Suspense fallback={<div className="scene-fallback" />}>
                <DishView kind={shown.kind} />
              </Suspense>
            </div>
            <div className="dialog-copy">
              <p className="eyebrow dark">{shown.category}</p>
              <h2 id="dish-title">{shown.name}</h2>
              <p>{shown.description}</p>
              <p className="spice">{spice(shown.spice)}</p>
              <strong className="price">{money(shown.price)}</strong>
              <div className="hero-actions">
                <Link className="btn btn-dark" to="/reserve">{t('menu.reserve')}</Link>
                <button type="button" className="btn btn-line" onClick={() => setActive(null)}>{t('menu.close')}</button>
              </div>
            </div>
          </article>
        </div>
      )}
    </main>
  )
}
