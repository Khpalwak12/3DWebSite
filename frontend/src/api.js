export async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(data.message || 'له سرور سره اړیکه ونه نیول شوه.')
    error.errors = data.errors || {}
    error.status = response.status
    throw error
  }

  return data
}

export function money(amount) {
  return `${new Intl.NumberFormat('fa-AF').format(amount)} افغانۍ`
}

export function localISODate(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function formatWhen(value) {
  const date = new Date(value.replace(' ', 'T'))
  return new Intl.DateTimeFormat('fa-AF', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export const TIME_SLOTS = Array.from({ length: 21 }, (_, index) => {
  const minutes = 12 * 60 + index * 30
  const hour = String(Math.floor(minutes / 60)).padStart(2, '0')
  const minute = String(minutes % 60).padStart(2, '0')
  return `${hour}:${minute}`
})

export const SPICE = ['ملایم', 'لږ توند', 'توند', 'ډېر توند']
