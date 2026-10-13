import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminFetch, adminToken, setAdminToken } from '../api'
import { categoryDefaults, dishDefaults, siteDefaults } from '../i18n'
import { SLIDES, WELCOME_IMAGES } from '../slides'

const LANGS = [
  { id: 'ps', label: 'پښتو' },
  { id: 'fa', label: 'دری' },
  { id: 'en', label: 'English' },
]

const TABS = [
  { id: 'home', label: 'کور' },
  { id: 'menu', label: 'مینو' },
  { id: 'place', label: 'رستورانت' },
  { id: 'bookings', label: 'ځای نیونې' },
]

function mergeLang(stored, fallback) {
  const out = {}
  for (const lang of ['ps', 'fa', 'en']) {
    out[lang] = { ...(fallback?.[lang] || {}) }
    for (const [key, value] of Object.entries(stored?.[lang] || {})) {
      if (typeof value === 'string' && value.trim()) out[lang][key] = value
    }
  }
  return out
}

function LangSwitch({ value, onChange }) {
  return (
    <div className="admin-langs">
      {LANGS.map((lang) => (
        <button key={lang.id} type="button" className={value === lang.id ? 'is-on' : ''} onClick={() => onChange(lang.id)}>
          {lang.label}
        </button>
      ))}
    </div>
  )
}

function Field({ label, value, onChange, dir, area, type = 'text' }) {
  const Tag = area ? 'textarea' : 'input'
  return (
    <label>
      {label}
      <Tag dir={dir} type={area ? undefined : type} value={value || ''} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

async function uploadImage(file) {
  const body = new FormData()
  body.append('image', file)
  const data = await adminFetch('/api/admin/upload', { method: 'POST', body })
  return data.url
}

function ImageEditor({ images, onChange }) {
  async function add(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    onChange([...images, await uploadImage(file)])
  }

  function move(index, step) {
    const next = [...images]
    const target = index + step
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <div className="admin-images">
      {images.map((src, index) => (
        <figure key={`${src}-${index}`}>
          <img src={src} alt="" />
          <span>
            <button type="button" onClick={() => move(index, -1)}>مخکې</button>
            <button type="button" onClick={() => move(index, 1)}>وروسته</button>
            <button type="button" onClick={() => onChange(images.filter((_, item) => item !== index))}>لیرې</button>
          </span>
        </figure>
      ))}
      <label className="admin-upload">
        انځور زیات کړئ
        <input type="file" accept="image/*" hidden onChange={add} />
      </label>
    </div>
  )
}

export default function Admin() {
  const defaults = siteDefaults()
  const [token, setToken] = useState(() => adminToken())
  const [password, setPassword] = useState('')
  const [tab, setTab] = useState('home')
  const [editLang, setEditLang] = useState('ps')
  const [welcome, setWelcome] = useState(null)
  const [tonight, setTonight] = useState(null)
  const [profile, setProfile] = useState(null)
  const [categories, setCategories] = useState([])
  const [reservations, setReservations] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const dir = editLang === 'en' ? 'ltr' : 'rtl'

  useEffect(() => {
    if (!token) return undefined
    let live = true
    setBusy(true)
    Promise.all([
      adminFetch('/api/content'),
      adminFetch('/api/admin/catalog'),
    ]).then(([content, catalog]) => {
      if (!live) return
      const hours = content.profile?.hours
      const customHours = Array.isArray(hours) && hours[0] && typeof hours[0].days === 'object'
      setWelcome({
        text: mergeLang(content.welcome?.text, defaults.welcome),
        images: {
          left: content.welcome?.images?.left || WELCOME_IMAGES.left,
          right: content.welcome?.images?.right || WELCOME_IMAGES.right,
        },
      })
      setTonight({ text: mergeLang(content.tonight?.text, defaults.tonight) })
      setProfile({
        phone: content.profile?.phone || '',
        translations: mergeLang(content.profile?.translations, defaults.place),
        hours: customHours ? hours : defaults.hours,
      })
      setCategories((catalog.categories || []).map((group) => ({
        ...group,
        translations: mergeLang(group.translations, categoryDefaults(group.slug)),
        items: (group.items || []).map((item) => ({
          ...item,
          translations: mergeLang(item.translations, dishDefaults(item.slug)),
          images: item.images?.length ? item.images : (SLIDES[item.slug] || []),
        })),
      })))
    }).catch((reason) => {
      if (!live) return
      if (reason.status === 401) setToken('')
      else setError('معلومات رانغلل. سرور وګورئ.')
    }).finally(() => {
      if (live) setBusy(false)
    })
    return () => {
      live = false
    }
  }, [token])

  useEffect(() => {
    if (!token || tab !== 'bookings') return undefined
    let live = true
    adminFetch('/api/admin/reservations')
      .then((data) => {
        if (live) setReservations(data.reservations || [])
      })
      .catch(() => {
        if (live) setError('ځای نیونې رانغلې.')
      })
    return () => {
      live = false
    }
  }, [token, tab])

  async function login(event) {
    event.preventDefault()
    setError('')
    try {
      const data = await adminFetch('/api/admin/login', { method: 'POST', body: { password } })
      setAdminToken(data.token)
      setToken(data.token)
      setPassword('')
    } catch (reason) {
      setError(reason.message === 'request-failed' ? 'پټنوم سم نه دی.' : reason.message)
    }
  }

  function logout() {
    setAdminToken('')
    setToken('')
  }

  async function save(action) {
    setBusy(true)
    setError('')
    setMessage('')
    try {
      await action()
      setMessage('خوندي شو.')
    } catch (reason) {
      if (reason.status === 401) setToken('')
      setError(reason.message === 'request-failed' ? 'خوندي نه شو. ډکې خانې وګورئ.' : reason.message)
    } finally {
      setBusy(false)
    }
  }

  function patchItem(groupId, itemId, patch) {
    setCategories((current) => current.map((group) => (
      group.id === groupId
        ? { ...group, items: group.items.map((item) => (item.id === itemId ? { ...item, ...patch } : item)) }
        : group
    )))
  }

  if (!token) {
    return (
      <main className="admin-login" dir="rtl">
        <form className="admin-card" onSubmit={login}>
          <p className="eyebrow dark">دسترخوان</p>
          <h1>ډشبورډ</h1>
          <Field label="پټنوم" type="password" value={password} onChange={setPassword} dir="ltr" />
          {error && <p className="status error">{error}</p>}
          <button className="btn btn-gold" type="submit">ننوتل</button>
          <p><Link to="/">بېرته پاڼې ته</Link></p>
        </form>
      </main>
    )
  }

  return (
    <div className="admin" dir="rtl">
      <aside className="admin-side">
        <p className="brand-mark">دسترخوان</p>
        <nav>
          {TABS.map((item) => (
            <button key={item.id} type="button" className={tab === item.id ? 'is-on' : ''} onClick={() => setTab(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>
        <Link to="/">پاڼه وګورئ</Link>
        <button type="button" onClick={logout}>وتل</button>
      </aside>
      <main className="admin-main">
        {busy && <p className="status">روان دی…</p>}
        {message && <p className="status">{message}</p>}
        {error && <p className="status error">{error}</p>}

        {tab === 'home' && welcome && tonight && (
          <section>
            <h1>د کور پاڼه</h1>
            <LangSwitch value={editLang} onChange={setEditLang} />
            <article className="admin-card">
              <h2>ښه راغلاست</h2>
              <Field label="سرلیک" dir={dir} value={welcome.text[editLang].meet} onChange={(value) => setWelcome({ ...welcome, text: { ...welcome.text, [editLang]: { ...welcome.text[editLang], meet: value } } })} />
              <Field label="لنډ نوم" dir={dir} value={welcome.text[editLang].kicker} onChange={(value) => setWelcome({ ...welcome, text: { ...welcome.text, [editLang]: { ...welcome.text[editLang], kicker: value } } })} />
              <Field label="سرخط" dir={dir} value={welcome.text[editLang].heading} onChange={(value) => setWelcome({ ...welcome, text: { ...welcome.text, [editLang]: { ...welcome.text[editLang], heading: value } } })} />
              <Field area label="متن" dir={dir} value={welcome.text[editLang].body} onChange={(value) => setWelcome({ ...welcome, text: { ...welcome.text, [editLang]: { ...welcome.text[editLang], body: value } } })} />
              <div className="admin-images">
                {['left', 'right'].map((side) => (
                  <figure key={side}>
                    <img src={welcome.images[side]} alt="" />
                    <label className="admin-upload">
                      {side === 'left' ? 'کیڼ انځور' : 'ښي انځور'}
                      <input type="file" accept="image/*" hidden onChange={async (event) => {
                        const file = event.target.files?.[0]
                        event.target.value = ''
                        if (!file) return
                        const url = await uploadImage(file)
                        setWelcome((current) => ({ ...current, images: { ...current.images, [side]: url } }))
                      }} />
                    </label>
                  </figure>
                ))}
              </div>
              <button className="btn btn-gold" type="button" onClick={() => save(() => adminFetch('/api/admin/blocks/welcome', { method: 'PUT', body: welcome }))}>خوندي کړئ</button>
            </article>
            <article className="admin-card">
              <h2>د نن شپه</h2>
              <Field label="کوچنی سرلیک" dir={dir} value={tonight.text[editLang].eyebrow} onChange={(value) => setTonight({ text: { ...tonight.text, [editLang]: { ...tonight.text[editLang], eyebrow: value } } })} />
              <Field label="سرلیک" dir={dir} value={tonight.text[editLang].title} onChange={(value) => setTonight({ text: { ...tonight.text, [editLang]: { ...tonight.text[editLang], title: value } } })} />
              <button className="btn btn-gold" type="button" onClick={() => save(() => adminFetch('/api/admin/blocks/tonight', { method: 'PUT', body: tonight }))}>خوندي کړئ</button>
            </article>
          </section>
        )}

        {tab === 'menu' && (
          <section>
            <h1>مینو</h1>
            <LangSwitch value={editLang} onChange={setEditLang} />
            {categories.map((group) => (
              <article className="admin-card" key={group.id}>
                <h2>ډله</h2>
                <Field label="نوم" dir={dir} value={group.translations[editLang].name} onChange={(value) => setCategories((current) => current.map((row) => row.id === group.id ? { ...row, translations: { ...row.translations, [editLang]: { ...row.translations[editLang], name: value } } } : row))} />
                <Field label="لنډه" dir={dir} value={group.translations[editLang].description} onChange={(value) => setCategories((current) => current.map((row) => row.id === group.id ? { ...row, translations: { ...row.translations, [editLang]: { ...row.translations[editLang], description: value } } } : row))} />
                <button className="btn btn-dark" type="button" onClick={() => save(() => adminFetch(`/api/admin/categories/${group.id}`, { method: 'PUT', body: { translations: group.translations } }))}>ډله خوندي کړئ</button>
                {group.items.map((item) => (
                  <div className="admin-item" key={item.id}>
                    <Field label="د خوړو نوم" dir={dir} value={item.translations[editLang].name} onChange={(value) => patchItem(group.id, item.id, { translations: { ...item.translations, [editLang]: { ...item.translations[editLang], name: value } } })} />
                    <Field area label="تشریح" dir={dir} value={item.translations[editLang].description} onChange={(value) => patchItem(group.id, item.id, { translations: { ...item.translations, [editLang]: { ...item.translations[editLang], description: value } } })} />
                    <label>
                      بیه
                      <input dir="ltr" type="number" min="0" value={item.price} onChange={(event) => patchItem(group.id, item.id, { price: Number(event.target.value) })} />
                    </label>
                    <label>
                      توندوالی
                      <select value={item.spice} onChange={(event) => patchItem(group.id, item.id, { spice: Number(event.target.value) })}>
                        <option value={0}>ملایم</option>
                        <option value={1}>لږ توند</option>
                        <option value={2}>توند</option>
                        <option value={3}>ډېر توند</option>
                      </select>
                    </label>
                    <label className="admin-check">
                      <input type="checkbox" checked={Boolean(item.featured)} onChange={(event) => patchItem(group.id, item.id, { featured: event.target.checked })} />
                      په کور پاڼه کې ښکاره شي
                    </label>
                    <ImageEditor images={item.images} onChange={(images) => patchItem(group.id, item.id, { images })} />
                    <button className="btn btn-gold" type="button" onClick={() => save(() => adminFetch(`/api/admin/items/${item.id}`, {
                      method: 'PUT',
                      body: {
                        price: item.price,
                        featured: Boolean(item.featured),
                        spice: item.spice,
                        images: item.images,
                        translations: item.translations,
                      },
                    }))}>خوړه خوندي کړئ</button>
                  </div>
                ))}
              </article>
            ))}
          </section>
        )}

        {tab === 'place' && profile && (
          <section>
            <h1>رستورانت</h1>
            <LangSwitch value={editLang} onChange={setEditLang} />
            <article className="admin-card">
              <Field label="ټیلیفون" dir="ltr" value={profile.phone} onChange={(value) => setProfile({ ...profile, phone: value })} />
              <Field label="نوم" dir={dir} value={profile.translations[editLang].brand} onChange={(value) => setProfile({ ...profile, translations: { ...profile.translations, [editLang]: { ...profile.translations[editLang], brand: value } } })} />
              <Field label="شعار" dir={dir} value={profile.translations[editLang].tagline} onChange={(value) => setProfile({ ...profile, translations: { ...profile.translations, [editLang]: { ...profile.translations[editLang], tagline: value } } })} />
              <Field area label="د سر پاڼې یادښت" dir={dir} value={profile.translations[editLang].heroNote} onChange={(value) => setProfile({ ...profile, translations: { ...profile.translations, [editLang]: { ...profile.translations[editLang], heroNote: value } } })} />
              <Field area label="کیسه" dir={dir} value={profile.translations[editLang].about} onChange={(value) => setProfile({ ...profile, translations: { ...profile.translations, [editLang]: { ...profile.translations[editLang], about: value } } })} />
              <Field label="پته" dir={dir} value={profile.translations[editLang].address} onChange={(value) => setProfile({ ...profile, translations: { ...profile.translations, [editLang]: { ...profile.translations[editLang], address: value } } })} />
              <Field label="ښار" dir={dir} value={profile.translations[editLang].city} onChange={(value) => setProfile({ ...profile, translations: { ...profile.translations, [editLang]: { ...profile.translations[editLang], city: value } } })} />
              {profile.hours.map((row, index) => (
                <div className="admin-hours" key={index}>
                  <Field label="ورځې" dir={dir} value={row.days[editLang]} onChange={(value) => setProfile({ ...profile, hours: profile.hours.map((hour, hourIndex) => hourIndex === index ? { ...hour, days: { ...hour.days, [editLang]: value } } : hour) })} />
                  <Field label="ساعت" dir="ltr" value={row.time} onChange={(value) => setProfile({ ...profile, hours: profile.hours.map((hour, hourIndex) => hourIndex === index ? { ...hour, time: value } : hour) })} />
                </div>
              ))}
              <button className="btn btn-gold" type="button" onClick={() => save(() => adminFetch('/api/admin/profile', { method: 'PUT', body: profile }))}>خوندي کړئ</button>
            </article>
          </section>
        )}

        {tab === 'bookings' && (
          <section>
            <h1>ځای نیونې</h1>
            {!reservations.length && <p>تر اوسه ځای نه دی نیول شوی.</p>}
            {reservations.map((row) => (
              <article className="admin-card" key={row.id}>
                <h2>{row.guest_name}</h2>
                <p><bdi dir="ltr">{row.phone}</bdi> · {row.guests} کسان · {row.table}</p>
                <p><bdi dir="ltr">{row.reserved_at}</bdi> · {row.status}</p>
                {row.notes && <p>{row.notes}</p>}
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  )
}
