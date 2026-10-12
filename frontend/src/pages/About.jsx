import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { useRestaurant } from '../context'

const DishView = lazy(() => import('../three/DishView'))

export default function About() {
  const { info, loading, error } = useRestaurant()
  const paragraphs = (info?.about || '').split('\n\n').filter(Boolean)

  return (
    <main className="page">
      <header className="page-hero">
        <p className="eyebrow dark">زموږ کیسه</p>
        <h1>{info?.name || 'دسترخوان'}</h1>
        <p>{info?.tagline}</p>
      </header>

      <section className="about-grid">
        <div className="about-scene">
          <Suspense fallback={<div className="scene-fallback" />}>
            <DishView kind="platter" />
          </Suspense>
        </div>
        <div>
          {loading && <p className="status">کیسه راځي…</p>}
          {error && <p className="status error">د رستورانت معلومات رانغلل.</p>}
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
          <Link className="btn btn-dark" to="/reserve">میز ونیسئ</Link>
        </div>
      </section>

      <section className="section points">
        <article>
          <h2>فرش</h2>
          <p>یوه خونه د کور په ډول ده: توشک، دسترخوان، او ډوډۍ پر ځمکه.</p>
        </article>
        <article>
          <h2>سالون</h2>
          <p>که میز غواړئ، اته میزونه دي. له دوه کسانو څخه تر شپږو پورې.</p>
        </article>
        <article>
          <h2>پخلنځی</h2>
          <p>وریجې زعفراني، کباب پر سکرو، او نان هماغه ورځ له تنوره.</p>
        </article>
      </section>
    </main>
  )
}
