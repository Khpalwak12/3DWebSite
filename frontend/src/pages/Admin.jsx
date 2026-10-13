import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminFetch, adminToken, setAdminToken } from '../api'
import { categoryDefaults, dishDefaults, siteDefaults } from '../i18n'
import { SLIDES, WELCOME_IMAGES } from '../slides'

const LANG_KEY = 'dastarkhwan-admin-lang'

const LANGS = [
  { id: 'ps', label: 'پښتو', dir: 'rtl' },
  { id: 'fa', label: 'دری', dir: 'rtl' },
  { id: 'en', label: 'English', dir: 'ltr' },
]

const UI = {
  ps: {
    dashboard: 'ډشبورډ',
    password: 'پټنوم',
    login: 'ننوتل',
    back: 'بېرته پاڼې ته',
    badPassword: 'پټنوم سم نه دی.',
    tabs: { home: 'کور', menu: 'مینو', place: 'رستورانت', bookings: 'ځای نیونې' },
    viewSite: 'پاڼه وګورئ',
    logout: 'وتل',
    working: 'روان دی…',
    saved: 'خوندي شو.',
    loadError: 'معلومات رانغلل. سرور وګورئ.',
    bookingsError: 'ځای نیونې رانغلې.',
    saveError: 'خوندي نه شو. ډکې خانې وګورئ.',
    homeTitle: 'د کور پاڼه',
    welcome: 'ښه راغلاست',
    title: 'سرلیک',
    kicker: 'لنډ نوم',
    heading: 'سرخط',
    body: 'متن',
    leftImage: 'کیڼ انځور',
    rightImage: 'ښي انځور',
    save: 'خوندي کړئ',
    tonight: 'د نن شپه',
    eyebrow: 'کوچنی سرلیک',
    menuTitle: 'مینو',
    group: 'ډله',
    name: 'نوم',
    short: 'لنډه',
    saveGroup: 'ډله خوندي کړئ',
    dishName: 'د خوړو نوم',
    description: 'تشریح',
    price: 'بیه',
    spice: 'توندوالی',
    spices: ['ملایم', 'لږ توند', 'توند', 'ډېر توند'],
    featured: 'په کور پاڼه کې ښکاره شي',
    earlier: 'مخکې',
    later: 'وروسته',
    remove: 'لیرې',
    addImage: 'انځور زیات کړئ',
    saveDish: 'خوړه خوندي کړئ',
    placeTitle: 'رستورانت',
    phone: 'ټیلیفون',
    tagline: 'شعار',
    heroNote: 'د سر پاڼې یادښت',
    story: 'کیسه',
    address: 'پته',
    city: 'ښار',
    days: 'ورځې',
    hours: 'ساعت',
    bookingsTitle: 'ځای نیونې',
    noBookings: 'تر اوسه ځای نه دی نیول شوی.',
    guests: 'کسان',
    table: 'میز {n}',
    statuses: { pending: 'پاتې', confirmed: 'تایید', cancelled: 'لغوه' },
  },
  fa: {
    dashboard: 'داشبورد',
    password: 'گذرواژه',
    login: 'ورود',
    back: 'بازگشت به صفحه',
    badPassword: 'گذرواژه درست نیست.',
    tabs: { home: 'خانه', menu: 'مینو', place: 'رستورانت', bookings: 'رزروها' },
    viewSite: 'دیدن صفحه',
    logout: 'خروج',
    working: 'در جریان است…',
    saved: 'ذخیره شد.',
    loadError: 'معلومات نیامد. سرور را ببینید.',
    bookingsError: 'رزروها نیامد.',
    saveError: 'ذخیره نشد. خانه‌های پر را ببینید.',
    homeTitle: 'صفحه خانه',
    welcome: 'خوش آمدید',
    title: 'عنوان',
    kicker: 'نام کوتاه',
    heading: 'سرخط',
    body: 'متن',
    leftImage: 'عکس چپ',
    rightImage: 'عکس راست',
    save: 'ذخیره کنید',
    tonight: 'امشب',
    eyebrow: 'عنوان کوچک',
    menuTitle: 'مینو',
    group: 'دسته',
    name: 'نام',
    short: 'کوتاه',
    saveGroup: 'دسته را ذخیره کنید',
    dishName: 'نام غذا',
    description: 'توضیح',
    price: 'قیمت',
    spice: 'تندی',
    spices: ['ملایم', 'کمی تند', 'تند', 'خیلی تند'],
    featured: 'در صفحه خانه دیده شود',
    earlier: 'پیش',
    later: 'پس',
    remove: 'بردارید',
    addImage: 'عکس اضافه کنید',
    saveDish: 'غذا را ذخیره کنید',
    placeTitle: 'رستورانت',
    phone: 'تلفن',
    tagline: 'شعار',
    heroNote: 'یادداشت بالای صفحه',
    story: 'داستان',
    address: 'آدرس',
    city: 'شهر',
    days: 'روزها',
    hours: 'ساعت',
    bookingsTitle: 'رزروها',
    noBookings: 'تا حال رزروی نشده است.',
    guests: 'نفر',
    table: 'میز {n}',
    statuses: { pending: 'در انتظار', confirmed: 'تأیید', cancelled: 'لغو' },
  },
  en: {
    dashboard: 'Dashboard',
    password: 'Password',
    login: 'Sign in',
    back: 'Back to the site',
    badPassword: 'The password is not right.',
    tabs: { home: 'Home', menu: 'Menu', place: 'Restaurant', bookings: 'Reservations' },
    viewSite: 'View the site',
    logout: 'Sign out',
    working: 'Working…',
    saved: 'Saved.',
    loadError: 'The details did not load. Check the server.',
    bookingsError: 'Reservations did not load.',
    saveError: 'It did not save. Check the filled fields.',
    homeTitle: 'Home page',
    welcome: 'Welcome',
    title: 'Title',
    kicker: 'Small label',
    heading: 'Heading',
    body: 'Text',
    leftImage: 'Left photo',
    rightImage: 'Right photo',
    save: 'Save',
    tonight: 'Tonight',
    eyebrow: 'Small heading',
    menuTitle: 'Menu',
    group: 'Group',
    name: 'Name',
    short: 'Short line',
    saveGroup: 'Save group',
    dishName: 'Dish name',
    description: 'Description',
    price: 'Price',
    spice: 'Heat',
    spices: ['Mild', 'A little hot', 'Hot', 'Very hot'],
    featured: 'Show on the home page',
    earlier: 'Earlier',
    later: 'Later',
    remove: 'Remove',
    addImage: 'Add a photo',
    saveDish: 'Save dish',
    placeTitle: 'Restaurant',
    phone: 'Phone',
    tagline: 'Tagline',
    heroNote: 'Top-of-page note',
    story: 'Story',
    address: 'Address',
    city: 'City',
    days: 'Days',
    hours: 'Hours',
    bookingsTitle: 'Reservations',
    noBookings: 'No table has been reserved yet.',
    guests: 'guests',
    table: 'Table {n}',
    statuses: { pending: 'Pending', confirmed: 'Confirmed', cancelled: 'Cancelled' },
  },
}

function readAdminLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY)
    if (UI[saved]) return saved
  } catch {
    /* storage can be blocked */
  }
  return 'ps'
}

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

function ImageEditor({ images, onChange, ui }) {
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
            <button type="button" onClick={() => move(index, -1)}>{ui.earlier}</button>
            <button type="button" onClick={() => move(index, 1)}>{ui.later}</button>
            <button type="button" onClick={() => onChange(images.filter((_, item) => item !== index))}>{ui.remove}</button>
          </span>
        </figure>
      ))}
      <label className="admin-upload">
        {ui.addImage}
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
  const [editLang, setEditLang] = useState(readAdminLang)
  const [welcome, setWelcome] = useState(null)
  const [tonight, setTonight] = useState(null)
  const [profile, setProfile] = useState(null)
  const [categories, setCategories] = useState([])
  const [reservations, setReservations] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const ui = UI[editLang]
  const dir = LANGS.find((lang) => lang.id === editLang)?.dir || 'rtl'

  function chooseLang(next) {
    setEditLang(next)
    try {
      localStorage.setItem(LANG_KEY, next)
    } catch {
      /* storage can be blocked */
    }
  }

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
      else setError('load')
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
        if (live) setError('bookings')
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
      setError(reason.status === 422 || reason.message === 'request-failed' ? 'password' : 'load')
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
      setMessage('saved')
    } catch (reason) {
      if (reason.status === 401) setToken('')
      setError('save')
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

  const notices = { load: ui.loadError, bookings: ui.bookingsError, save: ui.saveError, password: ui.badPassword }
  const eastern = '۰۱۲۳۴۵۶۷۸۹'
  function localCount(amount) {
    const text = String(amount)
    return editLang === 'en' ? text : text.replace(/\d/g, (digit) => eastern[Number(digit)])
  }
  function tableName(label) {
    const normalized = [...String(label || '')].map((char) => {
      const index = eastern.indexOf(char)
      return index >= 0 ? String(index) : char
    }).join('')
    const match = normalized.match(/\d+/)
    return match ? ui.table.replace('{n}', localCount(match[0])) : label
  }
  const tabs = [
    { id: 'home', label: ui.tabs.home },
    { id: 'menu', label: ui.tabs.menu },
    { id: 'place', label: ui.tabs.place },
    { id: 'bookings', label: ui.tabs.bookings },
  ]

  if (!token) {
    return (
      <main className="admin-login" dir={dir} lang={editLang}>
        <form className="admin-card" onSubmit={login}>
          <LangSwitch value={editLang} onChange={chooseLang} />
          <p className="eyebrow dark">دسترخوان</p>
          <h1>{ui.dashboard}</h1>
          <Field label={ui.password} type="password" value={password} onChange={setPassword} dir="ltr" />
          {notices[error] && <p className="status error">{notices[error]}</p>}
          <button className="btn btn-gold" type="submit">{ui.login}</button>
          <p><Link to="/">{ui.back}</Link></p>
        </form>
      </main>
    )
  }

  return (
    <div className="admin" dir={dir} lang={editLang}>
      <aside className="admin-side">
        <p className="brand-mark">دسترخوان</p>
        <LangSwitch value={editLang} onChange={chooseLang} />
        <nav>
          {tabs.map((item) => (
            <button key={item.id} type="button" className={tab === item.id ? 'is-on' : ''} onClick={() => setTab(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>
        <Link to="/">{ui.viewSite}</Link>
        <button type="button" onClick={logout}>{ui.logout}</button>
      </aside>
      <main className="admin-main">
        {busy && <p className="status">{ui.working}</p>}
        {message === 'saved' && <p className="status">{ui.saved}</p>}
        {notices[error] && <p className="status error">{notices[error]}</p>}

        {tab === 'home' && welcome && tonight && (
          <section>
            <h1>{ui.homeTitle}</h1>
            <article className="admin-card">
              <h2>{ui.welcome}</h2>
              <Field label={ui.title} dir={dir} value={welcome.text[editLang].meet} onChange={(value) => setWelcome({ ...welcome, text: { ...welcome.text, [editLang]: { ...welcome.text[editLang], meet: value } } })} />
              <Field label={ui.kicker} dir={dir} value={welcome.text[editLang].kicker} onChange={(value) => setWelcome({ ...welcome, text: { ...welcome.text, [editLang]: { ...welcome.text[editLang], kicker: value } } })} />
              <Field label={ui.heading} dir={dir} value={welcome.text[editLang].heading} onChange={(value) => setWelcome({ ...welcome, text: { ...welcome.text, [editLang]: { ...welcome.text[editLang], heading: value } } })} />
              <Field area label={ui.body} dir={dir} value={welcome.text[editLang].body} onChange={(value) => setWelcome({ ...welcome, text: { ...welcome.text, [editLang]: { ...welcome.text[editLang], body: value } } })} />
              <div className="admin-images">
                {['left', 'right'].map((side) => (
                  <figure key={side}>
                    <img src={welcome.images[side]} alt="" />
                    <label className="admin-upload">
                      {side === 'left' ? ui.leftImage : ui.rightImage}
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
              <button className="btn btn-gold" type="button" onClick={() => save(() => adminFetch('/api/admin/blocks/welcome', { method: 'PUT', body: welcome }))}>{ui.save}</button>
            </article>
            <article className="admin-card">
              <h2>{ui.tonight}</h2>
              <Field label={ui.eyebrow} dir={dir} value={tonight.text[editLang].eyebrow} onChange={(value) => setTonight({ text: { ...tonight.text, [editLang]: { ...tonight.text[editLang], eyebrow: value } } })} />
              <Field label={ui.title} dir={dir} value={tonight.text[editLang].title} onChange={(value) => setTonight({ text: { ...tonight.text, [editLang]: { ...tonight.text[editLang], title: value } } })} />
              <button className="btn btn-gold" type="button" onClick={() => save(() => adminFetch('/api/admin/blocks/tonight', { method: 'PUT', body: tonight }))}>{ui.save}</button>
            </article>
          </section>
        )}

        {tab === 'menu' && (
          <section>
            <h1>{ui.menuTitle}</h1>
            {categories.map((group) => (
              <article className="admin-card" key={group.id}>
                <h2>{ui.group}</h2>
                <Field label={ui.name} dir={dir} value={group.translations[editLang].name} onChange={(value) => setCategories((current) => current.map((row) => row.id === group.id ? { ...row, translations: { ...row.translations, [editLang]: { ...row.translations[editLang], name: value } } } : row))} />
                <Field label={ui.short} dir={dir} value={group.translations[editLang].description} onChange={(value) => setCategories((current) => current.map((row) => row.id === group.id ? { ...row, translations: { ...row.translations, [editLang]: { ...row.translations[editLang], description: value } } } : row))} />
                <button className="btn btn-dark" type="button" onClick={() => save(() => adminFetch(`/api/admin/categories/${group.id}`, { method: 'PUT', body: { translations: group.translations } }))}>{ui.saveGroup}</button>
                {group.items.map((item) => (
                  <div className="admin-item" key={item.id}>
                    <Field label={ui.dishName} dir={dir} value={item.translations[editLang].name} onChange={(value) => patchItem(group.id, item.id, { translations: { ...item.translations, [editLang]: { ...item.translations[editLang], name: value } } })} />
                    <Field area label={ui.description} dir={dir} value={item.translations[editLang].description} onChange={(value) => patchItem(group.id, item.id, { translations: { ...item.translations, [editLang]: { ...item.translations[editLang], description: value } } })} />
                    <label>
                      {ui.price}
                      <input dir="ltr" type="number" min="0" value={item.price} onChange={(event) => patchItem(group.id, item.id, { price: Number(event.target.value) })} />
                    </label>
                    <label>
                      {ui.spice}
                      <select value={item.spice} onChange={(event) => patchItem(group.id, item.id, { spice: Number(event.target.value) })}>
                        {ui.spices.map((label, level) => (
                          <option key={label} value={level}>{label}</option>
                        ))}
                      </select>
                    </label>
                    <label className="admin-check">
                      <input type="checkbox" checked={Boolean(item.featured)} onChange={(event) => patchItem(group.id, item.id, { featured: event.target.checked })} />
                      {ui.featured}
                    </label>
                    <ImageEditor images={item.images} ui={ui} onChange={(images) => patchItem(group.id, item.id, { images })} />
                    <button className="btn btn-gold" type="button" onClick={() => save(() => adminFetch(`/api/admin/items/${item.id}`, {
                      method: 'PUT',
                      body: {
                        price: item.price,
                        featured: Boolean(item.featured),
                        spice: item.spice,
                        images: item.images,
                        translations: item.translations,
                      },
                    }))}>{ui.saveDish}</button>
                  </div>
                ))}
              </article>
            ))}
          </section>
        )}

        {tab === 'place' && profile && (
          <section>
            <h1>{ui.placeTitle}</h1>
            <article className="admin-card">
              <Field label={ui.phone} dir="ltr" value={profile.phone} onChange={(value) => setProfile({ ...profile, phone: value })} />
              <Field label={ui.name} dir={dir} value={profile.translations[editLang].brand} onChange={(value) => setProfile({ ...profile, translations: { ...profile.translations, [editLang]: { ...profile.translations[editLang], brand: value } } })} />
              <Field label={ui.tagline} dir={dir} value={profile.translations[editLang].tagline} onChange={(value) => setProfile({ ...profile, translations: { ...profile.translations, [editLang]: { ...profile.translations[editLang], tagline: value } } })} />
              <Field area label={ui.heroNote} dir={dir} value={profile.translations[editLang].heroNote} onChange={(value) => setProfile({ ...profile, translations: { ...profile.translations, [editLang]: { ...profile.translations[editLang], heroNote: value } } })} />
              <Field area label={ui.story} dir={dir} value={profile.translations[editLang].about} onChange={(value) => setProfile({ ...profile, translations: { ...profile.translations, [editLang]: { ...profile.translations[editLang], about: value } } })} />
              <Field label={ui.address} dir={dir} value={profile.translations[editLang].address} onChange={(value) => setProfile({ ...profile, translations: { ...profile.translations, [editLang]: { ...profile.translations[editLang], address: value } } })} />
              <Field label={ui.city} dir={dir} value={profile.translations[editLang].city} onChange={(value) => setProfile({ ...profile, translations: { ...profile.translations, [editLang]: { ...profile.translations[editLang], city: value } } })} />
              {profile.hours.map((row, index) => (
                <div className="admin-hours" key={index}>
                  <Field label={ui.days} dir={dir} value={row.days[editLang]} onChange={(value) => setProfile({ ...profile, hours: profile.hours.map((hour, hourIndex) => hourIndex === index ? { ...hour, days: { ...hour.days, [editLang]: value } } : hour) })} />
                  <Field label={ui.hours} dir="ltr" value={row.time} onChange={(value) => setProfile({ ...profile, hours: profile.hours.map((hour, hourIndex) => hourIndex === index ? { ...hour, time: value } : hour) })} />
                </div>
              ))}
              <button className="btn btn-gold" type="button" onClick={() => save(() => adminFetch('/api/admin/profile', { method: 'PUT', body: profile }))}>{ui.save}</button>
            </article>
          </section>
        )}

        {tab === 'bookings' && (
          <section>
            <h1>{ui.bookingsTitle}</h1>
            {!reservations.length && <p>{ui.noBookings}</p>}
            {reservations.map((row) => (
              <article className="admin-card" key={row.id}>
                <h2>{row.guest_name}</h2>
                <p><bdi dir="ltr">{row.phone}</bdi> · {localCount(row.guests)} {ui.guests} · {tableName(row.table)}</p>
                <p><bdi dir="ltr">{row.reserved_at}</bdi> · {ui.statuses[row.status] || row.status}</p>
                {row.notes && <p>{row.notes}</p>}
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  )
}
