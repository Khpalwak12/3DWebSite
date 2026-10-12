import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { money, SPICE } from '../api'
import { useApi } from '../context'

const DishView = lazy(() => import('../three/DishView'))

export default function MenuPage() {
  const { loading, error, data } = useApi('/api/menu')
  const [filter, setFilter] = useState('all')
  const [active, setActive] = useState(null)
  const categories = data?.categories || []

  const visible = useMemo(
    () => categories.filter((category) => filter === 'all' || category.slug === filter),
    [categories, filter],
  )

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
        <p className="eyebrow dark">مینو</p>
        <h1>له تنوره تر زعفرانو</h1>
        <p>بیې په افغانیو دي. توندوالی د مسالو اندازه ښيي، که غواړئ ملایم یې ووایاست.</p>
      </header>

      {loading && <p className="status">مینو راځي…</p>}
      {error && <p className="status error">مینو رانغی. backend سرور چالان کړئ.</p>}

      {categories.length > 0 && (
        <div className="chips">
          <button type="button" className={filter === 'all' ? 'on' : ''} onClick={() => setFilter('all')}>ټول</button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={filter === category.slug ? 'on' : ''}
              onClick={() => setFilter(category.slug)}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {visible.map((category) => (
        <section key={category.id} className="menu-block">
          <header>
            <h2>{category.name}</h2>
            <p>{category.description}</p>
          </header>
          <ul>
            {category.items.map((item) => (
              <li key={item.id}>
                <button type="button" onClick={() => setActive(item)}>
                  <span className={`medallion kind-${item.kind}`} aria-hidden="true" />
                  <span className="dish-copy">
                    <strong>{item.name}</strong>
                    <em>{item.description}</em>
                  </span>
                  <span className="price">{money(item.price)}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {active && (
        <div className="dialog-back" onClick={() => setActive(null)}>
          <article className="dialog" role="dialog" aria-modal="true" aria-labelledby="dish-title" onClick={(event) => event.stopPropagation()}>
            <div className="dialog-scene">
              <Suspense fallback={<div className="scene-fallback" />}>
                <DishView kind={active.kind} />
              </Suspense>
            </div>
            <div className="dialog-copy">
              <p className="eyebrow dark">{active.category}</p>
              <h2 id="dish-title">{active.name}</h2>
              <p>{active.description}</p>
              <p className="spice">{SPICE[active.spice] || SPICE[0]}</p>
              <strong className="price">{money(active.price)}</strong>
              <div className="hero-actions">
                <Link className="btn btn-dark" to="/reserve">میز ونیسئ</Link>
                <button type="button" className="btn btn-line" onClick={() => setActive(null)}>وتړئ</button>
              </div>
            </div>
          </article>
        </div>
      )}
    </main>
  )
}
