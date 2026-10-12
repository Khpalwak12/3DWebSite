import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { api, localISODate, TIME_SLOTS } from '../api'
import { useApi } from '../context'
import { useI18n } from '../i18n'

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
  const { t, lang, formatNumber, formatWhen, tableLabel, seatsLabel } = useI18n()
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
  const tables = useMemo(
    () => (data?.tables || []).map((table) => ({
      ...table,
      label: tableLabel(table.label),
      seatsLabel: seatsLabel(table.seats),
    })),
    [data, tableLabel, seatsLabel],
  )
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
      setErrors({ dining_table_id: [t('reserve.pickTable')] })
      return
    }

    setSubmitting(true)
    try {
      const result = await api('/api/reservations', {
        method: 'POST',
        body: JSON.stringify({ ...form, locale: lang }),
      })
      setDone(result.reservation)
    } catch (err) {
      const fallback = !err.message || err.message === 'request-failed' ? t('error.network') : err.message
      setErrors(err.errors && Object.keys(err.errors).length ? err.errors : { form: [fallback] })
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <main className="page">
        <section className="success">
          <p className="eyebrow dark">{t('reserve.booked')}</p>
          <h1>{t('reserve.ready')}</h1>
          <p>
            {t('reserve.held', {
              name: done.guest_name,
              table: tableLabel(done.table),
              guests: formatNumber(done.guests),
              when: formatWhen(done.reserved_at),
            })}
          </p>
          <p>
            {t('reserve.confirmLead')}<bdi dir="ltr">{done.phone}</bdi>{t('reserve.confirmTail', { id: formatNumber(done.id) })}
          </p>
          <button type="button" className="btn btn-dark" onClick={() => { setDone(null); setForm((current) => ({ ...current, dining_table_id: null, notes: '' })) }}>
            {t('reserve.another')}
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="page">
      <header className="page-hero">
        <p className="eyebrow dark">{t('reserve.eyebrow')}</p>
        <h1>{t('reserve.title')}</h1>
        <p>{t('reserve.intro')}</p>
      </header>

      <div className="reserve-layout">
        <form className="reserve-form" onSubmit={onSubmit}>
          <label>
            {t('reserve.date')}
            <input type="date" name="date" min={localISODate()} value={form.date} onChange={update} required />
          </label>
          <FieldError errors={errors} name="date" />

          <label>
            {t('reserve.time')}
            <select name="time" value={form.time} onChange={update}>
              {slots.map((slot) => (
                <option key={slot.time} value={slot.time} disabled={slot.disabled}>{slot.time}</option>
              ))}
            </select>
          </label>
          <FieldError errors={errors} name="time" />

          <label>
            {t('reserve.guests')}
            <select name="guests" value={form.guests} onChange={update}>
              {Array.from({ length: 8 }, (_, index) => index + 1).map((count) => (
                <option key={count} value={count}>{formatNumber(count)}</option>
              ))}
            </select>
          </label>
          <FieldError errors={errors} name="guests" />

          <p className="pick-note">
            {loading && t('reserve.checking')}
            {!loading && error && t('reserve.listError')}
            {!loading && !error && (openCount ? t('reserve.open', { n: formatNumber(openCount) }) : t('reserve.none'))}
            {selected ? t('reserve.selected', { name: selected.label }) : ''}
          </p>
          <FieldError errors={errors} name="dining_table_id" />

          <label>
            {t('reserve.name')}
            <input name="guest_name" value={form.guest_name} onChange={update} autoComplete="name" required />
          </label>
          <FieldError errors={errors} name="guest_name" />

          <label>
            {t('reserve.phone')}
            <input name="phone" value={form.phone} onChange={update} autoComplete="tel" placeholder="0790000000" dir="ltr" required />
          </label>
          <FieldError errors={errors} name="phone" />

          <label>
            {t('reserve.note')}
            <textarea name="notes" value={form.notes} onChange={update} rows={3} placeholder={t('reserve.notePlaceholder')} />
          </label>
          <FieldError errors={errors} name="notes" />
          <FieldError errors={errors} name="form" />

          <button className="btn btn-dark" type="submit" disabled={submitting}>
            {submitting ? t('reserve.submitting') : t('reserve.submit')}
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
            <li><i className="swatch free" /> {t('reserve.free')}</li>
            <li><i className="swatch taken" /> {t('reserve.taken')}</li>
            <li><i className="swatch small" /> {t('reserve.small')}</li>
            <li><i className="swatch chosen" /> {t('reserve.yours')}</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
