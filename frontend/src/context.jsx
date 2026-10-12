import { createContext, useContext, useEffect, useState } from 'react'
import { api } from './api'

const RestaurantContext = createContext({
  loading: true,
  error: null,
  info: null,
})

export function RestaurantProvider({ children }) {
  const [state, setState] = useState({ loading: true, error: null, info: null })

  useEffect(() => {
    let live = true

    api('/api/info')
      .then((info) => {
        if (live) setState({ loading: false, error: null, info })
      })
      .catch((error) => {
        if (live) setState({ loading: false, error, info: null })
      })

    return () => {
      live = false
    }
  }, [])

  return <RestaurantContext.Provider value={state}>{children}</RestaurantContext.Provider>
}

export function useRestaurant() {
  return useContext(RestaurantContext)
}

export function useApi(path) {
  const [state, setState] = useState({ loading: true, error: null, data: null })

  useEffect(() => {
    let live = true
    setState((current) => ({ ...current, loading: true, error: null }))

    api(path)
      .then((data) => {
        if (live) setState({ loading: false, error: null, data })
      })
      .catch((error) => {
        if (live) setState({ loading: false, error, data: null })
      })

    return () => {
      live = false
    }
  }, [path])

  return state
}
