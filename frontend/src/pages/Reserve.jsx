import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { api, formatWhen, localISODate, TIME_SLOTS } from '../api'
import { useApi } from '../context'

const TableMap = lazy(() => import('../three/TableMap'))

function FieldError({ errors, name }) {
  const message = errors?.[name]?.[0]
  if (!message) return null
  return <p className="field-error">{message}</p>
}

function slotPassed(date, time) {
  return new Date(`${date}T${time}:00`).getTime() <= Date.now()
}

export default function Reserve() {
  const [form, setForm] = useState({
    date: localISODate(),
    time: '19:00',
    guests: 2,
    dining_table_id: null,
    guest_name: '',
    phone: '',
    notes: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(null)

  const query = `/api/tables?date=${form.date}&time=${form.time}&guests=${form.guests}`
  const { loading, error, data } = useApi(query)
  const tables = data?.tables || []
  const selected = tables.find((table) => table.id === form.dining_table_id) || null
  const openCount = tables.filter((table) => table.available).length

  const slots = useMemo(
    () => TIME_SLOTS.map((time) => ({ time, disabled: slotPassed(form.date, time) })),
    [form.date],
  )

  useEffect(() => {
    if (slots.find((slot) => slot.time === form.time && slot.disabled)) {
      const next = slots.find((slot) => !slot.disabled)
      if (next) setForm((current) => ({ ...current, time: next.time, dining_table_id: null }))
    }
  }, [slots, form.time])

  useEffect(() => {
    if (selected && !selected.available) {
      setForm((current) => ({ ...current, dining_table_id: null }))
    }
  }, [selected])

  function update(event) {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: name === 'guests' ? Number(value) : value,
      dining_table_id: name === 'date' || name === 'time' || name === 'guests' ? null : current.dining_table_id,
    }))
  }

  async function onSubmit(event) {
    event.preventDefault()
    setErrors({})

    if (!form.dining_table_id) {
      setErrors({ dining_table_id: ['له سالون څخه یو خالي میز وټاکئ.'] })
      return
    }

    setSubmitting(true)
    try {
      const result = await api('/api/reservations', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      setDone(result.reservation)
    } catch (err) {
      setErrors(err.errors && Object.keys(err.errors).length ? err.errors : { form: [err.message] })
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <main className="page">
        <section className="success">
          <p className="eyebrow dark">ثبت شو</p>
          <h1>ستاسو دسترخوان برابرېږي</h1>
          <p>
            {done.guest_name}، {done.table} د {new Intl.NumberFormat('fa-AF').format(done.guests)} کسانو لپاره {formatWhen(done.reserved_at)} نیول شوی دی.
          </p>
          <p>موږ به پر {done.phone} تایید درکړو. شمېره یې {done.id} ده.</p>
          <button type="button" className="btn btn-dark" onClick={() => { setDone(null); setForm((current) => ({ ...current, dining_table_id: null, notes: '' })) }}>
            بل ځای ونیسئ
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="page">
      <header className="page-hero">
        <p className="eyebrow dark">ځای نیول</p>
        <h1>په سالون کې میز وټاکئ</h1>
        <p>هره ناسته نږدې یو نیم ساعت وخت نیسي. زرین میز خالي دی، تور سور نیول شوی، او خړ میز د دومره کسانو لپاره کوچنی دی.</p>
      </header>

      <div className="reserve-layout">
        <form className="reserve-form" onSubmit={onSubmit}>
          <label>
            نېټه
            <input type="date" name="date" min={localISODate()} value={form.date} onChange={update} required />
          </label>
          <FieldError errors={errors} name="date" />

          <label>
            وخت
            <select name="time" value={form.time} onChange={update}>
              {slots.map((slot) => (
                <option key={slot.time} value={slot.time} disabled={slot.disabled}>{slot.time}</option>
              ))}
            </select>
          </label>
          <FieldError errors={errors} name="time" />

          <label>
            کسان
            <select name="guests" value={form.guests} onChange={update}>
              {Array.from({ length: 8 }, (_, index) => index + 1).map((count) => (
                <option key={count} value={count}>{count}</option>
              ))}
            </select>
          </label>
          <FieldError errors={errors} name="guests" />

          <p className="pick-note">
            {loading && 'میزونه کتل کېږي…'}
            {!loading && error && 'د میزونو لیست رانغی.'}
            {!loading && !error && (openCount ? `${new Intl.NumberFormat('fa-AF').format(openCount)} میزونه خالي دي.` : 'په دې وخت کې د دومره کسانو لپاره خالي میز نشته.')}
            {selected ? ` ټاکل شوی: ${selected.label}.` : ''}
          </p>
          <FieldError errors={errors} name="dining_table_id" />

          <label>
            نوم
            <input name="guest_name" value={form.guest_name} onChange={update} autoComplete="name" required />
          </label>
          <FieldError errors={errors} name="guest_name" />

          <label>
            تلیفون
            <input name="phone" value={form.phone} onChange={update} autoComplete="tel" placeholder="0790000000" required />
          </label>
          <FieldError errors={errors} name="phone" />

          <label>
            یادښت
            <textarea name="notes" value={form.notes} onChange={update} rows={3} placeholder="د بېلګې په توګه: د کړکۍ څنګ، یا د ماشوم چوکۍ" />
          </label>
          <FieldError errors={errors} name="notes" />
          <FieldError errors={errors} name="form" />

          <button className="btn btn-dark" type="submit" disabled={submitting}>
            {submitting ? 'ثبتېږي…' : 'میز ثبت کړئ'}
          </button>
        </form>

        <div className="map-panel">
          <Suspense fallback={<div className="scene-fallback" />}>
            <TableMap
              tables={tables}
              selectedId={form.dining_table_id}
              onSelect={(id) => setForm((current) => ({ ...current, dining_table_id: id }))}
            />
          </Suspense>
          <ul className="legend">
            <li><i className="swatch free" /> خالي</li>
            <li><i className="swatch taken" /> نیول شوی</li>
            <li><i className="swatch small" /> کوچنی</li>
            <li><i className="swatch chosen" /> ستاسو میز</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
