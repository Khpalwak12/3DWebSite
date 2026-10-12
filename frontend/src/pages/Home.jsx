import { lazy, Suspense, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { money } from '../api'
import { useApi, useRestaurant } from '../context'

const DiningScene = lazy(() => import('../three/DiningScene'))

export default function Home() {
  const { info, loading, error } = useRestaurant()
  const featured = useApi('/api/menu?featured=1')

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
          <p className="eyebrow">افغاني رستورانت · {info?.city || 'کابل'}</p>
          <h1>دسترخوان</h1>
          <p className="lede">{info?.tagline || 'د کابل خوند، پر یوه دسترخوان'}</p>
          <p className="note">{info?.hero_note}</p>
          <div className="hero-actions">
            <Link className="btn btn-gold" to="/menu">مینو وګورئ</Link>
            <Link className="btn btn-ghost" to="/reserve">میز ونیسئ</Link>
          </div>
        </div>
        <p className="hero-hint">د صحنې د څرخولو لپاره یې وښکئ</p>
      </section>

      <section className="band">
        <p>قابلي · منتو · چکن تکہ · بولاني · فیرني · شین چای</p>
      </section>

      <section className="section">
        <div className="section-head">
          <p className="eyebrow dark">د نن شپه</p>
          <h2>هغه خوندونه چې میلمانه یې بیا راولي</h2>
        </div>
        {featured.loading && <p className="status">مینو راځي…</p>}
        {featured.error && <p className="status error">مینو رانغی. Laravel سرور وګورئ.</p>}
        <div className="feature-grid">
          {(featured.data?.items || []).map((item) => (
            <article key={item.id} className="feature-card">
              <p className="eyebrow dark">{item.category}</p>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <strong>{money(item.price)}</strong>
            </article>
          ))}
        </div>
        <Link className="text-link" to="/menu">ټول مینو</Link>
      </section>

      <section className="quote-band">
        <blockquote>
          {loading ? '…' : error ? 'له پخلنځي سره اړیکه ونه نیول شوه.' : info.hero_note}
        </blockquote>
        <Link className="btn btn-gold" to="/about">کیسه ولولئ</Link>
      </section>

      <section className="section visit">
        <div>
          <p className="eyebrow dark">راتلل</p>
          <h2>کارته ۴، کله چې وږي شئ</h2>
          <p>{info ? `${info.address}، ${info.city}` : 'کابل'}</p>
          <p className="phone">{info?.phone}</p>
        </div>
        <ul className="hours">
          {(info?.hours || []).map((row) => (
            <li key={row.days}>
              <span>{row.days}</span>
              <span>{row.time}</span>
            </li>
          ))}
        </ul>
        <Link className="btn btn-dark" to="/reserve">خالي میز وګورئ</Link>
      </section>
    </main>
  )
}
